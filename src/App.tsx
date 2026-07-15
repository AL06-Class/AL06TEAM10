import { Navigate, Route, Routes } from "react-router-dom";
import CertifiedPage from "./components/match/CertifiedPage";
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
import Login from "./routes/Login";
import RecruiterHome from "./routes/RecruiterHome";
import RequireRole from "./components/RequireRole";

export default function App() {
  const reviewMode = new URLSearchParams(window.location.search).get("review") === "1";

  return (
    <Routes>
      <Route path="/" element={reviewMode ? <Navigate replace to="/trainer?review=1" /> : <Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recruiter" element={<RequireRole role="recruiter"><RecruiterHome /></RequireRole>} />
      <Route path="/onboarding" element={<RequireRole role="recruiter"><Onboarding /></RequireRole>} />
      <Route path="/trainers" element={<RequireRole role="recruiter"><Trainers /></RequireRole>} />
      <Route path="/trainers/:trainerId" element={<RequireRole role="recruiter"><TrainerDetail /></RequireRole>} />
      <Route path="/trainers/:trainerId/report" element={<RequireRole role="recruiter"><GradingReport /></RequireRole>} />
      <Route path="/owner/offer/new" element={<RequireRole role="recruiter"><OfferFormPage /></RequireRole>} />
      <Route path="/trainer/certified" element={<RequireRole role="candidate"><CertifiedPage /></RequireRole>} />
      <Route path="/trainer/offers" element={<RequireRole role="candidate"><OfferListPage /></RequireRole>} />
      <Route path="/trainer/offers/:offerId" element={<RequireRole role="candidate"><OfferDetailPage /></RequireRole>} />
      <Route path="/trainer/offers/:offerId/confirmed" element={<RequireRole role="candidate"><ConfirmedPage /></RequireRole>} />
      <Route path="/notifications" element={<RequireRole role="candidate"><NotificationsPage /></RequireRole>} />
      <Route path="/trainer/*" element={<RequireRole role="candidate"><TrainerFlow /></RequireRole>} />
    </Routes>
  );
}
