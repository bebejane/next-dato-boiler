import backup from '@lib/next-dato-utils/route-handlers/backup';

export const runtime = "edge"

export async function GET(req: Request) {
  return await backup(req)
}