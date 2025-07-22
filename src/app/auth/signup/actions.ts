"use server";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName, username },
    },
  });
  if (error) return { error: error.message, success: false };
  return { error: "", success: true };
} 