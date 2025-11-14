import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Landing from "./components/Landing";
import QuizRound from "./components/QuizRound";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // delay 1.5 detik sebelum masuk aplikasi
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* LOADING SCREEN */}
      {loading && <LoadingScreen />}

      {/* MAIN APP */}
      {!loading && (
        <div className="app-container">
          <header className="header">
            <div className="logo" style={{ alignItems: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                Quiz University
              </div>
              <div className="small">
                3 Babak • 20 soal/babak • eliminasi antar babak
              </div>
            </div>

            <nav className="row">
              <Link to="/" className="btn-ghost">
                Home
              </Link>
              <Link to="/leaderboard" className="btn-ghost">
                Leaderboard
              </Link>
              <Link to="/admin" className="btn">
                Admin
              </Link>
            </nav>
          </header>

          <main style={{ marginTop: 20 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/quiz" element={<QuizRound />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
}
