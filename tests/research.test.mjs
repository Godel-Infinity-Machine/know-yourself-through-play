import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import SessionStore from '@deepseek-ai/dsh-session'
import ToolsService, { defineTool } from '@deepseek-ai/dsh-tools'
import * as NativeExecutor from '@deepseek-ai/dsh-tool-executor-native'
import * as plugin from '../lib/index.js'
import { toggleResearch, SessionResearch } from '../lib/research.js'
import { ResearchView } from '../lib/client.js'
import { temporary } from './helpers.mjs'

const off = { web: false, recent: false }, web = { web: true, recent: false }, both = { web: true, recent: true }
test('every valid button state obeys all four switch operations', () => {
  for (const [state, expected] of [[off, [web, off, both, off]], [web, [web, off, both, web]], [both, [both, off, both, web]]]) {
    for (const [index, [control, selected]] of [['web', true], ['web', false], ['recent', true], ['recent', false]].entries()) {
      assert.deepEqual(toggleResearch(state, control, selected), expected[index])
    }
  }
})

async function setup(t) {
  const { store } = await temporary(t)
  const ctx = new Context(), contributions = []
  t.after(() => ctx.fiber.dispose())
  ctx.provide('typert', { register(value) { contributions.push(value); return () => { contributions.splice(contributions.indexOf(value), 1) } } })
  await ctx.plugin(SessionProjectionRegistry)
  await ctx.plugin(SessionStore)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolsService)
  await ctx.plugin(NativeExecutor)
  const fiber = ctx.plugin(plugin, { memoryFile: store.path })
  await fiber
  // Same receiving Context shape as the native authenticated Remote dispatcher.
  const owner = ctx.extend({ invocation: { request: { namespace: 'kytpResearch' }, peer: { principal: { kind: 'owner' } } } })
  const controls = owner.get('kytpResearch')
  assert(controls)
  return { ctx, owner, controls, fiber, store, contributions }
}

test('Host controls isolate Sessions, reject forged control values, and never write Taste Memory', async t => {
  const { ctx, controls, store, fiber, contributions } = await setup(t)
  const a = ctx.sessions.create('controls-a'), b = ctx.sessions.create('controls-b')
  assert.deepEqual(controls.read(a.id), off)
  assert.deepEqual(controls.change(a.id, 'recent', true), both)
  assert.deepEqual(controls.read(b.id), off)
  assert.deepEqual(controls.change(a.id, 'recent', false), web)
  assert.deepEqual(controls.change(a.id, 'web', false), off)
  assert.throws(() => controls.change(a.id, 'web', 'true'), /Invalid/)
  assert.throws(() => controls.change('missing-session', 'web', true), /active/)
  assert.throws(() => ctx.get('kytpResearch').change(a.id, 'web', true))
  const stranger = ctx.extend({ invocation: { peer: { principal: { kind: 'agent' } } } })
  assert.throws(() => stranger.get('kytpResearch').change(a.id, 'web', true), /owner/)
  assert.equal((await store.load()).revision, 0)
  const freshHost = new SessionResearch()
  assert.deepEqual(freshHost.get(a), off)
  assert.equal(contributions.length, 1)
  await fiber.dispose()
  assert.equal(contributions.length, 0)
  assert.equal(ctx.get('kytpResearch'), undefined)
})

