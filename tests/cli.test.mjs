import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { temporary } from './helpers.mjs'

test('CLI requires both consent flags, and cache is isolated by account and storage country', async t => {
  const { store } = await temporary(t)
  const steamId = ['7656119', '8000000000'].join('') // synthetic identifier
  const base = ['lib/cli.js', 'import-steam', '--file', store.path, '--steam-id', steamId, '--country', 'Test country']
  const invoke = args => spawnSync(process.execPath, args, { encoding: 'utf8', env: { ...process.env, STEAM_API_KEY: '' } })
  assert.match(invoke(base).stderr, /consent/)
  await store.change(m => { m.importState = { importedAt: new Date().toISOString(), country: 'Test country', accountHash: createHash('sha256').update(steamId).digest('hex') } })
  const args = [...base, '--consent-local-storage', '--consent-model-context']
  const cached = invoke(args)
  assert.equal(cached.status, 0, cached.stderr)
  assert.match(cached.stdout, /Using library/)
  const different = [...args]
  different[different.indexOf('--steam-id') + 1] = String(BigInt(steamId) + 1n)
  assert.match(invoke(different).stderr, /STEAM_API_KEY/)
  assert.match(invoke([...args, '--refresh']).stderr, /STEAM_API_KEY/)
})
