import { useState } from "react";

export default function QuestionCard({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [startTime] = useState(Date.now());

  function choose(idx) {
    setSelected(idx);

    const timeTaken = (Date.now() - startTime) / 1000;

    onAnswer(q.id, idx, timeTaken);
  }

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>{q.text}</div>

      {q.options.map((opt, idx) => (
        <button
          key={idx}
          className="btn-choice"
          onClick={() => choose(idx)}
          style={{
            width: "100%",
            marginTop: 6,
            background: selected === idx ? "#2563eb" : "#f3f4f6",
            color: selected === idx ? "white" : "black",
            borderRadius: 6,
            padding: 10,
            textAlign: "left",
          }}
        >
          {String.fromCharCode(65 + idx)}. {opt}
        </button>
      ))}
    </div>
  );
}
