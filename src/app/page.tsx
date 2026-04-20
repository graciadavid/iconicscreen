export default function Home() {
  return (
    <main style={{width:'100vw',height:'100vh',display:'flex',flexDirection:'column',fontFamily:'"Arial Black",Arial,sans-serif',overflow:'hidden',position:'relative'}}>

      {/* HERO IMAGE */}
      <div style={{position:'absolute',inset:0,backgroundImage:'url(/hero.png)',backgroundSize:'cover',backgroundPosition:'center top',zIndex:0}}/>

      {/* DARK OVERLAY */}
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',zIndex:1}}/>

      {/* NAV */}
      <nav style={{position:'relative',zIndex:2,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 32px',borderBottom:'0.5px solid rgba(255,255,255,0.1)'}}>
        <div style={{fontSize:'15px',fontWeight:900,color:'#C9A84C',letterSpacing:'4px'}}>ICONIC SCREEN</div>
        <div style={{display:'flex',gap:'28px'}}>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>HOW IT WORKS</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>PRICING</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>LIVE</span>
        </div>
        <button style={{background:'#C9A84C',color:'#080808',padding:'9px 22px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>GET ON SCREEN</button>
      </nav>

      {/* SPACER — buildings occupy most of the viewport */}
      <div style={{flex:1,position:'relative',zIndex:2}}/>

      {/* COPY + CTA */}
      <div style={{position:'relative',zIndex:2,padding:'20px 32px 32px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',background:'linear-gradient(to top, rgba(0,0,0,0.92) 80%, transparent)'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'8px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:'32px',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px',marginBottom:'8px'}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',fontFamily:'Arial',fontWeight:400,lineHeight:1.6,maxWidth:'420px'}}>Upload your image or video. Appear where Nike and Apple advertise. Free forever — or reserve your exact moment.</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'flex-end',marginLeft:'32px'}}>
          <button style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
          <div style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',fontFamily:'Arial',letterSpacing:'1px'}}>Free to upload · $9 per hour slot</div>
        </div>
      </div>

    </main>
  )
}
