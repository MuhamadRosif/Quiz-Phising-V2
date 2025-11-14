import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Landing from "./components/Landing";
import QuizRound from "./components/QuizRound";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}

      {!loading && (
        <div className="app-container">

          {/* =============================== */}
          {/*         RESPONSIVE HEADER        */}
          {/* =============================== */}

          <header className="header-responsive">

            {/* TITLE */}
            <div className="header-title">
              <div className="title-main">Quiz University</div>
              <div className="title-sub">
                3 Babak • 20 Soal per Babak • Eliminasi
              </div>
            </div>

            {/* DESKTOP NAV */}
            <nav className="nav-desktop">
              <Link to="/" className="btn-ghost">Home</Link>
              <Link to="/leaderboard" className="btn-ghost">Leaderboard</Link>
              <Link to="/admin" className="btn">Admin</Link>
            </nav>

            {/* MOBILE HAMBURGER */}
            <button
              className="hamburger"
              onClick={() => setOpenMenu(!openMenu)}
              aria-label="Toggle menu"
            >
              <div className={openMenu ? "bar rotate1" : "bar"}></div>
              <div className={openMenu ? "bar hide" : "bar"}></div>
              <div className={openMenu ? "bar rotate2" : "bar"}></div>
            </button>
          </header>

          {/* MOBILE MENU */}
          {openMenu && (
            <nav className="nav-mobile">
              <Link to="/" className="nav-item" onClick={() => setOpenMenu(false)}>
                Home
              </Link>
              <Link to="/leaderboard" className="nav-item" onClick={() => setOpenMenu(false)}>
                Leaderboard
              </Link>
              <Link to="/admin" className="nav-item" onClick={() => setOpenMenu(false)}>
                Admin
              </Link>
            </nav>
          )}

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
      )}
    </>
  );
}
