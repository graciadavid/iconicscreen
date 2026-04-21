'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_PASSWORD } from '@/lib/constants'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState('')
  const [screen, setScreen] = useState<any[]>([])
  const [queue, setQueue] = useState<any[]>([])
  const [clock, setClock] = useState('')
  const [tab, setTab] = useState<'screen'|'queue'>('screen')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('en-US',{
      timeZone:'America/New_York',
      weekday:'short',month:'short',day:'numeric',
      hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (auth) {
      fetchAll()
      const t = setInterval(fetchAll, 10000)
      return () => clearInterval(t)
    }
  }, [auth])

  async function fetchAll() {
    const { data: s } = await supabase
      .from('uploads').select('*').eq('status','active')
      .order('queue_position', {ascending:true})
    if (s) setScreen(s)

    const { data: q } = await supabase
      .from('uploads').select('*').eq('status','approved')
      .order('queue_position', {ascending:true})
    if (q) setQueue(q)
  }

  async function removeFromScreen(id: string) {
    const maxPos = queue[queue.length-1]?.queue_position || screen[screen.length-1]?.queue_position || 0
    await supabase.from('uploads').update({status:'approved', queue_position: maxPos+1}).eq('id', id)
    fetchAll()
  }

  async function putOnScreen(id: string) {
    const maxPos = screen[screen.length-1]?.queue_position || 0
    await supabase.from('uploads').update({status:'active', queue_position: maxPos+1}).eq('id', id)
    fetchAll()
  }

  async function deleteUpload(id: string, url: string) {
    const filename = url.split('/').pop()
    if (filename) await supabase.storage.from('uploads').remove([filename])
    await supabase.from('uploads').delete().eq('id', id)
    fetchAll()
  }

  function formatNY(dt: string) {
    return new Date(dt).toLocaleString('en-US',{
      timeZone:'America/New_York',
      month:'short',day:'numeric',
      hour:'2-digit',minute:'2-digit',hour12:true
    }) + ' NY'
  }

  function Card({u, isNow, onRemove, onPutOnScreen, onDelete}: any) {
    return (
      <div style={{background:'#0f0f0f',border: isNow ? '2px solid #C9A84C' : '0.5px solid #222',overflow:'hidden'}}>
        {isNow && <div style={{background:'#C9A84C',color:'#080808',fontSize:'9px',fontWeight:900,letterSpacing:'3px',padding:'5px',textAlign:'center'}}>▶ NOW ON SCREEN</div>}
        <div style={{width:'100%',aspectRatio:'4/3',background:'#000',overflow:'hidden'}}>
          {u.url.match(/\.(mp4|webm|mov)$/i)
            ? <video src={u.url} style={{width:'100%',height:'100%',objectFit:'cover'}} muted/>
            : <img src={u.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          }
        </div>
        <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div style={{fontSize:'11px',color:'#C9A84C',fontWeight:900}}>#{u.queue_position}</div>
            {u.scheduled_at && (
              <div style={{fontSize:'10px',color:'#888',fontFamily:'Arial'}}>{formatNY(u.scheduled_at)}</div>
            )}
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            {onRemove && <button onClick={onRemove} style={{flex:1,background:'transparent',color:'#FF9900',padding:'9px',fontSize:'10px',fontWeight:900,border:'1px solid #FF9900',cursor:'pointer'}}>REMOVE</button>}
            {onPutOnScreen && <button onClick={onPutOnScreen} style={{flex:1,background:'#C9A84C',color:'#080808',padding:'9px',fontSize:'10px',fontWeight:900,border:'none',cursor:'pointer'}}>ON SCREEN</button>}
            <button onClick={onDelete} style={{background:'transparent',color:'#ff4444',padding:'9px 12px',fontSize:'10px',fontWeight:900,border:'1px solid #ff4444',cursor:'pointer'}}>DEL</button>
          </div>
        </div>
      </div>
    )
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

  return (
    <div style={{background:'#080808',minHeight:'100vh',fontFamily:'"Arial Black",Arial,sans-serif',padding:'32px'}}>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{fontSize:'15px',fontWeight:900,color:'#C9A84C',letterSpacing:'4px'}}>ICONIC SCREEN — ADMIN</div>
        <div style={{fontSize:'13px',color:'#C9A84C',fontFamily:'Arial',fontWeight:700}}>{clock}</div>
        <button onClick={() => setAuth(false)} style={{background:'transparent',color:'#555',padding:'8px 16px',fontSize:'10px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>LOGOUT</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'32px'}}>
        <div style={{background:'#0f0f0f',border:'1px solid #C9A84C',padding:'20px'}}>
          <div style={{fontSize:'9px',letterSpacing:'3px',color:'#555',marginBottom:'8px'}}>ON SCREEN NOW</div>
          <div style={{fontSize:'36px',fontWeight:900,color:'#C9A84C'}}>{screen.length}<span style={{fontSize:'14px',color:'#555'}}>/10</span></div>
        </div>
        <div style={{background:'#0f0f0f',border:'0.5px solid #222',padding:'20px'}}>
          <div style={{fontSize:'9px',letterSpacing:'3px',color:'#555',marginBottom:'8px'}}>IN QUEUE</div>
          <div style={{fontSize:'36px',fontWeight:900,color:'#4488cc'}}>{queue.length}</div>
        </div>
      </div>

      <div style={{display:'flex',marginBottom:'24px',borderBottom:'0.5px solid #222'}}>
        {(['screen','queue'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{background:'transparent',color:tab===t?'#C9A84C':'#555',padding:'12px 24px',fontSize:'10px',letterSpacing:'2px',border:'none',borderBottom:tab===t?'2px solid #C9A84C':'2px solid transparent',cursor:'pointer',fontFamily:'"Arial Black"'}}>
            {t==='screen' ? `ON SCREEN (${screen.length})` : `QUEUE (${queue.length})`}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'16px'}}>
        {tab === 'screen' && screen.map((u,i) => (
          <Card key={u.id} u={u} isNow={i===0}
            onRemove={() => removeFromScreen(u.id)}
            onDelete={() => deleteUpload(u.id, u.url)}
          />
        ))}
        {tab === 'queue' && queue.map(u => (
          <Card key={u.id} u={u}
            onPutOnScreen={() => putOnScreen(u.id)}
            onDelete={() => deleteUpload(u.id, u.url)}
          />
        ))}
        {((tab==='screen' && screen.length===0)||(tab==='queue' && queue.length===0)) && (
          <div style={{color:'#333',fontSize:'12px',letterSpacing:'2px',padding:'32px',fontFamily:'Arial'}}>NOTHING HERE</div>
        )}
      </div>
    </div>
  )
}
