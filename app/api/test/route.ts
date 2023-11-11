import test from '@lib/next-dato-utils/route-handlers/test'
import cors from '@lib/next-dato-utils/route-handlers/cors'

export const runtime = "edge"

export async function GET(req: Request) {
  return await test(req)
}

export async function OPTIONS(req: Request) {

  return await cors(req, new Response('ok', { status: 200 }), {
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
}