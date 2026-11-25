# Know Yourself Through Play

*成瘾让人忘记自己，真正契合的游戏却能让你认出自己。*  
*每款留在你心里的游戏，都恰好以最契合你天性的方式，回馈了你的行动。*

一个面向 **DeepSeek Harness** 的游戏发现与自我探索插件。  
它不为消磨时间，也不为把你困在黏性循环里。只需聊聊你玩过、喜欢或放弃的作品（也可按需导入已授权的 Steam 游戏库），它便通过**游戏回应行动的奖励机制**，帮你看清真正打动自己的原因，并找到下一款值得投入的作品。

[English](./README.md) · [研究说明](./docs/research.md) · [隐私说明](./docs/privacy.md) · [验证记录](./docs/validation.md)

---

## 为什么需要另一种推荐

大多数游戏推荐都在设法让你上瘾——用表层标签和惯性循环拴住你，尽可能拉长游玩时长。**我们不以“让你玩得更久”作为成功标准。**

决定一场游玩是消耗还是满足的，很少是表面有多像，而是**游戏的奖励机制如何回应你的行动**：

* **表面完全不同，奖赏却一致**  
  《星际拓荒》（宇宙探索）、《异星工厂》（工厂自动化）和《奥伯拉丁的回归》（推理）在类型和美术上几乎没有共同点，但它们奖赏的是同一件事：从未知中理出秩序，理解本身就是奖赏。
* **标签相同，体验却相反**  
  《蔚蓝》和《黑暗之魂》都带有“高难度”标签，体验却完全不同：《蔚蓝》让每一次瞬时重试都成为明确的进步；《黑暗之魂》则可能用漫长的跑图和高昂的死亡回退成本，很快消耗掉玩家的耐心。

**Know Yourself Through Play** 把游戏当作一面镜子：借你玩过的作品，映出你珍视的奖赏和排斥的阻力，再跳出既有的类型限制，寻找能带来真实满足感的游戏。

---

## 核心机制

* **以奖励机制为镜**  
  基于已发表的游戏心理学研究——包括自我决定理论（SDT）与玩家体验量表（PXI）——分析游戏如何奖赏行动，以及阻力从何而来。每一条洞察都是供你检验的**探索性假设**，而不是人格标签。
* **自然对话 + 可选 Steam 授权导入**  
  无需填写问卷。你可以直接用自然语言聊起玩过的作品，也可以按需连接明确授权的 Steam 游戏库作为起点。
* **奖赏匹配与排雷**  
  既按你偏爱的奖励机制跨类型寻找游戏，也提前标出可能打断体验的摩擦点，避开“看着合适、玩着疲惫”的作品。
* **可修改的品味记忆**  
  你的偏好记录与品味假设默认保存在本地，随每一次真实反馈持续修正。你始终拥有最终决定权——可以随时查看、反驳、修改或清空。
* **输入栏推荐开关**
  使用 **Web Search** 与 推荐**Recent New Games** 两个按钮控制本 Session 的联网与新作筛选。
---

## 试试这样问

以下示例分别对应插件的五个核心场景——从拆解“口碑好却玩不下去”的原因，到主动修正你的品味记忆：

* **跨类型挖掘底层偏好**：*“我平时不太玩回合制 RPG，但在《杀戮尖塔》和《陷阵之志》里都投入了上百小时。我真正喜欢的到底是什么？有没有其他完全不同类型、但能带来同样爽感的游戏？”*
* **结合 Steam 库或弃坑经历做反推**：*“看下我的游玩记录：《荒野大镖客2》这种公认神作我玩不到 5 小时就弃坑了，反而《小丑牌》停不下来。帮我分析一下究竟是哪些设计在劝退我，又是什么反馈循环让我上头？”*
* **带精力与时间约束的排雷推荐**：*“最近下班很累，想找一款 20 分钟能打完一局、不需要背大量剧情或拼极限操作，但依然有策略规划成就感的游戏，顺便提前标出可能会劝退我的设计。”*
* **查看并纠正 Taste Memory**：*“列出你目前对我游戏品味的判断。另外纠正一条：我其实不讨厌高难度，我只是受不了无法随时存档和漫长的死亡跑图，帮我把这条改掉。”*
* **联网搜寻近期正式版新作** *（发送前请先勾选 **Recent New Games**）*：*“单机策略和推理类的经典老游戏我基本都玩过了。帮我联网搜一下最近几个月刚正式发售（排除抢先体验）的新作，结合我的偏好推荐 3 款，核实发售时间并标出潜在雷点。”*

---

## 安装、配置与首次运行

### 1. 准备环境并安装

已验证的环境为 **Node.js 24.22.3、pnpm 11.25.0、DSH 0.2.3-alpha.2**。请先安装 Node.js 与 Git，再在终端执行：

```sh
npm install --global pnpm@11.25.0 @deepseek-ai/dsh@0.2.3-alpha.2
git clone https://github.com/Godel-Infinity-Machine/know-yourself-through-play.git
cd know-yourself-through-play
pnpm install --frozen-lockfile
pnpm build
```

下面创建独立的 `kytp` Web profile 并安装当前目录的插件。**初始化命令仅用于首次创建**；`--from-default-profile` 会重置同名 profile，已有 `kytp` 时请换一个未使用的名称，并在后续命令中保持一致。

```sh
dsh --profile kytp --from-default-profile web --dump-config
dsh plugin --profile kytp add .
dsh --profile kytp --dump-config
```

最后一条命令的输出应包含 `dsh-know-yourself-through-play` 插件层。保留此本地仓库目录，供已安装的本地插件使用；无需手动复制 `cordis.patch.yml` 或修改 DSH 核心代码。

