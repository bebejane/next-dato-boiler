import type { DatoCmsConfig } from './datocms-config/index'

export default {
  name: 'Nextjs Boiler',
  description: 'A boilerplate for Nextjs and DatoCMS',
  theme: {
    color: '#f6f3ee',
    background: '#ffffff'
  },
  url: {
    dev: 'http://localhost:3000',
    public: 'https://next-dato-boiler.vercel.app',
  },
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
  },
  routes: {
    'start': async (record, locale) => {
      return ['/']
    },
  },
  sitemap: async () => {
    return [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
} satisfies DatoCmsConfig