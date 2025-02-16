import type {
  TypedPocketBase,
  UsersRecord,
  UsersResponse,
} from "@/types/pocketbase-types";
import { PhotosMonthOptions, PhotosResponse } from "@/types/pocketbase-types";
import PocketBase from "pocketbase";

class PocketBaseClient {
  private static instance: PocketBaseClient;
  public pb: TypedPocketBase;

  private constructor() {
    this.pb = new PocketBase(
      process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://localhost:8090"
    ) as TypedPocketBase;
  }

  public static getInstance(): PocketBaseClient {
    if (!PocketBaseClient.instance) {
      PocketBaseClient.instance = new PocketBaseClient();
    }
    return PocketBaseClient.instance;
  }

  /**
   * Iniciar sesión con nombre de usuario y contraseña
   */
  async login(username: string, password: string): Promise<UsersResponse> {
    try {
      const user = await this.pb
        .collection("users")
        .authWithPassword<UsersResponse>(username, password);

      return user.record;
    } catch (error) {
      console.error("Error en login:", error);
      this.logout();
      throw new Error("Usuario o contraseña incorrectos: " + error);
    }
  }

  /**
   * Cerrar sesión del usuario actual
   */
  logout(): void {
    this.pb.authStore.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem("pocketbase_auth");
    }
  }

  /**
   * Verificar autenticación y refrescar token si es necesario
   */
  async validateAuth(): Promise<boolean> {
    if (!this.pb.authStore.token) return false;
    if (this.pb.authStore.isValid) return true;

    try {
      await this.pb.collection("users").authRefresh();
      return true;
    } catch (error) {
      console.error("Error al refrescar la autenticación:", error);
      this.logout();
      return false;
    }
  }

  /**
   * Obtener usuario actual autenticado
   */
  getCurrentUser(): UsersResponse | null {
    return this.pb.authStore.record as UsersResponse | null;
  }

  /**
   * Crear nuevo usuario
   */
  async createUser(data: UsersRecord): Promise<UsersResponse> {
    try {
      return await this.pb.collection("users").create<UsersResponse>({
        ...data,
        // Asegurar que el username se guarde en minúsculas
        username: data.username?.toLowerCase(),
      });
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error);
    }
  }

  /**
   * Actualizar usuario actual
   */
  async updateUser(data: Partial<UsersRecord>): Promise<UsersResponse> {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Usuario no autenticado");

    try {
      return await this.pb.collection("users").update<UsersResponse>(user.id, {
        ...data,
        username: data.username?.toLowerCase(),
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new Error("Error al actualizar el usuario: " + error);
    }
  }

  /**
   * Obtener fotos de la sesión actual
   */
  async getPhotos(sessionId: string): Promise<PhotosResponse[]> {
    try {
      return await this.pb.collection("photos").getFullList<PhotosResponse>({
        filter: `session = "${sessionId}"`,
      });
    } catch (error) {
      console.error("Error al obtener fotos:", error);
      throw new Error("Error al obtener fotos: " + error);
    }
  }

  /**
   * Subir o actualizar foto de un mes
   */
  async uploadPhoto(
    sessionId: string,
    month: PhotosMonthOptions,
    image: File
  ): Promise<PhotosResponse> {
    try {
      // Verificar si ya existe una foto para este mes
      const existing = await this.pb
        .collection("photos")
        .getFirstListItem<PhotosResponse>(
          `month="${month}" && session="${sessionId}"`
        )
        .catch(() => null);

      const formData = new FormData();
      formData.append("month", month);
      formData.append("photo", image);
      formData.append("session", sessionId);

      if (existing) {
        // Actualizar registro existente
        return await this.pb
          .collection("photos")
          .update<PhotosResponse>(existing.id, formData);
      } else {
        // Crear nuevo registro
        return await this.pb
          .collection("photos")
          .create<PhotosResponse>(formData);
      }
    } catch (error) {
      console.error("Error al subir foto:", error);
      throw new Error("Error al subir foto: " + error);
    }
  }

  /**
   * Eliminar foto de un mes
   */
  async deletePhoto(
    sessionId: string,
    month: PhotosMonthOptions
  ): Promise<boolean> {
    try {
      const existing = await this.pb
        .collection("photos")
        .getFirstListItem<PhotosResponse>(
          `month="${month}" && session="${sessionId}"`
        );

      await this.pb.collection("photos").delete(existing.id);
      return true;
    } catch (error) {
      console.error("Error al eliminar foto:", error);
      return false;
    }
  }
}

export const pocketbaseClient = PocketBaseClient.getInstance();
