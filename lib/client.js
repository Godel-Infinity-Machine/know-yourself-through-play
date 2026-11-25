/** One controller per mounted Session, always displaying Host-acknowledged state. */
export class ResearchView {
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
export function createResearchClient(React, contribution) {
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
