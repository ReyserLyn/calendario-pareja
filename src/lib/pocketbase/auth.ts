import type { UsersResponse } from "@/types/pocketbase-types";
import { pocketbaseClient } from "./client";

// Iniciar sesión con nombre de usuario y contraseña
export async function login(
  username: string,
  password: string
): Promise<UsersResponse> {
  try {
    const user = await pocketbaseClient.pb
      .collection("users")
      .authWithPassword<UsersResponse>(username, password);

    return user.record;
  } catch (error) {
    console.error("Error en login:", error);
    logout();
    throw new Error("Usuario o contraseña incorrectos: " + error);
  }
}

// Cerrar sesión
export function logout(): void {
  pocketbaseClient.pb.authStore.clear();
  if (typeof window !== "undefined") {
    localStorage.removeItem("pocketbase_auth");
  }
}

// Validar sesión
export async function validateAuth(): Promise<boolean> {
  if (!pocketbaseClient.pb.authStore.token) return false;
  if (pocketbaseClient.pb.authStore.isValid) return true;

  try {
    await pocketbaseClient.pb.collection("users").authRefresh();
    return true;
  } catch (error) {
    console.error("Error al refrescar la autenticación:", error);
    logout();
    return false;
  }
}

// Obtener usuario autenticado
export function getCurrentUser(): UsersResponse | null {
  return pocketbaseClient.pb.authStore.record as UsersResponse | null;
}
