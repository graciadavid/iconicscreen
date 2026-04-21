'use client'
import { useViewers } from '@/hooks/useViewers'

export function LiveCounter({ small }: { small?: boolean }) {
  const viewers = useViewers()
  return (
    <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
        <div style={{width: small?'6px':'8px',height:small?'6px':'8px',borderRadius:'50%',background:'#ff4444',animation:'pulse 1s ease-in-out infinite'}}/>
        <div style={{fontSize:small?'16px':'clamp(18px,2vw,28px)',fontWeight:900,color:'#ffffff',letterSpacing:'2px'}}>
          {viewers.toLocaleString('en-US')}
        </div>
      </div>
      <div style={{fontSize:small?'8px':'10px',color:'rgba(255,255,255,0.5)',letterSpacing:'3px'}}>WATCHING LIVE NOW</div>
    </div>
  )
}
