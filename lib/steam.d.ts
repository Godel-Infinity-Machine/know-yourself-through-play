import { type Observation } from './model.js';
export interface SteamConsent {
    steamId: string;
    country: string;
    allowLocalStorage: true;
    allowModelContext: true;
}
export interface SteamImport {
    observations: Observation[];
    fetchedAt: string;
    country: string;
}
export declare function validateConsent(value: SteamConsent): void;
/** Fetch only the single end user-requested library. Never request passwords/cookies. */
export declare function fetchSteamLibrary(consent: SteamConsent, options: {
    apiKey: string;
    signal?: AbortSignal;
    fetch?: typeof fetch;
    timeoutMs?: number;
}): Promise<SteamImport>;
