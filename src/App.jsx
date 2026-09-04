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
      <button onClick={() => jump('#method')}>方法</button>
      <button onClick={() => jump('#about')}>关于</button>
      <a href="/downloads/次央拉姆-秋招.pdf" download>简历</a>
    </nav>
    <span className="availability"><i /> Seeking 2027 opportunities</span>
    <button className="menu-button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '关闭' : '菜单'}</button>
  </header>
}

function Hero() {
  return <section id="top" className="hero page-shell">
    <Header />
    <div className="hero-layout">
      <div className="hero-copy">
        <h1 aria-label="你好，我是次央拉姆"><span>你好，我是</span><span>次央拉姆。</span></h1>
        <p className="hero-lead">AI 产品经理候选人，关注可信、可验证的 AI 产品体验。</p>
        <p className="hero-body">我把模糊问题整理成清晰的产品判断、PRD 与交互原型，再用数据、真实界面和测试证据验证它。比起“AI 能做什么”，我更在意人在哪里做决定，失败时产品如何诚实回应。</p>
      </div>
      <figure className="hero-portrait">
        <img src="/assets/profile-hires.webp" alt="次央拉姆高清职业照片" />
        <figcaption><span>2027 届 · 数字媒体技术</span></figcaption>
      </figure>
      <div className="hero-meta">
        <span>产品定义</span><span>AI Native</span><span>PRD / 交互</span><span>SQL / 数据闭环</span>
      </div>
    </div>
    <a className="hero-scroll" href="#work">查看精选项目 <Arrow /></a>
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
      <span>01 / Selected work</span>
      <h2>精选项目</h2>
      <p>六个案例，分别证明产品定义、AI 工作流、数据闭环、交互设计与真实交付。项目状态、入口与边界都可核对。</p>
    </Reveal>
    <div className="project-list">{projects.map((project, index) => <ProjectRow key={project.id} project={project} order={index} onOpen={onOpen} />)}</div>
  </section>
}

function Method() {
  const items = [
    ['01', '问题定义', '从用户、业务与约束出发，写清为什么解决、为什么现在解决，以及什么不做。'],
    ['02', '产品判断', '把范围、优先级、流程和异常状态变成可评审的 PRD 与交互方案。'],
    ['03', 'AI Native', '区分规则与模型，设计结构化输出、人工确认、失败降级与评测证据。'],
    ['04', '数据闭环', '用 SQL、状态、事件和指标观察产品是否真的减少成本或提升决策质量。'],
  ]
  return <section id="method" className="method page-shell">
    <Reveal className="method-statement"><span>02 / Product thinking</span><h2>我不把 AI 当作<br />一个魔法按钮。</h2><p>好的 AI 产品不是更会说，而是知道信息从哪里来、模型负责什么、人在哪里判断、结果如何被复核。</p></Reveal>
    <div className="method-list">{items.map(item => <Reveal className="method-row" key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></Reveal>)}</div>
  </section>
}

function Resources() {
  return <section className="resources page-shell">
    <Reveal className="section-intro compact"><span>03 / Portfolio system</span><h2>文档与可点击体验</h2><p>飞书负责完整阅读，墨刀负责交互体验，GitHub 与在线产品负责证明真实落地。</p></Reveal>
    <div className="resource-list">{portfolioLinks.map((link, index) => <Reveal as="a" className="resource-row" href={link.href} target="_blank" rel="noreferrer" key={link.label}><span>0{index + 1}</span><h3>{link.label}</h3><p>{link.note}</p><Arrow diagonal /></Reveal>)}</div>
  </section>
}

