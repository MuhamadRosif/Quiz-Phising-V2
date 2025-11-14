import { supabase } from "./supabaseClient";

export async function fetchQuestionsByRound(round) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("round", round)
    .order("id", { ascending: true });

  if (error) throw error;

  return data.map((q) => ({
    ...q,
    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
  }));
}

export async function addQuestion(q) {
  const { data, error } = await supabase.from("questions").insert({
    round: q.round,
    text: q.text,
    options: q.options,
    answer: q.answer,
    points: q.points || 10,
  });

  if (error) throw error;
  return data;
}

export async function deleteQuestion(id) {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteAllQuestions() {
  const { error } = await supabase.from("questions").delete().gt("id", 0);
  if (error) throw error;
}
