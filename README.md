# Know Yourself Through Play

![Know Yourself Through Play demo](https://raw.githubusercontent.com/Godel-Infinity-Machine/know-yourself-through-play/main/docs/assets/demo.gif?v=06948323a7a2f34c2515661b984d0c185ca5e413)

*Addiction makes you lose yourself; the right game lets you recognize yourself.*  
*Every game that stays with you has simply rewarded your actions in the way that best fits your nature.*

A game discovery and self-exploration plugin for **DeepSeek Harness**.  
It isn't built to kill time or trap you in sticky engagement loops. Just talk about the games you've played, loved, or walked away from (with an optional authorized Steam library import). Looking through the **reward mechanisms** games use to answer your actions, it helps you see what genuinely moves you—and find the next game truly worth your time.

[中文](./README.zh-CN.md) · [Research](./docs/research.md) · [Privacy](./docs/privacy.md) · [Validation](./docs/validation.md)

---

## Why Another Kind of Recommender

Most game recommenders are built to keep you hooked—relying on surface tags and compulsion loops to maximize playtime. **We don't measure success by how long you keep playing.**

What makes a session feel exhausting or deeply fulfilling is rarely how similar the surface looks, but **how a game's reward mechanisms respond to your actions**:

* **Worlds apart on the surface, identical in reward**  
  *Outer Wilds* (cosmic exploration), *Factorio* (factory automation), and *Return of the Obra Dinn* (deductive mystery) share almost nothing in genre or aesthetics—yet all of them reward the same thing: pulling order out of the unknown, where understanding itself is the prize.
* **Identical in tags, opposite in experience**  
  Both *Celeste* and *Dark Souls* carry the "Difficult" tag, yet they feel nothing alike. *Celeste* turns every instant retry into crisp, unmistakable mastery; *Dark Souls* can erode a player's patience with long runbacks and steep rollback costs after every fall.

**Know Yourself Through Play** treats games as a mirror: reflecting the rewards you cherish and the friction you avoid through the works you've played, then stepping outside genre bubbles to find games that bring real satisfaction.

---

## Core Mechanisms

* **Reward Mechanisms as a Mirror**  
  Grounded in published game-psychology research—including Self-Determination Theory (SDT) and the Player Experience Inventory (PXI)—to map how games reward action and where friction arises. Every insight is framed as a **tentative hypothesis** for you to test, never a personality label.
* **Natural Conversation + Optional Steam Import**  
  No questionnaires required. Start by chatting naturally about games you've played, or optionally connect an explicitly authorized Steam library as a starting point.
* **Reward Matching & Dealbreaker Filtering**  
  Surfaces cross-genre discoveries aligned with your preferred rewards while flagging potential friction points upfront, sparing you from games that look right but feel tiring.
* **Editable Taste Memory**  
  Your preferences and taste hypotheses live locally by default and recalibrate with every piece of real feedback. You hold final authority—inspect, challenge, rewrite, or clear your memory at any time.
* **Input-Bar Recommendation Controls**
  Use **Web Search** and recommend **Recent New Games** to control this Session. 
---
## Try Asking

Each prompt below targets a core capability—from diagnosing why popular games bounce off you to refining your Taste Memory.

* **Cross-genre discovery (beyond surface tags)**: *"I've sunk hundreds of hours into Slay the Spire and Into the Breach, even though I normally bounce off turn-based RPGs. What am I actually chasing here, and what completely different genres deliver that same feeling?"*
* **Diagnosing a mismatch (especially with Steam import)**: *"Looking at my play history, I dropped massive hits like Red Dead Redemption 2 within five hours, yet played Balatro non-stop. Help me figure out what specific friction turns me off and what feedback loops hook me."*
* **Constraint-based filtering (dealbreakers first)**: *"I'm burnt out after work—recommend something I can finish a run of in 20 minutes without heavy story reading or twitch reflexes, while still giving me strategic planning satisfaction. Flag any hidden dealbreakers."*
* **Challenging & editing Taste Memory**: *"Show me what you currently assume about my gaming taste. Also, correct one thing: I don't actually dislike high difficulty—I just hate losing progress to long runbacks. Update that."*
* **Recent full-release search** *(select **Recent New Games** first)*: *"I've already played most classic single-player strategy and deduction games. Search the web for recent full releases (skip Early Access) from the past few months that fit my preferences, verify their release dates, and warn me about potential friction."*
---

## Install, Configure, and Run

### 1. Prepare the environment and install

The verified environment is **Node.js 24.22.3, pnpm 11.25.0, and DSH 0.2.3-alpha.2**. Install Node.js and Git, then run:

```sh
npm install --global pnpm@11.25.0 @deepseek-ai/dsh@0.2.3-alpha.2
git clone https://github.com/Godel-Infinity-Machine/know-yourself-through-play.git
cd know-yourself-through-play
pnpm install --frozen-lockfile
pnpm build
```

Create a dedicated `kytp` Web profile and install the plugin from the current directory. **Run the initialization command only when creating the profile**: `--from-default-profile` resets an existing profile of that name. If `kytp` already exists, choose an unused name and use it consistently below.

```sh
dsh --profile kytp --from-default-profile web --dump-config
dsh plugin --profile kytp add .
dsh --profile kytp --dump-config
```

The final output should include the `dsh-know-yourself-through-play` bundle layer. Keep the local checkout available for the installed local plugin. There is no need to copy `cordis.patch.yml` manually or modify DSH core.

### 2. Configure a model and start

```sh
dsh --profile kytp
```

Open the local URL printed by DSH (default: `http://127.0.0.1:3080`). In **Settings → Models**, configure your provider and API key, then select an available model. A custom gateway also requires the correct API base URL, protocol, and model ID. See the [official DSH model configuration guide](https://github.com/deepseek-ai/deepseek-harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/providers.md) for the fields.

Natural conversation requires no Steam key. Taste Memory defaults to `~/.dsh/know-yourself-through-play/taste-memory.json` on your machine. To change its location, set the same absolute `KYTP_MEMORY_FILE` environment variable in the terminals running DSH and the import command. Model credentials are managed by DSH; keep them out of the repository.

### 3. Have your first conversation

Create a session, check that both input-bar buttons are visible and off, and send:

> I enjoy discovering rules myself, but dislike repetitive grinding. Suggest possible action, feedback, reward, and friction preferences, then recommend three games. Explain what remains uncertain.

The default uses model knowledge and Taste Memory without web access. Then try:

> Remember this: I enjoy discovering rules myself, not management or construction for its own sake. Revise the relevant hypothesis and recommend again.

Ask to see your current Taste Memory and check that your words were saved and the relevant hypothesis was revised. Enable **Web Search** manually for live sources, or **Recent New Games** for recent full releases. Networking also requires a working native DSH web provider.

### Optional: Import an authorized Steam library

Read [Privacy](./docs/privacy.md) first. Steam game details must be accessible to the official API; if they are unavailable, continue by discussing games directly. Run from the checkout; this example uses **PowerShell**:

```powershell
$env:STEAM_API_KEY = Read-Host "Steam Web API Key" -MaskInput
node lib/cli.js import-steam --steam-id YOUR_STEAMID64 --country YOUR_STORAGE_COUNTRY --consent-local-storage --consent-model-context
Remove-Item Env:STEAM_API_KEY
```

`Read-Host -MaskInput` requires PowerShell 7.1+; use your shell's secure environment-variable setup otherwise. Replace the placeholders with your authorized SteamID64 and **the country where the machine storing this data is located**. The consent flags allow local library storage and inclusion in DSH model context, potentially sending that data to your configured remote model provider; run only if you agree to both uses. The plugin reads the Steam key from the environment and **does not automatically load `.env`**. No Steam password or cookies are needed.

After a successful import, ask DSH using the same memory path: “Suggest tentative motives from my imported library, distinguishing ownership, playtime, and explicit liking.” Run `node lib/cli.js show` from the checkout to inspect local memory; see `node lib/cli.js help` for export, editing, and deletion commands.

---

## Recommendation Modes

Two toggles sit in the DSH Web/desktop composer (**Web Search** and **Recent New Games**; restart DSH after upgrading so it loads the client entry).

| Web Search | Recent New Games | Behavior |
| --- | --- | --- |
| Off (default) | Off (default) | Uses model knowledge and local Taste Memory only; web tools are blocked. |
| On | Off | Allows native web search/fetch to discover games by reward mechanisms with no date restriction. |
| On | On | Prioritizes recent **full releases**, verifying title, release date/status (Full Release vs. Early Access vs. unreleased), and core mechanics against your Taste Memory. |

* **Toggle coupling**: Turning on **Recent New Games** automatically enables **Web Search**; turning off **Web Search** clears both.
* **Session-scoped**: Switch states live in Host memory per session (never saved to Taste Memory) and reset to Off on restart or reload.
* **No chat override**: TUI and headless SDK surfaces have no toggles and stay offline—asking to "search the web" in chat cannot override the switch.

<details>
<summary>Technical boundaries &amp; guardrails</summary>

* DSH's native `tools.guard` checks the session switch before executing `web_search` or `web_fetch` (missing session identity fails closed). Turning the switch off blocks new calls, though in-flight requests cannot be retracted.
* This switch governs native DSH web tools only, not a global firewall for arbitrary shell commands or third-party plugins.
* Web-enabled modes still require a configured, working DSH web provider; unavailable search results are disclosed rather than fabricated, and recent-release filtering is model-guided rather than exhaustive.

</details>

---

## Restraint & Boundaries

* **Model capability affects results.** Models with stronger reasoning, nuanced feedback understanding and reliable tool use are generally better suited to this harness. Configure a capable model in DSH; it still does not guarantee accurate inferences or recommendations.
* **Hypotheses, Not Verdicts**: Psychological lenses serve purely as tools for reflection and game discovery—never psychological testing, personality typing, or medical diagnosis. Your lived experience always overrides any inference.
* **Your Memory, Your Control**: Taste Memory is stored locally by default. See [Privacy](./docs/privacy.md) for Steam authorization scope and data boundaries.
* **Honest Scope**: As an early MVP, recommendation coverage depends on available game metadata, authorized interfaces, and the validation scope documented in [Research](./docs/research.md) and [Validation](./docs/validation.md).

---

## License

[MIT](./LICENSE) · See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for third-party notices.
