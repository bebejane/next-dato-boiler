import { revalidatePath } from "next/cache";

export default async function revalidate(req: Request, callback: (record: any, revalidate: (paths: string[]) => Promise<Response>) => Promise<Response>) {

  if (!basicAuth(req))
    return new Response('unauthorized', { status: 401 })

  const payload = await req.json() as { entity: any, related_entities: any[], event_type: string };

  if (!payload || !payload?.entity)
    return new Response('Payload empty or missing entity', { status: 400 })

  const { entity, related_entities, event_type } = payload
  const model = related_entities.find(({ id }) => id === entity.relationships?.item_type?.data?.id)

  if (!model)
    return new Response('Model not found in payload', { status: 400 })

  const record = { ...entity.attributes, model: model.attributes }
  const delay = Date.now() - Math.max(new Date(entity.meta.updated_at).getTime(), new Date(entity.meta.published_at).getTime(), new Date(entity.meta.created_at).getTime())
  const now = Date.now()

  return await callback(record, async (paths) => {
    try {
      if (!paths)
        return new Response('Nothing to revalidate. Paths empty', { status: 400 })

      if (paths.length === 0)
        return new Response(JSON.stringify({ revalidated: false, paths, delay, now, event_type }), { status: 200, headers: { 'content-type': 'application/json' } })

      paths.forEach(p => revalidatePath(p))

      console.log(`revalidate${delay && !['unpublish', 'delete'].includes(event_type) ? ` (${delay}ms)` : ''} ${event_type}`, paths)

      return new Response(JSON.stringify({ revalidated: true, paths, now, delay, event_type }), { status: 200, headers: { 'content-type': 'application/json' } })
    } catch (err) {
      console.log('Error revalidating', paths)
      console.error(err)
      return new Response(JSON.stringify({ revalidated: false, paths, err, now, delay, event_type }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
  })

}


export const basicAuth = (req: Request) => {

  if (!process.env.BASIC_AUTH_USER || !process.env.BASIC_AUTH_PASSWORD)
    throw new Error('BASIC_AUTH_USER or BASIC_AUTH_PASSWORD not set in .env')

  const basicAuth = req.headers.get('authorization')

  if (!basicAuth)
    return true;

  const auth = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  return user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD
}