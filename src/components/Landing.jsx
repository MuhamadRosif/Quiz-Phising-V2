import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing(){
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>Selamat datang — Kompetisi Quiz</h2>
      <p className="small">Terdiri dari 3 babak, masing-masing 20 soal. Setelah tiap babak akan terjadi eliminasi.</p>

      <div style={{marginTop:16, display:"flex", gap:12}}>
        <button className="btn" onClick={() => navigate("/quiz")}>Mulai Kuis</button>
        <button className="btn-ghost" onClick={() => navigate("/leaderboard")}>Lihat Leaderboard</button>
      </div>

      <div style={{marginTop:18}}>
        <h4 className="small">Aturan singkat</h4>
        <ol className="small">
          <li>3 babak; setiap babak 20 soal.</li>
          <li>Setiap soal bernilai 10 poin (default).</li>
          <li>Setelah tiap babak, bottom x% dieliminasi (aturan admin).</li>
          <li>Ranking berdasarkan total score, jika seri, pemenang = total waktu lebih kecil.</li>
        </ol>
      </div>
    </div>
  );
}
