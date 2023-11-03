import backup from '@lib/dato-nextjs-utils/route-handlers/backup';

export async function GET(req: Request) {
  return await backup(req)
}