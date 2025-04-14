import { getDatoCmsConfig } from '@datocms-config'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await getDatoCmsConfig())?.sitemap?.() ?? []
}