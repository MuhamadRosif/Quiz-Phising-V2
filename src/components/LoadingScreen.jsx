import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [startFade, setStartFade] = useState(false);
  const [hide, setHide] = useState(false);
  const [logoFocused, setLogoFocused] = useState(false);

  useEffect(() => {
    // Logo butuh waktu agar blur hilang sempurna
    const tFocus = setTimeout(() => {
      setLogoFocused(true);
    }, 900); // waktu fokus lebih dulu sebelum fade

    const tFade = setTimeout(() => {
      setStartFade(true);
    }, 2400); // waktu tampil cinematic

    const tHide = setTimeout(() => {
      setHide(true);
    }, 3300);

    return () => {
      clearTimeout(tFocus);
      clearTimeout(tFade);
      clearTimeout(tHide);
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
        opacity: startFade ? 0 : 1,
        transition: "opacity 1.1s ease",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        backgroundSize: "280% 280%",
        animation: "gradientFlow 8s ease infinite",
        backdropFilter: startFade ? "blur(0px)" : "blur(6px)",
      }}
    >
      {/* Logo */}
      <img
        src="/logo-university.png"
        alt="Logo Loading"
        style={{
          width: 155,
          height: 155,
          objectFit: "contain",
          borderRadius: 18,
          opacity: startFade ? 0 : 1,
          filter: logoFocused ? "blur(0px)" : "blur(12px)",
          transform: startFade
            ? "scale(0.92)"
            : logoFocused
            ? "scale(1)"
            : "scale(0.75)",
          transition:
            "filter 1.2s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease",
          // Glow hanya aktif setelah logo benar-benar fokus
          boxShadow: logoFocused
            ? "0 0 35px rgba(96,165,250,0.45), 0 0 60px rgba(96,165,250,0.25)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
      />

      {/* Loading Text */}
      <div
        style={{
          marginTop: 28,
          fontSize: 20,
          fontWeight: 500,
          opacity: startFade ? 0 : 1,
          filter: logoFocused ? "blur(0px)" : "blur(4px)",
          color: "var(--muted)",
          transition: "opacity 0.8s ease, filter 0.9s ease",
          animation: logoFocused ? "floatText 2.2s infinite ease-in-out" : "none",
        }}
      >
        Loading...
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: 200,
          height: 7,
          borderRadius: 6,
          overflow: "hidden",
          marginTop: 20,
          background: "rgba(255,255,255,0.08)",
          opacity: startFade ? 0 : 1,
          transition: "opacity 1s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            animation: "progressSmooth 2.1s infinite ease-in-out",
          }}
        />
      </div>

      <style>
        {`
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes floatText {
            0% { transform: translateY(0); opacity: .85; }
            50% { transform: translateY(-4px); opacity: 1; }
            100% { transform: translateY(0); opacity: .85; }
          }

          @keyframes progressSmooth {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(20%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
