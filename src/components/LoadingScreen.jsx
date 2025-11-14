import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [logoFocused, setLogoFocused] = useState(false);
  const [holdLogo, setHoldLogo] = useState(false);
  const [startFade, setStartFade] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Tahap 1: Logo muncul blur → fokus
    const tFocus = setTimeout(() => {
      setLogoFocused(true);
    }, 900);

    // Tahap 2: Logo sudah fokus → tahan 3 detik (freeze effect)
    const tHold = setTimeout(() => {
      setHoldLogo(true);
    }, 900 + 3000); // setelah fokus + 3 detik

    // Tahap 3: Fade keluar setelah tahan
    const tFade = setTimeout(() => {
      setStartFade(true);
    }, 900 + 3000 + 800);

    // Tahap 4: Hilang total
    const tHide = setTimeout(() => {
      setHide(true);
    }, 900 + 3000 + 800 + 900);

    return () => {
      clearTimeout(tFocus);
      clearTimeout(tHold);
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
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: startFade ? 0 : 1,
        transition: "opacity 1.1s ease",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        backgroundSize: "300% 300%",
        animation: "bgAnim 8s infinite ease",
        backdropFilter: startFade ? "blur(0px)" : "blur(6px)",
      }}
    >
      {/* LOGO */}
      <img
        src="/logo.png"
        alt="logo"
        style={{
          width: 165,
          height: 165,
          objectFit: "contain",
          borderRadius: 18,

          // Fokus blur
          filter: logoFocused ? "blur(0px)" : "blur(12px)",

          // Scale cinematic
          transform: logoFocused
            ? "scale(1)"
            : "scale(0.75)",

          opacity: startFade ? 0 : 1,
          transition:
            "filter 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity .8s",

          // Glow hanya aktif setelah fokus + hold selesai
          boxShadow:
            logoFocused && holdLogo
              ? "0 0 40px rgba(96,165,250,0.55), 0 0 75px rgba(96,165,250,0.3)"
              : "0 0 0 rgba(0,0,0,0)",

          animation: logoFocused
            ? holdLogo
              ? "pulseGlow 2.4s infinite ease-in-out"
              : "none"
            : "none",
        }}
      />

      {/* TEXT */}
      <div
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 500,
          color: "var(--muted)",
          opacity: logoFocused ? 1 : 0,
          transition: "opacity .8s ease",
          filter: startFade ? "blur(5px)" : "blur(0px)",
          animation:
            logoFocused && holdLogo
              ? "textFloat 2s infinite ease-in-out"
              : "none",
        }}
      >
        Loading...
      </div>

      {/* PROGRESS */}
      <div
        style={{
          width: 200,
          height: 6,
          borderRadius: 6,
          overflow: "hidden",
          marginTop: 22,
          background: "rgba(255,255,255,0.1)",
          opacity: holdLogo ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            animation: "progressBar 2.1s infinite ease-in-out",
          }}
        />
      </div>

      <style>
        {`
          @keyframes bgAnim {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 25px rgba(96,165,250,0.4),
                          0 0 55px rgba(96,165,250,0.2);
            }
            50% {
              box-shadow: 0 0 50px rgba(96,165,250,0.75),
                          0 0 95px rgba(96,165,250,0.35);
            }
          }

          @keyframes textFloat {
            0% { transform: translateY(0); opacity: .85; }
            50% { transform: translateY(-4px); opacity: 1; }
            100% { transform: translateY(0); opacity: .85; }
          }

          @keyframes progressBar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(10%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
