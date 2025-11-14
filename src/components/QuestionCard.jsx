import React, { useState, useEffect } from "react";

export default function QuestionCard({ q, onAnswer }){
  const [selected, setSelected] = useState(null);
  const [startTs, setStartTs] = useState(Date.now());

  useEffect(()=> {
    setStartTs(Date.now());
    setSelected(null);
  }, [q.id]);

  function pick(idx){
    if(selected !== null) return; // once answered, lock
    setSelected(idx);
    const timeTaken = Math.round((Date.now() - startTs) / 1000);
    onAnswer(q.id, idx, timeTaken);
  }

  const opts = Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]");

  return (
    <div className="q-card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div><strong>{q.text}</strong></div>
      </div>

      <div style={{marginTop:8, display:"grid", gap:8}}>
        {opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            style={{
              textAlign:"left",
              padding:"10px",
              borderRadius:8,
              border: selected===i ? "2px solid #10b981" : "1px solid rgba(255,255,255,0.04)",
              background:selected===i ? "rgba(16,185,129,0.06)" : "transparent"
            }}
          >
            {String.fromCharCode(65+i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
