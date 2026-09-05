import { useEffect, useRef, useState } from 'react'
import { hobbies, portfolioLinks, projects } from './data'

function Arrow({ diagonal = false }) {
  return <svg className={diagonal ? 'arrow diagonal' : 'arrow'} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
}

function Logo() {
  return <span className="logo" aria-label="次央拉姆">CL<span>·</span></span>
}

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) { node?.classList.add('is-visible'); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.unobserve(node) }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <Tag ref={ref} className={`reveal ${className}`}>{children}</Tag>
}

function ExternalLink({ link, className = '' }) {
  return <a className={className} href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><Arrow diagonal /></a>
}

function Header() {
  const [open, setOpen] = useState(false)
  const jump = (id) => { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }
  return <header className="site-header">
    <button className="home-link" onClick={() => jump('#top')}><Logo /><span>次央拉姆</span></button>
    <nav className={open ? 'is-open' : ''} aria-label="主导航">
      <button onClick={() => jump('#work')}>项目</button>
      <button onClick={() => jump('#experience')}>经历</button>
      <button onClick={() => jump('#capabilities')}>能力</button>
      <button onClick={() => jump('#about')}>关于</button>
    </nav>
    <div className="header-actions"><span className="availability"><i />寻找 2027 届产品机会</span><a className="header-resume" href="/downloads/次央拉姆-秋招.pdf" download>下载简历</a></div>
    <button className="menu-button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '关闭' : '菜单'}</button>
  </header>
}

function Hero() {
  return <section id="top" className="hero page-shell">
    <Header />
    <div className="hero-layout">
      <div className="hero-copy">
        <span className="eyebrow">AI PRODUCT MANAGER · 2027</span>
        <h1 aria-label="能定义问题，也能把 AI 产品推到真实交付。">能定义问题，<br />也能把 AI 产品推到真实交付。</h1>
        <p className="hero-lead">从业务分析、MVP 取舍、PRD 与交互，到 Agent 工作流、数据闭环、测试验收与部署。</p>
        <p className="hero-identity">次央拉姆 · 已独立推进三个独立 AI 产品</p>
        <div className="hero-actions"><a className="button-primary" href="#work">查看核心项目 <Arrow /></a><a className="button-secondary" href="/downloads/次央拉姆-秋招.pdf" download>下载简历 <Arrow diagonal /></a></div>
      </div>
      <figure className="hero-portrait">
        <img src="/assets/profile-original.png" alt="次央拉姆高清职业照片" />
        <figcaption><span>2027 届 · 数字媒体技术</span></figcaption>
      </figure>
    </div>
    <div className="proof-rail" aria-label="3 个独立 AI 产品，企业 Beta 已上线，69 项自动化测试，13 个月项目推进">
      <div><strong>3</strong><span>个独立 AI 产品</span><small>端到端主导</small></div>
      <div><strong>企业 Beta</strong><span>已上线</span><small>真实业务验证</small></div>
      <div><strong>69</strong><span>项自动化测试</span><small>覆盖核心流程</small></div>
      <div><strong>13</strong><span>个月项目推进</span><small>0→1 稳定迭代</small></div>
    </div>
  </section>
}

