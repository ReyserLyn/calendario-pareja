"use client";

import { getSession } from "@/lib/pocketbase/sessions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SessionState {
  sessionId: string | null;
  sessionName: string | null;
  isLoading: boolean;
  isError: boolean;
}

export const useSession = (): SessionState => {
  const params = useParams();
  const sessionIdFromParams =
    (params?.sessionId as string) || process.env.NEXT_PUBLIC_DEFAULT_SESSION_ID;

  const [state, setState] = useState<SessionState>({
    sessionId: null,
    sessionName: null,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    // Si no hay sessionId en la URL, marcamos error
    if (!sessionIdFromParams) {
      setState({
        sessionId: null,
        sessionName: null,
        isLoading: false,
        isError: true,
      });
      return;
    }

    const loadSession = async () => {
      try {
        const session = await getSession(sessionIdFromParams);
        if (!session) {
          setState({
            sessionId: null,
            sessionName: null,
            isLoading: false,
            isError: true,
          });
          return;
        }
        setState({
          sessionId: session.id,
          sessionName: session.name,
          isLoading: false,
          isError: false,
        });
      } catch (error) {
        console.error("Error loading session:", error);
        setState({
          sessionId: null,
          sessionName: null,
          isLoading: false,
          isError: true,
        });
      }
    };

    loadSession();
  }, [sessionIdFromParams]);

  return state;
};
