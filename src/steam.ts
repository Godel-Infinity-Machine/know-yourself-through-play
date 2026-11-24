import { object, text, type Observation } from './model.js'

export interface SteamConsent { steamId: string; country: string; allowLocalStorage: true; allowModelContext: true }
export interface SteamImport { observations: Observation[]; fetchedAt: string; country: string }
export function validateConsent(value: SteamConsent): void {
  if (!/^7656119\d{10}$/.test(value.steamId)) throw new Error('A SteamID64 is required; vanity names are not accepted')
  text(value.country, 'storage country', 80)
  if (value.allowLocalStorage !== true || value.allowModelContext !== true) throw new Error('Explicit local-storage and remote-model-context consent required')
}

/** Fetch only the single end user-requested library. Never request passwords/cookies. */
export async function fetchSteamLibrary(consent: SteamConsent, options: { apiKey: string; signal?: AbortSignal; fetch?: typeof fetch; timeoutMs?: number } ): Promise<SteamImport> {
  validateConsent(consent)
  if (!/^[a-fA-F0-9]{32}$/.test(options.apiKey)) throw new Error('Set a valid STEAM_API_KEY in the local environment')
  const timeout = options.timeoutMs ?? 8000
  if (!Number.isInteger(timeout) || timeout < 1 || timeout > 30000) throw new Error('Invalid Steam timeout')
  const signal = options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeout)]) : AbortSignal.timeout(timeout)
  const url = new URL('https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/')
  url.search = new URLSearchParams({ key: options.apiKey, steamid: consent.steamId, include_appinfo: 'true', include_played_free_games: 'true', format: 'json' }).toString()
  let response: Response | undefined
  // At most two attempts; no retries for privacy/auth denial or 429 (respect rate limiting).
  for (let attempt = 0; attempt < 2; attempt++) {
    try { response = await (options.fetch ?? fetch)(url, { signal, redirect: 'error' }) }
    catch { if (signal.aborted) throw new Error('Steam request cancelled or timed out'); if (attempt === 1) throw new Error('Steam network request failed; manually enter your games instead'); continue }
    if (response.status === 429) throw new Error('Steam rate limited this request; wait before retrying')
    if (response.status < 500 || attempt === 1) break
    await response.body?.cancel()
  }
  if (!response?.ok) throw new Error(`Steam request failed (HTTP ${response?.status ?? 'unavailable'}); check the key and game-details visibility, or enter games manually`)
  const reader = response.body?.getReader()
  if (!reader) throw new Error('Empty Steam response')
  const chunks: Uint8Array[] = []
  let bytes = 0
  try {
    while (true) {
      const result = await reader.read()
      if (result.done) break
      bytes += result.value.byteLength
      if (bytes > 8_000_000) { await reader.cancel(); throw new Error('Steam response exceeds the import limit') }
      chunks.push(result.value)
    }
  } catch { throw new Error('Steam response could not be read within the size/time limit') }
  let body
  try { body = object(object(JSON.parse(Buffer.concat(chunks).toString('utf8'))).response) }
  catch { throw new Error('Steam returned malformed data; no changes saved') }
  if (!Array.isArray(body.games) || body.game_count !== body.games.length) {
    if (body.game_count === 0 && (body.games === undefined || Array.isArray(body.games) && body.games.length === 0)) return { observations: [], fetchedAt: new Date().toISOString(), country: consent.country }
    throw new Error('Steam library unavailable or game details are private; manually enter games instead')
  }
  if (body.games.length > 20000) throw new Error('Library exceeds the import limit')
  const fetchedAt = new Date().toISOString(), seen = new Set<number>()
  const observations = body.games.map(item => {
    const game = object(item)
    const nonnegative = (v: unknown): number => { if (!Number.isSafeInteger(v) || Number(v) < 0) throw new Error('Steam returned invalid playtime/ID data'); return v as number }
    const appId = nonnegative(game.appid)
    if (!appId || seen.has(appId)) throw new Error('Steam returned duplicate or invalid app IDs')
    seen.add(appId)
    return { appId, name: typeof game.name === 'string' ? text(game.name, 'game name', 300) : `Steam app ${appId}`, owned: true as const, playtimeMinutes: nonnegative(game.playtime_forever), recentMinutes: game.playtime_2weeks === undefined ? null : nonnegative(game.playtime_2weeks), lastPlayed: game.rtime_last_played === undefined ? null : nonnegative(game.rtime_last_played), source: 'steam-api' as const, observedAt: fetchedAt }
  })
  return { observations, fetchedAt, country: consent.country }
}
