"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRef, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { signUp } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      // disabled={pending}
      className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-md focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700"
      aria-label="Sign up for an account"
    >
      Sign Up
    </Button>
  );
}

type State = { error: string; success: boolean };
async function signUpReducer(_prevState: State, formData: FormData): Promise<State> {
  return await signUp(formData);
}

export default function SignUpPage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(signUpReducer, { error: "", success: false });

  useEffect(() => {
    if (state.success) window.location.href = "/";
  }, [state.success]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4">
      <Card className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl border-0 p-0 overflow-hidden" aria-label="Sign up form container">
        <CardHeader className="flex flex-col items-center gap-2 pt-10 pb-4 bg-white/80">
          <CardTitle className="text-3xl font-extrabold text-purple-600">Create Your Account</CardTitle>
          <div className="text-base text-gray-500 font-medium">Sign up to unlock personalized date ideas</div>
        </CardHeader>
        <form action={formAction} aria-label="Sign up form" autoComplete="on" className="w-full">
          <CardContent className="flex flex-col gap-6 px-10 py-8 bg-white/90">
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="relative group">
                <label htmlFor="signup-avatar" className="sr-only">Profile photo</label>
                <Avatar className="size-20 border-4 border-pink-200 shadow-md">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="Avatar preview" /> : <AvatarFallback>?</AvatarFallback>}
                </Avatar>
                <input
                  ref={fileInputRef}
                  id="signup-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="avatar"
                  onChange={handleAvatarChange}
                  aria-label="Upload profile photo"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-1 text-xs rounded-full bg-white/90 border-pink-300 shadow group-hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700"
                  aria-label="Upload profile photo"
                >
                  Upload
                </Button>
              </div>
              <span className="text-xs text-gray-400">Optional: Add a profile photo</span>
            </div>
            <label htmlFor="signup-fullname" className="text-base font-medium text-gray-700">Full Name</label>
            <Input
              id="signup-fullname"
              name="fullName"
              type="text"
              placeholder="Full Name"
              required
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Full Name"
              autoComplete="name"
            />
            <label htmlFor="signup-email" className="text-base font-medium text-gray-700">Email</label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Email"
              autoComplete="email"
            />
            <label htmlFor="signup-username" className="text-base font-medium text-gray-700">Username</label>
            <Input
              id="signup-username"
              name="username"
              type="text"
              placeholder="Username"
              required
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Username"
              autoComplete="username"
            />
            <label htmlFor="signup-password" className="text-base font-medium text-gray-700">Password</label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="h-12 text-base rounded-lg"
              aria-required="true"
              aria-label="Password"
              autoComplete="new-password"
            />
            {state.error && (
              <div className="text-red-500 text-sm mt-2 text-center" role="alert" aria-live="assertive">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-stretch px-10 pb-10 bg-white/90">
            <SubmitButton />
            <nav className="flex flex-col gap-2 text-center mt-2" aria-label="Sign up navigation">
              <span className="text-gray-400" aria-hidden="true">or</span>
              <Link href="/auth/signin" className="text-pink-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-pink-700 focus-visible:ring-2 focus-visible:ring-pink-700" tabIndex={0} aria-label="Already have an account? Sign in">
                Already have an account? Sign in
              </Link>
            </nav>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 