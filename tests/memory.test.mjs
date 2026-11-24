import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { JsonTasteStore } from '../lib/store.js'
import { updateMemory, recommendationContext } from '../lib/memory.js'
import { temporary, evidence, hypothesis } from './helpers.mjs'

test('facts remain exact quotations; unsupported guesses cannot become facts or confirmed hypotheses', async t => {
  const { store } = await temporary(t)
  await assert.rejects(updateMemory(store, 'fact', {}), /human message/)
  const memory = await updateMemory(store, 'fact', {}, evidence('I enjoy Outer Wilds and Factorio.'))
  const fact = memory.facts[0]
  await assert.rejects(updateMemory(store, 'propose', { hypothesis: hypothesis(['invented-evidence']) }), /Unresolved/)
  const next = await updateMemory(store, 'propose', { hypothesis: { ...hypothesis([fact.id]), confirmation: 'confirmed', probability: .99 } })
  assert.equal(next.hypotheses[0].confirmation, 'tentative')
  assert.equal(next.hypotheses[0].probability, undefined)
  await assert.rejects(updateMemory(store, 'confirm', { id: next.hypotheses[0].id }, evidence('It might be true')), /human command/)
})

test('natural feedback replaces only the affected hypothesis and changes next-session recommendation context', async t => {
  const { store } = await temporary(t)
  let memory = await updateMemory(store, 'fact', {}, evidence('I like Outer Wilds, Factorio and Return of the Obra Dinn.'))
  const fact = memory.facts[0]
  memory = await updateMemory(store, 'propose', { hypothesis: hypothesis([fact.id], { description: 'May enjoy building and managing complex systems', action: ['construction', 'management'] }) })
  const old = memory.hypotheses[0]
  await updateMemory(store, 'propose', { hypothesis: hypothesis([fact.id], { description: 'May enjoy reasoning from incomplete clues' }) })
  const feedback = evidence('我最喜欢的是自己发现规律的过程，而不是经营和建造。', 'human-2')
  memory = await updateMemory(store, 'revise', { id: old.id, hypothesis: hypothesis([fact.id]) }, feedback)
  assert.equal(memory.hypotheses.find(h => h.id === old.id).confirmation, 'revised')
  assert.equal(memory.hypotheses[1].confirmation, 'tentative')
  const fresh = new JsonTasteStore(store.path)
  const context = JSON.parse(recommendationContext(await fresh.load()))
  assert(!context.motivationHypotheses.some(h => h.id === old.id))
  assert(context.motivationHypotheses.some(h => h.action.includes('infer rules')))
  assert(context.explicitFacts.some(f => f.quote === feedback.quote))
  assert(context.inactiveHypotheses[0].counterEvidence.some(c => c.includes(feedback.quote)))
  // A completely separate Node process sees the same corrected state.
  const child = spawnSync(process.execPath, ['lib/cli.js', 'show', '--file', store.path], { encoding: 'utf8' })
  assert.equal(child.status, 0, child.stderr)
  assert.equal(JSON.parse(child.stdout).hypotheses.at(-1).supersedes, old.id)
})

test('explicit rejection is never silently revived; precise confirmation needs a user command', async t => {
  const { store } = await temporary(t)
  let m = await updateMemory(store, 'fact', {}, evidence('I prefer discovery.'))
  m = await updateMemory(store, 'propose', { hypothesis: hypothesis([m.facts[0].id]) })
  const h = m.hypotheses[0]
  m = await updateMemory(store, 'confirm', { id: h.id }, evidence(`/taste confirm ${h.id}`, 'm2'))
  assert.equal(m.hypotheses[0].confirmation, 'confirmed')
  m = await updateMemory(store, 'reject', { id: h.id }, evidence(`/taste reject ${h.id} This misses my experience.`, 'm3'))
  assert.equal(m.hypotheses[0].confirmation, 'rejected')
  await assert.rejects(updateMemory(store, 'confirm', { id: h.id }, evidence(`/taste confirm ${h.id}`, 'm4')), /reviving/)
  assert.equal(JSON.parse(recommendationContext(m)).motivationHypotheses.length, 0)
})

test('corruption and write contention fail closed without destroying the memory', async t => {
  const { store } = await temporary(t)
  await updateMemory(store, 'fact', {}, evidence('I dislike grinding.'))
  const original = await readFile(store.path, 'utf8')
  await writeFile(`${store.path}.lock`, 'test-lock')
  await assert.rejects(store.change(() => {}), /busy/)
  assert.equal(await readFile(store.path, 'utf8'), original)
  await writeFile(store.path, '{broken')
  await assert.rejects(store.load())
  assert.equal(await readFile(store.path, 'utf8'), '{broken')
})

test('export is local and refuses overwrite; forget cascades dependent guesses; clear erases all taste data', async t => {
  const { store, dir } = await temporary(t)
  let m = await updateMemory(store, 'fact', {}, evidence('I enjoy experimenting.'))
  m = await updateMemory(store, 'propose', { hypothesis: hypothesis([m.facts[0].id]) })
  const output = join(dir, 'private-export.json')
  await store.export(output)
  assert.equal(JSON.parse(await readFile(output, 'utf8')).facts.length, 1)
  await assert.rejects(store.export(output), /EEXIST/)
  const result = spawnSync(process.execPath, ['lib/cli.js', 'forget', '--file', store.path, '--id', m.facts[0].id, '--confirm-delete'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  m = await store.load()
  assert.equal(m.facts.length + m.hypotheses.length, 0)
  await store.clear()
  assert.equal((await store.load()).observations.length, 0)
})
