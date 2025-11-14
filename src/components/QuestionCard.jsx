import React, { useEffect, useState } from "react";
import {
  fetchQuestionsByRound,
  fetchSettings,
  savePlayerResult,
  fetchActivePlayers,
} from "../lib/api"; // FIXED
import QuestionCard from "./QuestionCard";
import { uid } from "../utils/helpers";

const NUM_ROUNDS = 3;
const QUESTIONS_PER_ROUND = 20;

export default function QuizRound() {
  const [playerName, setPlayerName] = useState("");
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);

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
    setLoadingQ(true);

    try {
      const qs = await fetchQuestionsByRound(r);

      if (qs.length === 0) {
        alert(`Belum ada soal untuk Babak ${r}!`);
      }

      setQuestions(qs.slice(0, QUESTIONS_PER_ROUND));
    } catch (e) {
      console.error("Load questions error:", e);
      setQuestions([]);
    }

    setAnswers({});
    setLoadingQ(false);
  }

  function handleAnswer(qId, choice, timeTaken) {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { choice, timeTaken },
    }));
  }

  function calcRoundResult() {
    let score = 0;
    let totalTime = 0;

    for (const q of questions) {
      const a = answers[q.id];
      if (a) {
        totalTime += a.timeTaken || 0;
        if (a.choice === q.answer) score += q.points ?? 10;
      }
    }
    return { score, totalTime };
  }

  async function finishRound() {
    if (!playerName) {
      alert("Masukkan nama peserta dulu.");
      return;
    }

    const { score, totalTime } = calcRoundResult();
    const sessionId = uid("sess");

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
      alert("Semua babak selesai!");

      await savePlayerResult({
        id: sessionId,
        name: playerName,
        total_score: Object.values({ ...scoreByRound, [round]: score }).reduce(
          (a, b) => a + b,
          0
        ),
        total_time: Object.values({ ...timesByRound, [round]: totalTime }).reduce(
          (a, b) => a + b,
          0
        ),
        is_active: false,
      });

      window.location.href = "/leaderboard";
      return;
    }

    setRound((r) => r + 1);
  }

  return (
    <div className="card">
      <h3>Babak {round}</h3>

      <div className="row" style={{ marginTop: 10 }}>
        <input
          className="input"
          placeholder="Nama peserta"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <div className="small">Active players: {activePlayersCount}</div>
      </div>

      <div style={{ marginTop: 14 }}>
        {loadingQ && <div className="small">Memuat soal...</div>}

        {!loadingQ && questions.length === 0 && (
          <div className="small">Tidak ada soal untuk babak ini.</div>
        )}

        {!loadingQ &&
          questions.map((q) => (
            <div key={q.id} style={{ marginBottom: 8 }}>
              <QuestionCard q={q} onAnswer={handleAnswer} />
            </div>
          ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button className="btn" onClick={finishRound}>
          Selesai Babak
        </button>
      </div>
    </div>
  );
}
