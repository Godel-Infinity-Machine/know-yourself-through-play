export type Confirmation = 'tentative' | 'confirmed' | 'rejected' | 'revised';
export interface Fact {
    id: string;
    quote: string;
    source: {
        kind: 'user';
        sessionId: string;
        messageId: string;
    };
    createdAt: string;
}
export interface Observation {
    appId: number;
    name: string;
    owned: true;
    playtimeMinutes: number;
    recentMinutes: number | null;
    lastPlayed: number | null;
    source: 'steam-api';
    observedAt: string;
}
export interface Hypothesis {
    id: string;
    description: string;
    action: string[];
    feedback: string[];
    reward: string[];
    friction: string[];
    support: string[];
    counterEvidence: string[];
    conditions: string[];
    confirmation: Confirmation;
    feedbackFactIds: string[];
    supersedes: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface TasteMemory {
    version: 1;
    revision: number;
    facts: Fact[];
    observations: Observation[];
    hypotheses: Hypothesis[];
    importState: {
        importedAt: string;
        country: string;
        accountHash: string;
    } | null;
}
export declare const freshMemory: () => TasteMemory;
export declare const id: (prefix: string) => string;
export declare function object(value: unknown): Record<string, unknown>;
export declare function text(value: unknown, name: string, max?: number): string;
export declare function strings(value: unknown, name: string): string[];
export declare function validateMemory(value: unknown): TasteMemory;
export declare function parseHypothesis(value: unknown, memory: TasteMemory): Hypothesis;
