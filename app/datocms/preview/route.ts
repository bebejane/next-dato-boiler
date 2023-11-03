import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.DATOCMS_PREVIEW_SECRET || !slug)
    return new Response('Invalid token', { status: 401 })

  draftMode().enable()
  cookies().set('__prerender_bypass', cookies().get('__prerender_bypass').value, { maxAge: 5 })
  redirect(slug)
}