import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useUploads() {
  const [uploads, setUploads] = useState<{id:string,url:string}[]>([])
  const [current, setCurrent] = useState(0)

  async function fetchUploads() {
    const { data } = await supabase
      .from('uploads')
      .select('id,url,queue_position')
      .eq('status', 'active')
      .order('queue_position', {ascending: true, nullsFirst: false})
      .limit(10)
    if (data) setUploads(data)
  }

  async function rotate() {
    const { data } = await supabase
      .from('uploads')
      .select('id,queue_position')
      .eq('status', 'active')
      .order('queue_position', {ascending: true, nullsFirst: false})
      .limit(1)

    if (!data || data.length === 0) return

    const first = data[0]

    const { data: max } = await supabase
      .from('uploads')
      .select('queue_position')
      .eq('status', 'active')
      .order('queue_position', {ascending: false})
      .limit(1)

    const maxPos = max?.[0]?.queue_position || 0

    await supabase
      .from('uploads')
      .update({queue_position: maxPos + 1})
      .eq('id', first.id)

    await fetchUploads()
    setCurrent(0)
  }

  useEffect(() => {
    fetchUploads()
  }, [])

  useEffect(() => {
    if (uploads.length === 0) return

    const now = new Date()
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    const timeout = setTimeout(() => {
      rotate()
      const interval = setInterval(rotate, 60000)
      return () => clearInterval(interval)
    }, msToNextMinute)

    return () => clearTimeout(timeout)
  }, [uploads])

  return { uploads, current }
}
