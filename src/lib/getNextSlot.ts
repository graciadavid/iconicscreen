import { supabase } from './supabase'

export async function getNextFreeSlot(): Promise<Date> {
  const now = new Date()
  now.setSeconds(0, 0)
  now.setMilliseconds(0)

  const start = new Date(now)
  start.setMinutes(start.getMinutes() + 1)

  const { data } = await supabase
    .from('uploads')
    .select('scheduled_at')
    .eq('status', 'queued')
    .gte('scheduled_at', start.toISOString())
    .order('scheduled_at', { ascending: true })

  if (!data || data.length === 0) return start

  const occupied = new Set(
    data.map(d => {
      const t = new Date(d.scheduled_at)
      t.setSeconds(0, 0)
      return t.getTime()
    })
  )

  let candidate = start.getTime()
  while (occupied.has(candidate)) {
    candidate += 60000
  }

  return new Date(candidate)
}
