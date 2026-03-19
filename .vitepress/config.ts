import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Synap',
  description: 'Documentation for Synap — personal knowledge graph infrastructure for AI',
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['style', {}, `
      @font-face { font-family: 'Sixtyfour Convergence'; src: url('/fonts/SixtyfourConvergence.ttf') format('truetype'); font-display: swap; }
      @font-palette-values --synap-purple { font-family: "Sixtyfour Convergence"; override-colors: 0 #bc8cff, 1 #9b6dff, 2 #d2b0ff, 3 #bc8cff, 4 #bc8cff, 5 #bc8cff, 6 #bc8cff, 7 #bc8cff; }
      :root, .dark { --vp-c-brand-1: #bc8cff !important; --vp-c-brand-2: #d2b0ff !important; --vp-c-brand-3: #a370ff !important; --vp-c-brand-soft: rgba(188,140,255,0.15) !important; --vp-button-brand-bg: #bc8cff !important; --vp-button-brand-hover-bg: #d2b0ff !important; --vp-button-brand-active-bg: #a370ff !important; --vp-button-brand-text: #0d1117 !important; --vp-button-brand-hover-text: #0d1117 !important; --vp-button-brand-active-text: #0d1117 !important; --vp-button-brand-border: transparent !important; --vp-button-brand-hover-border: transparent !important; }
      .VPButton.brand { background-color: #bc8cff !important; color: #0d1117 !important; border-color: transparent !important; }
      .VPButton.brand:hover { background-color: #d2b0ff !important; }
      .VPHero .name.clip { background: none !important; -webkit-background-clip: unset !important; -webkit-text-fill-color: #bc8cff !important; font-family: 'Sixtyfour Convergence', monospace !important; font-palette: --synap-purple; }
      .VPNavBar .title { font-family: 'Sixtyfour Convergence', monospace !important; color: #bc8cff !important; -webkit-text-fill-color: #bc8cff !important; }
      .VPSidebarItem.is-active > .item .link > .text { color: #bc8cff !important; }
      .VPFeature::before { background: linear-gradient(90deg, transparent, rgba(188,140,255,0.5) 30%, rgba(188,140,255,0.3) 70%, transparent) !important; }
      .VPFeature:hover { border-color: rgba(188,140,255,0.4) !important; }
      .vp-doc a { color: #bc8cff !important; }
      .vp-doc a:hover { color: #d2b0ff !important; }
      ::selection { background-color: rgba(188,140,255,0.3) !important; }
    `],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'synap',
    nav: [
      { text: 'Guide', link: '/guide/quickstart' },
      { text: 'API', link: '/api/overview' },
      { text: 'Concepts', link: '/concepts/knowledge-graph' },
      { text: 'synap.ing', link: 'https://synap.ing' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'What is Synap?', link: '/guide/what-is-synap' },
          { text: 'Quickstart', link: '/guide/quickstart' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'CLI Reference', link: '/guide/cli' },
        ]
      },
      {
        text: 'Products',
        items: [
          { text: 'iOS App', link: '/guide/ios' },
          { text: 'CLI Reference', link: '/guide/cli' },
          { text: 'MCP Server', link: '/guide/mcp' },
        ]
      },
      {
        text: 'AI Tool Setup',
        items: [
          { text: 'Claude Code', link: '/guide/claude-code' },
          { text: 'Claude Desktop', link: '/guide/claude-desktop' },
          { text: 'Cursor', link: '/guide/cursor' },
          { text: 'VS Code', link: '/guide/vscode' },
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Overview', link: '/api/overview' },
          { text: 'REST API', link: '/api/reference' },
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Knowledge Graph', link: '/concepts/knowledge-graph' },
          { text: 'Semantic Search', link: '/concepts/semantic-search' },
          { text: 'Tagging System', link: '/concepts/tagging' },
          { text: 'Privacy Architecture', link: '/concepts/privacy' },
        ]
      },
      {
        text: 'Self-Hosting',
        items: [
          { text: 'Overview', link: '/self-hosting/overview' },
          { text: 'Server Setup', link: '/self-hosting/server' },
          { text: 'Configuration', link: '/self-hosting/config' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ArcLabscc' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Built by <a href="https://synap.ing" style="color:#bc8cff">Arc Labs</a>',
      copyright: 'Copyright 2025-2026 Arc Labs. All rights reserved.'
    },
    editLink: {
      pattern: 'https://github.com/ArcLabscc/synap-docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
