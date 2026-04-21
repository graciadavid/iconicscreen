'use client'
import { useState, useEffect } from 'react'

export function NYClock() {
  const [clock, setClock] = useState({date:'', time:'', ampm:''})

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ny = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(now)

      const time = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now)

      const [hms, ampm] = time.split(' ')
      setClock({date: ny, time: hms, ampm})
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:'6px'}}>
        <div style={{fontSize:'clamp(22px,2.5vw,36px)',fontWeight:900,color:'#ffffff',letterSpacing:'3px',fontVariantNumeric:'tabular-nums'}}>
          {clock.time}
        </div>
        <div style={{fontSize:'clamp(10px,1vw,14px)',fontWeight:900,color:'#C9A84C',letterSpacing:'2px'}}>
          {clock.ampm}
        </div>
      </div>
      <div style={{fontSize:'clamp(9px,0.9vw,11px)',color:'rgba(255,255,255,0.5)',letterSpacing:'2px'}}>
        {clock.date}
      </div>
      <div style={{fontSize:'9px',color:'#C9A84C',letterSpacing:'3px',marginTop:'2px'}}>
        NEW YORK TIME
      </div>
    </div>
  )
}
