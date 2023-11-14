'use client'

export default function BackgroundColor({ color }) {

  return (
    <style global jsx>{`
      :root {
        --background: ${color ?? 'var(--white)'};
      }
  `}
    </style>
  )

}