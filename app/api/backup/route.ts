import { backup } from 'next-dato-utils';

export const runtime = "edge"

export async function GET(req: Request) {
  return await backup(req)
}