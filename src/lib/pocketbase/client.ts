import type { TypedPocketBase } from "@/types/pocketbase-types";
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
}

export const pocketbaseClient = PocketBaseClient.getInstance();
