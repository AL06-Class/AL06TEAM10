import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CertifiedPage from "./components/match/CertifiedPage";
import CentersPage from "./components/match/CentersPage";
import OfferFormPage from "./components/match/OfferFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/trainer/certified" replace />} />
        <Route path="/trainer/certified" element={<CertifiedPage />} />
        <Route path="/trainer/centers" element={<CentersPage />} />
        <Route path="/owner/offer/new" element={<OfferFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
