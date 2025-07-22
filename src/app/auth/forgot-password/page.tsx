"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forgotPassword } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-md focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700"
      aria-label="Send password reset link"
    >
      Send Reset Link
    </Button>
  );
}

type State = { error: string; success: boolean };
async function forgotPasswordReducer(_prevState: State, formData: FormData): Promise<State> {
  return await forgotPassword(formData);
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPasswordReducer, { error: "", success: false });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4">
      <Card className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl border-0 p-0 overflow-hidden" aria-label="Forgot password form container">
        <CardHeader className="flex flex-col items-center gap-2 pt-10 pb-4 bg-white/80">
          <CardTitle className="text-3xl font-extrabold text-pink-600">Forgot Password?</CardTitle>
          <div className="text-base text-gray-500 font-medium">We&apos;ll send you a link to reset your password</div>
        </CardHeader>
        <form action={formAction} aria-label="Forgot password form" autoComplete="on" className="w-full">
          <CardContent className="flex flex-col gap-6 px-10 py-8 bg-white/90">
            <label htmlFor="forgot-email" className="text-base font-medium text-gray-700">Email</label>
            <Input
              id="forgot-email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoFocus
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Email"
              autoComplete="email"
            />
            {state.error && (
              <div className="text-red-500 text-sm mt-2 text-center" role="alert" aria-live="assertive">
                {state.error}
              </div>
            )}
            {state.success && (
              <div className="text-green-600 text-sm mt-2 text-center" role="alert" aria-live="polite">
                Check your email for a password reset link.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-stretch px-10 pb-10 bg-white/90">
            <SubmitButton />
            <nav className="flex flex-col gap-2 text-center mt-2" aria-label="Forgot password navigation">
              <Link href="/auth/signin" className="text-pink-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700" tabIndex={0} aria-label="Back to sign in">
                Back to sign in
              </Link>
            </nav>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 