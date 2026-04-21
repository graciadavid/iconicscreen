'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_PASSWORD } from '@/lib/constants'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState('')
  const [uploads, setUploads] = useState<any[]>([])
  const [clock, setClock] = useState('')
  const [nowSlot, setNowSlot] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleString('en-US',{timeZone:'America/New_York',weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}))
      const ms = new Date(now)
      ms.setSeconds(0,0)
      setNowSlot(ms.toISOString())
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (auth) {
      fetchAll()
      const t = setInterval(fetchAll, 15000)
      return () => clearInterval(t)
    }
  }, [auth])

  async function fetchAll() {
    const { data } = await supabase
      .from('uploads')
      .select('*')
      .eq('status','queued')
      .order('scheduled_at', {ascending:true})
    if (data) setUploads(data)
  }

  async function deleteUpload(id: string, url: string) {
    const filename = url.split('/').pop()
    if (filename) await supabase.storage.from('uploads').remove([filename])
    await supabase.from('uploads').delete().eq('id', id)
    fetchAll()
  }

  async function moveToNow(id: string) {
    const now = new Date()
    now.setSeconds(0,0)
    await supabase.from('uploads').update({scheduled_at: now.toISOString()}).eq('id', id)
    fetchAll()
  }

  function formatNY(dt: string) {
    return new Date(dt).toLocaleString('en-US',{
      timeZone:'America/New_York',
      month:'short',day:'numeric',
      hour:'2-digit',minute:'2-digit',hour12:true
    })
  }

  function isNow(scheduled: string) {
    const s = new Date(scheduled)
    const n = new Date(nowSlot)
    return s >= n && s < new Date(n.getTime() + 60000)
  }

  function isPast(scheduled: string) {
    return new Date(scheduled) < new Date(nowSlot)
  }

  if (!auth) return (
    <div style={{background:'#080808',width:'100vw',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Arial Black",Arial,sans-serif'}}>
      <div style={{border:'1px solid #C9A84C',padding:'48px',width:'320px',display:'flex',flexDirection:'column',gap:'20px'}}>
        <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>ICONIC SCREEN</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#fff'}}>Admin Panel</div>
        <input type="password" placeholder="Password" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && input===ADMIN_PASSWORD && setAuth(true)}
          style={{padding:'12px',background:'#111',border:'0.5px solid #333',color:'#fff',fontSize:'14px',fontFamily:'Arial'}}/>
        <button onClick={() => input===ADMIN_PASSWORD && setAuth(true)}
          style={{background:'#C9A84C',color:'#080808',padding:'14px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer'}}>
          ENTER
        </button>
      </div>
    </div>
  )

  const nowItems = uploads.filter(u => isNow(u.scheduled_at))
  const upcoming = uploads.filter(u => !isNow(u.scheduled_at) && !isPast(u.scheduled_at))
  const past = uploads.filter(u => isPast(u.scheduled_at))

  return (
    <div style={{background:'#080808',minHeight:'100vh',fontFamily:'"Arial Black",Arial,sans-serif',padding:'32px'}}>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{fontSize:'15px',fontWeight:900,color:'#C9A84C',letterSpacing:'4px'}}>ICONIC SCREEN — ADMIN</div>
        <div style={{fontSize:'13px',color:'#C9A84C',fontFamily:'Arial',fontWeight:700}}>{clock} NY</div>
        <button onClick={() => setAuth(false)} style={{background:'transparent',color:'#555',padding:'8px 16px',fontSize:'10px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>LOGOUT</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
        {[
          {label:'NOW ON SCREEN',value:nowItems.length,color:'#C9A84C'},
          {label:'UPCOMING',value:upcoming.length,color:'#4488cc'},
          {label:'NEEDS RESCHEDULE',value:past.length,color:'#FF9900'},
        ].map(s => (
          <div key={s.label} style={{background:'#0f0f0f',border:'0.5px solid #222',padding:'20px'}}>
            <div style={{fontSize:'9px',letterSpacing:'3px',color:'#555',marginBottom:'8px'}}>{s.label}</div>
            <div style={{fontSize:'28px',fontWeight:900,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* NOW */}
      {nowItems.length > 0 && (
        <>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'16px'}}>▶ NOW ON SCREEN</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'16px',marginBottom:'32px'}}>
            {nowItems.map(u => <Card key={u.id} u={u} isNow formatNY={formatNY} onDelete={deleteUpload}/>)}
          </div>
        </>
      )}

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#4488cc',marginBottom:'16px'}}>UPCOMING QUEUE</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'16px',marginBottom:'32px'}}>
            {upcoming.map(u => <Card key={u.id} u={u} formatNY={formatNY} onDelete={deleteUpload} onMoveToNow={moveToNow}/>)}
          </div>
        </>
      )}

      {/* PAST — need reschedule */}
      {past.length > 0 && (
        <>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#FF9900',marginBottom:'16px'}}>NEEDS RESCHEDULE</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'16px'}}>
            {past.map(u => <Card key={u.id} u={u} isPast formatNY={formatNY} onDelete={deleteUpload} onMoveToNow={moveToNow}/>)}
          </div>
        </>
      )}

    </div>
  )
}

function Card({u, isNow, isPast, formatNY, onDelete, onMoveToNow}: any) {
  return (
    <div style={{background:'#0f0f0f',border: isNow ? '2px solid #C9A84C' : isPast ? '1px solid #FF9900' : '0.5px solid #222',overflow:'hidden'}}>
      {isNow && <div style={{background:'#C9A84C',color:'#080808',fontSize:'9px',fontWeight:900,letterSpacing:'3px',padding:'5px',textAlign:'center'}}>▶ ON SCREEN NOW</div>}
      {isPast && <div style={{background:'#FF9900',color:'#080808',fontSize:'9px',fontWeight:900,letterSpacing:'3px',padding:'5px',textAlign:'center'}}>NEEDS RESCHEDULE</div>}
      <div style={{width:'100%',aspectRatio:'4/3',background:'#000',overflow:'hidden'}}>
        {u.url.match(/\.(mp4|webm|mov)$/i)
          ? <video src={u.url} style={{width:'100%',height:'100%',objectFit:'cover'}} muted/>
          : <img src={u.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        }
      </div>
      <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
        <div style={{fontSize:'12px',fontWeight:900,color: isNow ? '#C9A84C' : isPast ? '#FF9900' : '#fff',fontFamily:'Arial'}}>
          {formatNY(u.scheduled_at)}
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          {onMoveToNow && (
            <button onClick={() => onMoveToNow(u.id)} style={{flex:1,background:'transparent',color:'#C9A84C',padding:'9px',fontSize:'10px',fontWeight:900,border:'1px solid #C9A84C',cursor:'pointer'}}>
              PLAY NOW
            </button>
          )}
          <button onClick={() => onDelete(u.id, u.url)} style={{background:'transparent',color:'#ff4444',padding:'9px 12px',fontSize:'10px',fontWeight:900,border:'1px solid #ff4444',cursor:'pointer'}}>DEL</button>
        </div>
      </div>
    </div>
  )
}
