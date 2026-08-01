import { useEffect, useMemo, useRef, useState } from 'react'
import { featuredProjects, hobbies, moreProjects, projects } from './data'

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg className={`arrow-icon arrow-${direction}`} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 16h21M18 8l8 8-8 8" />
    </svg>
  )
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) {
      node?.classList.add('is-visible')
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && node.classList.add('is-visible'),
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useReveal()
  return <Tag ref={ref} className={`reveal ${className}`}>{children}</Tag>
}

function Nav() {
  const [open, setOpen] = useState(false)
  const go = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }
  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => go('#top')}>次央拉姆</button>
      <button className="menu-button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '关闭' : '菜单'}</button>
      <nav className={open ? 'nav-open' : ''} aria-label="主导航">
        <button onClick={() => go('#about')}>关于</button><span>/</span>
        <button onClick={() => go('#projects')}>项目</button><span>/</span>
        <button onClick={() => go('#life')}>生活</button><span>/</span>
        <button onClick={() => go('#contact')}>联系</button>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <main id="top" className="hero page-grid">
      <Nav />
      <div className="hero-copy">
        <h1 aria-label="把 AI 变成可落地的产品与内容">
          <span>把 AI 变成</span><span>可落地的</span><span>产品与内容</span>
        </h1>
        <p className="hero-positioning">AI 产品 × 项目推进 × AIGC 视觉叙事</p>
        <a className="text-link" href="#projects">查看项目 <ArrowIcon direction="up" /></a>
      </div>
      <div className="portrait-wrap" aria-label="次央拉姆职业照片">
        <div className="portrait-mask"><img src="/assets/profile-color.webp" alt="次央拉姆彩色职业证件照" /></div>
      </div>
      <aside className="hero-meta"><span>大连工业大学</span><span>数字媒体技术</span><span>2027 届</span><i /><b>ENTJ</b></aside>
      <div className="next-chapter"><span>01</span><span>向下了解我</span></div>
    </main>
  )
}

function About() {
  return (
    <section id="about" className="about page-grid section-rule">
      <Reveal className="section-label"><span>01</span><h2>关于我</h2></Reveal>
      <Reveal className="about-statement" as="p">
        我不只想“会用 AI 工具”。<br />
        我更关心如何定义问题、组织协作，<br />
        并把想法推进到<strong>可以被看见、被体验、被验证</strong>。
      </Reveal>
      <Reveal className="about-detail">
        <p>数字媒体技术背景让我同时理解技术、视觉与交互；产品实习和项目负责人经历，让我习惯在模糊目标中拆问题、对齐表达、推动交付。</p>
        <dl>
          <div><dt>目标岗位</dt><dd>AI 产品管理 / AI 项目管理 / AIGC 内容创作</dd></div>
          <div><dt>工作方式</dt><dd>目标导向 · 主动推进 · 快速学习 · 结果复盘</dd></div>
        </dl>
      </Reveal>
    </section>
  )
}

function LeadMedia({ project, className = '' }) {
  if (project.lead.type === 'video') {
    return <video className={className} src={project.lead.src} poster={project.lead.poster} muted loop autoPlay playsInline preload="metadata" />
  }
  return <img className={className} src={project.lead.src} alt={`${project.title} 项目视觉`} />
}

function ProjectRow({ project, reverse, onOpen }) {
  return (
    <Reveal className={`project-row ${reverse ? 'project-reverse' : ''}`}>
      <div className="project-copy">
        <div className="project-index">{project.index}</div>
        <div className="project-title-group">
          <h3>{project.title}</h3><p className="project-role">{project.role}</p><p className="project-summary">{project.summary}</p>
          <div className="evidence-list">{project.evidence.map((item) => <span key={item}>{item}</span>)}</div>
          <button className="case-link" aria-label={`查看 ${project.title} 案例`} onClick={() => onOpen(project)}>查看完整案例 <ArrowIcon /></button>
        </div>
      </div>
      <button className="project-media" onClick={() => onOpen(project)} aria-label={`查看 ${project.title} 案例`}>
        <LeadMedia project={project} /><span className="media-corner">{project.period}</span>
      </button>
    </Reveal>
  )
}

