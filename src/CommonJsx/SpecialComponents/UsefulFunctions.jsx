import { supabase } from "../SupabaseClient.js";

export async function refreshOnlineStatus(id) {
  const date = new Date().toISOString();
  const { data, error } = await supabase
    .from("users")
    .update({ lastSeen: date })
    .eq("id", id);
}


