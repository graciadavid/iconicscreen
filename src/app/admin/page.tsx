'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_PASSWORD } from '@/lib/constants'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState('')
  const [uploads, setUploads] = useState<any[]>([])
  const [tab, setTab] = useState<'pending'|'active'|'published'|'all'>('pending')
  const [stats, setStats] = useState({total:0,pending:0,active:0,published:0})
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('en-US',{month:'long',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (auth) { fetchUploads(); fetchStats() }
  }, [auth, tab])

  async function fetchUploads() {
    let query = supabase.from('uploads').select('*').order('created_at', {ascending: false})
    if (tab !== 'all') query = query.eq('status', tab)
    const { data } = await query
    if (data) setUploads(data)
  }

  async function fetchStats() {
    const { data } = await supabase.from('uploads').select('status')
    if (data) setStats({
      total: data.length,
      pending: data.filter((d:any) => d.status === 'pending').length,
      active: data.filter((d:any) => d.status === 'active').length,
      published: data.filter((d:any) => d.status === 'published').length,
    })
  }

  async function approve(id: string) {
    const { data } = await supabase.from('uploads').select('id').eq('status','active')
    const newStatus = (data?.length || 0) < 10 ? 'active' : 'approved'
    await supabase.from('uploads').update({status: newStatus}).eq('id', id)
    fetchUploads(); fetchStats()
  }

  async function reject(id: string) {
    await supabase.from('uploads').update({status:'rejected'}).eq('id', id)
    fetchUploads(); fetchStats()
  }

  async function deleteUpload(id: string, url: string) {
    const filename = url.split('/').pop()
    if (filename) await supabase.storage.from('uploads').remove([filename])
    await supabase.from('uploads').delete().eq('id', id)
    fetchUploads(); fetchStats()
  }

  async function moveToActive(id: string) {
    await supabase.from('uploads').update({status:'active'}).eq('id', id)
    fetchUploads(); fetchStats()
  }

  async function setSchedule(id: string, datetime: string) {
    await supabase.from('uploads').update({scheduled_at: new Date(datetime).toISOString()}).eq('id', id)
    fetchUploads()
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
    <div style={{background:'#080808',minHeight:'100vh',fontFamily:'"Arial Black",Arial,sans-serif',padding:'32px',boxSizing:'border-box'}}>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{fontSize:'15px',fontWeight:900,color:'#C9A84C',letterSpacing:'4px'}}>ICONIC SCREEN — ADMIN</div>
        <div style={{fontSize:'12px',color:'#C9A84C',letterSpacing:'2px',fontFamily:'Arial',fontWeight:700}}>{clock}</div>
        <button onClick={() => setAuth(false)} style={{background:'transparent',color:'#555',padding:'8px 16px',fontSize:'10px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>LOGOUT</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'32px'}}>
        {[
          {label:'TOTAL',value:stats.total,color:'#fff'},
          {label:'PENDING',value:stats.pending,color:'#FF9900'},
          {label:'ON SCREEN',value:stats.active,color:'#C9A84C'},
          {label:'PUBLISHED',value:stats.published,color:'#00cc66'},
        ].map(s => (
          <div key={s.label} style={{background:'#0f0f0f',border:'0.5px solid #222',padding:'20px'}}>
            <div style={{fontSize:'9px',letterSpacing:'3px',color:'#555',marginBottom:'8px'}}>{s.label}</div>
            <div style={{fontSize:'28px',fontWeight:900,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:'0',marginBottom:'24px',borderBottom:'0.5px solid #222'}}>
        {(['pending','active','published','all'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{background:'transparent',color:tab===t?'#C9A84C':'#555',padding:'12px 20px',fontSize:'10px',letterSpacing:'2px',border:'none',borderBottom:tab===t?'2px solid #C9A84C':'2px solid transparent',cursor:'pointer',fontFamily:'"Arial Black"'}}>
            {t === 'active' ? 'ON SCREEN' : t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px'}}>
        {uploads.map(u => (
          <div key={u.id} style={{background:'#0f0f0f',border:'0.5px solid #222',overflow:'hidden'}}>
            <div style={{width:'100%',aspectRatio:'16/9',background:'#000',overflow:'hidden'}}>
              {u.url.match(/\.(mp4|webm|mov)$/i)
                ? <video src={u.url} style={{width:'100%',height:'100%',objectFit:'cover'}} muted/>
                : <img src={u.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              }
            </div>
            <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:u.status==='active'?'#C9A84C':u.status==='pending'?'#FF9900':u.status==='published'?'#00cc66':'#ff4444'}}/>
                  <div style={{fontSize:'10px',color:'#888',letterSpacing:'2px'}}>{u.status==='active'?'ON SCREEN':u.status?.toUpperCase()}</div>
                </div>
                <div style={{fontSize:'10px',color:'#444',fontFamily:'Arial'}}>
                  {new Date(u.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})}
                </div>
              </div>

              {u.scheduled_at && (
                <div style={{fontSize:'10px',color:'#00cc66',fontFamily:'Arial'}}>
                  Scheduled (NY): {new Date(u.scheduled_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})}
                </div>
              )}

              {u.status === 'approved' && (
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <div style={{fontSize:'9px',color:'#555',letterSpacing:'2px'}}>SCHEDULE SLOT</div>
                  <input type="datetime-local"
                    defaultValue={u.scheduled_at ? new Date(u.scheduled_at).toISOString().slice(0,16) : ''}
                    onChange={e => setSchedule(u.id, e.target.value)}
                    style={{padding:'8px',background:'#1a1a1a',border:'0.5px solid #333',color:'#fff',fontSize:'12px',fontFamily:'Arial'}}/>
                </div>
              )}

              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {u.status === 'pending' && (
                  <button onClick={() => approve(u.id)}
                    style={{flex:1,background:'#C9A84C',color:'#000',padding:'10px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'none',cursor:'pointer'}}>
                    APPROVE
                  </button>
                )}
                {u.status === 'approved' && (
                  <button onClick={() => moveToActive(u.id)}
                    style={{flex:1,background:'#C9A84C',color:'#000',padding:'10px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'none',cursor:'pointer'}}>
                    PUT ON SCREEN
                  </button>
                )}
                {u.status !== 'rejected' && u.status !== 'published' && (
                  <button onClick={() => reject(u.id)}
                    style={{flex:1,background:'transparent',color:'#FF9900',padding:'10px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'1px solid #FF9900',cursor:'pointer'}}>
                    REJECT
                  </button>
                )}
                <button onClick={() => deleteUpload(u.id, u.url)}
                  style={{background:'transparent',color:'#ff4444',padding:'10px 14px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'1px solid #ff4444',cursor:'pointer'}}>
                  DEL
                </button>
              </div>
            </div>
          </div>
        ))}
        {uploads.length === 0 && (
          <div style={{color:'#333',fontSize:'12px',letterSpacing:'2px',padding:'32px',fontFamily:'Arial'}}>NOTHING HERE</div>
        )}
      </div>
    </div>
  )
}
