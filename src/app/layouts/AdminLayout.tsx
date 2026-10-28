import { Button, Layout, Menu } from "antd";
import {
  FileTextOutlined,
  FolderOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/features/auth";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // /articles/new, /articles/:id/edit vẫn sáng menu "Bài viết"
  const selectedKey = pathname.startsWith(ROUTES.ARTICLES)
    ? ROUTES.ARTICLES
    : pathname;

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth={0}>
        <div className="h-16 flex items-center justify-center text-white font-bold text-lg">
          ECS Admin
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: ROUTES.CATEGORIES,
              icon: <FolderOutlined />,
              label: "Danh mục",
            },
            {
              key: ROUTES.ARTICLES,
              icon: <FileTextOutlined />,
              label: "Bài viết",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="bg-white! flex items-center justify-end gap-4 shadow-sm">
          <span className="text-gray-600">{user?.email}</span>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Đăng xuất
          </Button>
        </Header>
        <Content className="p-4 md:p-6">
          <div className="bg-white rounded-lg p-4 md:p-6 min-h-full">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
