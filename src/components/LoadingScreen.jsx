import React, { useEffect, useState } from "react";

export default function LoadingScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 2000); // durasi loading 2 detik

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <img
        src="/logo-university.png"
        alt="University Logo"
        style={{
          width: 150,
          height: 150,
          marginBottom: 20,
          animation: "pulse 1.5s infinite ease-in-out"
        }}
      />
      <p style={{ marginTop: 10, fontSize: 18, color: "white" }}>
        Loading Quiz...
      </p>
    </div>
  );
}
