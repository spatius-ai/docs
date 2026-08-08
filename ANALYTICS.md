# PostHog 埋点（文档站）

项目：`docs`（`docs.spatius.ai`）

实现文件：[`analytics.js`](./analytics.js)。Mintlify 会把内容目录下的任意 `.js` 注入每个页面，
并在页面可交互后执行，**不需要在 `docs.json` 里声明**。

四个前端共用同一个 PostHog Project，事件靠 `project` 属性区分：

```text
spatius-site / spatialwalk-site / docs → studio
```

完整跨站约定见 spatius-website 的 `docs/cross-site-analytics.md`。

## 配置

配置项在 `analytics.js` 顶部硬编码。Mintlify 没有构建步骤，也没有环境变量注入，
所以无法像其他站那样用 `VITE_*`：

| 常量 | 值 | 说明 |
|---|---|---|
| `POSTHOG_API_KEY` | `phc_…` | 与官网、Studio 相同的 Project token |
| `POSTHOG_HOST` | `https://i.spatialwalk.ai` | 自建反代 |
| `PROJECT_NAME` | `docs` | 注册为事件的 `project` 公共属性 |
| `TRACK_EVENTS` | `true` | 紧急开关，置 `false` 完全停止加载与上报 |

`environment` 由域名推导：`docs.spatius.ai` → `production`，localhost → `development`，
其余 → `preview`。

`phc_` 是浏览器端公开的 write-only token，与官网 bundle 里的同一个值，
因此明文提交到仓库是可接受的。**不要**把 API Key 或任何服务端密钥放进这个文件。

## Consent

文档站自带 Cookie 横幅，因为大量读者是从搜索引擎直接落到 `docs.spatius.ai` 的，
从未访问过官网，也就不会有官网写下的同意状态。

同意状态存在 `.spatius.ai` 根域的 `spatius_analytics_consent` cookie 上，与官网、
Studio 共用同一份，任一站点做出的选择在其他站点即时生效：

- 值为 `granted` / `accepted` / `true` 才加载 SDK；
- 未同意或未决策时不加载，也不写任何 PostHog cookie；
- 同域多份 cookie 取值冲突时按「未决策」处理，不做猜测；
- 撤回同意时执行 `reset()` 与 `opt_out_capturing()`。

横幅实现要点（`showBanner`）：

- 纯 JS 构建 DOM，样式内联。Mintlify 没有组件系统可用，其 CSS 变量在这里会解析成
  透明值，因此配色按深浅主题写死，不走 `var(--…)`；
- React 水合会丢弃它没渲染过的 body 子节点，横幅会被清掉，所以用 MutationObserver
  在被移除后重新挂载，直到读者做出选择为止；
- 横幅带 `data-ph-no-capture`，回答横幅这件事本身不会被 autocapture 记录。

同意变化通过 `focus`、`storage`、`visibilitychange` 与
`spatius-cookie-consent-change` 四个事件同步，用户在官网改变选择后回到文档站会即时生效。

## 跨站身份

`persistence: 'cookie'` 搭配 `cross_subdomain_cookie: true`，匿名 `distinct_id` 与
`$session_id` 在 `.spatius.ai` 各子域间原生共享。用户在 Studio 登录后由 Studio 调用
`identify(user.id)`，该身份同样通过共享 cookie 带到文档站——**文档站自身不做任何登录集成，
也不读取用户信息**。

`person_profiles: 'identified_only'`，与其他前端保持一致，匿名访客不建 Person 档案。

## 事件

页面浏览由 `capture_pageview: 'history_change'` 处理，覆盖 Mintlify 的 SPA 路由切换。
普通点击由 `$autocapture` 覆盖（仅 `a` / `button` / `form` 的 `click` / `submit`）。

在此之上的语义事件：

| 事件 | 用途 | 主要字段 |
|---|---|---|
| `docs.search.opened` | 打开搜索面板 | `from_path` |
| `docs.search.queried` | 搜索关键词（防抖 900ms） | `search_term`、`search_term_length`、`from_path` |
| `docs.search.result_clicked` | 从搜索结果进入页面 | `search_term`、`target_path`、`from_path` |
| `docs.page.copied` | 点击 "Copy page" | `from_path` |
| `docs.code.copied` | 复制代码块 | `language`、`from_path` |
| `docs.contextual.clicked` | 使用 Ask AI / MCP / Cursor 等入口 | `option`、`from_path` |
| `docs.outbound.clicked` | 跳出到外部站点 | `target_domain`、`target_url`、`link_text`、`from_path` |
| `docs.page.scrolled` | 滚动深度里程碑 25/50/75/100 | `depth_percent`、`from_path` |
| `docs.nav.clicked` | 导航跳转 | `nav_area`、`nav_label`、`target_path`、`from_path` |
| `docs.nav.group_toggled` | 侧栏分组展开/收起 | `group_label`、`expanded`、`from_path` |
| `docs.tab.switched` | 正文代码 Tab 切换 | `tab_label`、`tab_group`、`tab_index`、`from_path` |
| `docs.page.engaged` | 活跃阅读时长 | `active_seconds`、`total_seconds`、`max_scroll_percent`、`idle_count`、`end_reason`、`from_path` |
| `docs.page.not_found` | 命中 404 页面 | `missing_path`、`referrer`、`referrer_is_internal` |

