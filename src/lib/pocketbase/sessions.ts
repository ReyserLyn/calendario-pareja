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

      console.error("PocketBase error:", {
        status: error.status,
        message: error.message,
        response: error.response || "No response",
      });
      return null;
    }

    return null;
  }
}

//Valida si una sesión existe
export async function validateSession(sessionId: string): Promise<boolean> {
  try {
    await getSession(sessionId);
    return true;
  } catch (error) {
    console.error("Session validation failed:", error);
    return false;
  }
}

// Obtiene la sesión por defecto
export async function getDefaultSession(): Promise<SessionsResponse> {
  try {
    const defaultSessionId = "0d5tth946j9me9c";
    const session = await getSession(defaultSessionId);
    if (!session) {
      throw new Error("Default session not found");
    }
    return session;
  } catch (error) {
    console.error("Error fetching default session:", error);
    throw new Error("Failed to load default session");
  }
}

// Busca una sesión por su nombre
export async function getSessionByName(
  name: string
): Promise<SessionsResponse | null> {
  try {
    const result = await pocketbaseClient.pb
      .collection("sessions")
      .getFirstListItem<SessionsResponse>(`name="${name}"`, {
        requestKey: `session_name_${name}_${new Date().getTime()}`,
      });

    return result;
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Crea una nueva sesión
export async function createSession(name: string): Promise<SessionsResponse> {
  try {
    const newSession = await pocketbaseClient.pb
      .collection("sessions")
      .create<SessionsResponse>(
        { name },
        {
          requestKey: `create_session_${new Date().getTime()}`,
        }
      );

    return newSession;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
}

// Actualiza una sesión existente
export async function updateSession(
  sessionId: string,
  data: Partial<SessionsResponse>
): Promise<SessionsResponse> {
  try {
    return await pocketbaseClient.pb
      .collection("sessions")
      .update<SessionsResponse>(sessionId, data, {
        requestKey: `update_session_${sessionId}_${new Date().getTime()}`,
      });
  } catch (error) {
    console.error("Error updating session:", error);
    throw new Error("Failed to update session");
  }
}
