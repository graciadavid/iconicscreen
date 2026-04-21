'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const PASSWORD = 'iconic2026'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState('')
  const [uploads, setUploads] = useState<any[]>([])
  const [tab, setTab] = useState<'pending'|'approved'|'all'>('pending')
  const [stats, setStats] = useState({total:0, pending:0, approved:0})

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (auth) {
      fetchUploads()
      fetchStats()
    }
  }, [auth, tab])

  async function fetchUploads() {
    let query = supabase.from('uploads').select('*').order('created_at', {ascending: false})
    if (tab !== 'all') query = query.eq('status', tab)
    const { data } = await query
    if (data) setUploads(data)
  }

  async function fetchStats() {
    const { data } = await supabase.from('uploads').select('status')
    if (data) {
      setStats({
        total: data.length,
        pending: data.filter(d => d.status === 'pending').length,
        approved: data.filter(d => d.status === 'approved').length,
      })
    }
  }

  async function approve(id: string) {
    await supabase.from('uploads').update({status:'approved'}).eq('id', id)
    fetchUploads()
    fetchStats()
  }

  async function reject(id: string) {
    await supabase.from('uploads').update({status:'rejected'}).eq('id', id)
    fetchUploads()
    fetchStats()
  }

  async function deleteUpload(id: string, url: string) {
    const filename = url.split('/').pop()
    await supabase.storage.from('uploads').remove([filename!])
    await supabase.from('uploads').delete().eq('id', id)
    fetchUploads()
    fetchStats()
  }

  if (!auth) return (
    <div style={{background:'#080808',width:'100vw',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Arial Black",Arial,sans-serif'}}>
      <div style={{border:'1px solid #C9A84C',padding:'48px',width:'320px',display:'flex',flexDirection:'column',gap:'20px'}}>
        <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>ICONIC SCREEN</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#fff'}}>Admin Panel</div>
        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && input === PASSWORD && setAuth(true)}
          style={{padding:'12px',background:'#111',border:'0.5px solid #333',color:'#fff',fontSize:'14px',fontFamily:'Arial'}}
        />
        <button
          onClick={() => input === PASSWORD && setAuth(true)}
          style={{background:'#C9A84C',color:'#080808',padding:'14px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer'}}
        >
          ENTER
        </button>
      </div>
    </div>
  )

  return (
    <div style={{background:'#080808',minHeight:'100vh',overflowY:'auto',fontFamily:'"Arial Black",Arial,sans-serif',padding:'32px'}}>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
        <div style={{fontSize:'15px',fontWeight:900,color:'#C9A84C',letterSpacing:'4px'}}>ICONIC SCREEN — ADMIN</div>
        <button onClick={() => setAuth(false)} style={{background:'transparent',color:'#555',padding:'8px 16px',fontSize:'10px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>LOGOUT</button>
      </div>

      {/* STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
        {[
          {label:'TOTAL UPLOADS',value:stats.total},
          {label:'PENDING',value:stats.pending,color:'#FF9900'},
          {label:'APPROVED',value:stats.approved,color:'#00cc66'},
        ].map(s => (
          <div key={s.label} style={{background:'#0f0f0f',border:'0.5px solid #222',padding:'24px'}}>
            <div style={{fontSize:'9px',letterSpacing:'3px',color:'#555',marginBottom:'8px'}}>{s.label}</div>
            <div style={{fontSize:'32px',fontWeight:900,color:s.color||'#fff'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{display:'flex',gap:'0',marginBottom:'24px',borderBottom:'0.5px solid #222'}}>
        {(['pending','approved','all'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{background:'transparent',color:tab===t?'#C9A84C':'#555',padding:'12px 24px',fontSize:'10px',letterSpacing:'2px',border:'none',borderBottom:tab===t?'2px solid #C9A84C':'2px solid transparent',cursor:'pointer',fontFamily:'"Arial Black"'}}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* UPLOADS GRID */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>
        {uploads.map(u => (
          <div key={u.id} style={{background:'#0f0f0f',border:'0.5px solid #222',overflow:'hidden'}}>
            <div style={{width:'100%',aspectRatio:'16/9',background:'#000',overflow:'hidden'}}>
              {u.url.match(/\.(mp4|webm|mov)$/i)
                ? <video src={u.url} style={{width:'100%',height:'100%',objectFit:'cover'}} muted/>
                : <img src={u.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              }
            </div>
            <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
              <div style={{fontSize:'10px',color:'#555',fontFamily:'Arial'}}>
                {new Date(u.created_at).toLocaleString()}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:u.status==='approved'?'#00cc66':u.status==='pending'?'#FF9900':'#ff4444'}}/>
                <div style={{fontSize:'10px',color:'#888',letterSpacing:'2px'}}>{u.status?.toUpperCase()}</div>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'4px'}}>
                {u.status !== 'approved' && (
                  <button onClick={() => approve(u.id)} style={{flex:1,background:'#00cc66',color:'#000',padding:'8px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'none',cursor:'pointer'}}>APPROVE</button>
                )}
                {u.status !== 'rejected' && (
                  <button onClick={() => reject(u.id)} style={{flex:1,background:'transparent',color:'#FF9900',padding:'8px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'0.5px solid #FF9900',cursor:'pointer'}}>REJECT</button>
                )}
                <button onClick={() => deleteUpload(u.id, u.url)} style={{background:'transparent',color:'#ff4444',padding:'8px 12px',fontSize:'10px',fontWeight:900,letterSpacing:'1px',border:'0.5px solid #ff4444',cursor:'pointer'}}>DEL</button>
              </div>
            </div>
          </div>
        ))}
        {uploads.length === 0 && (
          <div style={{color:'#333',fontSize:'12px',letterSpacing:'2px',padding:'32px',fontFamily:'Arial'}}>NO UPLOADS IN THIS CATEGORY</div>
        )}
      </div>

    </div>
  )
}
