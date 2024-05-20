import { revalidate } from 'next-dato-utils/route-handlers';

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity, event_type, entity_type } = payload;
    const { id, attributes: { slug } } = entity
    const paths: string[] = []
    const tags: string[] = [api_key, id].filter(t => t)

    switch (api_key) {

    }

    return await revalidate(paths, tags, true)
  })
}