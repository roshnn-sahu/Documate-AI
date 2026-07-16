import { ReactNode } from "react";

// Minimal layout for auth pages (login, signup).
// These pages must NOT inherit the (chat) sidebar layout.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {children}
    </div>
  );
}
