'use client'

import { useEffect } from "react"

export default function BackgroundColor({ color }) {

  useEffect(() => {
    document.body.style.backgroundColor = color
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [color])

  return null

}