import { useCallback, useEffect, useState } from "react";
import { categoryApi } from "./api";
import { App, Button, Popconfirm, Space, Table } from "antd";
import { getErrorMessage } from "@/utils/error";
import { PlusOutlined } from "@ant-design/icons";
import type { Category, CRUDCategory } from "./type";
import type { ColumnsType } from "antd/es/table";
import CategoryFormModal from "./components/CategoryFormModal";

const CategoryPage = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CRUDCategory>();
  const [open, setOpen] = useState(false);

  // tránh lặp vô hạn nếu không dùng useCallback địa chỉ ô nhớ thay đổi mỗi lần bị render nếu không dùng useCallback
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      message.error(getErrorMessage(err, "can not loading category"));
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.remove(id);
      message.success("Đã xóa");
      load();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };
  const openModal = async (record: CRUDCategory | null = null) => {
    setEditing(record!);
    setOpen(true);
  };

  const columns: ColumnsType<Category> = [
    { title: "Tên danh mục", dataIndex: "name" },
    { title: "Slug", dataIndex: "slug" },
    {
      title: "Thao tác",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Danh mục</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Thêm danh mục
        </Button>
      </div>
      <Table
        rowKey="id"
        dataSource={categories}
        columns={columns}
        loading={loading}
      />
      <CategoryFormModal
        open={open}
        editing={editing!}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          load();
        }}
      />
    </>
  );
};

export default CategoryPage;
