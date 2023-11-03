
import revalidate from '@lib/dato-nextjs-utils/route-handlers/revalidate';

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (record, revalidate) => {

    const { api_key } = record.model;
    const { slug } = record
    const paths: string[] = []

    switch (api_key) {
      case 'post':
        paths.push(`/posts/${slug}`)
        paths.push(`/`)
        break;
      default:
        break;
    }
    return revalidate(paths)
  })
}