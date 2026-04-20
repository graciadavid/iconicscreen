'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Home() {
  const [uploads, setUploads] = useState<{id:string,url:string}[]>([])
  const [current, setCurrent] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => { fetchUploads() }, [])

  useEffect(() => {
    if (uploads.length <= 1) return
    const t = setInterval(() => setCurrent(c => (c + 1) % uploads.length), 5000)
    return () => clearInterval(t)
  }, [uploads])

  async function fetchUploads() {
    const { data } = await supabase.from('uploads').select('id, url').order('created_at', { ascending: false })
    if (data) setUploads(data)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filename = `${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('uploads').upload(filename, file, { cacheControl: '3600', upsert: false })
    if (!error) {
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filename)
      await supabase.from('uploads').insert({ url: urlData.publicUrl })
      await fetchUploads()
      setShowModal(false)
    }
    setUploading(false)
  }

  const currentUpload = uploads[current]

  return (
    <main style={{width:'100vw',height:'100vh',display:'flex',flexDirection:'column',fontFamily:'"Arial Black",Arial,sans-serif',overflow:'hidden',position:'relative'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'url(/hero.png)',backgroundSize:'cover',backgroundPosition:'center top',zIndex:0}}/>

      {/* PANTALLA — sin bordes, blend con el edificio */}
      <div style={{
        position:'absolute',
        zIndex:3,
        top:'4%',
        left:'33%',
        width:'34%',
        height:'62%',
        overflow:'hidden',
        mixBlendMode:'luminosity',
        opacity:0.92
      }}>
        {currentUpload ? (
          <img src={currentUpload.url} alt="on screen" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        ) : (
          <div style={{width:'100%',height:'100%',background:'transparent'}}/>
        )}
      </div>

      <nav style={{position:'relative',zIndex:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',borderBottom:'0.5px solid rgba(255,255,255,0.1)'}}>
        <Image src="/logo.png" alt="Iconic Screen" width={160} height={60} style={{objectFit:'contain'}}/>
        <div style={{display:'flex',gap:'28px'}}>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>HOW IT WORKS</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>PRICING</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>LIVE</span>
        </div>
        <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'9px 22px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>GET ON SCREEN</button>
      </nav>

      <div style={{flex:1,position:'relative',zIndex:2}}/>

      <div style={{position:'relative',zIndex:2,padding:'20px 32px 32px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',background:'linear-gradient(to top, rgba(0,0,0,0.92) 80%, transparent)'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'8px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:'32px',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px',marginBottom:'8px'}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',fontFamily:'Arial',fontWeight:400,lineHeight:1.6,maxWidth:'420px'}}>Upload your image or video. Appear where Nike and Apple advertise. Free forever — or reserve your exact moment.</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'flex-end',marginLeft:'32px'}}>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
          <div style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',fontFamily:'Arial',letterSpacing:'1px'}}>Free to upload · $9 per hour slot</div>
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#0a0a0a',border:'1px solid #C9A84C',padding:'40px',width:'380px',display:'flex',flexDirection:'column',gap:'20px'}}>
            <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>GET ON THE SCREEN</div>
            <div style={{fontSize:'22px',fontWeight:900,color:'#fff',lineHeight:1.1}}>Upload your photo<br/>or video</div>
            <div style={{fontSize:'12px',color:'#555',fontFamily:'Arial',lineHeight:1.6}}>Your content will appear on the world&apos;s most iconic screen. Instantly. For free.</div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{display:'none'}}/>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{background:'#C9A84C',color:'#080808',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer'}}>
              {uploading ? 'UPLOADING...' : 'CHOOSE FILE'}
            </button>
            <button onClick={() => setShowModal(false)} style={{background:'transparent',color:'#555',padding:'12px',fontSize:'11px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>CANCEL</button>
          </div>
        </div>
      )}
    </main>
  )
}
