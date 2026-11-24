import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { JsonTasteStore } from '../lib/store.js'

export async function temporary(t) {
  const dir = await mkdtemp(join(tmpdir(), 'kytp-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  return { dir, store: new JsonTasteStore(join(dir, 'taste-memory.json')) }
}
export const evidence = (quote, messageId = 'human-1') => ({ quote, messageId, sessionId: 'test-chat' })
export const hypothesis = (support, extra = {}) => ({
  description: 'May enjoy discovering rules through self-directed experiments',
  action: ['experiment', 'infer rules'], feedback: ['new understanding'], reward: ['curiosity', 'autonomy'],
  friction: ['mandatory repetition'], support, counterEvidence: ['Construction may be incidental'],
  conditions: ['When discoveries are not spoiled'], ...extra,
})
