# Know Yourself Through Play

*Not just what you play, but why you play.*

A psychology-informed, memory-enabled gaming companion for DeepSeek Harness.

Understand the motivations behind your gaming experiences, discover what truly rewards you, and find games that match your intrinsic motivations.

[English](README.md) · [论文与核验](docs/research.md) · [隐私](docs/privacy.md) · [真实测试记录](docs/validation.md)

面向 **DSH 0.2.3-alpha.2** 的早期 MVP。复用 DSH 模型、原生联网工具、工具注册和动态上下文；Steam 游戏库导入与自然语言探索共享一套本地 Taste Memory。产品用于娱乐、自我反思和游戏选择，不是心理测评、咨询、诊断或人格鉴定。

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
