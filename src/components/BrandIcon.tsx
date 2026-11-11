import type { CSSProperties } from 'react'

type BrandIconProps = {
  className?: string
  title?: string
  style?: CSSProperties
}

/** Logo icon: eight-point star with two satellite dots. */
export function BrandIcon({ className, title, style }: BrandIconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="-18 -18 36 36"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <path d="M0-13 1.7-1.7 13 0 1.7 1.7 0 13-1.7 1.7-13 0-1.7-1.7Z" />
      <path transform="rotate(45)" d="M0-8 1.2-1.2 8 0 1.2 1.2 0 8-1.2 1.2-8 0-1.2-1.2Z" />
      <circle cx="10" cy="-10" r="1.7" />
      <circle cx="-11" cy="9" r="1.15" />
    </svg>
  )
}
