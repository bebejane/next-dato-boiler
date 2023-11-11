
import revalidate from '@lib/next-dato-utils/route-handlers/revalidate';

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity, event_type } = payload;
    const { id, attributes: { slug } } = entity
    const paths: string[] = []
    const tags: string[] = [id]

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
    tags.push(api_key)
    return revalidate([], tags)
  })
}