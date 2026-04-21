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
  const [viewers, setViewers] = useState(158218)
  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [screenStyle, setScreenStyle] = useState({top:0,left:0,width:0,height:0})
  const [amzStyle, setAmzStyle] = useState({top:0,left:0,width:0,height:0})
  const [adsStyle, setAdsStyle] = useState({top:0,left:0,width:0,height:0})

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
  const ADS_X1 = 148
  const ADS_Y1 = 173
  const ADS_X2 = 386
  const ADS_Y2 = 400

  function calcScreen() {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (mobile) return
    const img = imgRef.current
    if (!img) return
    const r = img.getBoundingClientRect()
    const scaleX = r.width / ORIG_W
    const scaleY = r.height / ORIG_H
    setScreenStyle({left:SCREEN_X1*scaleX,top:SCREEN_Y1*scaleY,width:(SCREEN_X2-SCREEN_X1)*scaleX,height:(SCREEN_Y2-SCREEN_Y1)*scaleY})
    setAmzStyle({left:AMZ_X1*scaleX,top:AMZ_Y1*scaleY,width:(AMZ_X2-AMZ_X1)*scaleX,height:(AMZ_Y2-AMZ_Y1)*scaleY})
    setAdsStyle({left:ADS_X1*scaleX,top:ADS_Y1*scaleY,width:(ADS_X2-ADS_X1)*scaleX,height:(ADS_Y2-ADS_Y1)*scaleY})
  }

  useEffect(() => {
    fetchUploads()
    calcScreen()
    window.addEventListener('resize', calcScreen)
    return () => window.removeEventListener('resize', calcScreen)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => {
        const rand = Math.random()
        let delta
        if (rand < 0.5) delta = Math.floor(Math.random() * 5) + 1
        else if (rand < 0.8) delta = -(Math.floor(Math.random() * 3) + 1)
        else delta = Math.floor(Math.random() * 8) + 3
        return v + delta
      })
    }, 1000)
    return () => clearInterval(interval)
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

      <img ref={imgRef} src="/hero.png" alt="Iconic Screen" onLoad={calcScreen}
        style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:isMobile?'cover':'fill',objectPosition:'center top',zIndex:0}}/>

      {/* PANTALLA CENTRAL */}
      {!isMobile && screenStyle.width > 0 && (
        <div style={{position:'fixed',top:screenStyle.top,left:screenStyle.left,width:screenStyle.width,height:screenStyle.height,zIndex:3,overflow:'hidden',background:'#000'}}>
          {currentUpload && <img src={currentUpload.url} alt="on screen" style={{width:'100%',height:'100%',objectFit:'cover'}}/>}
          <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px),repeating-linear-gradient(90deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px)',zIndex:4,pointerEvents:'none'}}/>
          {uploads.length > 1 && (
            <div style={{position:'absolute',bottom:'8px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'4px',zIndex:5}}>
              {uploads.map((_,i) => <div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:i===current?'#C9A84C':'rgba(255,255,255,0.3)'}}/>)}
            </div>
          )}
        </div>
      )}

      {/* AMAZON */}
      {!isMobile && amzStyle.width > 0 && (
        <div onClick={() => window.open('https://www.amazon.com/deals?tag=nys0b-20', '_blank')}
          style={{position:'fixed',top:amzStyle.top,left:amzStyle.left,width:amzStyle.width,height:amzStyle.height,zIndex:3,display:'flex',alignItems:'flex-end',justifyContent:'center',cursor:'pointer',paddingBottom:'4%'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'clamp(10px,1.5vw,18px)',fontWeight:900,color:'#FF9900',letterSpacing:'3px',animation:'pulse 1.5s ease-in-out infinite'}}>TODAY&apos;S DEALS</div>
            <div style={{fontSize:'clamp(8px,1vw,12px)',color:'#ffffff',letterSpacing:'2px',marginTop:'8px'}}>CLICK TO SHOP</div>
          </div>
        </div>
      )}

      {/* APPLE AD — encima de AdSense */}
      {!isMobile && adsStyle.width > 0 && (
        <div style={{position:'fixed',top:adsStyle.top,left:adsStyle.left,width:adsStyle.width,height:adsStyle.height,zIndex:3,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.92)'}}>
          <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
            <svg width="40" height="48" viewBox="0 0 814 1000" fill="#000">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.8 268.9-317.8 71 0 130 46.4 174.4 46.4 42.6 0 109.2-49.9 189.5-49.9 30.5 0 108.2 2.6 168.1 80.6zm-126.7-85.4c-5.2-31.2-16.7-62.9-41-89.2-31.5-34.8-83.5-58.7-132.1-58.7-3.2 0-6.5.3-9.7.6 1.9 32.4 13.8 63.7 37.4 92.7 27.3 33.1 72.5 60.8 145.4 60.8z"/>
            </svg>
            <div style={{fontSize:'clamp(8px,1vw,13px)',fontWeight:900,color:'#000',letterSpacing:'2px'}}>Think Different.</div>
            <div style={{fontSize:'clamp(7px,0.8vw,10px)',color:'#555',letterSpacing:'1px'}}>apple.com</div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{position:'relative',zIndex:4,display:'flex',justifyContent:'flex-start',alignItems:'center',padding:'12px 32px',background:'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)'}}>
        <Image src="/logo.png" alt="Iconic Screen" width={isMobile?120:200} height={isMobile?45:75} style={{objectFit:'contain'}}/>
      </nav>

      {/* BOTTOM BAR */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:4,padding:isMobile?'16px 20px 24px':'20px 32px 32px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',background:'linear-gradient(to top,rgba(0,0,0,0.95) 60%,transparent)'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'6px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:isMobile?'22px':'clamp(18px,2.5vw,32px)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px'}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
        </div>

        <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ff4444',animation:'pulse 1s ease-in-out infinite'}}/>
            <div style={{fontSize:'clamp(18px,2vw,28px)',fontWeight:900,color:'#ffffff',letterSpacing:'2px'}}>
              {viewers.toLocaleString('en-US')}
            </div>
          </div>
          <div style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',letterSpacing:'3px'}}>WATCHING LIVE NOW</div>
        </div>

        <div style={{display:'flex',flexDirection:'row',gap:'12px',alignItems:'center'}}>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
        </div>
      </div>

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
