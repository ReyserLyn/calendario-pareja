import type { SessionsResponse } from "@/types/pocketbase-types";
import { ClientResponseError } from "pocketbase";
import { pocketbaseClient } from "./client";

// Obtiene una sesión por su ID
export async function getSession(
  sessionId: string
): Promise<SessionsResponse | null> {
  try {
    const session = await pocketbaseClient.pb
      .collection("sessions")
      .getOne<SessionsResponse>(sessionId, {
        requestKey: `session_${sessionId}_${new Date().getTime()}`,
      });

    return session;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      // Maneja el caso de sesión no encontrada (404)
      if (error.status === 404) {
        console.warn(`Sesión con ID "${sessionId}" no encontrada.`);
        return null;
      }

      console.error(
        "PocketBase error:",
        {
          status: error.status,
          message: error.message,
          response: error.response || "No response",
        },
        process.env.NEXT_PUBLIC_POCKETBASE_URL,
        process.env.NEXT_PUBLIC_DEFAULT_SESSION_ID
      );
      return null;
    }

    return null;
  }
}

// Obtiene la sesión por defecto sin lanzar error en caso de fallo
export async function getDefaultSession(): Promise<SessionsResponse | null> {
  try {
    const defaultSessionId = process.env.NEXT_PUBLIC_DEFAULT_SESSION_ID;
    if (!defaultSessionId) throw new Error("Missing default session ID");

    const session = await getSession(defaultSessionId);
    if (!session) {
      console.warn(
        "Default session not found",
        defaultSessionId,
        process.env.NEXT_PUBLIC_POCKETBASE_URL
      );
      return null;
    }
    return session;
  } catch (error) {
    console.error("Error fetching default session:", error);
    return null;
  }
}
