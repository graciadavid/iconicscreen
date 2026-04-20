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
    const { data } = await supabase.from('uploads').select('id,url').order('created_at', { ascending: false })
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
    <main style={{width:'100vw',height:'100vh',overflow:'hidden',position:'relative',fontFamily:'"Arial Black",Arial,sans-serif',background:'#080808'}}>

      {/* NAV */}
      <nav style={{position:'absolute',top:0,left:0,right:0,zIndex:10,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)'}}>
        <Image src="/logo.png" alt="Iconic Screen" width={140} height={52} style={{objectFit:'contain'}}/>
        <div style={{display:'flex',gap:'28px'}}>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>HOW IT WORKS</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>PRICING</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>LIVE</span>
        </div>
        <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'9px 22px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>GET ON SCREEN</button>
      </nav>

      {/* SCENE */}
      <div style={{width:'100%',height:'100%',display:'grid',gridTemplateColumns:'1fr 1.4fr 1fr',gridTemplateRows:'1fr',gap:'6px',padding:'0',alignItems:'end'}}>

        {/* LEFT BUILDING — AdSense */}
        <div style={{height:'85%',background:'#0d1520',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',paddingTop:'5%',position:'relative',overflow:'hidden'}}>
          <div style={{width:'80%',aspectRatio:'4/3',background:'#0f1e30',border:'0.5px solid #1a3050',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px'}}>
            <div style={{fontSize:'clamp(24px,3vw,48px)',fontWeight:900,color:'#4488cc'}}>G</div>
            <div style={{fontSize:'clamp(8px,1vw,12px)',letterSpacing:'1px',color:'#4488cc'}}>AdSense</div>
          </div>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'15%',background:'#0a0f1a',borderTop:'2px solid #1a2535'}}/>
        </div>

        {/* CENTER BUILDING — User screen */}
        <div style={{height:'100%',background:'#0c1118',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',paddingTop:'2%',position:'relative'}}>
          <div style={{width:'85%',aspectRatio:'3/4',background:'#000',overflow:'hidden',position:'relative',cursor:'pointer'}} onClick={() => setShowModal(true)}>
            {currentUpload ? (
              <img src={currentUpload.url} alt="on screen" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            ) : (
              <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'12px',background:'#050505'}}>
                <div style={{fontSize:'clamp(10px,1.5vw,14px)',color:'#C9A84C',letterSpacing:'3px',textAlign:'center'}}>YOUR MOMENT<br/>HERE</div>
                <div style={{fontSize:'clamp(8px,1vw,11px)',color:'#333',letterSpacing:'2px'}}>CLICK TO UPLOAD</div>
              </div>
            )}
            {uploads.length > 1 && (
              <div style={{position:'absolute',bottom:'8px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'4px'}}>
                {uploads.map((_,i) => (
                  <div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:i===current?'#C9A84C':'rgba(255,255,255,0.3)'}}/>
                ))}
              </div>
            )}
          </div>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'12%',background:'#080d15',borderTop:'2px solid #111'}}/>
        </div>

        {/* RIGHT BUILDING — Amazon */}
        <div style={{height:'85%',background:'#1a0e00',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',paddingTop:'5%',position:'relative',overflow:'hidden'}}>
          <div style={{width:'80%',aspectRatio:'4/3',background:'#FF9900',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontSize:'clamp(16px,2.5vw,36px)',fontWeight:900,color:'#fff',fontFamily:'Arial'}}>amazon</div>
          </div>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'15%',background:'#0a0800',borderTop:'2px solid #2a1a00'}}/>
        </div>

      </div>

      {/* COPY + CTA */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:10,padding:'16px 32px 24px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',background:'linear-gradient(to top,rgba(0,0,0,0.95) 60%,transparent)'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'6px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:'clamp(18px,2.5vw,28px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:'6px'}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
          <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',fontFamily:'Arial',fontWeight:400,lineHeight:1.5,maxWidth:'380px'}}>Upload your image or video. Free forever — or reserve your exact moment.</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',alignItems:'flex-end',marginLeft:'24px'}}>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'12px 28px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'11px 20px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
          <div style={{fontSize:'10px',color:'rgba(255,255,255,0.2)',fontFamily:'Arial',letterSpacing:'1px'}}>Free to upload · $9 per hour slot</div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:20,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#0a0a0a',border:'1px solid #C9A84C',padding:'40px',width:'min(380px,90vw)',display:'flex',flexDirection:'column',gap:'20px'}}>
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
