import axiosClient from "@/lib/axiosClient";

const pendingImages = new Map<string, File>();

export const localImageUpload = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
): Promise<string> => {
  const url = URL.createObjectURL(file);
  pendingImages.set(url, file);
  onProgress?.({ progress: 100 });
  return url;
};

export const clearPendingImages = () => {
  pendingImages.forEach((_, url) => URL.revokeObjectURL(url));
  pendingImages.clear();
};

export interface UploadedImage {
  url: string;
  publicId: string;
}

export const createCloudinaryUploader = () => {
  let sigPromise: Promise<any> | null = null;
  const getSignature = () =>
    (sigPromise ??= axiosClient.get("upload/signature").then((r) => r.data));

  return async (file: File): Promise<UploadedImage> => {
    const { timestamp, signature, apiKey, cloudName, folder } =
      await getSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (data.error) throw new Error("Upload ảnh thất bại");

    return { url: data.secure_url, publicId: data.public_id };
  };  
};

export const uploadPendingImagesInHtml = async (
  html: string,
  upload: (file: File) => Promise<UploadedImage>,
): Promise<{ html: string; publicIds: string[] }> => {
  if (!html) return { html, publicIds: [] };

  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgs = Array.from(
    doc.querySelectorAll<HTMLImageElement>('img[src^="blob:"]'),
  );
  const uniqueSrcs = [...new Set(imgs.map((i) => i.getAttribute("src")!))];

  const results = new Map<string, UploadedImage>();
  await Promise.all(
    uniqueSrcs.map(async (src) => {
      const file = pendingImages.get(src);
      if (!file) {
        throw new Error("Không tìm thấy file ảnh, vui lòng chèn lại ảnh");
      }
      results.set(src, await upload(file));
    }),
  );

  imgs.forEach((img) => {
    img.setAttribute("src", results.get(img.getAttribute("src")!)!.url);
  });

  return {
    html: doc.body.innerHTML,
    publicIds: [...results.values()].map((r) => r.publicId),
  };
};
