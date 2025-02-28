import type { UsersRecord, UsersResponse } from "@/types/pocketbase-types";
import { ClientResponseError } from "pocketbase";
import { pocketbaseClient } from "./client";

export async function createUser(data: UsersRecord): Promise<UsersResponse> {
  try {
    return await pocketbaseClient.pb.collection("users").create<UsersResponse>({
      ...data,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      passwordConfirm: data.password,
      emailVisibility: true,
    });
  } catch (error) {
    let errorMessage = "Error al crear el usuario";

    if (error instanceof ClientResponseError) {
      const fieldErrors = error.data.data;

      if (fieldErrors?.username?.code === "validation_not_unique") {
        errorMessage = "El nombre de usuario ya está registrado";
      }

      if (fieldErrors?.email?.code === "validation_not_unique") {
        errorMessage = "El correo electrónico ya está en uso";
      }
    }

    throw new Error(errorMessage);
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
        username: data.username,
      });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw new Error("Error al actualizar el usuario: " + error);
  }
}
