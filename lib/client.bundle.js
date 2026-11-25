// Built for DSH's native lazy-CJS browser module loader.
window.__ModuleLoader__.load({ id: "dsh-know-yourself-through-play", factory: (require) => {
const module = { exports: {} }; const exports = module.exports;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchView = void 0;
exports.createResearchClient = createResearchClient;
/** One controller per mounted Session, always displaying Host-acknowledged state. */
class ResearchView {
    remote;
    sessionId;
    state = { web: false, recent: false, ready: false, pending: false, error: '' };
    listeners = new Set();
    generation = 0;
    constructor(remote, sessionId) {
        this.remote = remote;
        this.sessionId = sessionId;
    }
    snapshot = () => this.state;
    subscribe = (listener) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
    publish(patch) {
        this.state = { ...this.state, ...patch };
        for (const listener of this.listeners)
            listener();
    }
    async refresh() {
        if (this.state.pending)
            return;
        const generation = ++this.generation;
        const result = await this.remote.read(this.sessionId);
        if (generation !== this.generation)
            return;
        if (result.ok && result.value)
            this.publish({ ...result.value, ready: true, error: '' });
        else
            this.publish({ ready: false, error: result.error?.message ?? 'Research controls unavailable' });
    }
    async toggle(control) {
        if (!this.state.ready || this.state.pending)
            return;
        ++this.generation;
        const selected = !this.state[control];
        this.publish({ pending: true, error: '' });
        const result = await this.remote.change(this.sessionId, control, selected);
        if (result.ok && result.value)
            this.publish({ ...result.value, pending: false, error: '' });
        else {
            this.publish({ pending: false, ready: false, error: result.error?.message ?? 'Research controls unavailable' });
            await this.refresh();
        }
    }
}
exports.ResearchView = ResearchView;
function createResearchClient(React, contribution) {
    const h = React.createElement;
    return {
        inject: ['slots', 'remote', 'sessions'],
        async apply(ctx) {
            const disposeRemote = await ctx.remote.$mount(contribution);
            ctx.effect(() => disposeRemote);
            ctx.inject(['remote.kytpResearch'], (scope) => {
                function Buttons({ sessionId }) {
                    const view = React.useMemo(() => new ResearchView(scope.remote.kytpResearch, sessionId), [sessionId]);
                    const state = React.useSyncExternalStore(view.subscribe, view.snapshot);
                    React.useEffect(() => {
                        const refresh = () => { void view.refresh(); };
                        refresh();
                        window.addEventListener('focus', refresh);
                        const reset = scope.on('connection/reset', refresh);
                        return () => { window.removeEventListener('focus', refresh); reset(); };
                    }, [view]);
                    const button = (control, label) => h('button', {
                        type: 'button', 'aria-pressed': state[control], disabled: !state.ready || state.pending,
                        title: state.error || label,
                        onClick: () => { void view.toggle(control); },
                        style: {
                            border: '1px solid currentColor', borderRadius: '6px', padding: '3px 7px', font: 'inherit', cursor: 'pointer',
                            background: state[control] ? 'var(--dsw-bg-hover, Highlight)' : 'transparent',
                            color: 'inherit', fontWeight: state[control] ? 700 : 400,
                        },
                    }, `${state[control] ? '✓ ' : ''}${label}`);
                    return h('span', { role: 'group', 'aria-label': 'Game research', style: { display: 'inline-flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' } }, button('web', 'Web Search'), button('recent', 'Recent New Games'), state.error ? h('span', { role: 'status' }, state.error) : null);
                }
                scope.slots.inject('conversation.input.left', () => scope.slots.register({
                    name: 'conversation.input.left', id: 'kytp-research', order: 50,
                }, Buttons));
            });
        },
    };
}

return module.exports.createResearchClient(require("react"), (function createResearchRemote() {
    const codec = (name, parse) => ({
        mode: 'strict', typeSymbol: `dsh-know-yourself-through-play#${name}`, create: () => ({ parse }),
    });
    const inputs = {
        sessionId: codec('SessionId', value => { if (typeof value !== 'string' || !value)
            throw new TypeError('Invalid Session ID'); return value; }),
        control: codec('ResearchControl', value => { if (value !== 'web' && value !== 'recent')
            throw new TypeError('Invalid research control'); return value; }),
        selected: codec('Selected', value => { if (typeof value !== 'boolean')
            throw new TypeError('Expected boolean'); return value; }),
    };
    const result = codec('ResearchMode', value => {
        if (!value || typeof value !== 'object' || !('web' in value) || !('recent' in value)
            || typeof value.web !== 'boolean' || typeof value.recent !== 'boolean' || (value.recent && !value.web))
            throw new TypeError('Invalid research state');
        return { web: value.web, recent: value.recent };
    });
    return {
        package: 'dsh-know-yourself-through-play',
        descriptors: ['read', 'change'].map(method => ({
            id: `dsh-know-yourself-through-play#kytpResearch/${method}`,
            service: 'kytpResearch', namespace: 'kytpResearch', method,
            invocation: { kind: 'direct' },
            parameters: (method === 'read' ? ['sessionId'] : ['sessionId', 'control', 'selected']).map(name => ({
                name, wire: name, source: 'json', codec: inputs[name],
            })),
            result,
        })),
    };
})());
} });
