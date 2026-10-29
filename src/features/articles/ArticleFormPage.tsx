import { App, Button, Form, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import type { ArticlePayload, Category } from "./type";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { articleApi } from "./api";
import { getErrorMessage } from "@/utils/error";
import { categoryApi } from "../categories/api";

const ArticleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [form] = Form.useForm<ArticlePayload>();

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        if (id) {
          const [resCat, resArt] = await Promise.all([
            categoryApi.getAll(),
            articleApi.getById(id),
          ]);
          setCategories(resCat.data);
          form.setFieldsValue(resArt);
        } else {
          const resCat = await categoryApi.getAll();
          setCategories(resCat.data);
          form.setFieldsValue({ is_published: true } as any);
        }
      } catch (e) {
        message.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [id, form, message]);

  const onFinish = async (values: ArticlePayload) => {
    console.log(values);
    setSaving(true);
    try {
      if (id) {
        const update = await articleApi.update(id, values);
        if (update) {
          message.success("Cập nhật bài viết thành công");
          navigate(ROUTES.ARTICLES);
        }
      } else {
        const create = await articleApi.create(values);
        if (create) {
          message.success("Tạo bài viết thành công");
          navigate(ROUTES.ARTICLES);
        }
      }
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin className="flex justify-center my-10" />;

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">
        {id ? "Sửa bài viết" : "Thêm bài viết"}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-3xl"
        initialValues={{ is_published: true }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="Danh mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select
            placeholder="Chọn danh mục"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>

        {/* Khớp tên với thumbnail_url ở DTO Backend */}
        <Form.Item name="thumbnail_url" label="Link ảnh đại diện">
          <Input placeholder="https://..." />
        </Form.Item>

        {/* Khớp tên với description ở DTO Backend */}
        <Form.Item
          name="description"
          label="Mô tả ngắn"
          rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
        >
          <Input.TextArea rows={3} placeholder="Mô tả tóm tắt bài viết" />
        </Form.Item>

        {/* Form Item trạng thái xuất bản is_published */}
        <Form.Item
          name="is_published"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            options={[
              { value: true, label: "Xuất bản (Công khai)" },
              { value: false, label: "Bản nháp (Ẩn)" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea rows={12} placeholder="Nội dung chi tiết bài viết" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={saving}>
          {id ? "Cập nhật" : "Tạo bài viết"}
        </Button>
        <Button className="ml-2" onClick={() => navigate(ROUTES.ARTICLES)}>
          Hủy
        </Button>
      </Form>
    </>
  );
};

export default ArticleFormPage;
