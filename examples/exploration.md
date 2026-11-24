# Worked example: discovery, not construction

This is a manually written illustration of intended behavior, **not a claimed live DSH/model transcript or passed acceptance test**. The code does not use these games as a search boundary. Game facts below were checked against the linked official sources on 2026-11-25; personal matches and friction warnings are interpretations.

First-use notice:

> Know Yourself Through Play 借鉴已发表的游戏心理学研究，结合你的游戏经历与反馈，帮助你探索个人游戏动机与体验偏好。所有个人分析均为探索性假设，仅供娱乐、自我反思与游戏选择参考，不构成医疗建议、心理咨询、心理测评或诊断，也不能替代专业服务。

User: 我喜欢《星际拓荒》《异星工厂》和《奥伯拉丁的回归》。

Companion: 一个值得检验的共同点可能是：你愿意主动观察或实验，直到零散信息变成可解释的规律。行动可能是探索、实验、推理；有效反馈可能是“我的解释终于成立了”；奖励可能是自主发现与认知满足。但也可能是各自不同的吸引力，不能仅凭三个名字确认。尤其《异星工厂》的建造和经营，未必就是你喜欢它的原因。

Scientific framing: SDT offers autonomy/competence vocabulary; PXI helps separate feedback from mastery/curiosity; DEEP distinguishes agency preferences. None of them measures this person's motives from game titles. See [sources and limits](../docs/research.md).

Suppose a tentative hypothesis originally included construction/management. The user replies:

> 我最喜欢的是自己发现规律的过程，而不是经营和建造。请排除重复刷怪。

Memory change, corresponding to the actually executed test in `tests/memory.test.mjs`:

```text
Before: h-old [tentative] may enjoy construction/management of complex systems
Human fact: exact correction quotation, with source message/session IDs
After: h-old [revised], counterevidence references that quotation
       h-new [tentative], supersedes h-old
       action: experiment; infer rules
       feedback: new understanding
       reward: curiosity; autonomy
       friction: mandatory repetition
       conditions: discoveries remain unspoiled
```

The next-session context excludes `h-old` from active motives, includes the correction, and retains unrelated hypotheses. This is a change to the user model, not agent strategy evolution or a numerical psychological probability. The current hard exclusion “排除重复刷怪” must additionally govern candidate selection.

Illustrative next recommendation:

| Game / official source | Loop and possible motive match | Possible friction / unknowns |
| --- | --- | --- |
| [Baba Is You — Steam](https://store.steampowered.com/app/736260/), [developer](https://hempuli.com/baba/) | 移动作为实体存在的规则、观察世界变化，再修改解释；可能贴合“自己发现规则”的反馈，而不依赖经营建造。 | 抽象推理卡关可能让发现变成挫败；这是匹配风险推断。开发者资料没有证明你会喜欢，也未在此次核查中确认当前所有辅助功能。 |
| [The Case of the Golden Idol — Steam](https://store.steampowered.com/app/1677770/The_Case_of_the_Golden_Idol/) | 观察死亡现场、连接线索、重建人物与动机；可能满足把不完整信息组织成解释的偏好。 | 官方页明确涉及谋杀现场，若排斥相关题材应排除。推理停滞是否可接受仍未知；不能保证其反馈节奏适合你。 |
| [ANIMAL WELL — Steam](https://store.steampowered.com/app/813230/ANIMAL_WELL/) | 非线性探索，尝试物品的多种用途，观察环境与生物的系统互动；可能给自主实验提供跨类型体验。 | 官方页强调紧张与悬念，未知环境可能造成压力；移动/探索摩擦是否可接受待确认。若把“排除重复刷怪”扩展为“不接受任何敌人压力”，应先换候选。 |

These recommendations cross rule manipulation, scene deduction and exploratory movement. They are justified by possible action/feedback connections, not by their shared tags. They avoid claiming verified absence of every unwanted mechanic. Ordinary runtime recommendations must verify their own current candidate facts through the available DSH tools and honor the user's exact exclusions.

Counterexample illustration: “I like Celeste but dislike Dark Souls” could reflect enjoyment of skill learning with a tolerable retry loop rather than a general preference for difficulty. Other explanations include feedback readability, failure rollback, setting or combat interaction. Ask which moments were enjoyable/frustrating instead of concluding a personality type. The difference between those particular games' current mechanics must be researched before presenting it as verified fact.
