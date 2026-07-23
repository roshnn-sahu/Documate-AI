"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { icons } from "@/components/icons";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      // If email confirmation is enabled, there's no active session yet.
      if (!data.session) {
        toast.success("Check your email to confirm your account.");
        router.push("/login");
        return;
      }

      router.push("/chat/new");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign up");
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
        Create your free account
      </h1>

      {/* Google Sign Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <icons.google />
        Sign up with Google
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
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mb-3 h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm"
        />
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
          minLength={6}
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
          {loading ? "Creating account..." : "Continue"}
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

      {/* Login Link */}
      <p className="mt-8 text-sm text-gray-600">
        Already a user?{" "}
        <Link
          href="/login"
          className="font-medium text-black underline hover:text-gray-700"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