function Projects({ onOpen }) {
  return (
    <section id="projects" className="projects page-grid section-rule">
      <Reveal className="projects-heading"><h2>精选项目</h2><p>不止展示结果，也完整呈现我如何从问题定义推进到交付与验证。</p></Reveal>
      <div className="project-list">{featuredProjects.map((project, index) => <ProjectRow key={project.id} project={project} reverse={index % 2 === 1} onOpen={onOpen} />)}</div>
    </section>
  )
}

function MoreProjects({ onOpen }) {
  return (
    <section className="more-projects page-grid section-rule">
      <Reveal className="section-label"><span>03</span><h2>更多项目</h2></Reveal>
      <div className="more-list">
        {moreProjects.map((project) => (
          <Reveal key={project.id} className="more-item">
            <span className="more-index">{project.index}</span>
            <LeadMedia project={project} />
            <div><h3>{project.title}</h3><p className="project-role">{project.role}</p><p>{project.summary}</p><strong>{project.evidence.join(' / ')}</strong></div>
            <button aria-label={`查看 ${project.title} 案例`} onClick={() => onOpen(project)}><ArrowIcon /></button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="experience page-grid section-rule">
      <Reveal className="section-label"><span>04</span><h2>经历</h2></Reveal>
      <Reveal className="experience-date"><strong>2026.06</strong><i /></Reveal>
      <Reveal className="experience-detail"><h3>上海移品信息技术有限公司 — NextMind Slides</h3><p>视觉设计实习生 · 2026.06 — 至今</p><ul><li>品牌宣传片创意开发与视觉执行</li><li>AI 产品文档与核心功能表达</li><li>Prompt 迭代与海内外内容传播</li></ul></Reveal>
    </section>
  )
}

function Capabilities() {
  const capabilities = ['AI 产品表达', '项目推进', 'AIGC 内容生产', '视觉与实时渲染']
  return (
    <section className="capabilities page-grid section-rule">
      <Reveal className="section-label"><span>05</span><h2>能力坐标</h2></Reveal>
      <div className="capability-list">{capabilities.map((item, index) => <Reveal key={item} className="capability"><span>0{index + 1}</span><strong>{item}</strong></Reveal>)}</div>
      <Reveal className="tools-line"><span>TOOLS</span><p>ChatGPT / Claude / Midjourney / Stable Diffusion / UE5 / Unity / Blender / Figma / AE</p></Reveal>
    </section>
  )
}

function Hobbies({ onView }) {
  return (
    <section id="life" className="life page-grid section-rule">
      <Reveal className="life-heading"><span>06</span><h2 aria-label="网站之外，我也在认真生活">网站之外，<br />我也在认真生活</h2><p>工作之外的好奇心、耐心和行动力，也构成了我。</p></Reveal>
      {hobbies.map((group, groupIndex) => (
        <Reveal className={`hobby-group hobby-${groupIndex + 1}`} key={group.key}>
          <header><h3>{group.title}</h3><p>{group.description}</p><span>{String(group.items.length).padStart(2, '0')} ITEMS</span></header>
          <div className="hobby-rail">
            {group.items.map((item, index) => (
              <button className={index === 0 ? 'hobby-feature' : ''} key={item.id} onClick={() => onView(item)} aria-label={`放大查看 ${item.name}`}>
                <img src={item.url} alt={item.name} loading="lazy" /><span>{item.name}</span>
              </button>
            ))}
          </div>
        </Reveal>
      ))}
    </section>
  )
}

function Honors() {
  const honors = ['省级创新创业训练计划优秀结项', '外观专利授权', 'VPC 全国大学生虚拟制作大赛荣誉证书', '国青杯三等奖', '进步奖学金']
  return (
    <section className="honors page-grid section-rule"><Reveal className="section-label"><span>07</span><h2>荣誉</h2></Reveal><div className="honor-list">{honors.map((item) => <Reveal key={item} className="honor-item">{item}</Reveal>)}</div></section>
  )
}

function Contact() {
  return (
    <footer id="contact" className="contact page-grid"><div className="section-label"><span>08</span><h2>联系我</h2></div><p className="contact-statement">如果你在寻找一个能把 AI、产品与内容<br />真正连起来的人，我们可以聊聊。</p><div className="contact-links"><a href="mailto:3534615751@qq.com"><span>Email</span><strong>3534615751@qq.com</strong><ArrowIcon /></a><a href="tel:+8618289146696"><span>Phone</span><strong>182 8914 6696</strong></a></div></footer>
  )
}

function CaseTimeline({ items }) {
  return <ol className="case-timeline">{items.map((item) => <li key={item.step}><span>{item.step}</span><div><h4>{item.title}</h4><p>{item.text}</p></div></li>)}</ol>
}

function AssetItem({ item, onView }) {
  if (item.kind === 'image') {
    return <button className="asset-media" onClick={() => onView(item)}><img src={item.url} alt={item.name} loading="lazy" /><span>{item.name}</span><small>{item.sourceGroup}</small></button>
  }
  if (item.kind === 'video') {
    return <figure className="asset-video"><video src={item.url} controls playsInline preload="metadata" /><figcaption><span>{item.name}</span><small>{item.sourceGroup}</small></figcaption></figure>
  }
  return <a className="asset-file" href={item.url} download><b>{item.extension}</b><span>{item.name}<small>{item.sourceGroup}</small></span><em>下载原件</em><ArrowIcon /></a>
}

export function ProjectModal({ project, onClose, onView = () => {} }) {
  const [filter, setFilter] = useState('all')
  useEffect(() => {
    if (!project) return undefined
    document.body.classList.add('modal-open')
    const keydown = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', keydown)
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', keydown) }
  }, [project, onClose])

  const visibleAssets = useMemo(() => {
    if (!project) return []
    if (filter === 'media') return project.assets.filter((item) => item.kind !== 'document')
    if (filter === 'document') return project.assets.filter((item) => item.kind === 'document')
    return project.assets
  }, [filter, project])

  if (!project) return null
  const { caseStudy } = project
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${project.title} 案例详情`}>
      <article className="case-modal">
        <header className="case-nav"><span>{project.index} / CASE STUDY</span><button onClick={onClose}>关闭</button></header>
        <div className="case-hero"><div><span>{project.role}</span><h2>{project.title}</h2></div><p>{project.summary}</p></div>
        <div className="case-lead"><LeadMedia project={project} /></div>
        <div className="case-overview">
          <section><h3>项目背景</h3><p>{caseStudy.background}</p></section>
          <section><h3>目标与约束</h3><p>{caseStudy.challenge}</p><ul>{caseStudy.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></section>
          <section><h3>我的角色</h3><p>{caseStudy.role}</p></section>
        </div>
        <section className="case-process"><div className="case-section-title"><span>PROCESS</span><h3>从 0 到 1</h3></div><CaseTimeline items={caseStudy.timeline} /></section>
        <section className="case-decisions"><div className="case-section-title"><span>DECISIONS</span><h3>关键决策</h3></div><div>{caseStudy.decisions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h4>{item.title}</h4><p>{item.text}</p></article>)}</div></section>
        <section className="case-results"><div><span>OUTCOME</span><h3>结果与复盘</h3></div><div><ul>{caseStudy.outcomes.map((item) => <li key={item}>{item}</li>)}</ul><div className="learning"><strong>我学到的</strong>{caseStudy.learnings.map((item) => <p key={item}>{item}</p>)}</div></div></section>
        <section className="case-archive">
          <div className="archive-head"><div><span>EVIDENCE ARCHIVE</span><h3>完整项目档案</h3><p>{project.assets.length} 份原始材料</p></div><div className="archive-filters" aria-label="档案筛选"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button><button className={filter === 'media' ? 'active' : ''} onClick={() => setFilter('media')}>媒体</button><button className={filter === 'document' ? 'active' : ''} onClick={() => setFilter('document')}>文档</button></div></div>
          <div className="asset-grid">{visibleAssets.map((item) => <AssetItem key={item.id} item={item} onView={onView} />)}</div>
        </section>
        <footer className="case-footer"><button onClick={onClose}>返回全部项目</button><span>{project.index} / {String(projects.length).padStart(2, '0')}</span></footer>
      </article>
    </div>
  )
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined
    const keydown = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [item, onClose])
  if (!item) return null
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${item.name} 放大预览`} onClick={onClose}><button onClick={onClose}>关闭</button><img src={item.url} alt={item.name} onClick={(event) => event.stopPropagation()} /><p>{item.name}</p></div>
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [lightboxItem, setLightboxItem] = useState(null)
  return (
    <><Hero /><About /><Projects onOpen={setActiveProject} /><MoreProjects onOpen={setActiveProject} /><Experience /><Capabilities /><Hobbies onView={setLightboxItem} /><Honors /><Contact /><ProjectModal project={activeProject} onClose={() => setActiveProject(null)} onView={setLightboxItem} /><Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} /></>
  )
}
