'use client'

import s from './DraftMode.module.scss'
import { usePathname } from 'next/navigation'
import { disableDraftMode } from '@app/api/draft/exit/action'
import revalidateTag from '@lib/actions/revalidate-tag'
import { useEffect } from 'react'

export type DraftModeProps = {
  draftMode: boolean
  listenUrl?: string,
  tag: string
}

export default function DraftMode({ draftMode, listenUrl, tag }: DraftModeProps) {

  const pathname = usePathname()

  const disable = async () => {
    console.log('disable draft mode')
    disableDraftMode(pathname)
  }

  useEffect(() => {

    if (!listenUrl) return

    let updates = 0;
    const eventSource = new EventSource(listenUrl)
    eventSource.addEventListener("open", () => {
      console.log("connected to channel!");
    });
    eventSource.addEventListener("update", (event) => {
      if (++updates > 1)
        revalidateTag(tag)
    });
    return () => {
      eventSource.close()
    }

  }, [listenUrl, tag])

  if (!draftMode) return null

  return (

    <button className={s.draftMode} onClick={disable}>
      <div>Exit preview</div>
      <img width="20" height="20" />
    </button>
  )
}