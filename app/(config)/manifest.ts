import { getDatoCmsConfig } from 'next-dato-utils/config'
import { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await getDatoCmsConfig()
  return {
    name: config.name,
    short_name: config.name,
    description: config.description,
    start_url: '/',
    display: 'standalone',
    background_color: config.theme.background,
    theme_color: config.theme.color,
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}