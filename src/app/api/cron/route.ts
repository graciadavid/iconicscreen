import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getNextFreeSlot(): Promise<Date> {
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

export async function GET() {
  try {
    const now = new Date()
    now.setSeconds(0, 0)
    now.setMilliseconds(0)

    const { data: expired } = await supabase
      .from('uploads')
      .select('id')
      .eq('status', 'queued')
      .lt('scheduled_at', now.toISOString())

    if (!expired || expired.length === 0) {
      return NextResponse.json({ rescheduled: 0 })
    }

    for (const item of expired) {
      const nextSlot = await getNextFreeSlot()
      await supabase
        .from('uploads')
        .update({ scheduled_at: nextSlot.toISOString() })
        .eq('id', item.id)
    }

    return NextResponse.json({ rescheduled: expired.length })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
