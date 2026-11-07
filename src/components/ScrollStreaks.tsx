import type { Streak } from '../hooks/useScrollStreaks'

type ScrollStreaksProps = {
  streaks: Streak[]
}

export function ScrollStreaks({ streaks }: ScrollStreaksProps) {
  if (!streaks.length) return null
  return (
    <div className="scroll-streaks" aria-hidden="true">
      {streaks.map((streak) => (
        <span
          key={streak.id}
          className={`scroll-streak scroll-streak--${streak.tone}`}
          style={{
            top: `${streak.top}%`,
            left: `${streak.left}%`,
            width: streak.length,
            transform: `rotate(${streak.angle}deg)`,
          }}
        />
      ))}
    </div>
  )
}
