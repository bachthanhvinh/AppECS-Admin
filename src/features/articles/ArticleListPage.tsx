// src/features/articles/ArticleListPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  ConfigProvider,
  Image,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { getErrorMessage } from "@/utils/error";
import { articleApi } from "./api";
import type { Article, Category } from "./type";
import { paginationApi } from "@/utils/pagination";
import { categoryApi } from "../categories/api";

// Mở rộng type cho dữ liệu hiển thị trên Table để chuẩn TypeScript
interface ArticleTableItem extends Article {
  category_name: string;
}

const DEFAULT_PAGE_SIZE = 8;
const FALLBACK_IMAGE = "https://placehold.co/150x100?text=No+Image";

export default function ArticleListPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [data, setData] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // 1. Tải danh sách danh mục
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        if (isMounted) setCategories(res.data);
      } catch (err) {
        message.error(getErrorMessage(err, "Không tải được danh mục"));
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [message]);

  // 2. Tải danh sách bài viết theo page & pageSize
  const load = useCallback(
    async (page: number, size: number) => {
      setLoading(true);
      try {
        const res = await paginationApi.pagination(page, size, "articles");
        setData(res.data.items);
        setTotal(res.data.total);
        setCurrentPage(page);
        setPageSize(size);
      } catch (err) {
        message.error(getErrorMessage(err, "Không tải được bài viết"));
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  useEffect(() => {
    load(1, DEFAULT_PAGE_SIZE);
  }, [load]);

  // 3. Xử lý xóa thông minh: Giữ nguyên trang hiện tại (hoặc lùi 1 trang nếu xóa hết item cuối)
  const handleDelete = async (id: string) => {
    try {
      await articleApi.remove(id);
      message.success("Đã xóa bài viết");

      const isLastItemOnPage = data.length === 1 && currentPage > 1;
      const targetPage = isLastItemOnPage ? currentPage - 1 : currentPage;
      load(targetPage, pageSize);
    } catch (err) {
      message.error(getErrorMessage(err, "Xóa bài viết thất bại"));
    }
  };

  // 4. Tối ưu ghép tên danh mục bằng Map + useMemo (O(1) thay vì filter lồng nhau)
  const tableData: ArticleTableItem[] = useMemo(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    return data.map((item) => ({
      ...item,
      category_name: categoryMap.get(item.category_id) || "Chưa phân loại",
    }));
  }, [data, categories]);

  const columns: ColumnsType<ArticleTableItem> = useMemo(
    () => [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        width: "30%",
        render: (text: string) => <span className="font-medium">{text}</span>,
      },
      {
        title: "Danh mục",
        dataIndex: "category_name",
        render: (name: string) => <Tag color="blue">{name}</Tag>,
      },
      {
        title: "Hình ảnh",
        dataIndex: "thumbnail_url",
        width: 180,
        render: (url: string | null) => (
          <Image
            className="rounded-md object-cover"
            src={url || FALLBACK_IMAGE}
            fallback={FALLBACK_IMAGE}
            alt="thumbnail"
            width={140}
            height={80}
          />
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        width: 140,
        render: (v?: string) =>
          v ? new Date(v).toLocaleDateString("vi-VN") : "—",
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 160,
        render: (_, record) => (
          <Space>
            <Button
              size="small"
              onClick={() => navigate(ROUTES.articleEdit(record.id))}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa bài viết này?"
              description="Hành động này không thể hoàn tác."
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [navigate, currentPage, pageSize, data.length],
  );

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

      <Table<ArticleTableItem>
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["8", "16", "32", "50"],
          showTotal: (totalItems) => `Tổng ${totalItems} bài viết`,
          onChange: (page, size) => load(page, size),
        }}
      />
    </>
  );
}
