import { getDatoCmsConfig } from 'next-dato-utils/config'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getDatoCmsConfig()
  const sitemap = await config.sitemap()
  return sitemap
}