`nav_area` 取 `top_tab`（顶部三个 tab）、`sidebar`（左侧栏）、`navbar`（其余导航栏元素），
用于区分「读者在选哪个文档区」和「读者在选哪个 SDK 页面」。

`tab_group` 携带同组全部 Tab 标题（如 `Web|iOS|Android|Flutter` 或 `pnpm|npm|yarn`），
使平台选择器与包管理器选择器无需后处理即可区分。

### 阅读时长的计算方式

墙钟时间在文档站没有意义——读者会把标签页挂一下午。`active_seconds` 只在
**标签页处于前台** 且 **距上次交互未超过 60 秒** 时累加：

- 计时从首次真实交互开始，而非页面加载，后台打开的标签页不产生时长；
- `visibilitychange` 切到后台立即结算，切回前台重新起算；
- 空闲判定靠 5 秒轮询主动检查（进入空闲的特征恰恰是「不再有事件」）；
- 判定空闲时只累计到**最后一次交互**为止，中间的静默不计入；
- 单页上限 30 分钟，避免遗忘的标签页拉爆均值；
- 多次结算只上报增量，来回切标签页不会重复计数。

60 秒的阈值比营销站常用的 30 秒宽松：盯着代码块看一分钟不动鼠标是正常阅读行为。

`active_seconds` 必须与 `total_seconds` 对照看——比值低说明页面开着但没人读。
`max_scroll_percent` 与时长配对使用：滚到底但只花 5 秒是快速划过，只滚 30% 却停留
3 分钟则可能是卡在某段读不懂。

上报时机为页面隐藏、路由切换、`pagehide`，并带 `send_instantly`，避免页面卸载时丢失。

### 404 的判定方式

Mintlify 的 404 页面**返回 HTTP 200** 并由客户端渲染，因此状态码不可用。判定依据是
`document.title === 'Page Not Found'`——正常页面标题均带 ` - Spatius` 后缀，不会误判。

页面内容在脚本执行后才渲染，所以首次检查延迟 1.2 秒；SPA 路由切换后同样重新检查。
同一路径只上报一次。

`referrer_is_internal` 是这个事件的关键：为 `true` 说明**文档站内部存在死链**，
且 `referrer` 指明了是哪一页链错的，可直接定位修复；为 `false` 则多为外部过期链接
或用户手输错误路径。

站内跳转不额外发事件，`$pageview` 已经覆盖。

## 隐私处理

搜索词是自由文本，是文档站唯一的用户输入面，因此在 `before_send` 之外还会在采集点先清洗一次。
`scrubText` 处理：

- 凭证：`bearer …`、Basic、JWT、`sk-` / `pk-` / `phc_` 前缀、GitHub 与 Slack 的 token 前缀、Google `AIza…`；
- 带标签的密钥：`token=`、`api_key:`、`password:`、`Authorization: Bearer …`（含 scheme 一并清除）；
- 邮箱与手机号（8–15 位数字，避免误伤版本号和错误码）。

URL 清洗移除 `username` / `password` / `hash`，并对含
`token|secret|key|password|code|auth|access|refresh|credential|email|phone|name` 的查询参数值打码。
Referrer 只保留 origin。`$el_text`（autocapture 带出的元素文本）同样过清洗。

Session recording、Surveys、Flags、Experiments、Product tours 与远程依赖加载全部关闭，
`ip: false` 不记录 IP。

回归测试见 `scripts/` 之外的说明：清洗规则的用例覆盖「必须打码」与「不得误伤」两类，
后者包含 `SPATIUS_API_KEY`、`ai.spatius:avatarkit`、`wss://api.us-west.spatius.ai/...`、
错误码与版本号等正常检索词。

## 本地验证

`mint dev` **不会**注入自定义 JS（仅托管站点生效），因此本地预览看不到上报。
验证需在部署后于 PostHog 中按 `project = docs` 过滤查看。
