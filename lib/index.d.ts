import type { Context } from '@deepseek-ai/cordis';
export declare const name = "know-yourself-through-play";
export declare const inject: string[];
export interface Config {
    memoryFile?: string;
}
export declare function apply(ctx: Context, config?: Config): Promise<void>;
