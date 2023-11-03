import backup from '@lib/dato-nextjs-utils/route-handlers/backup';

export const runtime = "edge"

export async function GET(req: Request) {
  return await backup(req)
}