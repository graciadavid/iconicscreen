import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getNextFreeSlot } from '@/lib/getNextSlot'

export function useUploads() {
  const [current, setCurrent] = useState<{id:string,url:string}|null>(null)

  async function rescheduleExpired() {
    const now = new Date()
    now.setSeconds(0,0)
    now.setMilliseconds(0)

    const { data: expired } = await supabase
      .from('uploads')
      .select('id')
      .eq('status','queued')
      .lt('scheduled_at', now.toISOString())

    if (!expired || expired.length === 0) return

    for (const item of expired) {
      const nextSlot = await getNextFreeSlot()
      await supabase
        .from('uploads')
        .update({ scheduled_at: nextSlot.toISOString() })
        .eq('id', item.id)
    }
  }

  async function fetchCurrent() {
    const now = new Date()
    const minuteStart = new Date(now)
    minuteStart.setSeconds(0,0)
    minuteStart.setMilliseconds(0)
    const minuteEnd = new Date(minuteStart)
    minuteEnd.setMinutes(minuteEnd.getMinutes() + 1)

    const { data } = await supabase
      .from('uploads')
      .select('id,url')
      .eq('status','queued')
      .gte('scheduled_at', minuteStart.toISOString())
      .lt('scheduled_at', minuteEnd.toISOString())
      .limit(1)
      .single()

    setCurrent(data || null)
  }

  async function tick() {
    await rescheduleExpired()
    await fetchCurrent()
  }

  useEffect(() => {
    tick()
    const now = new Date()
    const msToNext = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    const timeout = setTimeout(() => {
      tick()
      const interval = setInterval(tick, 60000)
      return () => clearInterval(interval)
    }, msToNext)
    return () => clearTimeout(timeout)
  }, [])

  return { current }
}
