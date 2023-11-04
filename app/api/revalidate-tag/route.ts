
import revalidateTagHandler from '@lib/dato-nextjs-utils/route-handlers/revalidate-tag';

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return await revalidateTagHandler(req)
}