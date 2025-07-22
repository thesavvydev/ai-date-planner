"use server";
import { createClient } from "@/lib/supabase/server";

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: error.message, success: false };
  return { error: "", success: true };
} 