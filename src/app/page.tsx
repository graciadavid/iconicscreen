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
  const imgRef = useRef<HTMLImageElement>(null)
  const mobileImgRef = useRef<HTMLImageElement>(null)

  function calcOverlays(img: HTMLImageElement) {
    const r = img.getBoundingClientRect()
    const sx = r.width / ORIG_W
    const sy = r.height / ORIG_H
    setScreenStyle({left:r.left+SCREEN.X1*sx,top:r.top+SCREEN.Y1*sy,width:(SCREEN.X2-SCREEN.X1)*sx,height:(SCREEN.Y2-SCREEN.Y1)*sy})
    setAmzStyle({left:r.left+AMZ.X1*sx,top:r.top+AMZ.Y1*sy,width:(AMZ.X2-AMZ.X1)*sx,height:(AMZ.Y2-AMZ.Y1)*sy})
    setAdsStyle({left:r.left+ADS.X1*sx,top:r.top+ADS.Y1*sy,width:(ADS.X2-ADS.X1)*sx,height:(ADS.Y2-ADS.Y1)*sy})
  }

  function calcScreen() {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    const img = mobile ? mobileImgRef.current : imgRef.current
    if (img) calcOverlays(img)
  }

  useEffect(() => {
    calcScreen()
    window.addEventListener('resize', calcScreen)
    return () => window.removeEventListener('resize', calcScreen)
  }, [])

  return (
    <main style={{width:'100vw',minHeight:'100vh',background:'#080808',fontFamily:'"Arial Black",Arial,sans-serif'}}>

      {/* NAV */}
      <nav style={{
        background:'#080808',
        padding: isMobile ? '14px 20px' : '12px 32px',
        display:'flex',
        justifyContent: isMobile ? 'center' : 'flex-start',
        alignItems:'center',
        borderBottom:'0.5px solid #1a1a1a',
        position:'relative',
        zIndex:10
      }}>
        {isMobile && (
          <button onClick={() => setShowModal(true)} style={{position:'absolute',right:'20px',top:'50%',transform:'translateY(-50%)',background:'#C9A84C',color:'#080808',padding:'8px 14px',fontSize:'9px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>GET ON SCREEN</button>
        )}
        <Image src="/logo.png" alt="Iconic Screen" width={isMobile?160:200} height={isMobile?60:75} style={{objectFit:'contain'}}/>
      </nav>

      {/* HERO — imagen con overlays */}
      <div style={{position:'relative',width:'100%'}}>
        <img
          ref={isMobile ? mobileImgRef : imgRef}
          src="/hero.png"
          alt="Iconic Screen"
          onLoad={calcScreen}
          style={{
            width:'100%',
            height: isMobile ? 'auto' : '100vh',
            objectFit: isMobile ? 'cover' : 'fill',
            display:'block'
          }}
        />

        {screenStyle.width > 0 && <Screen style={screenStyle}/>}
        {amzStyle.width > 0 && <AmazonPanel style={amzStyle}/>}
        {adsStyle.width > 0 && <ApplePanel style={adsStyle}/>}

        {/* Desktop bottom bar */}
        {!isMobile && (
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
        )}
      </div>

      {/* Mobile bottom section */}
      {isMobile && (
        <div style={{background:'#080808',padding:'24px 20px 32px',display:'flex',flexDirection:'column',gap:'16px'}}>
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
          <div style={{fontSize:'11px',color:'#333',fontFamily:'Arial',textAlign:'center',letterSpacing:'1px'}}>
            Free to upload · $9 per hour slot
          </div>
        </div>
      )}

      {showModal && <UploadModal onClose={() => setShowModal(false)}/>}

    </main>
  )
}
