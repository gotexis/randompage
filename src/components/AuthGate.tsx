"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl max-w-sm w-full">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl">📖 RandomPage</h2>
          <p className="text-sm opacity-60 mb-4">Sign in to continue</p>
          <a
            href="/api/logto/sign-in"
            className="btn btn-primary w-full"
          >
            <Globe size={16} />
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
