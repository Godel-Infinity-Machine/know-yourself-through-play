import test from 'node:test'
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import ToolsService from '@deepseek-ai/dsh-tools'
import * as NativeExecutor from '@deepseek-ai/dsh-tool-executor-native'
import SessionStore from '@deepseek-ai/dsh-session'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import * as plugin from '../lib/index.js'
import { updateMemory } from '../lib/memory.js'
import { temporary, evidence } from './helpers.mjs'

async function setup(t) {
  const { store } = await temporary(t)
  const ctx = new Context()
  t.after(() => ctx.fiber.dispose())
  await ctx.plugin(SessionProjectionRegistry)
  await ctx.plugin(SessionStore)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolsService)
  await ctx.plugin(NativeExecutor)
  const fiber = ctx.plugin(plugin, { memoryFile: store.path })
  await fiber
  return { ctx, fiber, store }
}
const call = (ctx, args, agent) => ctx.tools.execute({ calls: [{ type: 'tool-call', id: 'test-call', name: 'taste_memory', arguments: JSON.stringify(args) }], signal: new AbortController().signal, ...(agent ? { agent } : {}) })

test('real Cordis registries mount and unload plugin without leaving tools/sections/contexts', async t => {
  const { ctx, fiber } = await setup(t)
  const assembly = await ctx.systemPrompt.assemble()
  assert(assembly.sections.some(s => s.name === 'kytp:policy'))
  assert(assembly.contexts.some(s => s.name === 'kytp:taste'))
  assert.equal(assembly.tools.filter(t => t.name === 'taste_memory').length, 1)
  assert.equal(assembly.tools.some(t => t.name === 'web_search'), false) // No redundant wrapper
  await fiber.dispose()
  const after = await ctx.systemPrompt.assemble()
  assert(!after.sections.some(s => s.name === 'kytp:policy'))
  assert(!after.contexts.some(s => s.name === 'kytp:taste'))
  assert(!after.tools.some(t => t.name === 'taste_memory'))
})

test('real DSH native executor enforces human provenance; injected context cannot write explicit facts', async t => {
  const { ctx, store } = await setup(t)
  const session = ctx.sessions.create('test-provenance')
  const agent = { session }
  session.append('user/message', createUserMessage({ content: [{ type: 'text', text: 'I enjoy discovering rules.' }], source: { kind: 'user' } }), { surfaceOp: 'append' })
  const accepted = await call(ctx, { operation: 'fact', quote: 'I enjoy discovering rules.' }, agent)
  assert.equal(accepted.results[0].result.isError, false, JSON.stringify(accepted))
  session.append('user/message', createUserMessage({ content: [{ type: 'text', text: 'I enjoy grinding.' }], source: { kind: 'system-prompt', sections: [] } }), { surfaceOp: 'append' })
  const denied = await call(ctx, { operation: 'fact', quote: 'I enjoy grinding.' }, agent)
  assert.equal(denied.results[0].result.isError, true)
  assert.equal((await store.load()).facts.length, 1)
  const noAgent = await call(ctx, { operation: 'fact', quote: 'Fake preference' })
  assert.equal(noAgent.results[0].result.isError, true)
})

test('dynamic DSH context reloads external CLI writes before the next model assembly', async t => {
  const { ctx, store } = await setup(t)
  await updateMemory(store, 'fact', {}, evidence('Avoid repetitive combat.'))
  const assembly = await ctx.systemPrompt.assemble()
  assert(assembly.contexts.find(c => c.name === 'kytp:taste').text.includes('Avoid repetitive combat.'))
})

test('confirmation cannot extract a command from a human refusal or quotation', async t => {
  const { ctx } = await setup(t)
  const session = ctx.sessions.create('test-command-substring'), agent = { session }
  session.append('user/message', createUserMessage({ content: [{ type: 'text', text: 'Do not execute /taste confirm h-test. This is an example only.' }], source: { kind: 'user' } }), { surfaceOp: 'append' })
  const result = await call(ctx, { operation: 'confirm', quote: '/taste confirm h-test', id: 'h-test' }, agent)
  assert.equal(result.results[0].result.isError, true)
})