function RecruiterBrief() {
  const items = [
    ['01', '产品判断', '从用户、业务与约束定义 MVP，在不确定中找到可验证的最优解。', '航益智审 / NextMind'],
    ['02', 'AI Native', '理解模型边界，设计 Agent 工作流、评测、人工确认与失败兜底。', 'Origin Brand AI'],
    ['03', '数据闭环', '用 SQL、指标与行为分析拆解问题，用上线证据驱动迭代。', 'Sentinel / 指标体系'],
    ['04', '交付推动', '把 PRD、流程和验收标准推进到评审、测试、发布与复盘。', '6 版方案 / 4 轮迭代'],
  ]
  return <section className="recruiter-brief page-shell">
    <Reveal className="brief-heading"><span>00 / WHY ME</span><h2><small>个人优势</small>为什么值得继续看</h2><p>不是技能名词的堆叠，而是四条有真实项目支撑的交付能力。</p></Reveal>
    <div className="brief-grid">{items.map(([number, title, text, proof]) => <Reveal as="article" className="brief-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><a href="#work">关键证据 · {proof} <Arrow /></a></Reveal>)}</div>
  </section>
}

function ProjectRow({ project, order, onOpen }) {
  return <Reveal as="article" className={`project-row layout-${order % 3} tone-${project.tone}`}>
    <button className="project-media" onClick={() => onOpen(project)} aria-label={`打开 ${project.title} 案例`}>
      <img src={project.image} alt={project.imageAlt} />
      <span>{project.status}</span>
    </button>
    <div className="project-copy">
      <div className="project-kicker"><span>{project.index}</span><span>{project.english}</span><span>{project.period}</span></div>
      <h3>{project.title}</h3>
      <p>{project.statement}</p>
      <div className="project-tags">{project.capabilities.map(item => <span key={item}>{item}</span>)}</div>
      {project.download && <div className="project-quick-actions">
        <a href={project.links[0].href} target="_blank" rel="noreferrer"><span><b>LIVE</b>在线访问航益智审</span><Arrow diagonal /></a>
        <a href={project.download.href} download><span><b>ZIP</b>直接下载 Lens 插件</span><Arrow diagonal /></a>
      </div>}
      <button className="case-button" onClick={() => onOpen(project)} aria-label={`打开 ${project.title} 案例`}><span>阅读完整案例</span><Arrow /></button>
    </div>
  </Reveal>
}

function Work({ onOpen }) {
  return <section id="work" className="work page-shell">
    <Reveal className="section-intro">
      <span>01 / SELECTED WORK</span>
      <h2 aria-label="精选项目">用项目证明判断。</h2>
      <p>六个案例覆盖企业智能审核、品牌决策、竞品情报、内容安全、AI 演示与实体产品。每个项目都说明问题、取舍、交互、数据、证据和边界。</p>
    </Reveal>
    <div className="project-list">{projects.map((project, index) => <ProjectRow key={project.id} project={project} order={index} onOpen={onOpen} />)}</div>
  </section>
}

function Experience() {
  return <section id="experience" className="experience-section page-shell">
    <Reveal className="section-intro"><span>02 / EXPERIENCE</span><h2>把 AI 能力讲清楚，<br />也把版本推上线。</h2><p>在 NextMind，我连接场景、功能、生成质量与商业化表达，让产品能力变得可理解、可验收。</p></Reveal>
    <Reveal className="experience">
      <div className="experience-label"><span>INTERNSHIP · 2026.06—至今</span><h3>实习经历</h3></div>
      <div className="experience-main"><div className="experience-head"><div><strong>上海移品信息技术有限公司 · NextMind LLC</strong><p>AI 产品（视觉设计方向）实习生</p></div></div><div className="experience-metrics"><div><b>20+</b><span>AI 功能归类</span></div><div><b>18</b><span>业务场景梳理</span></div><div><b>V2.5</b><span>产品文档迭代</span></div><div><b>6 / 4</b><span>版本 / 迭代轮次</span></div></div><ul><li>把提示增强、需求澄清、Text2Deck、智能提纲、Context2Image、模板融合归纳为 5 类产品能力。</li><li>为投标、融资路演、高管汇报、市场研究、产品发布等场景定义目标用户、核心任务和标准页面结构。</li><li>从准确性、结构完整性、表达一致性和场景匹配度走查生成结果，用 Prompt、版本与失败案例台账跟踪 6 版方案与 4 轮迭代。</li><li>参与 Free、Plus、Pro、Enterprise 四档方案与定价页梳理，把技术能力转译为用户价值和版本差异。</li></ul></div>
    </Reveal>
  </section>
}

function CapabilityStack() {
  const groups = [
    ['01', '产品策略与定义', '需求洞察 · JTBD · MVP · Roadmap · PRD · 信息架构 · 原型 · 验收标准', '从“为什么做”到“怎么验收”，让需求具备边界、优先级与可交付性。'],
    ['02', 'AI 产品与评测', 'Workflow · Tool Calling · Prompt · Context · Structured Output · Bad Case · Human-in-the-loop', '设计模型、规则、工具与人的分工，并用评测集、失败分类和降级策略管理不确定性。'],
    ['03', '数据与增长验证', 'SQL · SQLite · D1 · PostgreSQL · 指标体系 · 漏斗 · 行为分析 · 实验设计', '以事件、状态和指标验证价值，定位转化阻塞与质量问题，而不是停留在主观判断。'],
    ['04', '交付与协同', '优先级 · 评审 · 版本管理 · 测试验收 · 上线复盘 · Git · GitHub · Cloudflare', '连接设计、研发与业务，把方案推过评审、实现、测试和发布的完整链路。'],
  ]
  return <section id="capabilities" className="capabilities page-shell">
    <Reveal className="capability-intro"><span>03 / CAPABILITY STACK</span><h2>一套面向交付的<br />AI 产品能力栈。</h2><p>工具按工作任务组织，能力用真实项目校验。</p></Reveal>
    <p className="sr-only">LLM / Agent 产品设计；Prompt / Context / Structured Output；AI 评测与 Bad Case；SQL / SQLite / D1 / PostgreSQL。</p>
    <div className="capability-table">{groups.map(([number, title, tools, detail]) => <Reveal as="article" className="capability-row" key={number}><span>{number}</span><h3>{title}</h3><strong>{tools}</strong><p>{detail}</p></Reveal>)}</div>
    <Reveal className="tool-strip"><span>常用工具</span><p><b>原型与表达</b> Figma / Axure / 墨刀 / Mermaid / XMind</p><p><b>数据与验证</b> SQL / Excel / SQLite / D1 / PostgreSQL</p><p><b>AI 与交付</b> ChatGPT / Claude / DeepSeek / Cursor / Codex / GitHub</p></Reveal>
  </section>
}

function Resources() {
  return <section className="resources page-shell">
    <Reveal className="section-intro compact"><span>04 / EVIDENCE LIBRARY</span><h2>文档与可点击体验</h2><p>飞书看完整案例，墨刀体验交互，GitHub 与在线产品核对真实落地。</p></Reveal>
    <div className="resource-list">{portfolioLinks.map((link, index) => <Reveal as="a" className="resource-row" href={link.href} target="_blank" rel="noreferrer" key={link.label}><span>0{index + 1}</span><h3>{link.label}</h3><p>{link.note}</p><Arrow diagonal /></Reveal>)}</div>
  </section>
}

function About() {
  return <section id="about" className="about page-shell">
    <Reveal className="about-title"><span>05 / ABOUT</span><h2>关于我</h2></Reveal>
    <Reveal className="about-profile"><img src="/assets/profile-original.png" alt="次央拉姆高清职业照片" /><div><p>我是次央拉姆，大连工业大学数字媒体技术专业 2027 届学生，求职产品经理 / AI 产品方向。跨内容、设计与技术的经历，让我既能追问用户与业务问题，也能进入 API、数据库和前端细节；更重要的是，我会把模型不确定性转化为清晰的规则、人工决策点、评测证据与交付边界。</p><dl><div><dt>工作方式</dt><dd>问题定义 → PRD → 交互 → AI / 数据闭环 → 验证复盘</dd></div><div><dt>实践原则</dt><dd>Spec → Agent → Test → Review → Human Acceptance</dd></div><div><dt>求职方向</dt><dd>产品经理 / AI 产品方向</dd></div></dl></div></Reveal>
  </section>
}

function Hobbies() {
  return <section className="hobbies page-shell">
    <Reveal className="section-intro compact"><span>05 / Outside work</span><h2>工作以外</h2><p>板绘训练我观察叙事与细节，烘焙让我尊重变量和反馈，运动让我保持好奇与体力。</p></Reveal>
    <div className="hobby-strip">{hobbies.map(item => <Reveal as="figure" key={item.category}><img src={item.image} alt={`${item.category}真实照片`} /><figcaption><strong>{item.category}</strong><span>{item.note}</span></figcaption></Reveal>)}</div>
  </section>
}

function MediaItem({ item }) {
  if (item.type === 'video') return <figure className="story-media"><video controls playsInline preload="metadata" poster={item.poster}><source src={item.src} type="video/mp4" /></video><figcaption>{item.alt}</figcaption></figure>
  return <figure className="story-media"><img src={item.src} alt={item.alt} /><figcaption>{item.alt}</figcaption></figure>
}

function StorySection({ number, label, title, children }) {
  return <section className="story-section"><header><span>{number} / {label}</span><h3>{title}</h3></header><div className="story-section-body">{children}</div></section>
}

export function ProjectStory({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const close = event => event.key === 'Escape' && onClose()
    document.body.classList.add('story-open')
    window.addEventListener('keydown', close)
    return () => { document.body.classList.remove('story-open'); window.removeEventListener('keydown', close) }
  }, [project, onClose])
  if (!project) return null
  const c = project.caseStudy
  return <div className="story-overlay" role="dialog" aria-modal="true" aria-label={`${project.title} 案例详情`}>
    <article className="story-page">
      <nav className="story-nav"><Logo /><span>{project.index} / {String(projects.length).padStart(2, '0')} · CASE STUDY</span><button onClick={onClose}>关闭 <b>×</b></button></nav>
      <header className={`story-hero tone-${project.tone}`}>
        <div><span>{project.status}</span><p>{project.role}</p><h2>{project.title}</h2><strong>{project.statement}</strong><div className="story-links">{project.links.map(link => <ExternalLink key={link.label} link={link} />)}</div></div>
        <figure><img src={project.image} alt={project.imageAlt} /><figcaption>真实项目界面 / 素材</figcaption></figure>
      </header>
      <StorySection number="01" label="CONTEXT" title="为什么做"><div className="context-grid"><article><h4>背景</h4><p>{c.background}</p></article><article><h4>要解决的问题</h4><p>{c.problem}</p></article><article><h4>为什么现在解决</h4><p>{c.whyNow}</p></article></div></StorySection>
      <StorySection number="02" label="USERS" title="用户与核心任务"><ul className="user-list">{c.users.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ul></StorySection>
      <StorySection number="03" label="JUDGEMENT" title="关键产品判断"><div className="decision-list">{c.decisions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h4>{item.title}</h4><p>{item.text}</p></article>)}</div></StorySection>
      <StorySection number="04" label="INTERACTION" title="关键交互"><ol className="interaction-list">{c.interactions.map(item => <li key={item.step}><span>{item.step}</span><div><h4>{item.title}</h4><p>{item.text}</p></div></li>)}</ol></StorySection>
      <StorySection number="05" label="AI NATIVE" title="AI、规则与人的位置"><ul className="plain-list">{c.aiNative.map(item => <li key={item}>{item}</li>)}</ul></StorySection>
      <StorySection number="06" label="DATA" title="数据与 SQL"><ul className="plain-list">{c.data.map(item => <li key={item}>{item}</li>)}</ul></StorySection>
      <StorySection number="07" label="PROOF" title="真实证据"><div className="proof-list">{c.evidence.map(item => <p key={item}><i>✓</i>{item}</p>)}</div><div className={`media-grid count-${project.media.length}`}>{project.media.map((item, index) => <MediaItem item={item} key={`${item.src}-${index}`} />)}</div></StorySection>
      {project.download && <section className="download-panel"><div><span>ANCILLA LENS · {project.download.version}</span><h3>在当前机票页面<br />直接发起审核。</h3><p>Chrome / Edge Manifest V3 · {project.download.size}</p></div><a href={project.download.href} download><span>下载 Lens 插件</span><Arrow diagonal /></a><ol><li>下载并解压 ZIP</li><li>打开浏览器扩展管理页</li><li>开启开发者模式，加载已解压扩展</li><li>固定 Lens，在普通 HTTP / HTTPS 机票页主动扫描</li></ol><strong>离线模式不会上传字段；该适配器不是携程官方接口。</strong></section>}
      <StorySection number="08" label="BOUNDARY" title="边界与复盘"><div className="boundary"><ul>{c.boundaries.map(item => <li key={item}>{item}</li>)}</ul><blockquote>{c.reflection}</blockquote></div></StorySection>
      <footer className="story-footer"><button onClick={onClose}>← 返回精选项目</button><span>次央拉姆 · AI Product Manager</span></footer>
    </article>
  </div>
}

function Footer() {
  return <footer className="footer page-shell"><div><Logo /><h2>让我们聊聊产品、AI，<br />以及真实的问题。</h2></div><div className="footer-links"><a href="mailto:3534615751@qq.com"><span>联系我</span><small>3534615751@qq.com</small><Arrow /></a><a href="/downloads/次央拉姆-秋招.pdf" download><span>下载简历</span><small>PDF · 2027 届</small><Arrow diagonal /></a></div><p>© 2026 次央拉姆 · 案例明确区分真实实现、设计原型与后续规划。</p></footer>
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null)
  return <><Hero /><RecruiterBrief /><Work onOpen={setActiveProject} /><Experience /><CapabilityStack /><Resources /><About /><Hobbies /><Footer /><ProjectStory project={activeProject} onClose={() => setActiveProject(null)} /></>
}
