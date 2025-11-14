// src/lib/api.js
import { supabase } from "./supabaseClient";

/* ================================
   FETCH QUESTIONS BY ROUND
================================ */
export async function fetchQuestionsByRound(round) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("round", round)
    .order("id", { ascending: true });

  if (error) {
    console.error("Fetch questions error:", error);
    return [];
  }

  return data.map(q => ({
    ...q,
    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options
  }));
}

/* ================================
   FETCH ALL QUESTIONS (ADMIN)
================================ */
export async function fetchAllQuestions() {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("round", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Fetch all questions:", error);
    return [];
  }

  return data.map(q => ({
    ...q,
    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options
  }));
}

/* ================================
   ADD QUESTION
================================ */
export async function addQuestion(question) {
  const payload = {
    ...question,
    options: JSON.stringify(question.options)
  };

  const { data, error } = await supabase
    .from("questions")
    .insert(payload)
    .select();

  if (error) {
    console.error("Add question error:", error);
    return null;
  }
  return data?.[0];
}

/* ================================
   DELETE QUESTION
================================ */
export async function deleteQuestion(id) {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete question error:", error);
    return false;
  }

  return true;
}

/* ================================
   FETCH SETTINGS
================================ */
export async function fetchSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (error) {
    console.error("Fetch settings error:", error);
    return null;
  }

  return data;
}
