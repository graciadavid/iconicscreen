import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ROTATION_MS } from '@/lib/constants'

export function useUploads() {
  const [uploads, setUploads] = useState<{id:string,url:string}[]>([])
  const [current, setCurrent] = useState(0)

  async function fetchUploads() {
    const { data } = await supabase
      .from('uploads')
      .select('id,url')
      .eq('status', 'active')
      .order('slot_order', {ascending: true, nullsFirst: false})
      .order('created_at', {ascending: true})
      .limit(10)
    if (data) setUploads(data)
  }

  useEffect(() => {
    fetchUploads()
  }, [])

  useEffect(() => {
    if (uploads.length === 0) return
    const t = setInterval(async () => {
      const done = uploads[current]
      await supabase
        .from('uploads')
        .update({status:'published', published_at: new Date().toISOString()})
        .eq('id', done.id)
      await fetchUploads()
      setCurrent(0)
    }, ROTATION_MS)
    return () => clearInterval(t)
  }, [uploads, current])

  return { uploads, current }
}
