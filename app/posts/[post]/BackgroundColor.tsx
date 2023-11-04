'use client'

import { useEffect, useRef } from "react"

export default function BackgroundColor({ color }) {

  const originalColor = useRef<string | null>(null)

  useEffect(() => {
    if (!originalColor.current)
      originalColor.current = document.body.style.backgroundColor

    document.body.style.backgroundColor = color

    return () => {
      document.body.style.backgroundColor = originalColor.current
    }
  }, [color])

  return null

}