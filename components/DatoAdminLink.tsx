export default function DatoAdminLink() {

  if (!process.env.NEXT_PUBLIC_DATOCMS_ADMIN_URL || process.env.NODE_ENV === 'production') return null

  return (
    <a
      href={process.env.NEXT_PUBLIC_DATOCMS_ADMIN_URL}
      target="_blank"
      rel="noreferrer"
      style={{
        position: 'fixed',
        cursor: 'pointer',
        top: 0,
        right: 0,
        margin: '2px',
      }}
    >
      <img width="40" src="https://www.datocms.com/images/brand-assets/main-icon.svg" alt="DatoCMS" />
    </a>
  )

}