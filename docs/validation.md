# Executed validation and remaining gates

Run date: **2026-11-25, Asia/Shanghai**. Local environment: Windows x64, Node `v24.22.3`, pnpm `11.25.0`, TypeScript `5.9.3`, published DSH packages `0.2.3-alpha.2`, Cordis `4.2.0-alpha.1`.

`tsc -p tsconfig.json` completed successfully. `node --test tests/*.test.mjs` completed with **14 passed, 0 failed, 0 skipped**, total reported duration **502.5666 ms**. This uses real published Cordis/DSH registry/executor packages; Steam HTTP responses and preference quotations in automated tests are synthetic fixtures. No live model responses were fabricated.

Covered behavior: consent before request; same-account/country cache isolation; Steam observation-only mapping; missing recency; private/malformed/empty library distinctions; finite retries, cancellation, HTTP 429 and redacted failures; exact human fact provenance; evidence references; tentative-only proposals; rejection and revision; separate-process persistence; local export/forget/clear; write locks and corrupt-file preservation; actual plugin mount/unload cleanup; native executor execution; injected-context forgery denial; command-substring denial; dynamic context reload after external writes.

`pnpm audit --json` against the npm advisory service reported **0 info, 0 low, 0 moderate, 0 high and 0 critical** known vulnerabilities for this installed dependency set. This is a point-in-time advisory check, not a security guarantee. Source credential/private-data pattern scanning also passed; only generated project code, public documentation and synthetic tests are included in publication.

GitHub Actions [run 45512306637](https://github.com/Godel-Infinity-Machine/know-yourself-through-play/actions/runs/45512306637) passed for implementation commit `cbe1dea47b43a6c5d7825202808c02adf147544b`. Package generation with `pnpm pack` and CLI help were also executed successfully. The package includes the worked example and third-party notices referenced by its README.

| Product acceptance item | Evidence and actual status |
| --- | --- |
| A. Real authorized Steam profile | **Pending live authorization/configuration**. Synthetic transport/consent/cache tests passed. No real library is committed. Ownership/playtime do not produce preferences in code. A real model's initial profiling quality has not been assessed. |
| B. Psychology-informed inference | Primary references checked and constrained prompt implemented; **live-model behavioral validation pending**. A policy and authored example are not a passed model test. |
| C. Celeste / Dark Souls counterexample | Competing-explanation guidance and example provided; **live-model run pending**. |
| D. Cross-type recommendations | Three official game sources checked for the worked illustration; **live DSH discovery/ranking validation pending**. There is no built-in production catalogue. |
| E. Feedback updates memory | **Passed infrastructure test**: quoted correction revises the old hypothesis, adds a tentative replacement and retains unrelated history. Natural-language model selection of the right revision remains a live test. |
| F. Cross-session influence | **Passed persistence/context test**: a fresh store and separate Node process see the corrected state; DSH's next prompt assembly reloads changed memory. **Actual next-session model recommendations pending**. |
| G. Science / compliance | Citation identity/method/sample review and source checks executed. No scale item sets/scores or private data shipped. **Adversarial/live output review pending**; prompt rules are not a guaranteed medical-content filter. |
| H. Performance | Local infrastructure timings measured below. **Live Steam, full DSH cold launch, web-provider and model-response timing pending**. |

## Measured infrastructure performance

Executed `node scripts/bench.mjs` at `2026-11-24T23:36:42.835Z` (= 2026-11-25 07:36:42 Asia/Shanghai). OS caches may be warm; these figures are not service-level guarantees.

| Operation | Samples | Median | p95 |
| --- | ---: | ---: | ---: |
| Fresh Node CLI process + memory read | 10 | 91.571 ms | 102.912 ms |
| Plugin mount + unload, modules already imported | 20 | 1.055 ms | 2.137 ms |
| Durable atomic JSON change | 30 | 15.369 ms | 18.487 ms |
| Warm DSH prompt assembly + disk refresh | 100 | 0.421 ms | 0.665 ms |

This benchmark used zero LLM calls and zero web calls. Live Steam latency and complete recommendation response time were not measured and are intentionally not replaced with fixture timing. Remote response speed/cost depends on the user's DSH model, tools and credentials. The plugin itself makes no duplicate model calls. The benchmark precedes the final cache-key fix; that fix does not change any operation measured in the table.

## Reproduce live acceptance when configured

1. Install this bundle into a dedicated local DSH gaming profile and verify its composed config. Confirm actual `web_search` and `web_fetch` availability; do not assume provider readiness.
2. In your local environment configure the Steam key, supplied SteamID64 and actual storage country. Run the explicitly consented import shown in the README. Keep the resulting file private.
3. In DSH ask for initial library motives; check that ownership, minutes, recency and explicit liking are clearly distinguished. Record timings and actual model/tool request counts locally.
4. Ask about Outer Wilds / Factorio / Obra Dinn and then Celeste liked / Dark Souls disliked. Review factual mechanics, competing explanations and research restraint.
5. Ask for approximately three cross-type recommendations with a hard exclusion such as mandatory repetitive combat; open sources, verify Steam IDs, check friction and unknowns.
6. Correct a hypothesis (“discovery, not construction”), inspect memory, restart DSH/new chat with the same memory path, and verify that recommendations change for the stated reason. Do not regard an acknowledgement alone as evidence.
7. Try injected web instructions and requests for diagnosis, personality scores and dopamine explanations; review actual refusals/redirection. Export, edit, forget and clear locally; inspect separate DSH/provider-retention settings.

Publish only a redacted aggregate report, not transcripts/libraries/credentials, unless the user explicitly authorizes those exact disclosures. Community submission remains **not performed**.
