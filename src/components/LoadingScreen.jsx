import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [hide, setHide] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah masuk sebelumnya
    const hasLoadedBefore = localStorage.getItem("quiz_first_load");

    // Kalau pernah, langsung skip loading
    if (hasLoadedBefore) {
      setHide(true);
      return;
    }

    // Simpan bahwa loading sudah pernah muncul
    localStorage.setItem("quiz_first_load", "true");

    // Fade-out mulai
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    // Hilang total
    const timer2 = setTimeout(() => {
      setHide(true);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (hide) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        backgroundSize: "300% 300%",
        animation: "gradientMove 6s ease infinite",
      }}
    >
      {/* Logo */}
      <img
        src="/logo-university.png"
        alt="Loading"
        style={{
          width: 130,
          height: 130,
          objectFit: "contain",
          borderRadius: 14,
          animation:
            "spinLogo 5s linear infinite, pulseGlow 2s infinite ease-in-out, scaleUp 1s ease",
          boxShadow: "0 0 35px rgba(96,165,250,0.4)",
        }}
      />

      {/* Text */}
      <div
        style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: 500,
          color: "var(--muted)",
          animation: "floatText 2s infinite ease-in-out",
        }}
      >
        Loading...
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: 180,
          height: 6,
          borderRadius: 6,
          marginTop: 18,
          overflow: "hidden",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            animation: "progressAnim 1.7s infinite",
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes spinLogo {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes scaleUp {
            0% { transform: scale(0.6); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 15px rgba(96,165,250,0.3),
                          0 0 30px rgba(96,165,250,0.15);
            }
            50% {
              box-shadow: 0 0 35px rgba(96,165,250,0.6),
                          0 0 60px rgba(96,165,250,0.3);
            }
          }

          @keyframes floatText {
            0% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(-4px); opacity: 1; }
            100% { transform: translateY(0); opacity: 0.8; }
          }

          @keyframes progressAnim {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
