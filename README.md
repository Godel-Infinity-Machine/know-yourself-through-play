# Know Yourself Through Play

*Not just what you play, but why you play.*

A psychology-informed, memory-enabled gaming companion for DeepSeek Harness.

Understand the motivations behind your gaming experiences, discover what truly rewards you, and find games that match your intrinsic motivations.

[中文](README.zh-CN.md) · [Research](docs/research.md) · [Privacy](docs/privacy.md) · [Validation](docs/validation.md)

An early MVP for **DSH 0.2.3-alpha.2**. Uses DSH's model, native web tools, tool registry and dynamic context. One persistent Taste Memory connects an explicitly authorized Steam import with natural-language exploration. It is an entertainment and reflection tool, not psychological assessment, counselling or diagnosis.

## What it does

- Explores **Action → Feedback → Reward → Friction**, a project reasoning scaffold rather than a validated psychological theory.
- Separates exact human statements, Steam observations and tentative motivation hypotheses, with supporting evidence, counterexamples and conditions.
- Revises a specific hypothesis after user disagreement, preserves unrelated history, and injects the corrected memory into the next DSH model context.
- Guides approximately three recommendations by motives and actual mechanics, with Steam links, sources, unknowns and friction. Native DSH web search/fetch verify candidates when available; there is no bundled game catalogue or genre/tag ranking engine.
- Imports only a user-requested API-visible library, through the local CLI. Ownership and minutes never automatically become positive preferences.
- Supports local inspect, edit, export, individual forgetting and complete Taste Memory clearing. No telemetry, database, vector store, separate agent runtime or frontend.

## Install

Requirements: Node **24.22.3+**, pnpm, and a separately installed/configured **DeepSeek Harness 0.2.3-alpha.2**. Other DSH versions have not been verified. Configure the model and usable native web providers in DSH itself; this plugin supplies no model key or search provider.

```sh
git clone https://github.com/Godel-Infinity-Machine/know-yourself-through-play.git
cd know-yourself-through-play
pnpm install --frozen-lockfile
pnpm check
dsh plugin --profile gaming add .
dsh --profile gaming --dump-config
dsh --profile gaming
```

`lib/` is committed for installation without a prepare hook. To install straight from GitHub, use `dsh plugin --profile gaming add github:Godel-Infinity-Machine/know-yourself-through-play#COMMIT_SHA` with a reviewed real commit. No npm release is claimed. To remove: `dsh plugin --profile gaming remove dsh-know-yourself-through-play`.

The default file is `~/.dsh/know-yourself-through-play/taste-memory.json`. Set `KYTP_MEMORY_FILE` to the same absolute local file for both CLI and DSH, or configure the plugin's `memoryFile` via a DSH profile patch:

```yaml
- id: know-yourself-through-play
  config:
    memoryFile: /absolute/private/path/taste-memory.json
```

Use one local person's data per profile/file. A DSH deployment's own persistence is not assumed to be a taste store. [API verification and fallback decision](docs/dsh-verification.md).

## Start with conversation

Tell DSH, in any language:

> I like Outer Wilds and Factorio. What might they have in common?
>
> I enjoy discovering rules, not managing production. Please remember that correction and suggest three games. Exclude repetitive combat.

The agent should offer competing, tentative explanations and record only useful evidence. Explicit confirm/reject status requires the human command `/taste confirm HYPOTHESIS_ID` or `/taste reject HYPOTHESIS_ID reason`; these are ordinary chat messages interpreted by the companion, not registered native slash-command UI actions. Natural feedback revises immediately but the replacement stays tentative. The single `taste_memory` tool validates human quotation provenance.

## Start with Steam

Read [privacy and Steam terms](docs/privacy.md), then set `STEAM_API_KEY` in the local environment using your normal secret-management method. Never put it in a chat, command argument, source file or GitHub. SteamID64 is an identifier, not a password or authentication token. The library's game details must be visible to the official API. Do not supply Steam passwords/cookies.

```sh
node lib/cli.js help
node lib/cli.js import-steam --steam-id YOUR_STEAMID64 --country YOUR_STORAGE_COUNTRY --consent-local-storage --consent-model-context
dsh --profile gaming
```

After import ask: “Explore my imported library. Separate ownership/time from enjoyment and suggest tentative motives I can correct.” Both entries read the same file. `--country` means where **this machine** stores data. Both consent flags acknowledge local storage and possible remote model transmission; they are not Steam OAuth. A same-account snapshot is reused for 15 minutes unless `--refresh` is supplied. If import fails, manually describe liked/disliked/played games.

## Control your memory

```sh
node lib/cli.js show
node lib/cli.js export --output /private/location/export.json
node lib/cli.js replace --input /private/location/edited-export.json --confirm-replace
node lib/cli.js forget --id FACT_OR_HYPOTHESIS_ID --confirm-delete
node lib/cli.js clear --confirm-delete
```

Add `--file ABSOLUTE_PATH` to any CLI command to override storage. Exports refuse existing files. Forget removes dependent hypotheses. Local clear does not erase DSH logs, provider records or backups. Memory is unencrypted; protect the file and exports with your OS account permissions.

## Science, tests and limitations

[Five verified research references](docs/research.md) constrain vocabulary and uncertainty; no protected scale questions, psychological scores or individual causal claims are used. [Worked example](examples/exploration.md) shows cross-type motives, counterexamples and feedback correction; it is a written illustration, not a fabricated live transcript.

```sh
pnpm typecheck
pnpm build
pnpm test
pnpm bench
pnpm audit:source
```

[Actual results and pending acceptance gates](docs/validation.md) distinguish real local integration tests from live model/authorized-library tests. Model-level scientific quality, recommendation accuracy, hard-exclusion adherence and jailbreak resistance remain dependent on the configured DSH model; prompt rules are not a deterministic guarantee. The plugin does not certify all A–H product acceptance tests as passed. Large profiles need user curation; context includes all active hypotheses, relevant/recent quotations and the top 25 games by minutes, with ownership count, not every library row.

MIT for project code. Installed dependency metadata was reviewed: MIT libraries and Apache-2.0 TypeScript tooling; upstream licenses remain applicable. See [third-party notes](THIRD_PARTY_NOTICES.md). **No DSH community submission has been made**, per the owner's instruction.
