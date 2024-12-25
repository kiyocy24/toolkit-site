import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Toolkit</span>,
  project: {
    link: 'https://github.com/kiyocy24/toolkit-site',
  },
  docsRepositoryBase: 'https://github.com/kiyocy24/toolkit-site',
  footer: {
    component: 'kiyocy24\'s toolkit',
  },
  i18n: [
    { locale: 'ja', name: '日本語' },
  ],
}

export default config
