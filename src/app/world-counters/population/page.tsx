import Counter from "./Counter"

// Re-render on the server every 60s so crawlers read near-current values.
export const revalidate = 60

export default function Page() {
  return <Counter initialNow={Date.now()} />
}
