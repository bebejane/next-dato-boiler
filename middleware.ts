import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let currency = request.cookies.get('currency')?.value ?? 'SEK'
  request.cookies.set('currency', currency)
  console.log(currency)
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/products/:path*',
}