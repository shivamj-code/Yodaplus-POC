import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <ErrorBoundary>
    <AppRoutes />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 14px 35px rgba(15, 23, 42, 0.08)"
        }
      }}
    />
  </ErrorBoundary>
);

export default App;
