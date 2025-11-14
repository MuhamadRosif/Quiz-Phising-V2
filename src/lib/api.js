import { supabase } from "./supabaseClient";

/**
 * questions table fields:
 * id, round, text, options (json), answer (int), points (int)
 */

export async function fetchQuestionsByRound(round){
  const { data, error } = await supabase.from("questions").select("*").eq("round", round).order("id", {ascending:true});
  if(error) throw error;
  // normalize options if stored as string
  return (data || []).map(d => ({...d, options: typeof d.options === "string" ? JSON.parse(d.options) : d.options}));
}

export async function fetchSettings(){
  const { data } = await supabase.from("settings").select("value").eq("key", "global");
  if(!data || data.length === 0) return { eliminationPercent: [50,50] };
  return data[0].value;
}

export async function saveSettings(key, value){
  const { data, error } = await supabase.from("settings").upsert({ key, value });
  if(error) throw error;
  return data;
}

export async function savePlayerResult(player){
  // player: { id?, name, total_score, total_time, round?, score_by_round?, time_by_round?, is_active? }
  const { data, error } = await supabase.from("players").upsert(player).select();
  if(error) throw error;
  return data;
}

export async function fetchLeaderboard(){
  const { data, error } = await supabase.from("players").select("*").order("total_score", {ascending:false}).order("total_time", {ascending:true});
  if(error) throw error;
  return data || [];
}

export async function fetchActivePlayers(){
  const { data, error } = await supabase.from("players").select("*").eq("is_active", true);
  if(error) return [];
  return data || [];
}
