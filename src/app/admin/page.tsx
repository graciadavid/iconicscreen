'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_PASSWORD } from '@/lib/constants'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState('')
  const [activeUploads, setActiveUploads] = useState<any[]>([])
  const [queueUploads, setQueueUploads] = useState<any[]>([])
  const [pendingUploads, setPendingUploads] = useState<any[]>([])
  const [stats, setStats] = useState({total:0,pending:0,active:0,queue:0})
  const [clock, setClock] = useState('')
  const [tab, setTab] = useState<'screen'|'queue'|'pending'|'all'>('screen')
  const [allUploads, setAllUploads] = useState<any[]>([])

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('en-US',{
      timeZone:'America/New_York',
      month:'long',day:'numeric',year:'numeric',
      hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (auth) fetchAll()
    const t = setInterval(() => { if (auth) fetchAll() }, 10000)
    return () => clearInterval(t)
  }, [auth, tab])

  async function fetchAll() {
    const { data: active } = await supabase
      .from('uploads').select('*').eq('status','active')
      .order('queue_position', {ascending: true})
    if (active) setActiveUploads(active)

    const { data: queue } = await supabase
      .from('uploads').select('*').eq('status','approved')
      .order('created_at', {ascending: true})
    if (queue) setQueueUploads(queue)

    const { data: pending } = await supabase
      .from('uploads').select('*').eq('status','pending')
      .order('created_at', {ascending: false})
    if (pending) setPendingUploads(pending)

    const { data: all } = await supabase
      .from('uploads').select('*')
      .order('created_at', {ascending: false})
    if (all) {
      setAllUploads(all)
      setStats({
        total: all.length,
        pending: all.filter((d:any) => d.status === 'pending').length,
        active: all.filter((d:any) => d.status === 'active').length,
        queue: all.filter((d:any) => d.status === 'approved').length,
      })
    }
  }

  async function approve(id: string) {
    const activeCount = activeUploads.length
    const newStatus = activeCount < 10 ? 'active' : 'approved'
    if (newStatus === 'active') {
      const maxPos = activeUploads[activeUploads.length - 1]?.queue_position || 0
      await supabase.from('uploads').update({status:'active', queue_position: maxPos + 1}).eq('id', id)
    } else {
      await supabase.from('uploads').update({status:'approved'}).eq('id', id)
    }
    fetchAll()
  }

  async function reject(id: string) {
    await supabase.from('uploads').update({status:'rejected'}).eq('id', id)
    fetchAll()
  }

  async function deleteUpload(id: string, url: string) {
    const filename = url.split('/').pop()
    if (filename) await supabase.storage.from('uploads').remove([filename])
    await supabase.from('uploads').delete().eq('id', id)
    fetchAll()
  }

  async function moveToScreen(id: string) {
    const maxPos = activeUploads[activeUploads.length - 1]?.queue_position || 0
    await supabase.from('uploads').update({status:'active', queue_position: maxPos + 1}).eq('id', id)
    fetchAll()
  }

  const s = {
    card: {background:'#0f0f0f',border:'0.5px solid #222',overflow:'hidden'} as React.CSSProperties,
    img: {width:'100%',aspectRatio:'16/9' as any,background:'#000',overflow:'hidden'} as React.CSSProperties,
    btn: (color:string, bg?:string) => ({
      flex:1,background:bg||'transparent',color,padding:'10px',fontSize:'10px',
      fontWeight:900,letterSpacing:'1px',border:`1px solid ${color}`,cursor:'pointer'
    } as React.CSSProperties)
  }

  function UploadCard({u, isNow, actions}: {u:any, isNow?:boolean, actions: React.ReactNode}) {
    return (
      <div style={{...s.card, border: isNow ? '1.5px solid #C9A84C' : '0.5px solid #222'}}>
        {isNow && <div style={{background:'#C9A84C',color:'#080808',fontSize:'9px',fontWeight:900,letterSpacing:'3px',padding:'4px 12px',textAlign:'center'}}>NOW ON SCREEN</div>}
        <div style={s.img}>
          {u.url.match(/\.(mp4|webm|mov)$/i)
            ? <video src={u.url} style={{width:'100%',height:'100%',objectFit:'cover'}} muted/>
            : <img src={u.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          }
        </div>
        <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:'10px',color:'#888',letterSpacing:'1px',fontFamily:'Arial'}}>
              {u.queue_position ? `#${u.queue_position}` : ''}
            </div>
            <div style={{fontSize:'10px',color:'#444',fontFamily:'Arial'}}>
              {new Date(u.created_at).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})} NY
            </div>
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap' as any}}>
            {actions}
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
          onKeyDown={e => e.key === 'Enter' && input === ADMIN_PASSWORD && setAuth(true)}
          style={{padding:'12px',background:'#111',border:'0.5px solid #333',color:'#fff',fontSize:'14px',fontFamily:'Arial'}}/>
        <button onClick={() => input === ADMIN_PASSWORD && setAuth(true)}
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
        <div style={{fontSize:'12px',color:'#C9A84C',letterSpacing:'2px',fontFamily:'Arial',fontWeight:700}}>{clock} NY</div>
        <button onClick={() => setAuth(false)} style={{background:'transparent',color:'#555',padding:'8px 16px',fontSize:'10px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>LOGOUT</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'32px'}}>
        {[
          {label:'TOTAL',value:stats.total,color:'#fff'},
          {label:'PENDING',value:stats.pending,color:'#FF9900'},
          {label:'ON SCREEN',value:stats.active,color:'#C9A84C'},
          {label:'IN QUEUE',value:stats.queue,color:'#4488cc'},
        ].map(s => (
          <div key={s.label} style={{background:'#0f0f0f',border:'0.5px solid #222',padding:'20px'}}>
            <div style={{fontSize:'9px',letterSpacing:'3px',color:'#555',marginBottom:'8px'}}>{s.label}</div>
            <div style={{fontSize:'28px',fontWeight:900,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:'0',marginBottom:'24px',borderBottom:'0.5px solid #222'}}>
        {(['screen','queue','pending','all'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{background:'transparent',color:tab===t?'#C9A84C':'#555',padding:'12px 20px',fontSize:'10px',letterSpacing:'2px',border:'none',borderBottom:tab===t?'2px solid #C9A84C':'2px solid transparent',cursor:'pointer',fontFamily:'"Arial Black"'}}>
            {t === 'screen' ? `ON SCREEN (${activeUploads.length})` : t === 'queue' ? `QUEUE (${queueUploads.length})` : t === 'pending' ? `PENDING (${pendingUploads.length})` : 'ALL'}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>

        {tab === 'screen' && activeUploads.map((u,i) => (
          <UploadCard key={u.id} u={u} isNow={i===0} actions={
            <>
              <button onClick={() => reject(u.id)} style={s.btn('#FF9900')}>REMOVE</button>
              <button onClick={() => deleteUpload(u.id, u.url)} style={s.btn('#ff4444')}>DEL</button>
            </>
          }/>
        ))}

        {tab === 'queue' && queueUploads.map(u => (
          <UploadCard key={u.id} u={u} actions={
            <>
              <button onClick={() => moveToScreen(u.id)} style={s.btn('#C9A84C','#C9A84C')}>
                <span style={{color:'#080808'}}>PUT ON SCREEN</span>
              </button>
              <button onClick={() => deleteUpload(u.id, u.url)} style={s.btn('#ff4444')}>DEL</button>
            </>
          }/>
        ))}

        {tab === 'pending' && pendingUploads.map(u => (
          <UploadCard key={u.id} u={u} actions={
            <>
              <button onClick={() => approve(u.id)} style={{...s.btn('#000','#C9A84C'),flex:1}}>APPROVE</button>
              <button onClick={() => reject(u.id)} style={s.btn('#FF9900')}>REJECT</button>
              <button onClick={() => deleteUpload(u.id, u.url)} style={s.btn('#ff4444')}>DEL</button>
            </>
          }/>
        ))}

        {tab === 'all' && allUploads.map(u => (
          <UploadCard key={u.id} u={u} actions={
            <>
              {u.status === 'pending' && <button onClick={() => approve(u.id)} style={{...s.btn('#000','#C9A84C'),flex:1}}>APPROVE</button>}
              {u.status === 'approved' && <button onClick={() => moveToScreen(u.id)} style={{...s.btn('#000','#C9A84C'),flex:1}}>ON SCREEN</button>}
              <button onClick={() => reject(u.id)} style={s.btn('#FF9900')}>REJECT</button>
              <button onClick={() => deleteUpload(u.id, u.url)} style={s.btn('#ff4444')}>DEL</button>
            </>
          }/>
        ))}

        {((tab === 'screen' && activeUploads.length === 0) ||
          (tab === 'queue' && queueUploads.length === 0) ||
          (tab === 'pending' && pendingUploads.length === 0) ||
          (tab === 'all' && allUploads.length === 0)) && (
          <div style={{color:'#333',fontSize:'12px',letterSpacing:'2px',padding:'32px',fontFamily:'Arial'}}>NOTHING HERE</div>
        )}

      </div>
    </div>
  )
}
