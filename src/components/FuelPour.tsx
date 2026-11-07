type FuelPourProps = {
  layer: 'behind' | 'front'
}

/** Lime energy streams — pass layer so App can sandwich the portrait between them. */
export function FuelPour({ layer }: FuelPourProps) {
  if (layer === 'behind') {
    return (
      <div className="fuel-pour fuel-pour--behind" aria-hidden="true">
        <span className="fuel-stream fuel-stream--b" />
        <span className="fuel-stream fuel-stream--d" />
        <span className="fuel-drip fuel-drip--b" />
      </div>
    )
  }

  return (
    <div className="fuel-pour fuel-pour--front" aria-hidden="true">
      <span className="fuel-stream fuel-stream--a" />
      <span className="fuel-stream fuel-stream--c" />
      <span className="fuel-drip fuel-drip--a" />
      <span className="fuel-drip fuel-drip--c" />
    </div>
  )
}
