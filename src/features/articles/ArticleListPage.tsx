// src/features/articles/ArticleListPage.tsx
import { useCallback, useEffect, useState } from "react";
import { App, Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { getErrorMessage } from "@/utils/error";
import { articleApi } from "./api";
import type { Article } from "./type";

export default function ArticleListPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      
      setData(await articleApi.getAll());
    } catch (err) {
      message.error(getErrorMessage(err, "Không tải được bài viết"));
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await articleApi.remove(id);
      message.success("Đã xóa");
      load();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const columns: ColumnsType<Article> = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Danh mục", dataIndex: "category_name" },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (v?: string) =>
        v ? new Date(v).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Thao tác",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(ROUTES.articleEdit(record.id))}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bài viết này?"
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
        <h1 className="text-xl font-semibold">Bài viết</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.ARTICLE_NEW)}
        >
          Thêm bài viết
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </>
  );
}
