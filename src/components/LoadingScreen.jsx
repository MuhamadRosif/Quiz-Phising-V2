import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [startBlurOut, setStartBlurOut] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Blur in → fokus → glow
    const t1 = setTimeout(() => {
      setStartBlurOut(true); // mulai keluar
    }, 2600); // Durasi dibuat panjang dan cinematic

    const t2 = setTimeout(() => {
      setHide(true); // hilang total
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
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
        backdropFilter: startBlurOut ? "blur(0px)" : "blur(12px)",
        transition: "backdrop-filter 1.2s ease, opacity 1s ease",
        opacity: startBlurOut ? 0 : 1,
        background: "linear-gradient(130deg, #0f172a, #1e293b, #0f172a)",
        backgroundSize: "300% 300%",
        animation: "gradientMove 7s ease infinite",
      }}
    >
      {/* Logo cinematic */}
      <img
        src="/logo.png"
        alt="Loading"
        style={{
          width: 150,
          height: 150,
          objectFit: "contain",
          borderRadius: 16,
          filter: startBlurOut ? "blur(6px)" : "blur(0px)",
          opacity: startBlurOut ? 0 : 1,
          transition: "opacity 1s ease, filter 1.2s ease",
          animation:
            "fadeInScale 1.6s ease forwards, pulseGlow 2.4s infinite ease-in-out",
        }}
      />

      {/* Text cinematic */}
      <div
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 500,
          color: "var(--muted)",
          opacity: startBlurOut ? 0 : 1,
          filter: startBlurOut ? "blur(4px)" : "blur(0px)",
          animation: "fadeSlideUp 1.8s ease forwards",
          transition: "opacity 1s ease, filter 1.2s ease",
        }}
      >
        Loading...
      </div>

      {/* Progress bar smooth */}
      <div
        style={{
          width: 200,
          height: 6,
          borderRadius: 6,
          overflow: "hidden",
          marginTop: 22,
          background: "rgba(255,255,255,0.08)",
          opacity: startBlurOut ? 0 : 1,
          transition: "opacity 1s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            animation: "progressSmooth 2s infinite ease-in-out",
          }}
        />
      </div>

      {/* KEYFRAMES */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.65); filter: blur(12px); }
            50% { opacity: 0.6; transform: scale(0.85); filter: blur(4px); }
            100% { opacity: 1; transform: scale(1); filter: blur(0px); }
          }

          @keyframes fadeSlideUp {
            0% { opacity: 0; transform: translateY(12px); filter: blur(10px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(96,165,250,0.3),
                          0 0 35px rgba(96,165,250,0.15);
            }
            50% {
              box-shadow: 0 0 40px rgba(96,165,250,0.6),
                          0 0 70px rgba(96,165,250,0.3);
            }
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