### 2. 配置模型并启动

```sh
dsh --profile kytp
```

打开终端显示的本地地址（默认 `http://127.0.0.1:3080`）。在 DSH 的 **Settings → Models** 中配置模型提供商和 API Key，并选择可用模型；自定义网关还需填写正确的 API 地址、协议与模型名。详细字段见 [DSH 官方模型配置说明](https://github.com/deepseek-ai/deepseek-harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/providers.zh.md)。

自然语言入口无需 Steam Key。Taste Memory 默认使用本机的 `~/.dsh/know-yourself-through-play/taste-memory.json`；如需换路径，在启动 DSH 和运行导入命令的终端中设置同一个 `KYTP_MEMORY_FILE` 绝对路径。模型配置中的密钥由 DSH 管理，不要写入仓库。

### 3. 完成第一次对话

新建会话，确认输入栏显示两个默认关闭的按钮，然后发送：

> 我喜欢自己发现规律，但不喜欢重复刷取。请先提出可能的行动、反馈、奖励与摩擦偏好，再推荐三款游戏；不确定的地方请说明。

默认使用模型已有知识和 Taste Memory，无需联网。随后可以说：

> 请记住：我享受的是自己发现规律，不是经营建造本身。修正相关假设，再给我推荐。

再询问“查看你目前的品味记忆”，核对是否保存了原话、修正了相关假设。需要实时资料时手动开启 **Web Search**；寻找近期正式版新作时开启 **Recent New Games**。联网还需要 DSH 已配置可用的原生 Web Provider。

### 可选：导入已授权的 Steam 游戏库

先阅读 [隐私说明](./docs/privacy.md)。Steam 游戏详情必须允许该 API 访问；不可访问时可继续直接聊游戏。下面在仓库目录执行，示例为 **PowerShell**：

```powershell
$env:STEAM_API_KEY = Read-Host "Steam Web API Key" -MaskInput
node lib/cli.js import-steam --steam-id YOUR_STEAMID64 --country YOUR_STORAGE_COUNTRY --consent-local-storage --consent-model-context
Remove-Item Env:STEAM_API_KEY
```

`Read-Host -MaskInput` 需要 PowerShell 7.1+；其他终端请使用其安全的环境变量设置方式。将占位符替换为你授权的 SteamID64 和**实际存储此数据的机器所在国家**。两个同意参数表示允许本地保存游戏库数据，并让它进入 DSH 模型上下文，可能发送给所配置的远程模型服务；只在同意这些用途时执行。插件仅从环境变量读取 Steam Key，**不会自动加载 `.env`**，也不需要 Steam 密码或 Cookie。

导入成功后，在同一记忆路径的 DSH 会话中说“根据已导入的游戏库提出初步假设，区分拥有、游玩时长与明确喜好”。在仓库目录运行 `node lib/cli.js show` 可查看本地记忆；导出、修改与删除命令见 `node lib/cli.js help`。

---

## 推荐模式

DSH Web／桌面端输入栏提供两个会话开关（**Web Search** 与 **Recent New Games**；升级插件后请重启 DSH 以加载新版客户端入口）。

| Web Search | Recent New Games | 推荐行为 |
| --- | --- | --- |
| 关闭（默认） | 关闭（默认） | 仅使用模型已有知识与本地 Taste Memory，禁用联网工具。 |
| 开启 | 关闭 | 允许原生联网检索，按动机与奖励机制跨时代寻找游戏，不限发售时间。 |
| 开启 | 开启 | 优先检索近期**正式发售**的新作，核实名称、发售日期与状态（区分正式版、Early Access 与未发售），结合 Taste Memory 推荐。 |

* **开关联动**：开启 **Recent New Games** 会自动开启 **Web Search**；关闭 **Web Search** 会同时关闭前者。
* **会话隔离**：开关状态仅保存在当前 Session 的 Host 内存中（不写入长期 Taste Memory），重启或刷新会话后恢复默认关闭。
* **权限边界**：TUI／无界面 SDK 无这两个按钮且默认离线；仅在对话中要求“帮我联网搜索”无法改变开关状态。

<details>
<summary>技术实现与安全边界说明</summary>

* 开关通过 DSH 原生 `tools.guard` 在执行 `web_search` 与 `web_fetch` 前校验（缺少 Session 身份时默认拒绝）。关闭开关可阻止后续调用，但无法撤回已发出的请求。
* 该开关仅约束 DSH 原生联网工具，并非针对任意 shell 命令或第三方插件的全局防火墙。
* 开启联网仍依赖可用的 DSH Web Provider；工具不可用时会如实说明限制，不编造结果，近期新作筛选由模型结合来源完成，不保证穷举所有新游。

</details>
---

## 克制与边界

* **模型能力会影响效果。** 更擅长推理、理解细微反馈和可靠调用工具的模型，通常更适合这个 Harness；建议配置能力较强的模型，但不保证每次推断或推荐都准确。
* **假设，而非定论**：心理学视角只用于自我认识与选游参考，不构成心理测评、人格鉴定或医学诊断。你的真实感受始终高于一切推断。
* **你的记忆，由你掌控**：品味记忆默认保存在本地，Steam 授权范围与数据边界见 [隐私说明](./docs/privacy.md)。
* **诚实的能力边界**：作为早期 MVP，推荐覆盖范围取决于可用游戏资料、授权接口，以及 [研究说明](./docs/research.md) 和 [验证记录](./docs/validation.md) 中记录的验证范围。

---

## 开源协议

[MIT](./LICENSE) · 第三方声明见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)
