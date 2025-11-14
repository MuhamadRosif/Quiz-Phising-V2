import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Cek apakah admin sudah login
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate("/");  // kalau belum login, kembali ke home
      } else {
        setUser(data.user);
      }
    }
    loadUser();
  }, []);

  // ------- LOGOUT -------
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/"); // kembali ke home setelah logout
  }

  return (
    <div className="card">

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Panel</h2>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="btn"
          style={{ background: "#ef4444", color: "white" }}
        >
          Logout
        </button>
      </div>

      <p className="small" style={{ marginBottom: 20 }}>
        Login sebagai: {user?.email}
      </p>

      {/* konten admin di sini */}
      <div>
        {/* ... fitur admin lainnya ... */}
      </div>

    </div>
  );
}
