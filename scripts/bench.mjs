import { performance } from 'node:perf_hooks'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Projection from '@deepseek-ai/dsh-session-projection'
import Tools from '@deepseek-ai/dsh-tools'
import * as Native from '@deepseek-ai/dsh-tool-executor-native'
import * as plugin from '../lib/index.js'
import { JsonTasteStore } from '../lib/store.js'
import { updateMemory } from '../lib/memory.js'

const dir = await mkdtemp(join(tmpdir(), 'kytp-bench-')), ctx = new Context()
const timings = async (n, action) => {
  const samples = []
  for (let i = 0; i < n; i++) { const start = performance.now(); await action(); samples.push(performance.now() - start) }
  samples.sort((a,b) => a-b)
  return { n, medianMs: +samples[Math.floor(n / 2)].toFixed(3), p95Ms: +samples[Math.min(n-1, Math.ceil(n*.95)-1)].toFixed(3) }
}
try {
  const path = join(dir, 'taste-memory.json'), store = new JsonTasteStore(path)
  const coldCli = await timings(10, () => { const r = spawnSync(process.execPath, ['lib/cli.js','show','--file',path]); if (r.status !== 0) throw new Error('CLI benchmark failed') })
  await ctx.plugin(Projection); await ctx.plugin(SystemPrompt); await ctx.plugin(Tools); await ctx.plugin(Native)
  const mount = await timings(20, async () => { const fiber = ctx.plugin(plugin, { memoryFile: path }); await fiber; await fiber.dispose() })
  await ctx.plugin(plugin, { memoryFile: path })
  const write = await timings(30, () => updateMemory(store, 'fact', {}, { quote: 'Synthetic benchmark preference', sessionId: 'bench', messageId: 'same' }))
  const assembly = await timings(100, () => ctx.systemPrompt.assemble())
  console.log(JSON.stringify({ measuredAt: new Date().toISOString(), platform: process.platform, arch: process.arch, node: process.version, coldCli, pluginMountAndUnload: mount, durableWrite: write, warmPromptAssembly: assembly, llmCalls: 0, webCalls: 0, liveSteamLatency: null, fullModelResponseLatency: null, scope: 'Local infrastructure only; OS caches may be warm. Cold CLI includes a new Node process; mount uses already imported modules. Not a full DSH launch or model/recommendation benchmark.' }, null, 2))
} finally { await ctx.fiber.dispose(); await rm(dir, { recursive: true, force: true }) }
