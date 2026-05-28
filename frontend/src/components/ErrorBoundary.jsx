import React from "react";
import Card from "./Card";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Frontend error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-950">Something went wrong</h1>
            <p className="mt-3 text-slate-600">
              The page hit an unexpected error. Refreshing usually clears this state.
            </p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
