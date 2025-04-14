//import fs from 'fs'
//import path from 'path'
import { MetadataRoute } from '@node_modules/next';
import { backup, revalidate, test, webPreviews, draft } from './route-handlers';

export type DatoCmsConfig = {
  name: string
  description: string
  theme: {
    color: string
    background: string
  }
  url: {
    dev: string
    public: string
  }
  i18n?: {
    locales: string[]
    defaultLocale: string
  }
  routes: {
    [api_key: string]: (record: any, locale?: string) => Promise<string[] | null>
  },
  sitemap?: () => Promise<MetadataRoute.Sitemap>
}

export const getDatoCmsConfig = async (): Promise<DatoCmsConfig> => {
  /*
  const configFile = ['datocms.config.ts', 'datocms.config.js'].find(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      return true
    }
    return false
  })
*/
  //if (!configFile) throw new Error('No datocms.config.ts or datocms.config.js file found')
  const config = (await import(`../datocms.config`)).default;
  return config

}

export const getRoute = async (record: any, locale?: string): Promise<string[] | null> => {
  const config = await getDatoCmsConfig()
  if (!config?.routes?.[record?.api_key]) throw new Error(`No route found for ${record.api_key}`)
  return config.routes[record.api_key](record, locale)
}

export const datoCmsApiRoutes = async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
  const config = await getDatoCmsConfig()
  const { slug } = await params
  let handler = null;

  switch (slug) {
    case 'revalidate':
      handler = () => revalidate(req, async (payload, revalidate) => {
        const { api_key, entity } = payload;
        const { id, attributes } = entity
        const paths: string[] = await config.routes?.[api_key]?.(attributes) ?? []
        const tags: string[] = [api_key, id].filter(t => t)
        return await revalidate(paths, tags, true)
      })
      break;
    case 'web-previews':
      handler = () => webPreviews(req, async ({ item, itemType, locale }) => {
        const { slug } = item.attributes
        const path = await config.routes[itemType.attributes.api_key](item)
        return path?.[0] ?? null
      })
      break;
    case 'backup':
      handler = () => backup(req)
      break;
    case 'test':
      handler = () => test(req)
      break;
    case 'draft':
      handler = () => draft(req)
      break;
  }
  if (!handler) throw new Error(`No handler found for ${slug}`)
  return handler()
}


