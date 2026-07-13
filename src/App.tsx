import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Onboarding from "./routes/Onboarding";
import Trainers from "./routes/Trainers";
import TrainerDetail from "./routes/TrainerDetail";
import GradingReport from "./routes/GradingReport";
import TrainerFlow from "./routes/TrainerFlow";

export default function App() {
  const reviewMode = new URLSearchParams(window.location.search).get("review") === "1";

  return (
    <Routes>
      <Route path="/" element={reviewMode ? <Navigate replace to="/trainer?review=1" /> : <Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/trainers/:trainerId" element={<TrainerDetail />} />
      <Route path="/trainers/:trainerId/report" element={<GradingReport />} />
      <Route path="/trainer/*" element={<TrainerFlow />} />
    </Routes>
  );
}
