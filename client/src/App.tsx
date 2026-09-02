import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Home";
import AnalysisPage from "@/pages/Analysis";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </div>
  );
}

export default App;
