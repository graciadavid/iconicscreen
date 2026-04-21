'use client'
import { useState, useEffect, useRef } from 'react'
import { Screen } from '@/components/Screen'
import { AmazonPanel } from '@/components/AmazonPanel'
import { ApplePanel } from '@/components/ApplePanel'
import { LiveCounter } from '@/components/LiveCounter'
import { NYClock } from '@/components/NYClock'
import { UploadModal } from '@/components/UploadModal'
import { ORIG_W, ORIG_H, SCREEN, AMZ, ADS } from '@/lib/constants'
import Image from 'next/image'

type BoxStyle = {top:number,left:number,width:number,height:number}
const empty = {top:0,left:0,width:0,height:0}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [screenStyle, setScreenStyle] = useState<BoxStyle>(empty)
  const [amzStyle, setAmzStyle] = useState<BoxStyle>(empty)
  const [adsStyle, setAdsStyle] = useState<BoxStyle>(empty)
  const desktopRef = useRef<HTMLImageElement>(null)
  const mobileRef = useRef<HTMLImageElement>(null)

  function calcOverlays(img: HTMLImageElement, relative: boolean) {
    const r = img.getBoundingClientRect()
    const sx = r.width / ORIG_W
    const sy = r.height / ORIG_H
    const ox = relative ? 0 : r.left
    const oy = relative ? 0 : r.top
    setScreenStyle({left:ox+SCREEN.X1*sx,top:oy+SCREEN.Y1*sy,width:(SCREEN.X2-SCREEN.X1)*sx,height:(SCREEN.Y2-SCREEN.Y1)*sy})
    setAmzStyle({left:ox+AMZ.X1*sx,top:oy+AMZ.Y1*sy,width:(AMZ.X2-AMZ.X1)*sx,height:(AMZ.Y2-AMZ.Y1)*sy})
    setAdsStyle({left:ox+ADS.X1*sx,top:oy+ADS.Y1*sy,width:(ADS.X2-ADS.X1)*sx,height:(ADS.Y2-ADS.Y1)*sy})
  }

  function calcScreen() {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    const img = mobile ? mobileRef.current : desktopRef.current
    if (img) calcOverlays(img, mobile)
  }

  useEffect(() => {
    calcScreen()
    window.addEventListener('resize', calcScreen)
    return () => window.removeEventListener('resize', calcScreen)
  }, [])

  return (
    <main style={{width:'100vw',height:isMobile?'auto':'100vh',overflow:isMobile?'visible':'hidden',background:'#080808',fontFamily:'"Arial Black",Arial,sans-serif'}}>

      {/* NAV */}
      {/* HERO */}
      {isMobile ? (
        <div style={{position:'relative',width:'100%'}}>
          <img ref={mobileRef} src="/hero.png" alt="Iconic Screen" onLoad={calcScreen}
            style={{width:'100%',display:'block',objectFit:'fill'}}/>
          {screenStyle.width > 0 && <Screen style={screenStyle} fixed={false}/>}
          {amzStyle.width > 0 && <AmazonPanel style={amzStyle} fixed={false}/>}
          {adsStyle.width > 0 && <ApplePanel style={adsStyle} fixed={false}/>}
        </div>
      ) : (
        <div style={{position:'relative',width:'100vw',height:'100vh',overflow:'hidden'}}>
          <img ref={desktopRef} src="/hero.png" alt="Iconic Screen" onLoad={calcScreen}
            style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'fill',zIndex:0}}/>
          {screenStyle.width > 0 && <Screen style={screenStyle}/>}
          {amzStyle.width > 0 && <AmazonPanel style={amzStyle}/>}
          {adsStyle.width > 0 && <ApplePanel style={adsStyle}/>}
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:4,padding:'20px 32px 32px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',background:'linear-gradient(to top,rgba(0,0,0,0.95) 60%,transparent)'}}>
            <div>
              <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'6px'}}>THE WORLD&apos;S SCREEN</div>
              <div style={{fontSize:'clamp(18px,2.5vw,32px)',fontWeight:900,color:'#fff',lineHeight:1.1}}>
                Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
              <NYClock/>
              <LiveCounter/>
            </div>
            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
              <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM */}
      {isMobile && (
        <div style={{padding:'24px 20px 32px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 0',borderBottom:'0.5px solid #1a1a1a'}}>
            <NYClock/>
            <LiveCounter/>
          </div>
          <button onClick={() => setShowModal(true)} style={{background:'#C9A84C',color:'#080808',padding:'18px',fontSize:'13px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',width:'100%'}}>
            GET ON THE SCREEN
          </button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'2px',border:'1px solid #C9A84C',cursor:'pointer',width:'100%'}}>
            RESERVE YOUR SLOT
          </button>
          <div style={{fontSize:'11px',color:'#333',fontFamily:'Arial',textAlign:'center'}}>
            Free to upload · $9 per hour slot
          </div>
        </div>
      )}

      {showModal && <UploadModal onClose={() => setShowModal(false)}/>}
    </main>
  )
}
