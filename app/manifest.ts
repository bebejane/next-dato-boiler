import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Humaneight',
    short_name: 'Humaneight',
    description: 'Humaneight',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f6f3ee',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}