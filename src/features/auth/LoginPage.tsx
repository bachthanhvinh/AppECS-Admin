import { App, Button, Card, Form, Input, Spin } from "antd";
import { useState } from "react";
import { ROUTES } from "@/config/routes";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getErrorMessage } from "@/utils/error";

const LoginPage = () => {
  const { user, login, loading } = useAuth();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) return <Spin fullscreen />;
  if (user) return <Navigate to={ROUTES.HOME} replace />;

  const onFinish = async (value: { email: string; password: string }) => {
    setSubmitting(true);
    try {
      await login(value.email, value.password);
      navigate(`${ROUTES.CATEGORIES}`);
    } catch (err) {
      message.error(getErrorMessage(err, "Đăng nhập thất bại"));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="min-h-screen grid place-items-center bg-gray-100 p-4">
        <Card title="ECS Admin - Đăng nhập" className="w-full max-w-sm">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Đăng nhập
            </Button>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
