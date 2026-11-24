# Third-party notices

Project-authored code is MIT, copyright Godel-Infinity-Machine. It does not relicense third-party works.

Dependency license metadata was inspected with `pnpm licenses list --json` on 2026-11-25. All installed libraries except TypeScript report MIT: DeepSeek Cordis/DSH packages, DeepSeek Cosmokit/Schemastery, Zod, `@standard-schema/spec`, `@types/node`, and `undici-types`. TypeScript 5.9.3 reports Apache-2.0 and is development tooling. These declared licenses are compatible with distributing this project's code under MIT; this is a metadata review, not a legal certification. Preserve upstream notices when redistributing their code. `lib/` contains compiled project code with external package imports, not bundled copies of DSH.

DSH and Cordis remain under their [upstream license](https://github.com/deepseek-ai/deepseek-harness/blob/master/LICENSE). Exact resolved dependencies and integrity values are in `pnpm-lock.yaml`; package authors' license files ship with their packages. No third-party source or paper PDF is copied into this repository.

Psychology papers are cited and paraphrased under their respective publication terms. No protected scale item sets or scoring instruments are reproduced. Game titles and Steam marks belong to their owners. Links and brief original descriptions do not grant rights to game assets, text, reviews or datasets. Steam data is governed by [Valve's API terms](https://steamcommunity.com/dev/apiterms), separate from this project's MIT code license. Tests use explicitly synthetic payloads; no real user's library is redistributed.
