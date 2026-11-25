# Know Yourself Through Play

*每款让你念念不忘的游戏，都恰好以你偏爱的方式，回馈了你的行动。*

一个面向 **DeepSeek Harness** 的游戏发现与自我探索插件。
你可以直接聊聊玩过、偏爱或放下的作品，也可以主动授权导入 Steam 游戏库，结合本地保存的品味记忆继续探索——它不以延长游玩时长为目标，而是循着游戏对行动给出的**反馈与奖励机制**，陪你在游玩中更了解自己，发现更契合内在动机的游戏。

[English](./README.md) · [研究说明](./docs/research.md) · [隐私说明](./docs/privacy.md) · [验证记录](./docs/validation.md)

---

## 与以往推荐的本质不同

基于标签与题材的推荐，可以帮助你找到外观、内容或类别相近的游戏。本项目进一步关心：**你在游戏里主动做了什么，游戏怎样回应，而你真正享受的是其中哪一部分。**

我们不以“让你玩得更久”为优化目标，而是关心：关掉屏幕后，你是否觉得这段体验值得投入。游戏时长本身既不能证明满足，也不能判断成瘾。

**值得探索的，不只是下一款游戏，还有你为何享受它。**
除了题材与类型，我们更关注**游戏对你的行动给出了怎样的反馈与奖励机制**：

- **跨过类型，遇见相似的满足**
  《星际拓荒》的宇宙探索、《异星工厂》的产线推演、《奥伯拉丁的回归》的线索推理，玩法各异，却可能让同一个人享受到相似的过程——在未知与复杂中建立理解，让“看懂”本身成为回报。这是有待本人确认的解释，不是仅凭游戏名称就能得出的结论。
- **外壳相近，体验却可能相背**
  同样涉及高难度挑战或长篇叙事，有的体验让每一次尝试带来清晰的进步反馈，有的则可能因为较高的失败回退成本、重复劳动或反馈不清而磨平兴致。你的题材偏好与明确排除条件也始终重要。

因此，**Know Yourself Through Play** 把**认识自己**与**发现游戏**连接起来：从你玩过的作品和实际感受出发，探索自己珍视的满足感，再跨过熟悉的类型，寻找下一款可能值得投入的作品。

---

## 它如何工作

- **自然切入，两个入口共享记忆**
  无需填写问卷。你可以直接聊聊玩过或弃坑的作品，也可以主动授权导入官方 API 可访问的 Steam 游戏库。后续对话会读取本地保存的品味记忆与已导入的游戏库观察；当前没有通用的本地游戏安装目录扫描功能。
- **以反馈与奖励机制为镜**
  参照自我决定理论（SDT）、玩家体验量表（PXI）等已发表的游戏心理学研究，梳理 **行动 → 反馈 → 可能的心理满足 → 体验摩擦**。这里的“奖励”包括理解、进步、自主感等可能的主观满足，不仅指道具、数值或成就。这个分析框架是项目的推理方法，不是经过验证的统一心理学理论；个人洞察都是可被反驳和修正的探索性假设。
- **正向契合 + 逆向排雷**
  循着你偏爱的行动与反馈跨类型寻找候选，同时标出可能打断体验的摩擦点。推荐通常约三款，解释实际玩法、匹配理由、潜在劝退点、事实来源与未知信息。游戏事实按需通过 DSH 原生联网工具核实，用户的硬性排除条件优先。
- **随反馈校准的品味记忆**
  用户原话、游戏行为观察和动机假设分开记录，默认保存在本地。你的明确反馈优先于模型推断；长期有用的纠正会修订相关假设，同时保留反例、适用条件和其他偏好。修正后的记忆进入后续推荐上下文，重启后也可继续使用。你可以查看、改写、导出或清空。

例如，你说“**我最喜欢的是自己发现规律，不是经营和建造**”，记忆就应据此修订，而不是继续把建造当作已确认偏好。下一次推荐也应体现这个区别。见[完整探索与修正示例](./examples/exploration.md)与[真实模型反馈／重启验证](./docs/live-acceptance-2026-11-25.md)。

---

## 快速开始

> **早期 MVP 说明**：当前面向 **DeepSeek Harness 0.2.3-alpha.2**，需要 Node **24.22.3+** 与 pnpm。插件复用 DSH 的模型、工具注册、原生联网与上下文能力，支持自然语言对话、持久化品味记忆及可选的 Steam 授权导入。其他 DSH 版本尚未验证。

1. 在已安装并配置好模型的 **DeepSeek Harness** 中安装、启用本插件，检查实际可用的原生联网工具。安装步骤见下方；插件入口配置见 `cordis.patch.yml` 与 `package.json`。
2. 可以直接聊天；Steam 导入为可选项。需要导入时，在本机进程环境中配置 `STEAM_API_KEY`，再通过 CLI 明确同意本地存储与进入模型上下文。插件不自动加载 `.env`，也不接收 Steam 密码或 Cookie。详见[隐私说明](./docs/privacy.md)。
3. 无需问卷，告诉它你喜欢、厌恶或放下了哪些作品，以及当时的实际感受。

