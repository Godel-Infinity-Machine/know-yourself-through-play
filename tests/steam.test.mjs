import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchSteamLibrary } from '../lib/steam.js'

// Synthetic HTTP payloads only. No real person's library is committed.
const consent = { steamId: '76561198000000000', country: 'Test country', allowLocalStorage: true, allowModelContext: true }
const apiKey = '0'.repeat(32)
const response = body => new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
test('Steam requires consent before even making a request', async () => {
  let calls = 0
  await assert.rejects(fetchSteamLibrary({ ...consent, allowModelContext: false }, { apiKey, fetch: async () => { calls++; return response({}) } }), /consent/)
  await assert.rejects(fetchSteamLibrary(consent, { apiKey: '' }), /STEAM_API_KEY/)
  assert.equal(calls, 0)
})
test('Steam maps ownership/time/recency to observations only, not enjoyment', async () => {
  const result = await fetchSteamLibrary(consent, { apiKey, fetch: async url => {
    assert.equal(url.hostname, 'api.steampowered.com')
    assert.equal(url.searchParams.get('steamid'), consent.steamId)
    return response({ response: { game_count: 2, games: [
      { appid: 1, name: 'Synthetic owned unplayed', playtime_forever: 0 },
      { appid: 2, name: 'Synthetic long play', playtime_forever: 8000, playtime_2weeks: 120, rtime_last_played: 1000 },
    ] } })
  } })
  assert.equal(result.observations.length, 2)
  assert.equal(result.observations[0].playtimeMinutes, 0)
  assert.equal(result.observations[0].recentMinutes, null)
  assert.equal(result.observations[1].recentMinutes, 120)
  assert(!JSON.stringify(result).includes('liked'))
  assert(!JSON.stringify(result).includes(consent.steamId))
  assert(!JSON.stringify(result).includes(apiKey))
})
test('private/malformed Steam libraries are not silently treated as empty; a genuine empty library is accepted', async () => {
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, fetch: async () => response({ response: {} }) }), /private/)
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, fetch: async () => response({ response: { game_count: 5, games: [] } }) }), /private/)
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, fetch: async () => response({ response: { game_count: 1, games: [{ appid: 1, playtime_forever: -1 }] } }) }), /invalid/)
  assert.deepEqual((await fetchSteamLibrary(consent, { apiKey, fetch: async () => response({ response: { game_count: 0 } }) })).observations, [])
})
test('Steam uses finite retries, redacts failures, respects rate limit and cancellation', async () => {
  let calls = 0
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, fetch: async () => { calls++; return new Response('', { status: 503 }) } }), /503/)
  assert.equal(calls, 2)
  calls = 0
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, fetch: async () => { calls++; return new Response('', { status: 429 }) } }), /rate limited/)
  assert.equal(calls, 1)
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, fetch: async () => { throw new Error(`Network failed with secret ${apiKey}`) } }), error => !error.message.includes(apiKey))
  await assert.rejects(fetchSteamLibrary(consent, { apiKey, timeoutMs: 10, fetch: async (_url, options) => new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new Error('abort')), { once: true })) }), /timed out/)
})
