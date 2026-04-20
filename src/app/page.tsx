export default function Home() {
  return (
    <main style={{background:'#080808',width:'100vw',height:'100vh',display:'flex',flexDirection:'column',fontFamily:'"Arial Black",Arial,sans-serif',overflow:'hidden'}}>

      {/* NAV */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 32px',borderBottom:'0.5px solid #1a1a1a'}}>
        <div style={{fontSize:'15px',fontWeight:900,color:'#C9A84C',letterSpacing:'4px'}}>ICONIC SCREEN</div>
        <div style={{display:'flex',gap:'28px'}}>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'#555',cursor:'pointer'}}>HOW IT WORKS</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'#555',cursor:'pointer'}}>PRICING</span>
          <span style={{fontSize:'10px',letterSpacing:'2px',color:'#555',cursor:'pointer'}}>LIVE</span>
        </div>
        <button style={{background:'#C9A84C',color:'#080808',padding:'9px 22px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>GET ON SCREEN</button>
      </nav>

      {/* BUILDINGS */}
      <div style={{display:'flex',gap:'6px',alignItems:'flex-end',padding:'24px 24px 0',flex:1}}>

        {/* LEFT */}
        <div style={{flex:1,height:'220px',marginTop:'40px',background:'#0c1118',display:'flex',flexDirection:'column'}}>
          <div style={{width:'86%',margin:'0 auto',height:'130px',marginTop:'16px',background:'#0f1e30',border:'0.5px solid #1a3050',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'4px'}}>
            <div style={{fontSize:'26px',fontWeight:900,color:'#4488cc'}}>G</div>
            <div style={{fontSize:'8px',letterSpacing:'1px',color:'#4488cc'}}>AdSense</div>
          </div>
        </div>

        {/* CENTER */}
        <div style={{flex:1.3,height:'260px',background:'#0c1118',display:'flex',flexDirection:'column'}}>
          <div style={{width:'86%',margin:'0 auto',height:'150px',marginTop:'16px',background:'#0f0f20',border:'1.5px solid #C9A84C',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#C9A84C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',color:'#080808',fontWeight:900}}>?</div>
            <div style={{fontSize:'9px',color:'#C9A84C',letterSpacing:'2px'}}>YOUR MOMENT HERE</div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{flex:1,height:'220px',marginTop:'40px',background:'#0c1118',display:'flex',flexDirection:'column'}}>
          <div style={{width:'86%',margin:'0 auto',height:'130px',marginTop:'16px',background:'#1a1000',border:'0.5px solid #3a2800',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontSize:'20px',fontWeight:900,color:'#FF9900'}}>amazon</div>
          </div>
        </div>

      </div>

      {/* COPY + CTA */}
      <div style={{padding:'20px 32px 24px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:'0.5px solid #111'}}>
        <div>
          <div style={{fontSize:'9px',letterSpacing:'4px',color:'#C9A84C',marginBottom:'8px'}}>THE WORLD&apos;S SCREEN</div>
          <div style={{fontSize:'28px',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'1px',marginBottom:'6px'}}>Your face.<br/><span style={{color:'#C9A84C'}}>The internet&apos;s billboard.</span></div>
          <div style={{fontSize:'12px',color:'#555',fontFamily:'Arial',fontWeight:400,lineHeight:1.5,maxWidth:'400px'}}>Upload your image or video. Appear where Nike and Apple advertise. Free forever — or reserve your exact moment.</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'flex-end',marginLeft:'32px'}}>
          <button style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'11px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>GET ON THE SCREEN</button>
          <button style={{background:'transparent',color:'#C9A84C',padding:'13px 24px',fontSize:'10px',fontWeight:900,letterSpacing:'2px',border:'0.5px solid #C9A84C',cursor:'pointer',whiteSpace:'nowrap'}}>RESERVE YOUR SLOT</button>
          <div style={{fontSize:'10px',color:'#333',fontFamily:'Arial',letterSpacing:'1px'}}>Free to upload · $9 per hour slot</div>
        </div>
      </div>

    </main>
  )
}
