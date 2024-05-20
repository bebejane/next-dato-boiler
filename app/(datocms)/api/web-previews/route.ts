import { NextRequest } from 'next/server';
import { webPreviews, cors } from 'next-dato-utils/route-handlers';

export const runtime = "edge"

export async function POST(req: NextRequest) {

  return await webPreviews(req, async ({ item, itemType, locale }) => {

    let path = null;

    const { slug } = item.attributes

    switch (itemType.attributes.api_key) {
      default:
        break;
    }

    return path
  })
}

export async function OPTIONS(req: Request) {
  return await cors(req, new Response('ok', { status: 200 }), {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
}