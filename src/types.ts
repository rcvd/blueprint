/** Minimal type for the Roam extension API settings subset we use. */
export interface ExtensionAPI {
  settings: {
    get: (key: string) => string | null;
    set: (key: string, value: string) => void;
  };
}