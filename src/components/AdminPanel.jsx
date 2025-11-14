import { useEffect, useState } from "react";
import {
  addQuestion,
  deleteQuestion,
  deleteAllQuestions,
  fetchQuestionsByRound,
} from "../lib/api";

const ADMIN_PASS = "admin123";

export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    text: "",
    a: "",
    b: "",
    c: "",
    d: "",
    answer: 0,
    points: 10,
  });

  async function load() {
    const q = await fetchQuestionsByRound(round);
    setQuestions(q);
  }

  async function handleAdd() {
    const payload = {
      round,
      text: form.text,
      options: [form.a, form.b, form.c, form.d],
      answer: Number(form.answer),
      points: Number(form.points),
    };

    await addQuestion(payload);
    await load();

    setForm({ text: "", a: "", b: "", c: "", d: "", answer: 0, points: 10 });
  }

  async function handleDelete(id) {
    await deleteQuestion(id);
    load();
  }

  async function handleDeleteAll() {
    if (!confirm("Hapus semua soal?")) return;
    await deleteAllQuestions();
    load();
  }

  // Load setiap ganti babak
  useEffect(() => {
    if (auth) load();
  }, [auth, round]);

  // LOGIN ADMIN
  if (!auth) {
    return (
      <div className="card" style={{ maxWidth: 380, margin: "50px auto" }}>
        <h2>Admin Login</h2>
        <input
          className="input"
          type="password"
          placeholder="Password admin"
          onKeyDown={(e) =>
            e.key === "Enter" &&
            e.target.value === ADMIN_PASS &&
            setAuth(true)
          }
        />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="card">
        <h2>Tambah Soal</h2>

        <select
          className="input"
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
        >
          <option value={1}>Babak 1</option>
          <option value={2}>Babak 2</option>
          <option value={3}>Babak 3</option>
        </select>

        <textarea
          className="input"
          placeholder="Tulis soal..."
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />

        <input
          className="input"
          placeholder="Pilihan A"
          value={form.a}
          onChange={(e) => setForm({ ...form, a: e.target.value })}
        />
        <input
          className="input"
          placeholder="Pilihan B"
          value={form.b}
          onChange={(e) => setForm({ ...form, b: e.target.value })}
        />
        <input
          className="input"
          placeholder="Pilihan C"
          value={form.c}
          onChange={(e) => setForm({ ...form, c: e.target.value })}
        />
        <input
          className="input"
          placeholder="Pilihan D"
          value={form.d}
          onChange={(e) => setForm({ ...form, d: e.target.value })}
        />

        <select
          className="input"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
        >
          <option value="0">Jawaban: A</option>
          <option value="1">Jawaban: B</option>
          <option value="2">Jawaban: C</option>
          <option value="3">Jawaban: D</option>
        </select>

        <button className="btn" onClick={handleAdd} style={{ marginTop: 12 }}>
          Tambah Soal
        </button>

        <button
          className="btn-ghost"
          style={{ marginTop: 10, color: "red" }}
          onClick={handleDeleteAll}
        >
          Hapus Semua Soal ❌
        </button>
      </div>

      <h2 style={{ marginTop: 20 }}>Daftar Soal</h2>

      {questions.map((q) => (
        <div key={q.id} className="q-card">
          <b>{q.text}</b>
          <div className="small">
            A: {q.options[0]} <br />
            B: {q.options[1]} <br />
            C: {q.options[2]} <br />
            D: {q.options[3]} <br />
            <b>Jawaban benar: {["A", "B", "C", "D"][q.answer]}</b>
          </div>

          <button
            onClick={() => handleDelete(q.id)}
            className="btn-ghost"
            style={{ color: "red" }}
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}
