import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState("blur"); 
  // blur → focus → hold → animate → fade → hide

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("focus"), 50);      // start focusing
    const t2 = setTimeout(() => setPhase("hold"), 1450);     // after 1.4s focus done
    const t3 = setTimeout(() => setPhase("animate"), 1450 + 3000); // hold 3s
    const t4 = setTimeout(() => setPhase("fade"), 1450 + 3000 + 900);
    const t5 = setTimeout(() => setPhase("hide"), 1450 + 3000 + 900 + 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (phase === "hide") return null;

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
        background: "#0f172a",
        transition: "opacity 1s ease",
        opacity: phase === "fade" ? 0 : 1,
      }}
    >
      {/* LOGO */}
      <img
        src="/logo.png"
        alt="logo"
        style={{
          width: 180,
          height: 180,
          objectFit: "contain",
          borderRadius: 16,

          // PURE FOCUS ONLY
          filter:
            phase === "blur"
              ? "blur(14px)"
              : phase === "focus"
              ? "blur(0px)"
              : "blur(0px)",

          transform:
            phase === "blur"
              ? "scale(0.72)"
              : phase === "focus"
              ? "scale(1)"
              : "scale(1)",

          transition:
            phase === "focus"
              ? "filter 1.3s ease, transform 1.3s cubic-bezier(0.16,1,0.3,1)"
              : "none",

          /* Glow ONLY after animation phase */
          boxShadow:
            phase === "animate"
              ? "0 0 40px rgba(96,165,250,0.6), 0 0 80px rgba(96,165,250,0.3)"
              : "none",

          animation:
            phase === "animate"
              ? "pulseX 2.8s infinite ease-in-out"
              : "none",
        }}
      />

      {/* TEXT */}
      <div
        style={{
          marginTop: 32,
          fontSize: 20,
          fontWeight: 500,
          color: "var(--muted)",
          opacity: phase === "animate" ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        Loading...
      </div>

      {/* PROGRESS BAR */}
      <div
        style={{
          width: 230,
          height: 6,
          borderRadius: 6,
          overflow: "hidden",
          background: "rgba(255,255,255,0.1)",
          marginTop: 18,
          opacity: phase === "animate" ? 1 : 0,
          transition: "opacity 1.1s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--accent)",
            animation:
              phase === "animate"
                ? "lineRun 1.8s infinite ease-in-out"
                : "none",
          }}
        />
      </div>

      <style>
        {`
          @keyframes pulseX {
            0%, 100% {
              box-shadow: 0 0 30px rgba(96,165,250,0.5),
                          0 0 70px rgba(96,165,250,0.25);
            }
            50% {
              box-shadow: 0 0 55px rgba(96,165,250,0.75),
                          0 0 110px rgba(96,165,250,0.35);
            }
          }

          @keyframes lineRun {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(10%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