<details>
<summary>安装、Steam 导入与记忆控制</summary>

```sh
git clone https://github.com/Godel-Infinity-Machine/know-yourself-through-play.git
cd know-yourself-through-play
pnpm install --frozen-lockfile
pnpm check
# 仅在新建 gaming profile 时执行；已有 profile 请跳过此行：
dsh --profile gaming --from-default-profile tui --dump-config
dsh plugin --profile gaming add .
dsh --profile gaming --dump-config
dsh --profile gaming
```

`--from-default-profile` 会替换 profile 的现有组合，所以只用于新建。模型与可用的 Web Provider 在 DSH 中配置。仓库提供编译后的 `lib/`，没有声称已发布 npm 包。卸载用 `dsh plugin --profile gaming remove dsh-know-yourself-through-play`。

默认记忆文件为 `~/.dsh/know-yourself-through-play/taste-memory.json`。可用 `KYTP_MEMORY_FILE` 为 CLI 与 DSH 设置同一个绝对路径，或配置插件的 `memoryFile`。每个 profile／记忆文件用于一个本地用户。完整配置示例见 [English README](./README.md)。

在本机进程环境中配置密钥后，可选执行：

```sh
node lib/cli.js help
node lib/cli.js import-steam --steam-id YOUR_STEAMID64 --country YOUR_STORAGE_COUNTRY --consent-local-storage --consent-model-context
```

`--country` 填实际存储机器所在国家；两个 consent 参数分别确认本地保存及进入可能发送给远程模型的上下文，这不是 Steam OAuth 或账户所有权验证。游戏详情必须允许官方 API 访问；不可访问时可手动描述体验，不绕过隐私权限。同账户 15 分钟内可复用导入缓存，`--refresh` 显式重新读取。

```sh
node lib/cli.js show
node lib/cli.js export --output /private/location/export.json
node lib/cli.js replace --input /private/location/edited-export.json --confirm-replace
node lib/cli.js forget --id FACT_OR_HYPOTHESIS_ID --confirm-delete
node lib/cli.js clear --confirm-delete
```

所有命令可加 `--file 绝对路径`。导出不覆盖已有文件，改写通过编辑导出副本后替换完成；遗忘会移除依赖该证据的假设。自然反馈产生的修订仍是待确认假设；明确确认或否定可在聊天发送 `/taste confirm 假设ID` 或 `/taste reject 假设ID 原因`，由模型处理并由工具核验，不是新增的原生斜杠菜单命令。

</details>

### 试试这样聊

- *“看看我已导入的 Steam 游戏库，把拥有、游玩时长与明确喜欢分开，提出几个我可以纠正的初步猜想。”*
- *“我很喜欢《星际拓荒》和《异星工厂》，推荐几款类型不同、但行动与反馈同样可能戳中我的游戏。”*
- *“为什么《蔚蓝》卡关我愿意反复尝试，遇到死亡惩罚很重或需要重复刷取的体验却很快失去耐心？”*
- *“给我看看你目前对我游戏口味的猜想，我想改一改。”*

---

## 克制与边界

> Know Yourself Through Play 借鉴已发表的游戏心理学研究，结合你的游戏经历与反馈，帮助你探索个人游戏动机与体验偏好。所有个人分析均为探索性假设，仅供娱乐、自我反思与游戏选择参考，不构成医疗建议、心理咨询、心理测评或诊断，也不能替代专业服务。

- **假设而非定论**：不进行人格鉴定、临床判断、心理概率评分或多巴胺推断。群体研究不能直接测量个人，相关性不能当作因果关系；拥有、时长、近期游玩均不等于喜欢。你对自身体验拥有最终解释权。
- **记忆与数据归你掌控**：记忆默认保存在本地未加密的 JSON 文件中，但相关记忆和游戏库观察会进入 DSH 上下文，并可能发送给配置的远程模型。本插件不默认收集遥测；DSH 和模型服务另有自己的留存设置。清空记忆不会删除 DSH 日志、模型服务记录或备份。数据流向见[隐私说明](./docs/privacy.md)。
- **诚实的能力边界**：心理学研究用于约束推理，记忆改善的是对用户偏好的理解，不是模型训练或 Agent 策略自我演化。推荐质量、事实核验、反馈解释与研究预算仍依赖配置的模型及可用工具，提示词不构成确定性保证。研究核验范围、真实测试与已知限制见[研究说明](./docs/research.md)和[验证记录](./docs/validation.md)。

---

## 开源协议

[MIT](./LICENSE) · 第三方声明见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

按项目所有者要求，**尚未向 DeepSeek Harness 社区提交**。
