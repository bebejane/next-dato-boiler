import { NextRequest } from 'next/server';
import webPreviews from '/lib/dato-nextjs-utils/route-handlers/web-previews'
import cors from '/lib/dato-nextjs-utils/route-handlers/cors'

export const runtime = "edge"

export async function POST(req: NextRequest) {

  return await webPreviews(req, async ({ item, itemType, locale }) => {

    let path = null;

    const { slug } = item.attributes

    switch (itemType.attributes.api_key) {
      case 'start':
        path = `/`
        break;
      case 'post':
        path = `/posts/${slug}`
        break;
      case 'user':
        path = `/users/${slug}`
        break;
      default:
        break;
    }

    return path
  })
}

export async function OPTIONS(req: Request) {
  console.log('OPTIONS', req.url)
  return await cors(req, new Response('ok', { status: 200 }), {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
}