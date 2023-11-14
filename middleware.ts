import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  let currency = request.cookies.get('currency')?.value ?? 'SEK'
  request.cookies.set('currency', currency)
  return NextResponse.next()
}

export const config = {
  matcher: '/products/:path*',
}