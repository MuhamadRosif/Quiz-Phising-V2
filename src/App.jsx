import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import Landing from "./components/Landing";
import QuizRound from "./components/QuizRound";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return <LoadingScreen onFinish={() => setLoaded(true)} />;
  }

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <img src="/logo-university.png" alt="logo" />
          <div>
            <div style={{ fontWeight: 700 }}>Quiz University</div>
            <div className="small">3 Babak • 20 soal/babak • eliminasi antar babak</div>
          </div>
        </div>

        <nav className="row">
          <Link to="/" className="btn-ghost">Home</Link>
          <Link to="/leaderboard" className="btn-ghost">Leaderboard</Link>
          <Link to="/admin" className="btn">Admin</Link>
        </nav>
      </header>

      {/* ROUTES */}
      <main style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<QuizRound />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

    </div>
  );
}
