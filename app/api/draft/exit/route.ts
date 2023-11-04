import { disableDraftMode } from './action'

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  disableDraftMode(searchParams.get('pathname'))
}