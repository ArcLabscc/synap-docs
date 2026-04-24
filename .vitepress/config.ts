import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Synap',
  description: 'Access restricted — authorized access available on request.',
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['style', {}, `
      @font-face { font-family: 'Sixtyfour Convergence'; src: url('/fonts/SixtyfourConvergence.ttf') format('truetype'); font-display: swap; }
      @font-palette-values --synap-purple { font-family: "Sixtyfour Convergence"; override-colors: 0 #bc8cff, 1 #9b6dff, 2 #d2b0ff, 3 #bc8cff, 4 #bc8cff, 5 #bc8cff, 6 #bc8cff, 7 #bc8cff; }
      :root, .dark { --vp-c-brand-1: #bc8cff !important; --vp-c-brand-2: #d2b0ff !important; --vp-c-brand-3: #a370ff !important; --vp-c-brand-soft: rgba(188,140,255,0.15) !important; --vp-button-brand-bg: #bc8cff !important; --vp-button-brand-hover-bg: #d2b0ff !important; --vp-button-brand-active-bg: #a370ff !important; --vp-button-brand-text: #0d1117 !important; --vp-button-brand-hover-text: #0d1117 !important; --vp-button-brand-active-text: #0d1117 !important; --vp-button-brand-border: transparent !important; --vp-button-brand-hover-border: transparent !important; }
      .VPButton.brand { background-color: #bc8cff !important; color: #0d1117 !important; border-color: transparent !important; }
      .VPButton.brand:hover { background-color: #d2b0ff !important; }
      .VPHero .name.clip { background: none !important; -webkit-background-clip: unset !important; -webkit-text-fill-color: #bc8cff !important; font-family: 'Sixtyfour Convergence', monospace !important; font-palette: --synap-purple; }
      .VPNavBar .title { font-family: 'Sixtyfour Convergence', monospace !important; color: #bc8cff !important; -webkit-text-fill-color: #bc8cff !important; }
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
      { text: 'synap.ing', link: 'https://synap.ing' },
    ],
    sidebar: [],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Patent-pending. Architecture details available under NDA.',
      copyright: 'Copyright 2025-2026 Arc Labs. All rights reserved.'
    }
  }
})
