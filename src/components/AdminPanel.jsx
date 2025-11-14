// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import {
  addQuestion,
  deleteQuestion,
  fetchAllQuestions
} from "../lib/api";

export default function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    round: 1,
    text: "",
    a: "",
    b: "",
    c: "",
    d: "",
    answer: 0,
    points: 10
  });

  async function loadQuestions() {
    const q = await fetchAllQuestions();
    setQuestions(q);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    const payload = {
      round: Number(form.round),
      text: form.text,
      options: [form.a, form.b, form.c, form.d],
      answer: Number(form.answer),
      points: Number(form.points)
    };

    const ok = await addQuestion(payload);
    if (ok) {
      alert("Soal ditambahkan!");
      loadQuestions();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus soal ini?")) return;

    const ok = await deleteQuestion(id);
    if (ok) {
      alert("Dihapus!");
      loadQuestions();
    }
  }

  return (
    <div className="text-white p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {/* ADD QUESTION */}
      <form onSubmit={handleAdd} className="space-y-2 p-4 bg-gray-800 rounded-lg">
        <h2 className="font-bold">Tambah Soal</h2>

        <input
          placeholder="Babak (round)"
          type="number"
          className="p-2 w-full bg-gray-700"
          value={form.round}
          onChange={(e) => setForm({ ...form, round: e.target.value })}
        />

        <textarea
          placeholder="Isi soal"
          className="p-2 w-full bg-gray-700"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />

        {["a", "b", "c", "d"].map((key, idx) => (
          <input
            key={idx}
            placeholder={`Pilihan ${key.toUpperCase()}`}
            className="p-2 w-full bg-gray-700"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <input
          placeholder="Jawaban benar (0=A,1=B,2=C,3=D)"
          type="number"
          className="p-2 w-full bg-gray-700"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
        />

        <input
          placeholder="Points"
          type="number"
          className="p-2 w-full bg-gray-700"
          value={form.points}
          onChange={(e) => setForm({ ...form, points: e.target.value })}
        />

        <button className="bg-green-500 p-2 rounded w-full">
          Tambahkan
        </button>
      </form>

      {/* LIST OF QUESTIONS */}
      <div className="mt-6">
        <h2 className="font-bold mb-2">Daftar Soal</h2>
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-gray-700 p-3 rounded-lg mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                Babak {q.round} — Soal {q.id}
              </p>
              <p>{q.text}</p>
            </div>
            <button
              className="bg-red-500 p-2 rounded"
              onClick={() => handleDelete(q.id)}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
