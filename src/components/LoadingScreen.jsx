import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        display: hide ? "none" : "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "opacity 0.6s ease",
      }}
    >
      <img
        src="/logo-university.png"
        alt="Loading"
        style={{
          width: 110,
          height: 110,
          opacity: hide ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      />
    </div>
  );
}
