import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { default: App, ProjectStory } = await server.ssrLoadModule('/src/App.jsx')
const { projects, portfolioLinks, hobbies } = await server.ssrLoadModule('/src/data.js')

after(async () => server.close())

test('portfolio exposes only the six verified case studies in a deliberate order', () => {
  assert.deepEqual(projects.map(({ id, index }) => ({ id, index })), [
    { id: 'ancilla', index: '01' },
    { id: 'origin', index: '02' },
    { id: 'rivaltrace', index: '03' },
    { id: 'sentinel', index: '04' },
    { id: 'nextmind', index: '05' },
    { id: 'snow', index: '06' },
  ])
  assert.equal(projects.some(project => project.id === 'mychat'), false)
})

test('every case includes product judgement, evidence, honest status and real media', () => {
  for (const project of projects) {
    assert.ok(project.status)
    assert.ok(project.caseStudy.background)
    assert.ok(project.caseStudy.problem)
    assert.ok(project.caseStudy.whyNow)
    assert.ok(project.caseStudy.users.length >= 1)
    assert.ok(project.caseStudy.decisions.length >= 2)
    assert.ok(project.caseStudy.interactions.length >= 2)
    assert.ok(project.caseStudy.evidence.length >= 1)
    assert.ok(project.caseStudy.boundaries.length >= 1)
    assert.ok(project.media.length >= 1)
    assert.ok(project.links.length >= 1)
  }
})

test('Ancilla offers its real online product and extension package', () => {
  const ancilla = projects.find(project => project.id === 'ancilla')
  assert.equal(ancilla.download.href, '/downloads/ancilla-lens-v0.2.2.zip')
  assert.match(ancilla.links.map(link => link.href).join(' '), /ancilla-guard\.workers\.dev/)
  const html = renderToStaticMarkup(React.createElement(ProjectStory, { project: ancilla, onClose() {} }))
  assert.match(html, /下载 Lens 插件/)
  assert.match(html, /不是携程官方接口/)
  assert.match(html, /数据与 SQL/)
})

test('Ancilla presents the verified enterprise Beta v1.3 product instead of the earlier MVP shell', () => {
  const ancilla = projects.find(project => project.id === 'ancilla')
  const html = renderToStaticMarkup(React.createElement(ProjectStory, { project: ancilla, onClose() {} }))

  assert.equal(ancilla.status, '企业 Beta v1.3 · 公网可用')
  assert.match(ancilla.capabilities.join(' '), /Multi-tenant/)
  assert.match(ancilla.capabilities.join(' '), /Remote MCP/)
  assert.match(html, /企业空间隔离/)
  assert.match(html, /操作审计/)
  assert.match(html, /携程 Sandbox/)
  assert.match(html, /6 个工具/)
  assert.match(html, /不是携程官方生产接口/)
  assert.doesNotMatch(html, /公网 MVP · 可体验/)
})

test('homepage presents a formal recruiter-facing collection and Feishu resources', () => {
  const html = renderToStaticMarkup(React.createElement(App))
  assert.match(html, /你好，我是次央拉姆/)
  assert.match(html, /精选项目/)
  assert.match(html, /AI Native/)
  assert.match(html, /产品判断/)
  assert.match(html, /飞书作品集/)
  assert.match(html, /个人优势/)
  assert.match(html, /下载简历/)
  assert.doesNotMatch(html, /赫尔墨斯 IV|YOYO IP|反诈宣传|MyChat AI Agent/)
  assert.equal(portfolioLinks.length >= 3, true)
})

test('homepage makes the internship, AI-native skill stack and high-resolution portrait explicit', () => {
  const html = renderToStaticMarkup(React.createElement(App))
  assert.match(html, /\/assets\/profile-hires\.webp/)
  assert.match(html, /<figcaption><span>2027 届 · 数字媒体技术<\/span><\/figcaption>/)
  assert.match(html, /上海移品信息技术有限公司/)
  assert.match(html, /NextMind Slides/)
  assert.match(html, /AI 产品视觉与内容/)
  assert.match(html, /2026\.06—至今/)
  assert.match(html, /LLM \/ Agent 产品设计/)
  assert.match(html, /Prompt \/ Context \/ Structured Output/)
  assert.match(html, /AI 评测与 Bad Case/)
  assert.match(html, /SQL \/ SQLite \/ D1 \/ PostgreSQL/)
})

test('Ancilla quick actions expose both the live product and downloadable Lens package before opening the case', () => {
  const html = renderToStaticMarkup(React.createElement(App))
  assert.match(html, /在线访问航益智审/)
  assert.match(html, /直接下载 Lens 插件/)
  assert.match(html, /href="https:\/\/hangyi-zhishen\.ancilla-guard\.workers\.dev\/"/)
  assert.match(html, /href="\/downloads\/ancilla-lens-v0\.2\.2\.zip"/)
})

test('hobbies remain a separate visual chapter instead of masquerading as product work', () => {
  assert.deepEqual(hobbies.map(item => item.category), ['板绘', '烘焙', '运动'])
  const html = renderToStaticMarkup(React.createElement(App))
  assert.match(html, /工作以外/)
  assert.match(html, /板绘/)
  assert.match(html, /烘焙/)
  assert.match(html, /运动/)
})

test('every project is reachable from the non-hover project index', () => {
  const html = renderToStaticMarkup(React.createElement(App))
  for (const project of projects) {
    assert.match(html, new RegExp(`打开 ${project.title} 案例`))
  }
})
