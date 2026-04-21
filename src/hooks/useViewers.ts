import { useState, useEffect } from 'react'
import { VIEWERS_START } from '@/lib/constants'

export function useViewers() {
  const [viewers, setViewers] = useState(VIEWERS_START)

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => {
        const rand = Math.random()
        let delta
        if (rand < 0.5) delta = Math.floor(Math.random() * 5) + 1
        else if (rand < 0.8) delta = -(Math.floor(Math.random() * 3) + 1)
        else delta = Math.floor(Math.random() * 8) + 3
        return v + delta
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return viewers
}