test('native execution blocks both web tools by default, allows enabled Sessions, and denies missing identity', async t => {
  const { ctx, controls, fiber } = await setup(t)
  const a = ctx.sessions.create('guard-a'), b = ctx.sessions.create('guard-b')
  let requests = 0
  for (const name of ['web_search', 'web_fetch']) ctx.tools.register(defineTool({
    name, description: 'Synthetic web transport', parameters: {},
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute() { requests++; return 'Synthetic search reached the native tool body' },
  }))
  const call = (name, session) => ctx.tools.execute({ calls: [{ type: 'tool-call', id: `call-${requests}`, name, arguments: '{}' }],
    signal: new AbortController().signal, ...(session ? { agent: { session } } : {}) })
  for (const name of ['web_search', 'web_fetch']) assert.equal((await call(name, a)).results[0].result.isError, true)
  assert.equal(requests, 0)
  controls.change(a.id, 'web', true)
  for (const name of ['web_search', 'web_fetch']) assert.equal((await call(name, a)).results[0].result.isError, false)
  assert.equal(requests, 2)
  assert.equal((await call('web_search', b)).results[0].result.isError, true)
  assert.equal((await call('web_fetch')).results[0].result.isError, true)
  controls.change(a.id, 'recent', true)
  const recent = await ctx.systemPrompt.assemble({ session: a })
  assert.match(recent.contexts.find(c => c.name === 'kytp:research').text, /Early Access/)
  controls.change(a.id, 'recent', false)
  assert.match((await ctx.systemPrompt.assemble({ session: a })).contexts.find(c => c.name === 'kytp:research').text, /NO release-date restriction/)
  controls.change(a.id, 'web', false)
  assert.equal((await call('web_fetch', a)).results[0].result.isError, true)
  assert.match((await ctx.systemPrompt.assemble({ session: a })).contexts.find(c => c.name === 'kytp:research').text, /do NOT ask/i)
  assert.equal(requests, 2)
  await fiber.dispose()
  assert.equal((await call('web_fetch', a)).results[0].result.isError, false) // Guard unloads with the plugin.
})

test('client uses Host acknowledgements, prevents rapid stale writes, and reads each Session separately', async () => {
  const modes = new Map(), writes = []
  let settle
  const remote = {
    async read(id) { return { ok: true, value: modes.get(id) ?? off } },
    async change(id, control, selected) {
      writes.push([id, control, selected])
      await new Promise(resolve => { settle = resolve })
      const value = toggleResearch(modes.get(id) ?? off, control, selected)
      modes.set(id, value)
      return { ok: true, value }
    },
  }
  const a = new ResearchView(remote, 'a'), b = new ResearchView(remote, 'b')
  await Promise.all([a.refresh(), b.refresh()])
  const pending = a.toggle('recent')
  assert.equal(a.snapshot().recent, false) // No optimistic permission claim.
  assert.equal(a.snapshot().pending, true)
  await a.toggle('web')
  assert.equal(writes.length, 1)
  settle(); await pending
  assert.deepEqual([a.snapshot().web, a.snapshot().recent, b.snapshot().web], [true, true, false])
  modes.set('a', off); await a.refresh()
  assert.equal(a.snapshot().web, false)
})

test('native browser bundle registers two accessible input-bar buttons and cleans up on unload', async () => {
  const source = await readFile(new URL('../lib/client.bundle.js', import.meta.url), 'utf8')
  let artifact, entry, component, remoteMounted = false, selected = off
  const subscriptions = new Set(), cleanups = []
  const React = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    useMemo: factory => factory(),
    useSyncExternalStore: () => ({ ...selected, ready: true, pending: false, error: '' }),
    useEffect: () => {},
  }
  runInNewContext(source, { window: { __ModuleLoader__: { load(value) { artifact = value } } } })
  const browser = artifact.factory(name => { assert.equal(name, 'react'); return React })
  const ctx = {
    inject: (_dependencies, apply) => apply(ctx),
    remote: { async $mount() { remoteMounted = true; return () => { remoteMounted = false } } },
    effect: effect => { const cleanup = effect(); cleanups.push(cleanup); return cleanup },
    slots: {
      inject(name, install) { subscriptions.add(name); const cleanup = install(); cleanups.push(() => { cleanup(); subscriptions.delete(name) }) },
      register(options, view) { entry = options; component = view; return () => { entry = undefined } },
    },
  }
  await browser.apply(ctx)
  assert.equal(remoteMounted, true)
  assert.equal(entry.name, 'conversation.input.left')
  for (const mode of [off, web, both]) {
    selected = mode
    const rendered = component({ sessionId: 'a' })
    const [webButton, recentButton] = rendered.children
    assert.equal(webButton.type, 'button')
    assert.equal(webButton.props['aria-pressed'], mode.web)
    assert.equal(recentButton.props['aria-pressed'], mode.recent)
    assert.match(webButton.children[0], /Web Search/)
    assert.match(recentButton.children[0], /Recent New Games/)
    assert.equal(webButton.children[0].startsWith('✓ '), mode.web)
    assert.equal(typeof recentButton.props.onClick, 'function')
  }
  for (const cleanup of cleanups.reverse()) cleanup()
  assert.equal(remoteMounted, false)
  assert.equal(entry, undefined)
  assert.equal(subscriptions.size, 0)
})
