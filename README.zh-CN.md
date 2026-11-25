# Know Yourself Through Play

*Not just what you play, but why you play.*

A psychology-informed, memory-enabled gaming companion for DeepSeek Harness.

Understand the motivations behind your gaming experiences, discover what truly rewards you, and find games that match your intrinsic motivations.

[English](README.md) · [论文与核验](docs/research.md) · [隐私](docs/privacy.md) · [真实测试记录](docs/validation.md)

**一个围绕行动、反馈与可能的心理奖励进行游戏推荐，并能通过你的反馈持续修正记忆的 Harness。** 项目以 **DeepSeek Harness 0.2.3-alpha.2 原生插件**实现，帮助你探索：自己喜欢在游戏中主动做什么，什么反馈让这些行动变得满足，以及什么机制会破坏体验。通过你玩的游戏和你对体验的反馈，更了解自己的体验偏好。

**推荐的主要依据是你追求的体验，而不是内容、类别或 Steam 标签的相似性。** 不同类型的游戏，可能通过发现、实验或能力进步带来相似的满足；看似相似的游戏，也可能因为反馈方式和失败成本不同而带来截然不同的体验。你明确提出的题材、类别要求与排除条件仍然优先。已发表的游戏心理学研究用于约束探索性解释，不代表模型已经科学测量了你的动机。

当前是早期 MVP。复用 DSH 模型、原生联网工具、工具注册和动态上下文；主动授权的 Steam 游戏库导入与自然语言探索共享一套持久化 Taste Memory。

## 从游戏体验探索可能的动机

| 维度 | 探索的问题 |
| --- | --- |
| **Action · 行动** | 你喜欢主动做什么：探索、实验、创造、推理、练习或合作？ |
| **Feedback · 反馈** | 什么回应让你愿意继续：新信息、解释成立、能力进步或系统变化？ |
| **Reward · 奖励** | 这些体验可能带来什么满足：自主感、胜任感、好奇心、连接感或意义感？这是待验证的解释，不是测量分数。 |
| **Friction · 摩擦** | 什么会削弱体验：重复劳动、失败后的高回退成本、反馈不清或过度引导？ |

**Action → Feedback → Reward → Friction 是项目的推理框架，不是经过验证的统一心理学理论。** 喜欢行动本身和喜欢行动带来的结果，需要分别考虑。拥有、游玩时长或最近玩过，都不能直接证明喜欢，也不能据此测量心理需求。

## 可以由你改进的 Memory

Taste Memory 分开保存长期有用的用户原话、行为观察与待确认假设。**你的明确反馈优先于模型推断。** 纠正会修订相关假设，同时保留其他证据、反例和适用条件；修正后的记忆会进入后续推荐上下文，重启后也能继续使用。改进的是模型对**你的偏好**的理解，不是训练模型或让 Agent 自我演化推荐策略。

例如，你说“我喜欢自己发现规律，不是经营建造”，后续解释就应更重视自主发现，不能继续把建造当作已确认偏好。下一次推荐应说明候选游戏的行动和反馈为什么符合这一修正，并披露劝退点和未知信息。你可以查看、纠正、导出或删除记忆，对自己的体验拥有最终解释权。见[完整示例](examples/exploration.md)与[真实模型反馈／重启测试](docs/live-acceptance-2026-11-25.md)。

## 使用边界与隐私

> Know Yourself Through Play 借鉴已发表的游戏心理学研究，结合你的游戏经历与反馈，帮助你探索个人游戏动机与体验偏好。所有个人分析均为探索性假设，仅供娱乐、自我反思与游戏选择参考，不构成医疗建议、心理咨询、心理测评或诊断，也不能替代专业服务。

不进行人格鉴定、临床判断、心理概率评分或多巴胺推断。理论与量表构念用于辅助推理；群体研究不能直接测量个人，相关性不能当作因果关系，也不向用户施测受保护量表题目。推荐和假设都可能出错，允许用户反驳和修正。

Steam 导入需要主动授权。Taste Memory 默认保存在本地未加密的 JSON 文件中；相关记忆和游戏库观察会进入 DSH 上下文，并可能发送给配置的远程模型。本插件不启用遥测；DSH 与模型服务各有自己的留存和遥测设置。清空 Taste Memory 不会删除这些服务的记录或你的备份。导入前请阅读[隐私与数据处理说明](docs/privacy.md)。

## 已实现

- 用 Action → Feedback → Reward → Friction 分析体验；这是项目推理框架，不宣称为经过验证的统一心理学理论。
- 分开保存用户原话、Steam 行为观察、探索性动机假设；假设包含行动、反馈、奖励、摩擦、支持证据、反例、条件和确认状态。
- 自然反馈修正相关假设、保留其他历史；下一次 DSH 上下文读取修正后的记忆。
- 指导模型按动机推荐约三款游戏，说明真实机制、来源、劝退点和未知信息；直接使用 DSH 的 web_search / web_fetch，不建立游戏库或标签匹配器。
- 本地 CLI 主动授权导入 Steam 官方 API 可见的游戏库。拥有、时长、近期游玩均不等于喜欢。
- 支持查看、编辑、导出、逐条遗忘与清空。没有默认遥测、独立数据库、向量服务、多 Agent 系统或独立前后端。

