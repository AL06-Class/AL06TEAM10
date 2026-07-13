import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Onboarding from "./routes/Onboarding";
import Trainers from "./routes/Trainers";
import TrainerDetail from "./routes/TrainerDetail";
import GradingReport from "./routes/GradingReport";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/trainers/:trainerId" element={<TrainerDetail />} />
      <Route path="/trainers/:trainerId/report" element={<GradingReport />} />
    </Routes>
  );
}
