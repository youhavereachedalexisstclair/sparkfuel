export type WorkPiece = {
  id: string
  title: string
  meta: string
  src: string
  poster: string
  /** CSS aspect-ratio for the recorded frame. */
  aspect: string
}

export const workPieces: WorkPiece[] = [
  {
    id: 'nova-talent',
    title: 'Nova Talent',
    meta: 'Preview',
    src: '/work/nova-talent.mp4',
    poster: '/work/nova-talent.jpg',
    aspect: '3024 / 1496',
  },
  {
    id: 'saint-thomas',
    title: 'Saint Thomas the Apostle',
    meta: 'Preview',
    src: '/work/saint-thomas.mp4',
    poster: '/work/saint-thomas.jpg',
    aspect: '3024 / 1496',
  },
  {
    id: 'black-sheep',
    title: 'Black Sheep',
    meta: 'Preview',
    src: '/work/black-sheep.mp4',
    poster: '/work/black-sheep.jpg',
    aspect: '3024 / 1496',
  },
]
