'use client'
import { useState, useEffect, useRef } from 'react'
import { Screen } from '@/components/Screen'
import { AmazonPanel } from '@/components/AmazonPanel'
import { ApplePanel } from '@/components/ApplePanel'
import { ScreenMobile } from '@/components/ScreenMobile'
import { AmazonMobile } from '@/components/AmazonMobile'
import { AppleMobile } from '@/components/AppleMobile'
import { LiveCounter } from '@/components/LiveCounter'
import { NYClock } from '@/components/NYClock'
import { UploadModal } from '@/components/UploadModal'
import { ORIG_W, ORIG_H, SCREEN, AMZ, ADS } from '@/lib/constants'

type BoxStyle = {top:number,left:number,width:number,height:number}
const empty = {top:0,left:0,width:0,height:0}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'free'|'reserve'>('free')
  const [isMobile, setIsMobile] = useState(false)
  const [screenStyle, setScreenStyle] = useState<BoxStyle>(empty)
  const [amzStyle, setAmzStyle] = useState<BoxStyle>(empty)
  const [adsStyle, setAdsStyle] = useState<BoxStyle>(empty)
  const imgRef = useRef<HTMLImageElement>(null)

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
    if (!mobile && imgRef.current) calcOverlays(imgRef.current)
  }

  useEffect(() => {
    calcScreen()
    window.addEventListener('resize', calcScreen)
    return () => window.removeEventListener('resize', calcScreen)
  }, [])

  if (isMobile) return (
    <main style={{width:'100vw',background:'#080808',fontFamily:'"Arial Black",Arial,sans-serif',paddingBottom:'80px'}}>
      <div style={{textAlign:'center',padding:'12px 0 8px',background:'#080808'}}>
        <img src="/logo.png" alt="Iconic Screen" style={{height:'50px',objectFit:'contain'}}/>
      </div>
      <div style={{position:'relative',width:'100%'}}>
        <img src="/hero.png" alt="Iconic Screen" style={{width:'100%',display:'block'}}/>
        <ScreenMobile/>
        <AmazonMobile/>
        <AppleMobile/>
      </div>
      <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'0.5px solid #1a1a1a'}}>
        <NYClock/>
        <LiveCounter/>
      </div>
      <div style={{padding:'16px 20px 8px',textAlign:'center'}}>
        <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'6px'}}>THE WORLD&apos;S SCREEN</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#fff',lineHeight:1.1}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
      </div>
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:10,background:'#C9A84C',padding:'12px 16px',display:'flex',gap:'10px'}}>
        <button onClick={() => { setModalMode('free'); setShowModal(true) }}
          style={{flex:1,background:'#080808',color:'#C9A84C',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>
          GET ON SCREEN
        </button>
        <button onClick={() => { setModalMode('reserve'); setShowModal(true) }}
          style={{flex:1,background:'transparent',color:'#080808',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'2px',border:'1px solid #080808',cursor:'pointer'}}>
          RESERVE SLOT
        </button>
      </div>
      {showModal && <UploadModal onClose={() => setShowModal(false)} mode={modalMode}/>}
    </main>
  )

  return (
    <main style={{width:'100vw',height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',fontFamily:'"Arial Black",Arial,sans-serif',background:'#080808'}}>

      {/* NAV */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 32px',background:'#080808',borderBottom:'0.5px solid #1a1a1a',flexShrink:0,zIndex:5}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}><img src="/logo.png" alt="Iconic Screen" style={{height:"52px",objectFit:"contain"}}/><LiveCounter small/></div>
        <div style={{fontSize:'clamp(14px,1.5vw,20px)',fontWeight:900,color:'#fff',lineHeight:1.1,textAlign:'center',position:'absolute',left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap'}}>
          Your face. <span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={() => { setModalMode('free'); setShowModal(true) }}
              style={{background:'#C9A84C',color:'#080808',padding:'10px 20px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>
              GET ON THE SCREEN
            </button>
            <button onClick={() => { setModalMode('reserve'); setShowModal(true) }}
              style={{background:'transparent',color:'#C9A84C',padding:'9px 16px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>
              RESERVE YOUR SLOT
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{position:'relative',flex:1,overflow:'hidden'}}>
        <img ref={imgRef} src="/hero.png" alt="Iconic Screen" onLoad={calcScreen}
          style={{width:'100%',height:'100%',objectFit:'fill',display:'block'}}/>
        {screenStyle.width > 0 && <Screen style={screenStyle}/>}
        {amzStyle.width > 0 && <AmazonPanel style={amzStyle}/>}
        {adsStyle.width > 0 && <ApplePanel style={adsStyle}/>}

        {/* CLOCK BOTTOM CENTER */}
        <div style={{position:'absolute',bottom:'48px',left:'50%',transform:'translateX(-50%)',zIndex:4}}>
          <NYClock/><div style={{marginTop:"8px"}}><LiveCounter/></div>
        </div>
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} mode={modalMode}/>}
    </main>
  )
}