function About() {
  const strengths = [
    '能从需求分析、PRD、交互原型推进到可运行 MVP，并明确实现、原型与规划边界。',
    '能区分规则引擎与大模型的适用边界，坚持 Human-in-the-loop，由人保留最终决策权。',
    '具备 DeepSeek API、Prompt、结构化输出和异常流程设计经验，能与研发沟通接口、权限与状态。',
    '有复杂项目推进经验：带领 5 人团队完成省级项目，并在实习中推动产品内容与宣传片交付。',
  ]
  const skillGroups = [
    { label: 'PRODUCT', title: '产品与研究', skills: [
      ['需求洞察 / 问题定义', '用户访谈、行为分析、JTBD、问题优先级'],
      ['产品判断与 MVP', '为什么做 / 不做、范围收敛、P0 / P1 / P2'],
      ['PRD 与交互设计', '流程图、信息架构、原型、异常状态与验收标准'],
      ['用户与竞品研究', '用户反馈归因、竞品证据、市场机会判断'],
    ] },
    { label: 'AI NATIVE', title: 'AI 产品能力', skills: [
      ['LLM / Agent 产品设计', '模型边界、Agent 角色、权限与人工决策点'],
      ['Workflow / Tool Calling', '把模型、规则、工具与业务流程组织成闭环'],
      ['Prompt / Context / Structured Output', '上下文管理、Schema 约束与可解析输出'],
      ['AI 评测与 Bad Case', '评测集、指标、失败分类、重试与降级'],
    ] },
    { label: 'DATA & DELIVERY', title: '数据与落地', skills: [
      ['SQL / SQLite / D1 / PostgreSQL', '数据模型、版本、审计、权限与指标追踪'],
      ['0→1 项目推进', '需求 → PRD → 方案 → 研发 → 测试 → 上线'],
      ['技术协作', 'React、TypeScript、API、GitHub 与测试验证'],
    ] },
  ]
  return <section id="about" className="about page-shell">
    <Reveal className="about-title"><span>04 / About</span><h2>在技术、内容与用户之间，<br />把模糊问题变成可行动的产品。</h2></Reveal>
    <Reveal className="about-profile"><img src="/assets/profile-hires.webp" alt="次央拉姆高清职业照片" /><div><p>我是次央拉姆，大连工业大学数字媒体技术专业 2027 届学生，求职方向为 AI 产品经理。我的优势不只是写 PRD 或调用模型，而是把真实问题拆成产品范围、交互流程、AI 与规则边界，以及可验证的数据闭环。我关注 Human-in-the-loop、结构化输出、失败降级和证据可追溯，也能进入 API、数据库与前端实现细节，推动方案形成可运行交付。</p><dl><div><dt>工作方式</dt><dd>问题定义 → PRD → 交互 → AI / 数据闭环 → 验证复盘</dd></div><div><dt>求职方向</dt><dd>AI 产品经理 / AI Native 产品方向</dd></div></dl></div></Reveal>
    <Reveal className="experience">
      <div className="experience-label"><span>INTERNSHIP</span><h3>实习经历</h3></div>
      <div className="experience-main"><div className="experience-head"><div><strong>上海移品信息技术有限公司 · NextMind Slides</strong><p>AI 产品视觉与内容 / 视觉设计实习生</p></div><time>2026.06—至今</time></div><ul><li>梳理 20+ 项 AI 演示能力与 18 类场景，形成统一信息架构和产品表达。</li><li>推动宣传片从需求、分镜、Prompt 迭代、生成 / 实拍到评审与多平台发布。</li><li>将复杂能力转译为产品文档、场景语言和品牌内容，连接产品理解与用户传播。</li></ul></div>
    </Reveal>
    <div className="strengths"><h3>个人优势</h3>{strengths.map((item, index) => <Reveal className="strength" key={item}><span>0{index + 1}</span><p>{item}</p></Reveal>)}</div>
    <div className="capability-map"><header><span>AI NATIVE SKILL SET</span><h3>能力不是关键词，<br />而是一套交付链路。</h3><p>从洞察、判断和产品设计，到模型编排、评测、数据与上线验证。</p></header>{skillGroups.map((group, groupIndex) => <Reveal className="capability-group" key={group.label}><div className="capability-label"><span>0{groupIndex + 1} / {group.label}</span><h4>{group.title}</h4></div><div className="skill-list">{group.skills.map(([name, detail]) => <div className="skill-row" key={name}><strong>{name}</strong><p>{detail}</p></div>)}</div></Reveal>)}</div>
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
  return <><Hero /><Work onOpen={setActiveProject} /><Method /><Resources /><About /><Hobbies /><Footer /><ProjectStory project={activeProject} onClose={() => setActiveProject(null)} /></>
}
