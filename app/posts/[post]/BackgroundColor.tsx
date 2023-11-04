'use client'

import { useEffect } from "react"
import { apiQuery } from "@lib/client"
import { PostDocument } from "@graphql"
import { useParams } from "next/navigation"

export default function BackgroundColor({ color }) {

  useEffect(() => {

    document.body.style.backgroundColor = color

    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [color])

  return null

}