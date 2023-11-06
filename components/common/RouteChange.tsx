'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RouteChange() {

  const pathname = usePathname()

  useEffect(() => {
    console.log('current path', pathname)
  }, [pathname])

  return null
}