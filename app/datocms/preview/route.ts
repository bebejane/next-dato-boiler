import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.DATOCMS_PREVIEW_SECRET || !slug)
    return new Response('Invalid token', { status: 401 })

  draftMode().enable()

  setTimeout(() => {
    draftMode().disable()
    console.log('disable draft mode')
  }, 5000)

  redirect(slug)
}