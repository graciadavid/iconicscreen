'use client'
import { useViewers } from '@/hooks/useViewers'

export function LiveCounter() {
  const viewers = useViewers()
  return (
    <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ff4444',animation:'pulse 1s ease-in-out infinite'}}/>
        <div style={{fontSize:'clamp(18px,2vw,28px)',fontWeight:900,color:'#ffffff',letterSpacing:'2px'}}>
          {viewers.toLocaleString('en-US')}
        </div>
      </div>
      <div style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',letterSpacing:'3px'}}>WATCHING LIVE NOW</div>
    </div>
  )
}
