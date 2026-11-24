import { JsonTasteStore } from './store.js';
import { type TasteMemory } from './model.js';
export interface HumanEvidence {
    quote: string;
    sessionId: string;
    messageId: string;
}
export type MemoryOperation = 'read' | 'fact' | 'propose' | 'revise' | 'confirm' | 'reject';
/** Facts are exact human quotations, never model paraphrases. Hypotheses always start tentative. */
export declare function updateMemory(store: JsonTasteStore, operation: MemoryOperation, payload: unknown, evidence?: HumanEvidence): Promise<TasteMemory>;
/** A bounded projection used by both entry points; inactive guesses remain only as counterexamples. */
export declare function recommendationContext(memory: TasteMemory): string;
