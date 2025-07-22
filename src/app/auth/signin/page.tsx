"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "./actions";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-md focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700"
      aria-label="Sign in to your account"
    >
      Sign In
    </Button>
  );
}

type State = { error: string; success: boolean };
async function signInReducer(_prevState: State, formData: FormData): Promise<State> {
  return await signIn(formData);
}

export default function SignInPage() {
  const [state, formAction] = useActionState(signInReducer, { error: "", success: false });

  useEffect(() => {
    if (state.success) window.location.href = "/";
  }, [state.success]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4">
      <Card className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl border-0 p-0 overflow-hidden" aria-label="Sign in form container">
        <CardHeader className="flex flex-col items-center gap-2 pt-10 pb-4 bg-white/80">
          <CardTitle className="text-3xl font-extrabold text-pink-600">Welcome Back</CardTitle>
          <div className="text-base text-gray-500 font-medium">Sign in to plan your next amazing date</div>
        </CardHeader>
        <form action={formAction} aria-label="Sign in form" autoComplete="on" className="w-full">
          <CardContent className="flex flex-col gap-6 px-10 py-8 bg-white/90">
            <label htmlFor="signin-email" className="text-base font-medium text-gray-700">Email or Username</label>
            <Input
              id="signin-email"
              name="email"
              type="text"
              placeholder="Email or Username"
              required
              autoFocus
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Email or Username"
              autoComplete="username"
            />
            <label htmlFor="signin-password" className="text-base font-medium text-gray-700">Password</label>
            <Input
              id="signin-password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Password"
              autoComplete="current-password"
            />
            {state.error && (
              <div className="text-red-500 text-sm mt-2 text-center" role="alert" aria-live="assertive">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-stretch px-10 pb-10 bg-white/90">
            <SubmitButton />
            <nav className="flex flex-col gap-2 text-center mt-2" aria-label="Sign in navigation">
              <Link href="/auth/forgot-password" className="text-pink-600 font-medium hover:underline focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700" tabIndex={0} aria-label="Forgot password?">
                Forgot password?
              </Link>
              <span className="text-gray-400" aria-hidden="true">or</span>
              <Link href="/auth/signup" className="text-purple-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-purple-700 focus-visible:ring-2 focus-visible:ring-purple-700" tabIndex={0} aria-label="Create an account">
                Create an account
              </Link>
            </nav>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 