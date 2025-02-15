// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_POCKETBASE_URL: string;
    readonly PB_ADMIN_EMAIL: string;
    readonly PB_ADMIN_PASSWORD: string;
  }
}
