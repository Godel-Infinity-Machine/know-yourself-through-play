import { Service, type Context } from '@deepseek-ai/cordis';
export interface ResearchMode {
    readonly web: boolean;
    readonly recent: boolean;
}
export type ResearchControl = 'web' | 'recent';
export declare const WEB_TOOLS: Set<string>;
export declare function toggleResearch(state: ResearchMode, control: ResearchControl, selected: boolean): ResearchMode;
/** Ephemeral identities, never serialized into either Taste Memory or session logs. */
export declare class SessionResearch {
    private readonly modes;
    get(session?: object): ResearchMode;
    delete(session: object): void;
    set(session: object, control: ResearchControl, selected: boolean): ResearchMode;
}
/** Native TypertSchema only requires parse(); no additional schema dependency. Self-contained for the browser build. */
export declare function createResearchRemote(): {
    package: string;
    descriptors: {
        id: string;
        service: string;
        namespace: string;
        method: "change" | "read";
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: "sessionId" | "control" | "selected";
            wire: "sessionId" | "control" | "selected";
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                create: () => {
                    parse: (value: unknown) => unknown;
                };
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            create: () => {
                parse: (value: unknown) => unknown;
            };
        };
    }[];
};
export declare const RESEARCH_REMOTE: {
    package: string;
    descriptors: {
        id: string;
        service: string;
        namespace: string;
        method: "change" | "read";
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: "sessionId" | "control" | "selected";
            wire: "sessionId" | "control" | "selected";
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                create: () => {
                    parse: (value: unknown) => unknown;
                };
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            create: () => {
                parse: (value: unknown) => unknown;
            };
        };
    }[];
};
/** Exposed only through the authenticated native Host Remote, never as an LLM tool. */
export declare class ResearchControls extends Service {
    readonly typertRemote: {
        readonly service: ResearchControls;
        readonly serviceKey: string;
        readonly namespace: string;
    };
    readonly read: (sessionId: unknown) => ResearchMode;
    readonly change: (sessionId: unknown, control: unknown, selected: unknown) => ResearchMode;
    constructor(ctx: Context, state: SessionResearch);
    private session;
}
export declare function researchContext(mode: ResearchMode): string;
