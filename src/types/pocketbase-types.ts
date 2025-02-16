/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
  Photos = "photos",
  Sessions = "sessions",
  Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export enum PhotosMonthOptions {
  "Enero" = "Enero",
  "Febrero" = "Febrero",
  "Marzo" = "Marzo",
  "Abril" = "Abril",
  "Mayo" = "Mayo",
  "Junio" = "Junio",
  "Julio" = "Julio",
  "Agosto" = "Agosto",
  "Setiembre" = "Setiembre",
  "Octubre" = "Octubre",
  "Noviembre" = "Noviembre",
  "Diciembre" = "Diciembre",
}
export type PhotosRecord = {
  created?: IsoDateString;
  id: string;
  month?: PhotosMonthOptions;
  photo?: string;
  session?: RecordIdString;
  updated?: IsoDateString;
};

export type SessionsRecord = {
  created?: IsoDateString;
  id: string;
  name?: string;
  updated?: IsoDateString;
  users?: RecordIdString[];
};

export type UsersRecord = {
  avatar?: string;
  created?: IsoDateString;
  email: string;
  emailVisibility?: boolean;
  id: string;
  name?: string;
  password: string;
  tokenKey: string;
  updated?: IsoDateString;
  username: string;
  verified?: boolean;
};

// Response types include system fields and match responses from the PocketBase API
export type PhotosResponse<Texpand = unknown> = Required<PhotosRecord> &
  BaseSystemFields<Texpand>;
export type SessionsResponse<Texpand = unknown> = Required<SessionsRecord> &
  BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  photos: PhotosRecord;
  sessions: SessionsRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  photos: PhotosResponse;
  sessions: SessionsResponse;
  users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: "photos"): RecordService<PhotosResponse>;
  collection(idOrName: "sessions"): RecordService<SessionsResponse>;
  collection(idOrName: "users"): RecordService<UsersResponse>;
};
