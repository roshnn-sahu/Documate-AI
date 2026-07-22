import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/config";

const supabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);
const Header = async () => {
  let User = {
    name: "Guest",
    email: "",
    avatar: "",
  };

  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");
  }
  return (
    <>
      <nav className="fixed top-6 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
        <div className="glass-pane flex items-center justify-between rounded-xl border bg-white/50 px-6 py-3 shadow-lg backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-(image:--color-theme-gradient) text-white shadow-sm shadow-rose-200/50">
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="rounded-full p-1"
              />
            </div>
            <span className="hidden font-bold tracking-tight text-[#1e293b] md:flex lg:text-xl">
              Documate AI
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a
              className="text-on-surface hover:text-primary text-sm font-semibold transition-colors"
              href="#"
            >
              Product
            </a>
            <a
              className="text-on-surface hover:text-primary text-sm font-semibold transition-colors"
              href="#"
            >
              Integrations
            </a>
            <a
              className="text-on-surface hover:text-primary text-sm font-semibold transition-colors"
              href="#"
            >
              Security
            </a>
            <a
              className="text-on-surface hover:text-primary text-sm font-semibold transition-colors"
              href="#"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="themeOutline"
              size="sm"
              className="rounded-full px-5"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              variant="themeGradient"
              size="sm"
              className="rounded-full px-5 font-semibold"
            >
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
