import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fpsutemwskvxzaqoueul.supabase.co";
const supabaseKey = "sb_publishable_yM1uA4EolzGkT2t9z2rsbg__jFCrnIy";
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };
