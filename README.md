# Know Yourself Through Play

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
* **Choose How to Discover Games Each Time**
  Choose model knowledge or live web research for each recommendation request; if unspecified, the companion asks briefly. Knowledge mode makes no web calls and labels facts as unchecked live. Web mode uses available native DSH tools to find recent/new releases, check release dates/status and cite sources, without promising exhaustive latest-game coverage. If web access is unavailable, it asks before switching modes.

---

## Quick Start

> **Early MVP Note:** This is an early-stage native plugin for **DeepSeek Harness**. It directly reuses DSH's model, tool registry, web retrieval, and dynamic context, connecting natural-language exploration and optional authorized Steam imports to one persistent Taste Memory.

1. Install and enable the plugin in **DeepSeek Harness** (see `cordis.patch.yml` and `package.json`).
2. If you want to include authorized Steam library context, configure your credentials in `.env` (see [Privacy](./docs/privacy.md)).
3. Skip the onboarding forms—just start a conversation.

### Try Asking

* *"I loved Outer Wilds and Factorio—recommend a few games in completely different genres that reward me in a similar way."*
* *"Why am I happy to retry a hard screen in Celeste fifty times, yet instantly lose patience with heavy death penalties or endless grinding?"*
* *"I'm in the mood for something built around observation and deduction, with zero busywork—and warn me about any dealbreakers."*
* *"Show me what you currently assume about my gaming taste. A few of those feel off, and I want to correct them."*
* * *"I'm a longtime player and already know most classics. Search the web for recent releases this time, recommend three that fit the actions and rewards you remember I enjoy, verify their release dates, and flag potential dealbreakers."*

---

## Restraint & Boundaries

* **Model capability affects results.** Models with stronger reasoning, nuanced feedback understanding and reliable tool use are generally better suited to this harness. Configure a capable model in DSH; it still does not guarantee accurate inferences or recommendations.
* **Hypotheses, Not Verdicts**: Psychological lenses serve purely as tools for reflection and game discovery—never psychological testing, personality typing, or medical diagnosis. Your lived experience always overrides any inference.
* **Your Memory, Your Control**: Taste Memory is stored locally by default. See [Privacy](./docs/privacy.md) for Steam authorization scope and data boundaries.
* **Honest Scope**: As an early MVP, recommendation coverage depends on available game metadata, authorized interfaces, and the validation scope documented in [Research](./docs/research.md) and [Validation](./docs/validation.md).

---

## License

[MIT](./LICENSE) · See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for third-party notices.
