import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CertifiedPage from "./components/match/CertifiedPage";
import CentersPage from "./components/match/CentersPage";
import ConfirmedPage from "./components/match/ConfirmedPage";
import OfferDetailPage from "./components/match/OfferDetailPage";
import OfferListPage from "./components/match/OfferListPage";
import OfferFormPage from "./components/match/OfferFormPage";
import NotificationsPage from "./components/match/NotificationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/trainer/certified" replace />} />
        <Route path="/trainer/certified" element={<CertifiedPage />} />
        <Route path="/trainer/centers" element={<CentersPage />} />
        <Route path="/trainer/offers" element={<OfferListPage />} />
        <Route path="/trainer/offers/:offerId" element={<OfferDetailPage />} />
        <Route path="/trainer/offers/:offerId/confirmed" element={<ConfirmedPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/owner/offer/new" element={<OfferFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
