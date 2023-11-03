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
  console.log(cookies().get('__prerender_bypass').value)
  const bypassCookie = cookies().get('__prerender_bypass');
  console.log(bypassCookie)
  console.log(cookies().getAll())

  cookies().set(bypassCookie.name, bypassCookie.value, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: 3
  })
  redirect(slug)
}