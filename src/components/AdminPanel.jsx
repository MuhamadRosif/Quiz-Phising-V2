import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [questions, setQuestions] = useState([]);

  // Input Fields
  const [questionText, setQuestionText] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correct, setCorrect] = useState("");

  // Loading state untuk tombol
  const [loading, setLoading] = useState(false);

  // Load questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const { data, error } = await supabase.from("questions").select("*").order("id");
    if (error) {
      console.error("Error fetching questions:", error);
      return;
    }
    if (data) setQuestions(data);
  }

  function handleLogin() {
    if (password === "admin123") setLoggedIn(true);
    else alert("Password salah!");
  }

  async function addQuestion() {
    if (!questionText || !a || !b || !c || !d || !correct) {
      alert("Isi semua field termasuk jawaban benar!");
      return;
    }

    setLoading(true);
    try {
      console.log("Menambahkan soal:", { questionText, a, b, c, d, correct });

      const { data, error } = await supabase
        .from("questions")
        .insert({
          text: questionText,
          a,
          b,
          c,
          d,
          correct
        })
        .select(); // select() biar langsung dapet data yang baru ditambahkan

      if (error) {
        console.error("Error menambahkan soal:", error);
        alert("Gagal menambahkan soal. Cek console.");
      } else {
        alert("Soal berhasil ditambahkan!");
        // Reset semua input
        setQuestionText("");
        setA("");
        setB("");
        setC("");
        setD("");
        setCorrect("");
        // Refresh daftar soal
        fetchQuestions();
      }
    } catch (err) {
      console.error("Catch error:", err);
      alert("Terjadi kesalahan. Cek console.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuestion(id) {
    if (!confirm("Hapus soal ini?")) return;

    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) console.error("Error deleting question:", error);
    fetchQuestions();
  }

  async function deleteAll() {
    if (!confirm("HAPUS SEMUA SOAL?")) return;

    const { error } = await supabase.from("questions").delete().neq("id", 0);
    if (error) console.error("Error deleting all questions:", error);
    fetchQuestions();
  }

  if (!loggedIn)
    return (
      <div className="card admin-panel" style={{ maxWidth: 380, margin: "40px auto" }}>
        <h2>Admin Login</h2>
        <input
          className="input"
          placeholder="Password admin"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginTop: 10 }}
        />
        <button
          className="btn"
          onClick={handleLogin}
          style={{ marginTop: 14, width: "100%" }}
        >
          Login
        </button>
      </div>
    );

  return (
    <div className="admin-panel">
      <div className="card">
        <h2>Tambah Soal</h2>

        <textarea
          className="input"
          placeholder="Tulis soal..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          style={{ width: "100%", height: 70, marginTop: 10 }}
        />

        <input className="input" placeholder="Pilihan A" value={a} onChange={(e) => setA(e.target.value)} />
        <input className="input" placeholder="Pilihan B" value={b} onChange={(e) => setB(e.target.value)} />
        <input className="input" placeholder="Pilihan C" value={c} onChange={(e) => setC(e.target.value)} />
        <input className="input" placeholder="Pilihan D" value={d} onChange={(e) => setD(e.target.value)} />

        <select
          className="input"
          value={correct}
          onChange={(e) => setCorrect(e.target.value)}
          style={{ marginTop: 10 }}
        >
          <option value="">Jawaban Benar...</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>

        <button
          className="btn"
          onClick={addQuestion}
          style={{ marginTop: 14 }}
          disabled={loading}
        >
          {loading ? "Menambahkan..." : "Tambah Soal"}
        </button>

        <button
          className="btn-ghost"
          onClick={deleteAll}
          style={{ marginTop: 10, width: "100%", borderColor: "red", color: "red" }}
        >
          Hapus Semua Soal ❌
        </button>
      </div>

      <h2 style={{ marginTop: 25 }}>Daftar Soal</h2>

      <div>
        {questions.map((q) => (
          <div key={q.id} className="q-card" style={{ marginBottom: 12 }}>
            <div><b>{q.id}. </b> {q.text}</div>
            <div className="small">
              A: {q.a} • B: {q.b} • C: {q.c} • D: {q.d}
              <br />
              <b style={{ color: "#10b981" }}>Jawaban benar: {q.correct.toUpperCase()}</b>
            </div>
            <button
              className="btn-ghost"
              onClick={() => deleteQuestion(q.id)}
              style={{ marginTop: 6, width: "100%", borderColor: "red", color: "red" }}
            >
              Hapus Soal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
