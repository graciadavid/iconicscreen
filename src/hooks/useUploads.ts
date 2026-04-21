import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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

  async function rotateCurrent(current: number, uploads: {id:string,url:string}[]) {
    if (uploads.length === 0) return
    const done = uploads[current]
    await supabase
      .from('uploads')
      .update({status:'published', published_at: new Date().toISOString()})
      .eq('id', done.id)
    await fetchUploads()
    setCurrent(0)
  }

  useEffect(() => {
    fetchUploads()
  }, [])

  useEffect(() => {
    if (uploads.length === 0) return

    // Espera al segundo :00 del próximo minuto
    const now = new Date()
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    const timeout = setTimeout(() => {
      rotateCurrent(current, uploads)

      // A partir de aquí cada 60 segundos exactos
      const interval = setInterval(() => {
        rotateCurrent(current, uploads)
      }, 60000)

      return () => clearInterval(interval)
    }, msToNextMinute)

    return () => clearTimeout(timeout)
  }, [uploads])

  return { uploads, current }
}
