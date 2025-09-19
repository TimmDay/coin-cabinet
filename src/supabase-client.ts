import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

// TODO: do we need the casting below?
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL as string,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);
