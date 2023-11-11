import { revalidateTag } from "next/cache";

export default async function revalidateTagHandler(req: Request): Promise<Response> {

  if (!basicAuth(req))
    return new Response('unauthorized', { status: 401 })

  const payload = await req.json();

  if (!payload || !payload?.entity)
    return new Response('Payload empty or missing entity', { status: 400 })

  const { entity, event_type } = payload
  const { id } = entity
  const delay = Date.now() - Math.max(new Date(entity.meta.updated_at).getTime(), new Date(entity.meta.published_at).getTime(), new Date(entity.meta.created_at).getTime())
  const now = Date.now()

  revalidateTag(id)
  console.log(`Revalidated tag (${event_type}): "${id}"`)
  return new Response(JSON.stringify({ revalidated: true, id, now, delay, event_type }), { status: 200, headers: { 'content-type': 'application/json' } })

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