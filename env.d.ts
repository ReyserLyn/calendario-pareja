declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_POCKETBASE_URL: string;
    readonly NEXT_PUBLIC_DEFAULT_SESSION_ID: string;
  }
}
