import type { ChapterId } from '../hooks/useChapterPulse'

type ChapterWipeProps = {
  pulse: ChapterId | null
}

/** Brief full-sky color flood when a story chapter takes focus. */
export function ChapterWipe({ pulse }: ChapterWipeProps) {
  if (!pulse) return null
  return <div className={`chapter-wipe chapter-wipe--${pulse}`} aria-hidden="true" />
}
