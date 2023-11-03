'use client'

import s from './DatoAdminLink.module.scss'
import { usePathname } from 'next/navigation'

export default function DatoAdminLink({ previewMode }) {

  const pathname = usePathname()

  if ((!process.env.NEXT_PUBLIC_DATOCMS_ADMIN_URL || process.env.NODE_ENV === 'production') && !previewMode)
    return null

  return (
    <div className={s.container}>
      {previewMode &&
        <a className={s.previewMode} href={`/datocms/preview/exit?redirect=${pathname}`}>Exit preview</a>
      }
      <a href={process.env.NEXT_PUBLIC_DATOCMS_ADMIN_URL} target="_blank" rel="noreferrer">
        <img width="40" src="https://www.datocms.com/images/brand-assets/main-icon.svg" alt="DatoCMS" />
      </a>
    </div>
  )

}