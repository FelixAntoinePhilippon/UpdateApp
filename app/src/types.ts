export interface AppUpdate {
  name: string;
  id: string;
  version: string;
  available: string;
  source: string;
}

export interface SelfUpdateInfo {
  current: string;
  latest: string;
  available: boolean;
  url: string;
  notes: string;
  pub_date: string;
  error: string;
}

export type AppStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; apps: AppUpdate[] }
  | { kind: "updating"; logs: string[] }
  | { kind: "error"; message: string };

export interface ProgressEvent {
  message: string;
  timestamp: number;
}
