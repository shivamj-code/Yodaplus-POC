import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import IssueCertificate from "../pages/IssueCertificate";
import VerifyCertificate from "../pages/VerifyCertificate";
import RevokeCertificate from "../pages/RevokeCertificate";

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/issue" element={<IssueCertificate />} />
      <Route path="/verify" element={<VerifyCertificate />} />
      <Route path="/revoke" element={<RevokeCertificate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
