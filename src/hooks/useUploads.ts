import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useUploads() {
  const [current, setCurrent] = useState<{id:string,url:string}|null>(null)

  async function fetchCurrent() {
    const now = new Date()
    const minuteStart = new Date(now)
    minuteStart.setSeconds(0, 0)
    const minuteEnd = new Date(minuteStart)
    minuteEnd.setMinutes(minuteEnd.getMinutes() + 1)

    const { data } = await supabase
      .from('uploads')
      .select('id,url')
      .eq('status', 'queued')
      .gte('scheduled_at', minuteStart.toISOString())
      .lt('scheduled_at', minuteEnd.toISOString())
      .limit(1)
      .single()

    if (data) setCurrent(data)
    else setCurrent(null)
  }

  async function rotateExpired() {
    const now = new Date()
    const minuteStart = new Date(now)
    minuteStart.setSeconds(0, 0)

    const { data: expired } = await supabase
      .from('uploads')
      .select('id')
      .eq('status', 'queued')
      .lt('scheduled_at', minuteStart.toISOString())

    if (!expired || expired.length === 0) return

    const { data: last } = await supabase
      .from('uploads')
      .select('scheduled_at')
      .eq('status', 'queued')
      .order('scheduled_at', {ascending: false})
      .limit(1)
      .single()

    const lastSlot = last?.scheduled_at ? new Date(last.scheduled_at) : new Date()

    for (let i = 0; i < expired.length; i++) {
      const newSlot = new Date(lastSlot)
      newSlot.setMinutes(newSlot.getMinutes() + i + 1)
      await supabase
        .from('uploads')
        .update({scheduled_at: newSlot.toISOString(), queue_position: null})
        .eq('id', expired[i].id)
    }

    await fetchCurrent()
  }

  useEffect(() => {
    rotateExpired()
    fetchCurrent()

    const now = new Date()
    const msToNext = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    const timeout = setTimeout(() => {
      rotateExpired()
      fetchCurrent()
      const interval = setInterval(() => {
        rotateExpired()
        fetchCurrent()
      }, 60000)
      return () => clearInterval(interval)
    }, msToNext)

    return () => clearTimeout(timeout)
  }, [])

  return { current }
}
