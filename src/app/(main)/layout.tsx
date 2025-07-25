import { Button } from "@/components/ui/button";
import { Heart, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ai Date Planner",
  description: "Plan your perfect date with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="md:max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                <b className="text-pink-800">ai</b>DatePlanner
              </h1>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/settings">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center"
                  size="icon"
                >
                  <User className="size-4 text-white" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
