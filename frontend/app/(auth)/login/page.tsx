"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { icons } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/chat/new");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <h1 className="mb-8 text-3xl font-semibold text-gray-900">
        Welcome back
      </h1>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <icons.google />
        Sign in with Google
      </button>

      {/* Divider */}
      <div className="mb-6 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-gray-200"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <Input
          type="email"
          placeholder="Enter Your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm"
        />
        <Input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm"
        />
        <Button
          variant="themeGradient"
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-lg bg-black text-white hover:bg-gray-800"
        >
          {loading ? "Signing in..." : "Continue"}
        </Button>
      </form>

      {/* Terms */}
      <p className="mt-6 text-center text-xs text-gray-500">
        By proceeding, you accept the{" "}
        <Link href="/terms" className="underline hover:text-gray-700">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </Link>
      </p>

      {/* Signup Link */}
      <p className="mt-8 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-black underline hover:text-gray-700"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
