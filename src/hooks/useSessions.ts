"use client";

import { getSessionIdFromPathname } from "@/lib/sessions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useSession(): string | null {
  const pathname = usePathname();
  const sessionIdFromUrl = getSessionIdFromPathname(pathname);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionIdFromUrl || "0d5tth946j9me9c";
    setSessionId(id);
  }, [sessionIdFromUrl]);

  return sessionId;
}
