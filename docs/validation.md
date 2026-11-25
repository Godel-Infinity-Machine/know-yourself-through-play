# Executed validation and remaining gates

Run date: **2026-11-25, Asia/Shanghai**. Local environment: Windows x64, Node `v24.22.3`, pnpm `11.25.0`, TypeScript `5.9.3`, published DSH packages `0.2.3-alpha.2`, Cordis `4.2.0-alpha.1`.

**Follow-up:** actual official DSH CLI/SDK and user-selected ChatAnywhere `gpt-6.1-sol` runs have now been executed, including a separately authorized real-library profile. See [live acceptance, timings and observed limitations](live-acceptance-2026-11-25.md). The table summarizes the current evidence. A successful scenario is not exhaustive behavioral certification.

`tsc -p tsconfig.json` completed successfully. `node --test tests/*.test.mjs` completed with **14 passed, 0 failed, 0 skipped**, total reported duration **502.5666 ms**. This uses real published Cordis/DSH registry/executor packages; Steam HTTP responses and preference quotations in automated tests are synthetic fixtures. No live model responses were fabricated.

Covered behavior: consent before request; same-account/country cache isolation; Steam observation-only mapping; missing recency; private/malformed/empty library distinctions; finite retries, cancellation, HTTP 429 and redacted failures; exact human fact provenance; evidence references; tentative-only proposals; rejection and revision; separate-process persistence; local export/forget/clear; write locks and corrupt-file preservation; actual plugin mount/unload cleanup; native executor execution; injected-context forgery denial; command-substring denial; dynamic context reload after external writes.

`pnpm audit --json` against the npm advisory service reported **0 info, 0 low, 0 moderate, 0 high and 0 critical** known vulnerabilities for this installed dependency set. This is a point-in-time advisory check, not a security guarantee. Source credential/private-data pattern scanning also passed; only generated project code, public documentation and synthetic tests are included in publication.

GitHub Actions [run 45512306637](https://github.com/Godel-Infinity-Machine/know-yourself-through-play/actions/runs/45512306637) passed for implementation commit `cbe1dea47b43a6c5d7825202808c02adf147544b`. Package generation with `pnpm pack` and CLI help were also executed successfully. The package includes the worked example and third-party notices referenced by its README.

| Product acceptance item | Evidence and actual status |
| --- | --- |
| A. Real authorized Steam profile | **Real official API read and read-only model profile completed.** Ownership, minutes, missing recency and lack of explicit liking were distinguished. Real persistent CLI import was not exercised; its consent/transport/cache/storage tests use synthetic fixtures. No real library is committed. |
| B. Psychology-informed inference | Primary references checked; actual model proposed tentative cross-type action/feedback/reward explanations and alternatives. This does not validate individual psychological measurement or all future responses. |
| C. Celeste / Dark Souls counterexample | **Live scenario completed**: different failure costs, feedback and skill forms considered; uncertain mechanics marked unknown. |
| D. Cross-type recommendations | **Live scenarios completed** with actual Steam links and official fact reads. Initial run exceeded page guidance; revised prompt met it in one repeat. Native search-provider discovery was unavailable; web fetch was used. No built-in production catalogue. |
| E. Feedback updates memory | **Infrastructure and live-model scenario completed**: the natural correction was quoted, the affected hypothesis revised and unrelated history retained; actual JSON inspected. |
| F. Cross-session influence | **Persistence/context and real-model restart scenario completed**: a fresh DSH subprocess/session used the revised tentative hypothesis, kept the old hypothesis inactive and reflected the correction in recommendations. |
| G. Science / compliance | Citation identity/method/sample review, source checks and an actual diagnosis/personality/dopamine refusal scenario completed. No protected scale item sets/scores or private data shipped. This is not exhaustive adversarial testing or a guaranteed medical-content filter. |
| H. Performance | Local infrastructure timings below; real API, full DSH startup, model response and tool-call counts recorded in the live report. Single live observations are not latency guarantees. |

## Measured infrastructure performance

Executed `node scripts/bench.mjs` at `2026-11-24T23:36:42.835Z` (= 2026-11-25 07:36:42 Asia/Shanghai). OS caches may be warm; these figures are not service-level guarantees.

| Operation | Samples | Median | p95 |
| --- | ---: | ---: | ---: |
| Fresh Node CLI process + memory read | 10 | 91.571 ms | 102.912 ms |
| Plugin mount + unload, modules already imported | 20 | 1.055 ms | 2.137 ms |
| Durable atomic JSON change | 30 | 15.369 ms | 18.487 ms |
| Warm DSH prompt assembly + disk refresh | 100 | 0.421 ms | 0.665 ms |

This infrastructure benchmark used zero LLM calls and zero web calls. The separate live report records real Steam/model/recommendation timings rather than substituting fixture timing. Remote response speed/cost depends on the user's DSH model, tools and credentials. The plugin itself makes no duplicate model calls. The benchmark precedes the final cache-key fix; that fix does not change any operation measured in the table.

## Reproduce live acceptance when configured

1. Install this bundle into a dedicated local DSH gaming profile and verify its composed config. Confirm actual `web_search` and `web_fetch` availability; do not assume provider readiness.
2. In your local environment configure the Steam key, supplied SteamID64 and actual storage country. Run the explicitly consented import shown in the README. Keep the resulting file private.
3. In DSH ask for initial library motives; check that ownership, minutes, recency and explicit liking are clearly distinguished. Record timings and actual model/tool request counts locally.
4. Ask about Outer Wilds / Factorio / Obra Dinn and then Celeste liked / Dark Souls disliked. Review factual mechanics, competing explanations and research restraint.
5. Ask for approximately three cross-type recommendations with a hard exclusion such as mandatory repetitive combat; open sources, verify Steam IDs, check friction and unknowns.
6. Correct a hypothesis (“discovery, not construction”), inspect memory, restart DSH/new chat with the same memory path, and verify that recommendations change for the stated reason. Do not regard an acknowledgement alone as evidence.
7. Try injected web instructions and requests for diagnosis, personality scores and dopamine explanations; review actual refusals/redirection. Export, edit, forget and clear locally; inspect separate DSH/provider-retention settings.

Publish only a redacted aggregate report, not transcripts/libraries/credentials, unless the user explicitly authorizes those exact disclosures. Community submission remains **not performed**.
