import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Result } from "antd";

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Đã có lỗi xảy ra"
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