## 安装配置

需要 Node **24.22.3+**、pnpm，以及单独安装并配置好的 **DeepSeek Harness 0.2.3-alpha.2**。其他版本尚未验证。模型凭据与可用的原生 Web Provider 在 DSH 中配置，插件不另建模型调用和搜索层。

```sh
git clone https://github.com/Godel-Infinity-Machine/know-yourself-through-play.git
cd know-yourself-through-play
pnpm install --frozen-lockfile
pnpm check
# 仅在新建 gaming profile 时执行下面这一行：
dsh --profile gaming --from-default-profile tui --dump-config
dsh plugin --profile gaming add .
dsh --profile gaming --dump-config
dsh --profile gaming
```

新 profile 先从 `tui` 初始化，才有对话界面；已有 profile 请跳过 `--from-default-profile`，因为它会替换现有组合。仓库提供编译后的 `lib/`，不需要 Git 安装时执行 prepare 脚本。也可在初始化后用 `dsh plugin --profile gaming add github:Godel-Infinity-Machine/know-yourself-through-play#COMMIT_SHA` 安装经过审查的真实提交。没有声称已发布 npm 包。卸载用 `dsh plugin --profile gaming remove dsh-know-yourself-through-play`。

默认记忆文件为 `~/.dsh/know-yourself-through-play/taste-memory.json`。通过环境变量 `KYTP_MEMORY_FILE` 设置 CLI 与 DSH 共同使用的绝对路径，或在 DSH profile patch 中配置：

```yaml
- id: know-yourself-through-play
  config:
    memoryFile: /absolute/private/path/taste-memory.json
```

一个 profile/文件只用于一个本地用户。当前版本源码未找到通用持久化 Taste Memory Provider，所以使用 JSON 降级；没有虚构 `ctx.memory`。见[核查记录](docs/dsh-verification.md)。

## 两种入口

直接与 DSH 交谈：

> 我喜欢《星际拓荒》和《异星工厂》，它们可能有什么共同点？
>
> 我最喜欢的是自己发现规律，不是经营建造。请记住这个修正，再推荐三款；排除重复战斗。

自然反馈会修正相关假设，新解释仍为待确认。若要明确确认或否定状态，在聊天发送 `/taste confirm 假设ID` 或 `/taste reject 假设ID 原因`。它们是由模型处理的普通聊天文本，不是新增的原生斜杠菜单命令。`taste_memory` 工具会核验原话来自当前真实用户消息，防止把网页或模型内容存成用户事实。

Steam 入口：先阅读[隐私说明与 Steam 条款](docs/privacy.md)，在本机环境中配置 `STEAM_API_KEY`，不要把密钥发到聊天、命令参数或仓库。SteamID64 是标识符，不是登录凭证；游戏详情必须允许官方 API 访问。

```sh
node lib/cli.js help
node lib/cli.js import-steam --steam-id YOUR_STEAMID64 --country YOUR_STORAGE_COUNTRY --consent-local-storage --consent-model-context
dsh --profile gaming
```

导入后说：“分析我的游戏库，把拥有与时长和明确喜欢分开，提出可修正的初步假设。”两种入口读取同一份记忆。`--country` 填实际存储机器所在国家，不按语言推断。两个 consent 参数分别确认本地保存、进入可能发往远程模型的上下文；这不是 Steam OAuth。同账户 15 分钟内使用缓存，`--refresh` 强制重新读取。不可访问时可手动描述喜欢、厌恶和玩过的游戏，不绕过隐私权限。

## 记忆控制

```sh
node lib/cli.js show
node lib/cli.js export --output /private/location/export.json
node lib/cli.js replace --input /private/location/edited-export.json --confirm-replace
node lib/cli.js forget --id FACT_OR_HYPOTHESIS_ID --confirm-delete
node lib/cli.js clear --confirm-delete
```

所有命令可加 `--file 绝对路径`。导出不覆盖已有文件；编辑导出副本后可替换。遗忘会同时移除依赖该证据的假设。清空只清 Taste Memory，不删除 DSH 日志、模型服务记录或备份。数据未加密，请保护本机文件权限。

## 验证与限制

```sh
pnpm typecheck
pnpm build
pnpm test
pnpm bench
pnpm audit:source
```

[真实测试报告](docs/validation.md)与[真实 DSH／模型验收](docs/live-acceptance-2026-11-25.md)区分本地原生集成测试、真实模型上的模拟偏好案例，以及授权游戏库检查。不能将提示词规则视为推荐质量、硬性排除或科学合规的确定性保证，不把成功案例宣称为 A–H 的普遍保证，也不编造完整响应耗时。当前动态上下文保留有效假设、相关与近期原话，以及时长最高的 25 款游戏；大型画像需要用户整理。

[完整探索与修正示例](examples/exploration.md)是明确标注的人工示例，不是伪造模型运行记录。论文核验包括 SDT、PXI、BANGS、DEEP 和 28 Dimensions of Play，不复制受保护量表题目，不输出心理概率分数。

项目代码使用 MIT。依赖元数据为 MIT 与开发工具 TypeScript 的 Apache-2.0，详见[第三方说明](THIRD_PARTY_NOTICES.md)。**按用户要求，未向 DSH 社区提交。**
