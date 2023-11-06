import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const maxAge = searchParams.get('max-age')

  if (secret !== process.env.DATOCMS_PREVIEW_SECRET || !slug)
    return new Response('Invalid token', { status: 401 })

  draftMode().enable()

  if (maxAge) {
    const bypassCookie = cookies().get('__prerender_bypass');
    cookies().set(bypassCookie.name, bypassCookie.value, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge: parseInt(maxAge)
    })
  }

  redirect(slug)
}