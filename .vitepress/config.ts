import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Synap',
  description: 'Documentation for Synap — personal knowledge graph infrastructure for AI',
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
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
        text: 'AI Tool Integration',
        items: [
          { text: 'Claude Code', link: '/guide/claude-code' },
          { text: 'Claude Desktop', link: '/guide/claude-desktop' },
          { text: 'Cursor', link: '/guide/cursor' },
          { text: 'VS Code', link: '/guide/vscode' },
          { text: 'Synap iOS App', link: '/guide/ios-app' },
        ]
      },
      {
        text: 'MCP Tools',
        items: [
          { text: 'Overview', link: '/api/overview' },
          { text: 'Search & Recall', link: '/api/search' },
          { text: 'Capture & Manage', link: '/api/capture' },
          { text: 'Graph Traversal', link: '/api/graph' },
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
