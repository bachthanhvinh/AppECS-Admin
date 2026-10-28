import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ROUTES } from "@/config/routes";
import { Result, Spin } from "antd";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spin fullscreen />;
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  console.log(user);
  if (user.role !== "admin") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang quản trị"
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
