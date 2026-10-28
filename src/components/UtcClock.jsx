import { useEffect, useState } from 'react'

const pad = (value) => String(value).padStart(2, '0')

/** Часы в UTC: клуб живёт по эфирному времени, а не по местному. */
export default function UtcClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span>
      UTC {pad(now.getUTCHours())}:{pad(now.getUTCMinutes())}:{pad(now.getUTCSeconds())}
    </span>
  )
}
