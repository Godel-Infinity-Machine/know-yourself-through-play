#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { JsonTasteStore, memoryPath } from './store.js'
import { fetchSteamLibrary } from './steam.js'
import { DISCLAIMER } from './policy.js'
import { validateMemory } from './model.js'

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const { values, positionals } = parseArgs({ args: argv, allowPositionals: true, strict: true, options: {
    file: { type: 'string' }, 'steam-id': { type: 'string' }, country: { type: 'string' }, output: { type: 'string' }, input: { type: 'string' }, id: { type: 'string' },
    'consent-local-storage': { type: 'boolean' }, 'consent-model-context': { type: 'boolean' }, 'confirm-delete': { type: 'boolean' }, 'confirm-replace': { type: 'boolean' }, refresh: { type: 'boolean' },
  } })
  const command = positionals[0] ?? 'help'
  const store = new JsonTasteStore(memoryPath(values.file))
  if (command === 'help') {
    console.log(`${DISCLAIMER}\n\nkytp show | export --output FILE | forget --id ID --confirm-delete | clear --confirm-delete\nkytp replace --input FILE --confirm-replace   (edit an exported JSON copy first)\nkytp import-steam --steam-id STEAMID64 --country COUNTRY --consent-local-storage --consent-model-context [--refresh]\nOptional --file ABSOLUTE_PATH applies to every command.\nSteam key: local STEAM_API_KEY environment variable only. No telemetry.\nImported app names, IDs, ownership, minutes and last-played data are saved on THIS machine in the country you specify, and will enter DSH context, potentially reaching its remote model provider. SteamID/key are not saved.\nMemory is unencrypted. Exported files are private. Clear does not delete DSH chat logs/provider records. Steam data is provided as is, without warranty; this project is unaffiliated with Valve.`)
    return
  }
  if (command === 'show') { console.log(JSON.stringify(await store.load(), null, 2)); return }
  if (command === 'export') {
    if (!values.output) throw new Error('Provide --output FILE; existing files are never overwritten')
    await store.export(values.output); console.log('Memory exported locally; keep it private.'); return
  }
  if (command === 'clear') {
    if (!values['confirm-delete']) throw new Error('Provide --confirm-delete to erase Taste Memory (not DSH/provider logs)')
    await store.clear(); console.log('Taste Memory cleared. DSH logs/provider records are separate.'); return
  }
  if (command === 'forget') {
    if (!values['confirm-delete'] || !values.id) throw new Error('Provide --id ID and --confirm-delete')
    await store.change(memory => {
      const target = values.id!
      if (!memory.facts.some(f => f.id === target) && !memory.hypotheses.some(h => h.id === target) && !memory.observations.some(o => `steam:${o.appId}` === target)) throw new Error('Unknown memory ID')
      // Remove derived hypotheses too, avoiding dangling references or preserved copies of forgotten quotes.
      const removed = new Set([target])
      for (let changed = true; changed;) {
        changed = false
        for (const h of memory.hypotheses) if (!removed.has(h.id) && [...h.support, ...h.feedbackFactIds, ...(h.supersedes ? [h.supersedes] : [])].some(s => removed.has(s))) { removed.add(h.id); changed = true }
      }
      memory.facts = memory.facts.filter(f => !removed.has(f.id))
      memory.hypotheses = memory.hypotheses.filter(h => !removed.has(h.id))
      memory.observations = memory.observations.filter(o => !removed.has(`steam:${o.appId}`))
    })
    console.log('Entry and dependent hypotheses forgotten locally.'); return
  }
  if (command === 'replace') {
    if (!values.input || !values['confirm-replace']) throw new Error('Provide --input FILE and --confirm-replace')
    const replacement = validateMemory(JSON.parse(await readFile(values.input, 'utf8')))
    await store.change(memory => Object.assign(memory, replacement, { revision: memory.revision }))
    console.log('Memory replaced from your edited export.'); return
  }
  if (command === 'import-steam') {
    if (!values['consent-local-storage'] || !values['consent-model-context']) throw new Error('Read kytp help, then explicitly pass --consent-local-storage and --consent-model-context')
    const country = values.country ?? process.env.KYTP_STORAGE_COUNTRY
    if (!values['steam-id'] || !country) throw new Error('Provide --steam-id and --country (the country where THIS machine stores the data)')
    const existing = await store.load()
    const accountHash = createHash('sha256').update(values['steam-id']).digest('hex')
    if (!values.refresh && existing.importState?.accountHash === accountHash && existing.importState.country === country && Date.now() - Date.parse(existing.importState.importedAt) < 15 * 60 * 1000) { console.log('Using library imported less than 15 minutes ago. Use --refresh for an explicit refetch.'); return }
    const result = await fetchSteamLibrary({ steamId: values['steam-id'], country, allowLocalStorage: true, allowModelContext: true }, { apiKey: process.env.STEAM_API_KEY ?? '' })
    await store.change(memory => {
      memory.observations = result.observations
      memory.importState = { importedAt: result.fetchedAt, country, accountHash }
      // Imports may remove evidence for old hypotheses: preserve them as a condition with no unsupported reference.
      const valid = new Set([...memory.facts.map(f => f.id), ...memory.observations.map(o => `steam:${o.appId}`)])
      memory.hypotheses = memory.hypotheses.filter(h => [...h.support, ...h.feedbackFactIds].some(s => valid.has(s))).map(h => ({ ...h, support: [...new Set([...h.support, ...h.feedbackFactIds].filter(s => valid.has(s)))] }))
    })
    console.log(`Imported ${result.observations.length} owned-game observations locally. Ownership/playtime are not liking. Start or continue DSH to explore tentative motives.`); return
  }
  throw new Error('Unknown command; run kytp help')
}

if (import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1] ?? '').href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : 'Operation failed'); process.exitCode = 1 })
}
