import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import InputToJoin from "./pages/InputToJoin";
import Preparation from "./pages/Preparation";
import Results from "./pages/Results";
import Round1 from "./pages/Round1";
import Round2 from "./pages/Round2";
import Round3 from "./pages/Round3";
import WaitingArea from "./pages/WaitingArea";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/InputToJoin" element={<InputToJoin />} />
        <Route path="/waiting/:pin" element={<WaitingArea />} />
        <Route path="/preparation/:pin" element={<Preparation />} />
        <Route path="/round1/:pin" element={<Round1 />} />
        <Route path="/round2/:pin" element={<Round2 />} />
        <Route path="/round3/:pin" element={<Round3 />} />
        <Route path="/results/:pin" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
