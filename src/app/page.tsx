'use client'
import { useState, useEffect, useRef } from 'react'
import { Nav } from '@/components/Nav'
import { Screen } from '@/components/Screen'
import { AmazonPanel } from '@/components/AmazonPanel'
import { ApplePanel } from '@/components/ApplePanel'
import { LiveCounter } from '@/components/LiveCounter'
import { NYClock } from '@/components/NYClock'
import { UploadModal } from '@/components/UploadModal'
import { ORIG_W, ORIG_H, SCREEN, AMZ, ADS } from '@/lib/constants'

type BoxStyle = {top:number,left:number,width:number,height:number}
const empty = {top:0,left:0,width:0,height:0}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [screenStyle, setScreenStyle] = useState<BoxStyle>(empty)
  const [amzStyle, setAmzStyle] = useState<BoxStyle>(empty)
  const [adsStyle, setAdsStyle] = useState<BoxStyle>(empty)
  const imgRef = useRef<HTMLImageElement>(null)

  function calcScreen() {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (mobile) return
    const img = imgRef.current
    if (!img) return
    const r = img.getBoundingClientRect()
    const sx = r.width / ORIG_W
    const sy = r.height / ORIG_H
    setScreenStyle({left:SCREEN.X1*sx,top:SCREEN.Y1*sy,width:(SCREEN.X2-SCREEN.X1)*sx,height:(SCREEN.Y2-SCREEN.Y1)*sy})
    setAmzStyle({left:AMZ.X1*sx,top:AMZ.Y1*sy,width:(AMZ.X2-AMZ.X1)*sx,height:(AMZ.Y2-AMZ.Y1)*sy})
    setAdsStyle({left:ADS.X1*sx,top:ADS.Y1*sy,width:(ADS.X2-ADS.X1)*sx,height:(ADS.Y2-ADS.Y1)*sy})
  }

  useEffect(() => {
    calcScreen()
    window.addEventListener('resize', calcScreen)
    return () => window.removeEventListener('resize', calcScreen)
  }, [])

  if (isMobile) return (
    <main style={{width:'100vw',minHeight:'100vh',background:'#080808',fontFamily:'"Arial Black",Arial,sans-serif',display:'flex',flexDirection:'column'}}>

      {/* NAV mobile */}
      <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)',position:'absolute',top:0,left:0,right:0,zIndex:10}}>
        <img src="/logo.png" alt="Iconic Screen" style={{height:'44px',objectFit:'contain'}}/>
      </div>

      {/* HERO — sin deformar */}
      <img src="/hero.png" alt="Iconic Screen"
        style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',objectPosition:'center',display:'block'}}/>

      {/* BOTTOM MOBILE */}
      <div style={{flex:1,background:'#080808',padding:'24px 20px',display:'flex',flexDirection:'column',gap:'20px'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'8px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:'28px',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px',marginBottom:'4px'}}>
            Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'0.5px solid #222',borderBottom:'0.5px solid #222',padding:'16px 0'}}>
          <NYClock/>
          <LiveCounter/>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'14px',fontSize:'11px',fontWeight:900,letterSpacing:'2px',border:'1px solid #C9A84C',cursor:'pointer'}}>RESERVE YOUR SLOT</button>
        </div>

        <div style={{fontSize:'11px',color:'#444',fontFamily:'Arial',lineHeight:1.6,textAlign:'center'}}>
          Free to upload · $9 per hour slot
        </div>
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)}/>}
    </main>
  )

  return (
    <main style={{width:'100vw',height:'100vh',overflow:'hidden',position:'relative',fontFamily:'"Arial Black",Arial,sans-serif'}}>

      <img ref={imgRef} src="/hero.png" alt="Iconic Screen" onLoad={calcScreen}
        style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'fill',zIndex:0}}/>

      <Screen style={screenStyle}/>
      <AmazonPanel style={amzStyle}/>
      <ApplePanel style={adsStyle}/>

      <Nav onUpload={() => setShowModal(true)}/>

      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:4,padding:'20px 32px 32px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',background:'linear-gradient(to top,rgba(0,0,0,0.95) 60%,transparent)'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'6px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:'clamp(18px,2.5vw,32px)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px'}}>
            Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
          <NYClock/>
          <div style={{marginTop:'8px'}}><LiveCounter/></div>
        </div>

        <div style={{display:'flex',flexDirection:'row',gap:'12px',alignItems:'center'}}>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
        </div>
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)}/>}

    </main>
  )
}
