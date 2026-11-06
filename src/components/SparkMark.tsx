import type { CSSProperties } from 'react'

type SparkMarkProps = {
  className?: string
  title?: string
  style?: CSSProperties
}

/** 8-point spark used as brand motif */
export function SparkMark({ className, title, style }: SparkMarkProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <path d="M32 2.5 36.8 24.2 58.5 32 36.8 39.8 32 61.5 27.2 39.8 5.5 32 27.2 24.2 32 2.5Z" />
      <path
        d="M32 14.5 34.6 27.4 47.5 32 34.6 36.6 32 49.5 29.4 36.6 16.5 32 29.4 27.4 32 14.5Z"
        opacity="0.55"
      />
    </svg>
  )
}
