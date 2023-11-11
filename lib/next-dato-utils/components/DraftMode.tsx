'use client'

import s from './DraftMode.module.scss'
import { usePathname } from 'next/navigation'
import { disableDraftMode } from '@app/api/draft/exit/action'
import { revalidateTag, revalidatePath } from '../actions/revalidate'
import { useEffect, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'

export type DraftModeProps = {
  draftMode: boolean
  draftUrl?: string,
  tag?: string
  path?: string
}

export default function DraftMode({ draftMode, draftUrl, tag, path }: DraftModeProps) {

  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  const disable = async () => {
    console.log('disable draft mode')
    setLoading(true)
    await disableDraftMode(pathname)
    setLoading(false)
  }

  useEffect(() => {

    if (!draftUrl) return

    let updates = 0;
    const eventSource = new EventSource(draftUrl)
    eventSource.addEventListener("open", () => {
      console.log("connected to channel!");
    });
    eventSource.addEventListener("update", async (event) => {
      if (++updates <= 1) return

      setLoading(true)
      if (tag)
        await revalidateTag(tag)
      if (path)
        await revalidatePath(path)
      setLoading(false)

    });
    return () => {
      eventSource.close()
    }

  }, [draftUrl, tag, path])

  if (!draftMode) return null

  return (

    <button className={s.draftMode} onClick={disable}>
      <label>
        Exit draft
        {loading && <div className={s.loading}><ImSpinner8 /></div>}
      </label>
      <img width="20" height="20" />
    </button>
  )
}