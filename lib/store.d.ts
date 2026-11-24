import { type TasteMemory } from './model.js';
export declare function memoryPath(configured?: string): string;
/** One JSON file; an exclusive lock rejects overlapping writers rather than losing updates. */
export declare class JsonTasteStore {
    readonly path: string;
    private current;
    constructor(path: string);
    snapshot(): TasteMemory;
    load(): Promise<TasteMemory>;
    change(update: (memory: TasteMemory) => void): Promise<TasteMemory>;
    clear(): Promise<void>;
    export(destination: string): Promise<void>;
}
