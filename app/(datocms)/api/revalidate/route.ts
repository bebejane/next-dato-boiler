import { revalidate } from 'next-dato-utils'

//export const runtime = "edge"
//export const dynamic = "force-dynamic"
//export const fetchCache = "force-no-store";

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity, event_type, entity_type } = payload;
    const { id, attributes: { slug } } = entity
    const paths: string[] = []
    const tags: string[] = [api_key, id].filter(t => t)

    switch (api_key) {
      case 'post':
        paths.push(`/posts/${slug}`)
        paths.push(`/`)
        break;
      case 'menu':
        paths.push(`/`)
        break;
      default:
        break;
    }

    return await revalidate(paths, tags, true)
  })
}