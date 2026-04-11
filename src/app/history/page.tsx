"use client";

import AuthGate from "@/components/AuthGate";
import RandomPageApp from "@/components/RandomPageApp";

export default function HistoryPage() {
  return (
    <AuthGate>
      <RandomPageApp />
    </AuthGate>
  );
}
