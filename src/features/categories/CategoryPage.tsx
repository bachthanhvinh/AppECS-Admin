import { useCallback, useEffect, useState } from "react";
import { App, Button, Popconfirm, Space, Table } from "antd";
import { getErrorMessage } from "@/utils/error";
import { PlusOutlined } from "@ant-design/icons";
import type { Category, CRUDCategory } from "./type";
import type { ColumnsType } from "antd/es/table";
import CategoryFormModal from "./components/CategoryFormModal";
import { paginationApi } from "@/utils/pagination";
import { categoryApi } from "./api";

const CategoryPage = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CRUDCategory>();
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [currenPage, setCurrenPage] = useState(1);
  const pageFix = 8;

  // tránh lặp vô hạn nếu không dùng useCallback địa chỉ ô nhớ thay đổi mỗi lần bị render nếu không dùng useCallback
  const load = useCallback(
    async (page = 1, pageSize = 8) => {
      setLoading(true);
      try {
        const res = await paginationApi.pagination(page, pageSize, "categories");
        setCategories(res.items);
        setTotal(res.total);
        setCurrenPage(page);
        console.log(`items=${res.i}, total=${res.total}`);
      } catch (err) {
        message.error(getErrorMessage(err, "can not loading category"));
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  useEffect(() => {
    load(1, pageFix);
  }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.remove(id);
      message.success("Đã xóa");
      load(1, pageFix);
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
        pagination={{
          total: total,
          pageSize: 8,
          current: currenPage,
          onChange: (page, pageSize) => {
            load(page, pageSize);
          },
        }}
      />
      <CategoryFormModal
        open={open}
        editing={editing!}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          load(1, pageFix);
        }}
      />
    </>
  );
};

export default CategoryPage;
