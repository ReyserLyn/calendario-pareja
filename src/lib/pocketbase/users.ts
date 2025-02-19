import type { UsersRecord, UsersResponse } from "@/types/pocketbase-types";
import { pocketbaseClient } from "./client";

// Crear un nuevo usuario
export async function createUser(data: UsersRecord): Promise<UsersResponse> {
  try {
    return await pocketbaseClient.pb.collection("users").create<UsersResponse>({
      ...data,
      username: data.username?.toLowerCase(),
    });
  } catch (error) {
    throw new Error("Error al crear el usuario: " + error);
  }
}

// Actualizar usuario autenticado
export async function updateUser(
  data: Partial<UsersRecord>
): Promise<UsersResponse> {
  const user = pocketbaseClient.pb.authStore.record as UsersResponse | null;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    return await pocketbaseClient.pb
      .collection("users")
      .update<UsersResponse>(user.id, {
        ...data,
        username: data.username?.toLowerCase(),
      });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw new Error("Error al actualizar el usuario: " + error);
  }
}
