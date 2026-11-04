import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

interface DirectUploadProps {
  value?: File | string;
  onChange?: (file: File | undefined) => void;
}

const DirectUpload = ({ value, onChange }: DirectUploadProps) => {
  const [preview, setPreview] = useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);

  const handleBeforeUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileList([file]);

    if (onChange) onChange(file);

    return false;
  };

  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      beforeUpload={handleBeforeUpload}
      fileList={fileList}
      accept="image/*"
    >
      {preview || (typeof value === "string" && value) ? (
        <img
          src={preview || (value as string)}
          alt="thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ) : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
        </div>
      )}
    </Upload>
  );
};

export default DirectUpload;
