'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Home() {
  const [uploads, setUploads] = useState<{id:string,url:string}[]>([])
  const [current, setCurrent] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [screenStyle, setScreenStyle] = useState({top:0,left:0,width:0,height:0})
  const [amzStyle, setAmzStyle] = useState({top:0,left:0,width:0,height:0})

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const ORIG_W = 1344
  const ORIG_H = 768
  const SCREEN_X1 = 476
  const SCREEN_Y1 = 115
  const SCREEN_X2 = 834
  const SCREEN_Y2 = 430
  const AMZ_X1 = 925
  const AMZ_Y1 = 117
  const AMZ_X2 = 1197
  const AMZ_Y2 = 414

  function calcScreen() {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (mobile) return
    const img = imgRef.current
    if (!img) return
    const r = img.getBoundingClientRect()
    const scaleX = r.width / ORIG_W
    const scaleY = r.height / ORIG_H
    setScreenStyle({
      left: SCREEN_X1 * scaleX,
      top: SCREEN_Y1 * scaleY,
      width: (SCREEN_X2 - SCREEN_X1) * scaleX,
      height: (SCREEN_Y2 - SCREEN_Y1) * scaleY,
    })
    setAmzStyle({
      left: AMZ_X1 * scaleX,
      top: AMZ_Y1 * scaleY,
      width: (AMZ_X2 - AMZ_X1) * scaleX,
      height: (AMZ_Y2 - AMZ_Y1) * scaleY,
    })
  }

  useEffect(() => {
    fetchUploads()
    calcScreen()
    window.addEventListener('resize', calcScreen)
    return () => window.removeEventListener('resize', calcScreen)
  }, [])

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
    <main style={{width:'100vw',height:'100vh',overflow:'hidden',position:'relative',fontFamily:'"Arial Black",Arial,sans-serif'}}>

      <img
        ref={imgRef}
        src="/hero.png"
        alt="Iconic Screen"
        onLoad={calcScreen}
        style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:isMobile?'cover':'fill',objectPosition:'center top',zIndex:0}}
      />

      {/* PANTALLA CENTRAL */}
      {!isMobile && screenStyle.width > 0 && (
        <div style={{position:'fixed',top:screenStyle.top,left:screenStyle.left,width:screenStyle.width,height:screenStyle.height,zIndex:3,overflow:'hidden',background:'#000'}}>
          {currentUpload && (
            <img src={currentUpload.url} alt="on screen" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          )}
          <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px),repeating-linear-gradient(90deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px)',zIndex:4,pointerEvents:'none'}}/>
          {uploads.length > 1 && (
            <div style={{position:'absolute',bottom:'8px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'4px',zIndex:5}}>
              {uploads.map((_,i) => (
                <div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:i===current?'#C9A84C':'rgba(255,255,255,0.3)'}}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AMAZON OVERLAY */}
      {!isMobile && amzStyle.width > 0 && (
        
          
          
          
          style={{position:'fixed',top:amzStyle.top,left:amzStyle.left,width:amzStyle.width,height:amzStyle.height,zIndex:3,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',textDecoration:'none'}}
        >
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'clamp(10px,1.5vw,18px)',fontWeight:900,color:'#FF9900',letterSpacing:'3px'}}>TODAY&apos;S DEALS</div>
            <div style={{fontSize:'clamp(8px,1vw,12px)',color:'rgba(255,255,255,0.6)',letterSpacing:'2px',marginTop:'4px'}}>CLICK TO SHOP</div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{position:'relative',zIndex:4,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 32px',background:'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)'}}>
        <Image src="/logo.png" alt="Iconic Screen" width={isMobile?100:140} height={isMobile?38:52} style={{objectFit:'contain'}}/>
        {!isMobile && (
          <div style={{display:'flex',gap:'28px'}}>
            <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>HOW IT WORKS</span>
            <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>PRICING</span>
            <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>LIVE</span>
          </div>
        )}
        <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'9px 22px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>GET ON SCREEN</button>
      </nav>

      {/* COPY + CTA */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:4,padding:isMobile?'16px 20px 24px':'20px 32px 32px',display:'flex',flexDirection:isMobile?'column':'row',justifyContent:'space-between',alignItems:isMobile?'stretch':'flex-end',gap:isMobile?'12px':'0',background:'linear-gradient(to top,rgba(0,0,0,0.95) 60%,transparent)'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'6px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:isMobile?'22px':'clamp(18px,2.5vw,32px)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px',marginBottom:'6px'}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
          {!isMobile && <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',fontFamily:'Arial',fontWeight:400,lineHeight:1.6,maxWidth:'420px'}}>Upload your image or video. Appear where Nike and Apple advertise. Free forever — or reserve your exact moment.</div>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',alignItems:isMobile?'stretch':'flex-end',marginLeft:isMobile?'0':'32px'}}>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
          <div style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',fontFamily:'Arial',letterSpacing:'1px',textAlign:isMobile?'center':'right'}}>Free to upload · $9 per hour slot</div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
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
