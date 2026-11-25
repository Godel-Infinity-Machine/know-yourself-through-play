/** DSH supplies React through its shared browser module table; no bundled React copy. */
interface ReactRuntime {
    createElement(type: string | ((props: any) => any), props: any, ...children: any[]): any;
    useEffect(effect: () => (() => void), dependencies: readonly unknown[]): void;
    useMemo<T>(factory: () => T, dependencies: readonly unknown[]): T;
    useSyncExternalStore(subscribe: (listener: () => void) => () => void, snapshot: () => ViewState): ViewState;
}
interface Mode {
    web: boolean;
    recent: boolean;
}
interface ViewState extends Mode {
    ready: boolean;
    pending: boolean;
    error: string;
}
interface RemoteResult {
    ok: boolean;
    value?: Mode;
    error?: {
        message: string;
    };
}
interface ResearchRemote {
    read(sessionId: string): Promise<RemoteResult>;
    change(sessionId: string, control: 'web' | 'recent', selected: boolean): Promise<RemoteResult>;
}
/** One controller per mounted Session, always displaying Host-acknowledged state. */
export declare class ResearchView {
    private readonly remote;
    private readonly sessionId;
    private state;
    private readonly listeners;
    private generation;
    constructor(remote: ResearchRemote, sessionId: string);
    snapshot: () => ViewState;
    subscribe: (listener: () => void) => (() => void);
    private publish;
    refresh(): Promise<void>;
    toggle(control: 'web' | 'recent'): Promise<void>;
}
export declare function createResearchClient(React: ReactRuntime, contribution: unknown): {
    inject: string[];
    apply(ctx: any): Promise<void>;
};
export {};
