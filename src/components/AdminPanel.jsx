import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchSettings, saveSettings } from "../lib/api";

export default function AdminPanel(){
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [settings, setSettingsState] = useState({ eliminationPercent: [50,50] });

  useEffect(()=>{
    if(authed) loadAll();
  }, [authed]);

  async function loadAll(){
    const { data } = await supabase.from("questions").select("*").order("round", {ascending:true});
    setQuestions(data || []);
    const s = await fetchSettings().catch(()=>null);
    if(s) setSettingsState(s);
  }

  function tryLogin(){
    if(password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert("Password admin salah");
    }
  }

  async function addQuestion(){
    const round = parseInt(prompt("Round (1-3)"),10) || 1;
    const text = prompt("Teks Soal") || "Soal baru";
    const opts = [];
    for(let i=0;i<4;i++) opts.push(prompt(`Pilihan ${i+1}`) || `O${i+1}`);
    const ans = parseInt(prompt("Index jawaban benar (0-3)"),10) || 0;
    await supabase.from("questions").insert([{ round, text, options: JSON.stringify(opts), answer: ans, points: 10 }]);
    loadAll();
  }

  async function delQuestion(id){
    if(!confirm("Hapus soal?")) return;
    await supabase.from("questions").delete().eq("id", id);
    loadAll();
  }

  async function saveSettingsLocal(){
    await saveSettings("global", settings);
    alert("Settings disimpan");
  }

  if(!authed) return (
    <div className="card">
      <h3>Admin Login</h3>
      <input className="input" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{marginTop:10}}>
        <button className="btn" onClick={tryLogin}>Masuk</button>
      </div>
    </div>
  );

  return (
    <div className="card">
      <h3>Admin Panel</h3>
      <div style={{marginTop:8}}>
        <button className="btn" onClick={addQuestion}>Tambah Soal</button>
      </div>

      <div style={{marginTop:12}}>
        <h4>Settings</h4>
        <div className="row">
          <label className="small">Elimination after round 1 (%)</label>
          <input className="input" type="number" value={settings.eliminationPercent?.[0] || 50}
            onChange={e => setSettingsState(s => ({...s, eliminationPercent: [Number(e.target.value), s.eliminationPercent?.[1] || 50]}))} />
        </div>
        <div className="row" style={{marginTop:8}}>
          <label className="small">Elimination after round 2 (%)</label>
          <input className="input" type="number" value={settings.eliminationPercent?.[1] || 50}
            onChange={e => setSettingsState(s => ({...s, eliminationPercent: [s.eliminationPercent?.[0] || 50, Number(e.target.value)]}))} />
        </div>
        <div style={{marginTop:8}}>
          <button className="btn" onClick={saveSettingsLocal}>Simpan Settings</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <h4>Daftar Soal</h4>
        {questions.map(q => (
          <div key={q.id} className="q-card" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600}}>R{q.round} — {q.text}</div>
              <div className="small">ops: {q.options}</div>
            </div>
            <div>
              <button className="btn-ghost" onClick={()=>delQuestion(q.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
