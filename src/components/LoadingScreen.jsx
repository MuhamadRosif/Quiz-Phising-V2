import React, { useEffect, useState } from "react";

export default function LoadingScreen({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 1800); // durasi 1.8 detik, lebih smooth

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="loading-screen">
      <img
        src="/logo-university.png"
        alt="University Logo"
        className="loading-logo"
      />
      <div className="loading-text">Loading Quiz...</div>
    </div>
  );
}
