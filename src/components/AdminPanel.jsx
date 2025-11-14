import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // if not using supabase, methods will fallback
import { fetchSettings, saveSettings, fetchQuestionsByRound } from "../lib/api";

/**
 * AdminPanel (Level 1)
 * - Simple password login (checks VITE_ADMIN_PASSWORD or Supabase user)
 * - Add / Edit / Delete questions
 * - View players
 * - Reset data
 *
 * Works with Supabase if configured, otherwise falls back to localStorage.
 */

// helper localStorage keys
const LS_Q = "quiz_local_questions_v1";
const LS_PLAYERS = "quiz_local_players_v1";
const LS_SETTINGS = "quiz_local_settings_v1";

function useLocalQuestions() {
  const load = () => {
    try {
      const s = localStorage.getItem(LS_Q);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  };
  const [questions, setQuestions] = useState(load);

  useEffect(() => {
    localStorage.setItem(LS_Q, JSON.stringify(questions));
  }, [questions]);

  return { questions, setQuestions, reload: () => setQuestions(load()) };
}

function useLocalPlayers() {
  const load = () => {
    try {
      const s = localStorage.getItem(LS_PLAYERS);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  };
  const [players, setPlayers] = useState(load);
  useEffect(() => {
    localStorage.setItem(LS_PLAYERS, JSON.stringify(players));
  }, [players]);
  return { players, setPlayers, reload: () => setPlayers(load()) };
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(Boolean(import.meta.env.VITE_SUPABASE_URL));
  const [notice, setNotice] = useState("");

  // local hooks
  const localQ = useLocalQuestions();
  const localP = useLocalPlayers();

  // UI state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    round: 1,
    text: "",
    options: ["", "", "", ""],
    answer: 0,
    points: 10,
  });

  const [questions, setQuestions] = useState([]); // for display (from supabase or local)
  const [players, setPlayers] = useState([]);

  // load data
  useEffect(() => {
    if (!authed) return;
    loadAll();
  }, [authed]);

  async function loadAll() {
    setLoading(true);
    try {
      if (useSupabase && supabase) {
        // try supabase fetch
        const { data: qdata, error: qerr } = await supabase.from("questions").select("*").order("round", { ascending: true });
        const { data: pdata } = await supabase.from("players").select("*").order("total_score", { ascending: false });
        if (!qerr && qdata) {
          // normalize options
          const norm = qdata.map((r) => ({ ...r, options: typeof r.options === "string" ? JSON.parse(r.options) : r.options }));
          setQuestions(norm);
        } else {
          setQuestions(localQ.questions);
        }
        setPlayers(pdata || localP.players);
      } else {
        setQuestions(localQ.questions);
        setPlayers(localP.players);
      }
    } catch (e) {
      // fallback
      setQuestions(localQ.questions);
      setPlayers(localP.players);
    } finally {
      setLoading(false);
    }
  }

  // AUTH (very simple)
  function tryLogin() {
    // prefer env password
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (envPass && password === envPass) {
      setAuthed(true);
      setNotice("Login success (env password)");
      setTimeout(() => setNotice(""), 2000);
      return;
    }

    // try supabase session user
    if (useSupabase && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setAuthed(true);
          setNotice("Login via Supabase user");
          setTimeout(() => setNotice(""), 2000);
        } else {
          setNotice("Password salah atau belum login (Supabase)");
        }
      }).catch(() => setNotice("Auth error"));
      return;
    }

    // fallback admin password check (simple)
    if (password === "admin123") {
      setAuthed(true);
      setNotice("Login success (fallback default)");
      setTimeout(() => setNotice(""), 2000);
    } else {
      setNotice("Password salah");
    }
  }

  // LOGOUT
  async function handleLogout() {
    try {
      if (useSupabase && supabase) await supabase.auth.signOut();
    } catch {}
    setAuthed(false);
    setPassword("");
  }

  // ADD QUESTION (local or supabase)
  async function addQuestion(e) {
    e && e.preventDefault();
    const newQ = {
      id: "local_" + Math.random().toString(36).slice(2, 9),
      round: Number(form.round) || 1,
      text: form.text,
      options: form.options.map((o) => o || ""),
      answer: Number(form.answer) || 0,
      points: Number(form.points) || 10,
    };
    if (useSupabase && supabase) {
      try {
        const payload = { round: newQ.round, text: newQ.text, options: JSON.stringify(newQ.options), answer: newQ.answer, points: newQ.points };
        const { error } = await supabase.from("questions").insert(payload);
        if (error) throw error;
        setNotice("Soal disimpan ke Supabase");
        loadAll();
      } catch (err) {
        // fallback local
        localQ.setQuestions((s) => [newQ, ...s]);
        setQuestions((s) => [newQ, ...s]);
        setNotice("Supabase error, disimpan local");
      }
    } else {
      localQ.setQuestions((s) => [newQ, ...s]);
      setQuestions((s) => [newQ, ...s]);
      setNotice("Soal disimpan lokal");
    }
    resetForm();
    setTimeout(() => setNotice(""), 2200);
  }

  function resetForm() {
    setForm({ round: 1, text: "", options: ["", "", "", ""], answer: 0, points: 10 });
    setEditingId(null);
  }

  // EDIT
  function startEdit(q) {
    setEditingId(q.id);
    setForm({
      round: q.round,
      text: q.text,
      options: q.options ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options)) : ["", "", "", ""],
      answer: q.answer,
      points: q.points,
    });
  }

  async function saveEdit(e) {
    e && e.preventDefault();
    if (!editingId) return;
    const payload = {
      round: Number(form.round),
      text: form.text,
      options: JSON.stringify(form.options),
      answer: Number(form.answer),
      points: Number(form.points),
    };
    if (useSupabase && supabase && !String(editingId).startsWith("local_")) {
      const { error } = await supabase.from("questions").update(payload).eq("id", editingId);
      if (!error) {
        setNotice("Perubahan disimpan ke Supabase");
        loadAll();
      } else {
        setNotice("Gagal simpan ke Supabase");
      }
    } else {
      // local update
      localQ.setQuestions((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload, options: JSON.parse(payload.options) } : p)));
      setQuestions((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload, options: JSON.parse(payload.options) } : p)));
      setNotice("Perubahan disimpan lokal");
    }
    resetForm();
    setTimeout(() => setNotice(""), 2000);
  }

  // DELETE
  async function deleteQuestion(id) {
    if (!confirm("Hapus soal ini?")) return;
    if (useSupabase && supabase && !String(id).startsWith("local_")) {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (!error) {
        setNotice("Soal dihapus (Supabase)");
        loadAll();
      } else {
        setNotice("Gagal menghapus di Supabase");
      }
    } else {
      localQ.setQuestions((prev) => prev.filter((p) => p.id !== id));
      setQuestions((prev) => prev.filter((p) => p.id !== id));
      setNotice("Soal dihapus (local)");
    }
    setTimeout(() => setNotice(""), 1800);
  }

  // RESET ALL (danger)
  async function resetAll() {
    if (!confirm("Reset semua data (soal & peserta)?")) return;
    if (useSupabase && supabase) {
      try {
        await supabase.from("questions").delete();
        await supabase.from("players").delete();
        setNotice("Data Supabase direset");
      } catch {
        setNotice("Reset Supabase gagal");
      }
    }
    localStorage.removeItem(LS_Q);
    localStorage.removeItem(LS_PLAYERS);
    localQ.reload();
    localP.reload();
    setQuestions([]);
    setPlayers([]);
    setTimeout(() => setNotice(""), 1800);
  }

  // load initial from local
  useEffect(() => {
    // if local has data, use it for initial display
    setQuestions(localQ.questions);
    setPlayers(localP.players);
  }, []); // once

  // fetch from supabase if available and authed
  useEffect(() => {
    if (authed) loadAll();
  }, [authed]);

  // UI handlers for option input
  function setOptionAt(index, value) {
    setForm((f) => {
      const opts = [...f.options];
      opts[index] = value;
      return { ...f, options: opts };
    });
  }

  return (
    <div className="card admin-panel" style={{ padding: 18 }}>
      {!authed ? (
        <div>
          <h2>Admin Login</h2>
          <p className="small">Masuk sebagai admin untuk mengelola soal dan peserta.</p>

          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="input"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              style={{ minWidth: 220 }}
            />
            <button className="btn" onClick={tryLogin}>Login</button>
            <button className="btn-ghost" onClick={() => { setUseSupabase(!useSupabase); setNotice(useSupabase ? "Using localStorage" : "Using Supabase (if configured)"); setTimeout(()=>setNotice(""),1400); }}>
              {useSupabase ? "Use Local" : "Use Supabase"}
            </button>
          </div>

          {notice && <div style={{ marginTop: 10 }} className="small">{notice}</div>}
          <hr style={{ margin: "18px 0", borderColor: "rgba(255,255,255,0.04)" }} />
          <div className="small">Catatan: jika belum setup Supabase, gunakan local (default).</div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <h2>Admin Panel</h2>
              <div className="small">Manage questions / players</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={loadAll}>Refresh</button>
              <button className="btn-ghost" onClick={() => { localQ.reload(); localP.reload(); setQuestions(localQ.questions); setPlayers(localP.players); setNotice("Loaded local data"); setTimeout(()=>setNotice(""),1200); }}>Load Local</button>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {notice && <div style={{ marginTop: 10 }} className="small">{notice}</div>}

          {/* --- Add / Edit form --- */}
          <div style={{ marginTop: 18 }} className="card">
            <h3 style={{ marginBottom: 8 }}>{editingId ? "Edit Soal" : "Tambah Soal Baru"}</h3>

            <form onSubmit={editingId ? saveEdit : addQuestion} style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <label className="small" style={{ minWidth: 60 }}>Babak</label>
                <input className="input" type="number" min="1" max="10" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} style={{ width: 90 }} />
                <label className="small" style={{ minWidth: 60 }}>Poin</label>
                <input className="input" type="number" min="0" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} style={{ width: 120 }} />
              </div>

              <div>
                <label className="small">Teks Soal</label>
                <textarea className="input" rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
              </div>

              <div>
                <label className="small">Pilihan</label>
                <div style={{ display: "grid", gap: 8 }}>
                  {form.options.map((opt, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 30, fontWeight: 700 }}>{String.fromCharCode(65 + i)}</div>
                      <input className="input" value={opt} onChange={(e) => setOptionAt(i, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <label className="small">Index Jawaban (0-3)</label>
                <input className="input" type="number" min="0" max="3" value={form.answer} onChange={(e) => setForm({ ...form, answer: Number(e.target.value) })} style={{ width: 100 }} />
                <div style={{ flex: 1 }} />
                <button type="submit" className="btn">{editingId ? "Simpan Perubahan" : "Tambah Soal"}</button>
                <button type="button" className="btn-ghost" onClick={resetForm}>Reset</button>
              </div>
            </form>
          </div>

          {/* --- Questions list --- */}
          <div style={{ marginTop: 18 }}>
            <h3>Daftar Soal ({questions.length})</h3>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              {loading && <div className="small">Loading...</div>}
              {!loading && questions.length === 0 && <div className="small">Belum ada soal.</div>}
              {!loading && questions.map((q) => (
                <div key={q.id} className="q-card" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>R{q.round} — {q.text}</div>
                    <div className="small" style={{ marginTop: 6 }}>
                      {Array.isArray(q.options) ? q.options.map((o,i)=> <div key={i}>{String.fromCharCode(65+i)}. {o}</div>) : (JSON.parse(q.options || '[]')).map((o,i)=> <div key={i}>{String.fromCharCode(65+i)}. {o}</div>)}
                    </div>
                    <div className="small" style={{ marginTop: 6 }}>Answer: {q.answer} • Points: {q.points}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button className="btn-ghost" onClick={() => startEdit(q)}>Edit</button>
                    <button className="btn-ghost" onClick={() => deleteQuestion(q.id)}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Players --- */}
          <div style={{ marginTop: 18 }}>
            <h3>Players ({players.length})</h3>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              {players.length === 0 && <div className="small">Belum ada peserta.</div>}
              {players.map((p) => (
                <div key={p.id} className="q-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div className="small">Score: {p.total_score ?? 0} — Time: {p.total_time ?? 0}s</div>
                  </div>
                  <div className="small">{p.created_at ? new Date(p.created_at).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Danger actions --- */}
          <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => { if(confirm("Export all questions to JSON?")) { const data = JSON.stringify(questions, null, 2); const blob = new Blob([data], {type: "application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'questions.json'; a.click(); URL.revokeObjectURL(url); }}}>Export JSON</button>

            <button className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(questions)).then(()=> alert("Copied to clipboard")) }}>Copy JSON</button>

            <button className="btn" onClick={resetAll} style={{ background: "#ef4444", color: "#fff" }}>Reset Semua</button>
          </div>
        </div>
      )}
    </div>
  );
}
