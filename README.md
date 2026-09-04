# 次央拉姆｜个人简历作品集

面向 AI 产品管理、AI 项目管理与 AIGC 内容岗位的响应式作品集网站。使用 React + Vite 构建，包含 5 个完整的 0→1 项目案例、67 份项目档案、13 份个人爱好作品、原彩图片与完整视频、档案筛选/下载、灯箱预览和移动端布局。

## 本地运行

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 测试

```bash
pnpm test
```

如需从本地原始压缩包重新生成网页素材，可运行 `scripts/process-assets.py`。脚本会保留文档原件，并把图片与视频转为适合网页加载的全彩版本。

`dist/` 可直接部署到 Vercel。Vercel Framework Preset 选择 Vite，Build Command 使用 `pnpm build`，Output Directory 使用 `dist`。
