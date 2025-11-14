import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../lib/api";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBoard() {
    setLoading(true);
    try {
      const data = await fetchLeaderboard();

      // sort fallback (kalau Supabase belum mengurutkan)
      const sorted = data.sort((a, b) => {
        if (b.total_score !== a.total_score) {
          return b.total_score - a.total_score; // skor besar dulu
        }
        return a.total_time - b.total_time; // waktu kecil menang
      });

      setPlayers(sorted);
    } catch (err) {
      console.error("Leaderboard error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBoard();
    const interval = setInterval(loadBoard, 3000); // auto refresh 3 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Leaderboard</h2>

      {loading && <div className="small">Memuat...</div>}

      {!loading && players.length === 0 && (
        <div className="small">Belum ada peserta.</div>
      )}

      {!loading &&
        players.map((p, i) => (
          <div
            key={p.id}
            className="leader-item"
            style={{
              padding: "10px 14px",
              marginTop: 10,
              borderRadius: 8,
              background: i === 0 ? "#ffeaa7" : "#f1f2f6",
              border: i === 0 ? "2px solid #fdcb6e" : "1px solid #dfe4ea",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              #{i + 1} — {p.name}
            </div>

            <div className="small" style={{ marginTop: 4 }}>
              Skor: <b>{p.total_score}</b> • Waktu:{" "}
              <b>{p.total_time.toFixed(2)} dtk</b>
            </div>
          </div>
        ))}
    </div>
  );
}
