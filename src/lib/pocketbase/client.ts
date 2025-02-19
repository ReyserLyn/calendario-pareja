import type { TypedPocketBase } from "@/types/pocketbase-types";
import PocketBase from "pocketbase";

class PocketBaseClient {
  private static instance: PocketBaseClient;
  public pb: TypedPocketBase;

  private constructor() {
    const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

    if (!pocketbaseUrl) {
      throw new Error(
        "POCKETBASE_URL is not defined in environment variables."
      );
    }

    try {
      this.pb = new PocketBase(pocketbaseUrl) as TypedPocketBase;
    } catch (error) {
      console.error("Failed to initialize PocketBase client:", error);
      throw error;
    }
  }

  public static getInstance(): PocketBaseClient {
    if (!PocketBaseClient.instance) {
      PocketBaseClient.instance = new PocketBaseClient();
    }
    return PocketBaseClient.instance;
  }
}

export const pocketbaseClient = PocketBaseClient.getInstance();
