import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  draftMode().disable()
  const { searchParams } = new URL(request.url)
  redirect(searchParams.get('redirect') ?? `/`)
}