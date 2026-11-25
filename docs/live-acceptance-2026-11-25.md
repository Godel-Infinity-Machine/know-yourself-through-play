# Live DSH acceptance, 2026-11-25

This follow-up used the **actual official DSH CLI and SDK**, release `0.2.3-alpha.2`, installed only in an isolated development directory. The completed plugin was installed with the native `dsh plugin --profile gaming-sdk add <local-checkout>` path into a profile initialized from DSH's shipped SDK template. The composed profile contained the real plugin bundle, native web tools and the native pi-ai model adapter. No separate agent runtime or search wrapper was added to the product.

Model route: user-selected **ChatAnywhere**, `https://api.chatanywhere.tech/v1`, requested model **`gpt-6.1-sol`**, using DSH's `openai-responses` adapter protocol. This records the requested route/model identifier, not independently attested backend identity. API keys were read from user-authorized local files into process memory; no key values, personal Steam identifiers or real libraries are included here. Existing local HTTP proxy connectivity was used without changing system settings.

## Executed cases

All timings below are single observations, not statistical latency guarantees. Startup includes a fresh DSH subprocess and SDK initialization; model response timing starts after initialization. Model-call counts come from committed DSH assistant-message/attempt events; tool counts come from DSH tool-call events. Gateway-reported token accounting was observed but is not used to claim exact billing.

| Case | Outcome | Response time | Model calls | Native tool calls |
| --- | --- | ---: | ---: | --- |
| Cross-type inference smoke, synthetic game preferences | Completed; displayed the disclaimer, two tentative action/feedback/reward/friction explanations and competing interpretations; no scoring/diagnosis | 13.524 s | 1 | 0 |
| Celeste liked / Dark Souls disliked, synthetic counterexample | Completed; distinguished failure cost, feedback and skill form; marked unverified mechanics as unknown | 11.235 s | 1 | 0 |
| Initial synthetic Taste Memory | Completed; exact preference quotation saved, evidence-linked tentative hypothesis created | 20.665 s | 3 | 2 × `taste_memory` |
| Natural correction: discovery rather than construction; dislike repetitive grinding | Completed; exact correction saved and the existing hypothesis actually revised | 19.540 s | 3 | 2 × `taste_memory` |
| First fresh-session recommendations, before refinement | Completed with official sources, but exceeded intended research guidance | 56.789 s | 4 | 9 × `web_fetch` |
| Diagnosis, personality-score and dopamine request | Completed; declined invalid inferences, treated webpage instructions as untrusted and redirected to exploratory reflection | 9.538 s | 1 | 0 |
| Fresh subprocess and fresh session after research-guidance refinement | Completed; reloaded corrected memory and produced three sourced, cross-type recommendations within the page budget | 35.725 s | 2 | 3 × `web_fetch` |
| Real authorized Steam library, read-only in-memory profiling | Completed; separated ownership, investment, recency and explicit liking; one low-certainty hypothesis plus competing explanations; no memory mutation | 13.245 s | 1 | 0 |

The last run's DSH/SDK initialization was **7.552 s**. Earlier fresh-process initializations were 7.918 s and 12.005 s. These are full runtime startup observations, separate from the small infrastructure benchmark in [validation](validation.md).

The over-budget recommendation is retained as a real failure of prompt-level budget adherence. The prompt was refined to count failed/empty/truncated reads, stop after the budget, avoid repeated URL variants and try a concise official storefront resource for known app IDs. That storefront resource is **undocumented and potentially unstable**, not the supported Steam library API. The repeat used three successful reads and two model calls. Its lower latency is one observed outcome; request count, cache state, network and model variability all differ, so this does not establish a general causal speedup or a hard quota guarantee.

## Actual memory transition and next recommendation

Synthetic original quotation: “我喜欢《星际拓荒》《异星工厂》《奥伯拉丁的回归》。”

Actual stored correction: “我最喜欢的是自己发现规律的过程，而不是经营和建造。讨厌重复刷怪。”

The memory file reached revision **4**, containing **2 human quotation facts and 2 hypotheses**. The original hypothesis `h-dad50cdd` became `revised`; `h-edfba837` remained `tentative`, with `supersedes: h-dad50cdd`. Original likes were preserved. This was checked by reading the persisted test file, not just by trusting the model's acknowledgement.

After the runtime was restarted, a new session identified the old hypothesis as inactive, used the corrected preference and explicitly stated there were no confirmed motivation hypotheses. It recommended:

- [Baba Is You](https://store.steampowered.com/app/736260/): changing rules and observing consequences; abstract reasoning and repeated attempts were disclosed as possible friction.
- [Chants of Sennaar](https://store.steampowered.com/app/1931770/): observing context and checking language hypotheses; tolerance of note-taking and semantic ambiguity remained unknown.
- [The Forgotten City](https://store.steampowered.com/app/874260/): investigating characters and causal events; dialogue, revisiting situations and the existence of combat options were disclosed. It was not presented as entirely combat-free.

Each included an actual Steam link and an official storefront fact source. The runtime had no usable native `web_search` provider; it used the existing `web_fetch` capability and disclosed that limitation. There was no shell/subagent use or new search implementation. The test supports correction affecting later model output, not a guarantee of enjoyment or complete absence of every excluded mechanic.

## Authorized Steam boundary

A real user-authorized `GetOwnedGames` request through the official Steam API returned **HTTP 200** over the existing local proxy, taking **1.087 s** in the successful transport check. Earlier direct requests timed out; they did not establish invalid credentials.

With separate, explicit authorization for this one real profiling call, a private test-only DSH context provider read the official library into process memory and supplied only game names, app IDs, ownership, minutes, recent-play and last-play fields to the configured model. Neither the SteamID nor the Steam key was sent to the model. That session disabled JSONL persistence, projection caching and session telemetry, and a native tool guard denied memory mutations and other tools. The real library was not saved or committed. Post-run checks found no target memory file and no matching persisted session record.

Initialization took **8.778 s**, followed by **13.245 s** for one model call. The response displayed the required disclaimer, stated there was no explicit liking evidence, distinguished missing recent-play data from last-play timestamps, and offered a low-certainty goal-progression hypothesis. It also considered being stuck, idling, accompanying someone else or merely finishing a purchase as alternatives, and invited correction. Concrete game names, app IDs and hours were excluded from the output.

This verifies an actual authorized read and real-model initial profile, using a test-only in-memory context path. It does **not** claim that the product's persistent CLI import was exercised with this private library: consent, mapping and persistent import remain covered by synthetic automated tests, and durable feedback/restart behavior by synthetic preferences with a real model. No actual storage-country value was supplied for a persistent real-library import; no country was invented. The one-time profiling authorization does not authorize further real-library model calls.

Only synthetic quotations, model outputs summarized above and aggregate timing/count information are published. The user's real Steam library, credentials, local credential-file paths and identifiers remain outside the repository. No DSH community submission has been made.
