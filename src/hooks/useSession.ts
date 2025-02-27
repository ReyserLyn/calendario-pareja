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
  const sessionId = (params?.sessionId as string) || "0d5tth946j9me9c";

  const [state, setState] = useState<SessionState>({
    sessionId: null,
    sessionName: null,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getSession(sessionId);

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
  }, [sessionId]);

  return state;
};
