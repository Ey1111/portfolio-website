import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { default: App, ProjectModal } = await server.ssrLoadModule('/src/App.jsx')
const { hobbies, projects } = await server.ssrLoadModule('/src/data.js')

after(async () => {
  await server.close()
})

const expectedAssetCounts = {
  nextmind: 21,
  yoyo: 6,
  vpc: 2,
  antifraud: 15,
  chocolate: 23,
}

test('every project exposes a complete zero-to-one case and every supplied artifact', () => {
  assert.equal(projects.length, 5)

  for (const project of projects) {
    assert.ok(project.caseStudy.background)
    assert.ok(project.caseStudy.goals.length >= 2)
    assert.ok(project.caseStudy.timeline.length >= 4)
    assert.ok(project.caseStudy.decisions.length >= 2)
    assert.ok(project.caseStudy.outcomes.length >= 1)
    assert.ok(project.caseStudy.learnings.length >= 1)
    assert.equal(project.assets.length, expectedAssetCounts[project.id])
  }
})

test('hobbies preserve all supplied works across drawing, baking and sports', () => {
  assert.deepEqual(hobbies.map((group) => group.title), [
    '板绘 / 视觉叙事',
    '烘焙 / 配方与耐心',
    '运动 / 探索与行动',
  ])
  assert.equal(hobbies.flatMap((group) => group.items).length, 13)
})

test('detailed case exposes process and complete archive controls', () => {
  const html = renderToStaticMarkup(React.createElement(ProjectModal, {
    project: projects[0],
    onClose() {},
  }))
  assert.match(html, /从 0 到 1/)
  assert.match(html, /完整项目档案/)
  assert.match(html, /21 份原始材料/)
  assert.match(html, />媒体</)
  assert.match(html, />文档</)
})

test('main page shows the three human interests', () => {
  const html = renderToStaticMarkup(React.createElement(App))
  assert.match(html, /网站之外，我也在认真生活/)
  assert.match(html, /板绘 \/ 视觉叙事/)
  assert.match(html, /烘焙 \/ 配方与耐心/)
  assert.match(html, /运动 \/ 探索与行动/)
})
