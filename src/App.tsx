import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CertifiedPage from "./components/match/CertifiedPage";
import CentersPage from "./components/match/CentersPage";
import ConfirmedPage from "./components/match/ConfirmedPage";
import OfferDetailPage from "./components/match/OfferDetailPage";
import OfferListPage from "./components/match/OfferListPage";
import OfferFormPage from "./components/match/OfferFormPage";
import NotificationsPage from "./components/match/NotificationsPage";
import Home from "./routes/Home";
import Onboarding from "./routes/Onboarding";
import Trainers from "./routes/Trainers";
import TrainerDetail from "./routes/TrainerDetail";
import GradingReport from "./routes/GradingReport";
import TrainerFlow from "./routes/TrainerFlow";

export default function App() {
  const reviewMode = new URLSearchParams(window.location.search).get("review") === "1";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={reviewMode ? <Navigate replace to="/trainer?review=1" /> : <Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/trainers/:trainerId" element={<TrainerDetail />} />
        <Route path="/trainers/:trainerId/report" element={<GradingReport />} />
        <Route path="/trainer/*" element={<TrainerFlow />} />
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
