import React, { useEffect, useState } from "react";
import {
  fetchQuestionsByRound,
  fetchSettings,
  savePlayerResult,
  fetchActivePlayers,
} from "../lib/api";

import QuestionCard from "./QuestionCard";
import { uid } from "../utils/helpers";

const NUM_ROUNDS = 3;
const QUESTIONS_PER_ROUND = 20;

export default function QuizRound() {
  const [playerName, setPlayerName] = useState("");
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scoreByRound, setScoreByRound] = useState({});
  const [timesByRound, setTimesByRound] = useState({});
  const [settings, setSettings] = useState({ eliminationPercent: [50, 50] });
  const [activePlayersCount, setActivePlayersCount] = useState(1);

  useEffect(() => {
    fetchSettings().then((s) => setSettings(s)).catch(() => {});
    fetchActivePlayers()
      .then((res) => setActivePlayersCount(res.length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadQuestions(round);
  }, [round]);

  async function loadQuestions(r) {
    try {
      const qs = await fetchQuestionsByRound(r);

      if (!qs || qs.length === 0) throw new Error("empty");

      setQuestions(qs.slice(0, QUESTIONS_PER_ROUND));
    } catch (e) {
      console.warn("Soal babak", r, "kosong, membuat dummy...");
      const gen = Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => ({
        id: `r${r}q${i + 1}`,
        round: r,
        text: `Soal Babak ${r} — No ${i + 1}`,
        options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        answer: 0,
        points: 10,
      }));
      setQuestions(gen);
    }
    setAnswers({});
  }

  function handleAnswer(qId, choice, timeTaken) {
    setAnswers((prev) => ({ ...prev, [qId]: { choice, timeTaken } }));
  }

  function calcRoundResult() {
    let score = 0;
    let totalTime = 0;

    for (const q of questions) {
      const a = answers[q.id];
      if (a) {
        totalTime += a.timeTaken || 0;
        if (a.choice === q.answer) score += q.points || 10;
      }
    }

    return { score, totalTime };
  }

  async function finishRound() {
    if (!playerName) {
      alert("Masukkan nama peserta!");
      return;
    }

    const sessionId = uid("sess");
    const { score, totalTime } = calcRoundResult();

    setScoreByRound((s) => ({ ...s, [round]: score }));
    setTimesByRound((t) => ({ ...t, [round]: totalTime }));

    await savePlayerResult({
      id: sessionId,
      name: playerName,
      round,
      score_by_round: { ...scoreByRound, [round]: score },
      time_by_round: { ...timesByRound, [round]: totalTime },
      total_score: Object.values({ ...scoreByRound, [round]: score }).reduce(
        (a, b) => a + b,
        0
      ),
      total_time: Object.values({ ...timesByRound, [round]: totalTime }).reduce(
        (a, b) => a + b,
        0
      ),
      is_active: true,
    });

    if (round >= NUM_ROUNDS) {
      alert("Terima kasih! Anda selesai.");

      await savePlayerResult({
        id: sessionId,
        name: playerName,
        is_active: false,
      });

      window.location.href = "/leaderboard";
      return;
    }

    setRound((r) => r + 1);
    setAnswers({});
  }

  return (
    <div className="card">
      <h3>Babak {round}</h3>

      <input
        className="input"
        placeholder="Nama peserta"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div className="small">Peserta aktif: {activePlayersCount}</div>

      <div style={{ marginTop: 14 }}>
        {questions.map((q) => (
          <QuestionCard key={q.id} q={q} onAnswer={handleAnswer} />
        ))}
      </div>

      <button className="btn" onClick={finishRound} style={{ marginTop: 20 }}>
        Selesai Babak
      </button>
    </div>
  );
}
