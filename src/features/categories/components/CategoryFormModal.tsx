import { App, Form, Input, Modal } from "antd";
import type { CategoryPayload, CRUDCategory } from "../type";
import { useEffect, useState } from "react";
import { categoryApi } from "../api";
import { getErrorMessage } from "@/utils/error";

interface Props {
  open: boolean;
  editing: CRUDCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryFormModal = ({ open, editing, onClose, onSuccess }: Props) => {
  const { message } = App.useApp();
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<CategoryPayload>();

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          name: editing.name,
          slug: editing.slug,
          description: editing.description ?? "",
        });
      } else {
        form.resetFields();
      }
    }
  });

  const checkdescription = async (
    editing: CRUDCategory,
    values: CategoryPayload,
  ) => {
    const descriptionEdit =
      values.description === "" ? null : values.description;

    await categoryApi.update(editing.id, {
      ...values,
      description: descriptionEdit,
    });
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await checkdescription(editing, values);
        // await categoryApi.update(editing.id, values);
      } else {
        await categoryApi.create(values);
      }
      message.success("Lưu thành công");
      onSuccess();
    } catch (err) {
      message.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <Modal
        title={editing ? "Sửa danh mục" : "Thêm danh mục"}
        open={open}
        onOk={handleOk}
        confirmLoading={saving}
        onCancel={onClose}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Tên slug"
            rules={[{ required: true, message: "Nhập tên slug" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Tên mô tả"
            rules={[{ required: false, message: "Nhập tên mô tả" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryFormModal;
