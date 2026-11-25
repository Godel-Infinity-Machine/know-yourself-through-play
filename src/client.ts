/** DSH supplies React through its shared browser module table; no bundled React copy. */
interface ReactRuntime {
  createElement(type: string | ((props: any) => any), props: any, ...children: any[]): any
  useEffect(effect: () => (() => void), dependencies: readonly unknown[]): void
  useMemo<T>(factory: () => T, dependencies: readonly unknown[]): T
  useSyncExternalStore(subscribe: (listener: () => void) => () => void, snapshot: () => ViewState): ViewState
}
interface Mode { web: boolean; recent: boolean }
interface ViewState extends Mode { ready: boolean; pending: boolean; error: string }
interface RemoteResult { ok: boolean; value?: Mode; error?: { message: string } }
interface ResearchRemote {
  read(sessionId: string): Promise<RemoteResult>
  change(sessionId: string, control: 'web' | 'recent', selected: boolean): Promise<RemoteResult>
}

/** One controller per mounted Session, always displaying Host-acknowledged state. */
export class ResearchView {
  private state: ViewState = { web: false, recent: false, ready: false, pending: false, error: '' }
  private readonly listeners = new Set<() => void>()
  private generation = 0
  constructor(private readonly remote: ResearchRemote, private readonly sessionId: string) {}
  snapshot = (): ViewState => this.state
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private publish(patch: Partial<ViewState>): void {
    this.state = { ...this.state, ...patch }
    for (const listener of this.listeners) listener()
  }
  async refresh(): Promise<void> {
    if (this.state.pending) return
    const generation = ++this.generation
    const result = await this.remote.read(this.sessionId)
    if (generation !== this.generation) return
    if (result.ok && result.value) this.publish({ ...result.value, ready: true, error: '' })
    else this.publish({ ready: false, error: result.error?.message ?? 'Research controls unavailable' })
  }
  async toggle(control: 'web' | 'recent'): Promise<void> {
    if (!this.state.ready || this.state.pending) return
    ++this.generation
    const selected = !this.state[control]
    this.publish({ pending: true, error: '' })
    const result = await this.remote.change(this.sessionId, control, selected)
    if (result.ok && result.value) this.publish({ ...result.value, pending: false, error: '' })
    else { this.publish({ pending: false, ready: false, error: result.error?.message ?? 'Research controls unavailable' }); await this.refresh() }
  }
}

export function createResearchClient(React: ReactRuntime, contribution: unknown) {
  const h = React.createElement
  return {
    inject: ['slots', 'remote', 'sessions'],
    async apply(ctx: any): Promise<void> {
      const disposeRemote = await ctx.remote.$mount(contribution)
      ctx.effect(() => disposeRemote)
      ctx.inject(['remote.kytpResearch'], (scope: any) => {
        function Buttons({ sessionId }: { sessionId: string }) {
          const view = React.useMemo(() => new ResearchView(scope.remote.kytpResearch, sessionId), [sessionId])
          const state = React.useSyncExternalStore(view.subscribe, view.snapshot)
          React.useEffect(() => {
            const refresh = () => { void view.refresh() }
            refresh()
            window.addEventListener('focus', refresh)
            const reset = scope.on('connection/reset', refresh)
            return () => { window.removeEventListener('focus', refresh); reset() }
          }, [view])
          const button = (control: 'web' | 'recent', label: string) => h('button', {
            type: 'button', 'aria-pressed': state[control], disabled: !state.ready || state.pending,
            title: state.error || label,
            onClick: () => { void view.toggle(control) },
            style: {
              border: '1px solid currentColor', borderRadius: '6px', padding: '3px 7px', font: 'inherit', cursor: 'pointer',
              background: state[control] ? 'var(--dsw-bg-hover, Highlight)' : 'transparent',
              color: 'inherit', fontWeight: state[control] ? 700 : 400,
            },
          }, `${state[control] ? '✓ ' : ''}${label}`)
          return h('span', { role: 'group', 'aria-label': 'Game research', style: { display: 'inline-flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' } },
            button('web', 'Web Search'), button('recent', 'Recent New Games'),
            state.error ? h('span', { role: 'status' }, state.error) : null)
        }
        scope.slots.inject('conversation.input.left', () => scope.slots.register({
          name: 'conversation.input.left', id: 'kytp-research', order: 50,
        }, Buttons))
      })
    },
  }
}
