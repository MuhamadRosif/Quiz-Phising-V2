import React, { useEffect, useState } from "react";
import { fetchQuestionsByRound, fetchSettings, savePlayerResult, fetchActivePlayers } from "../lib/api";
import QuestionCard from "./QuestionCard";
import { uid } from "../utils/helpers";

const NUM_ROUNDS = 3;
const QUESTIONS_PER_ROUND = 20;

export default function QuizRound(){
  const [playerName, setPlayerName] = useState("");
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // qId => {choice, time}
  const [scoreByRound, setScoreByRound] = useState({});
  const [timesByRound, setTimesByRound] = useState({});
  const [settings, setSettings] = useState({ eliminationPercent: [50,50] });
  const [activePlayersCount, setActivePlayersCount] = useState(1);

  useEffect(()=>{
    fetchSettings().then(s => setSettings(s)).catch(()=>{});
    // try get active players count (optional)
    fetchActivePlayers().then(res=>setActivePlayersCount(res.length)).catch(()=>{});
  },[]);

  useEffect(()=> {
    loadQuestions(round);
  }, [round]);

  async function loadQuestions(r){
    try{
      const qs = await fetchQuestionsByRound(r);
      if(!qs || qs.length===0) throw new Error("empty");
      // ensure we only have QUESTIONS_PER_ROUND
      setQuestions(qs.slice(0, QUESTIONS_PER_ROUND));
    }catch(e){
      // fallback generate placeholders
      const gen = Array.from({length: QUESTIONS_PER_ROUND}).map((_,i)=>({
        id: `r${r}q${i+1}`,
        round: r,
        text: `Soal Babak ${r} — No ${i+1}`,
        options: ["Pilihan A","Pilihan B","Pilihan C","Pilihan D"],
        answer: 0,
        points: 10
      }));
      setQuestions(gen);
    }
    setAnswers({});
  }

  function handleAnswer(qId, choice, timeTaken){
    setAnswers(prev => ({...prev, [qId]: {choice, timeTaken}}));
  }

  function calcRoundResult(){
    let score = 0;
    let totalTime = 0;
    for(const q of questions){
      const a = answers[q.id];
      if(a){
        totalTime += a.timeTaken || 0;
        if(a.choice === q.answer) score += (q.points ?? 10);
      }
    }
    return {score, totalTime};
  }

  async function finishRound(){
    if(!playerName) {
      alert("Masukkan nama peserta sebelum selesai babak");
      return;
    }
    const {score, totalTime} = calcRoundResult();
    setScoreByRound(s => ({...s, [round]: score}));
    setTimesByRound(t => ({...t, [round]: totalTime}));

    // Save intermediate result to server so elimination can be computed centrally if needed
    const sessionId = uid("sess");
    await savePlayerResult({
      id: sessionId,
      name: playerName,
      round,
      score_by_round: {...scoreByRound, [round]: score},
      time_by_round: {...timesByRound, [round]: totalTime},
      total_score: Object.values({...scoreByRound, [round]: score}).reduce((a,b)=>a+b,0),
      total_time: Object.values({...timesByRound, [round]: totalTime}).reduce((a,b)=>a+b,0),
      is_active: true
    }).catch(()=>{});

    if(round >= NUM_ROUNDS){
      // finalize
      alert("Terima kasih! Babak selesai. Kamu akan dialokasikan ke leaderboard.");
      // mark as finished on server
      await savePlayerResult({
        name: playerName,
        id: sessionId,
        total_score: Object.values({...scoreByRound, [round]: score}).reduce((a,b)=>a+b,0),
        total_time: Object.values({...timesByRound, [round]: totalTime}).reduce((a,b)=>a+b,0),
        is_active: false
      }).catch(()=>{});
      // navigate to leaderboard
      window.location.href = "/leaderboard";
      return;
    }

    // Determine local elimination: if you want centralized elimination, run server-side logic
    // Here we apply a simple local rule: if player's score is below threshold (percentile) they get eliminated
    // But since single-player local instance cannot evaluate participants, we'll just advance.
    setRound(r => r + 1);
    setAnswers({});
    // loadQuestions handled by useEffect
  }

  return (
    <div className="card">
      <h3>Babak {round}</h3>
      <div className="row" style={{marginTop:10}}>
        <input className="input" placeholder="Nama peserta" value={playerName} onChange={e=>setPlayerName(e.target.value)} />
        <div className="small">Active players: {activePlayersCount}</div>
      </div>

      <div style={{marginTop:14}}>
        {questions.map(q => (
          <div key={q.id} style={{marginBottom:8}}>
            <QuestionCard q={q} onAnswer={handleAnswer} />
          </div>
        ))}
      </div>

      <div style={{marginTop:16, display:"flex", gap:12}}>
        <button className="btn" onClick={finishRound}>Selesai Babak</button>
        <div className="small">Soal per babak: {QUESTIONS_PER_ROUND}</div>
      </div>
    </div>
  );
}
