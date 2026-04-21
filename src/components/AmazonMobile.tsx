'use client'
import { MOBILE_AMZ } from '@/lib/mobileOverlays'
import { AMAZON_TAG } from '@/lib/constants'

export function AmazonMobile() {
  return (
    <div onClick={() => window.open(`https://www.amazon.com/deals?tag=${AMAZON_TAG}`, '_blank')}
      style={{position:'absolute',...MOBILE_AMZ,zIndex:3,display:'flex',alignItems:'flex-end',justifyContent:'center',cursor:'pointer',paddingBottom:'4%'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'clamp(7px,2.5vw,14px)',fontWeight:900,color:'#FF9900',letterSpacing:'2px',animation:'pulse 1.5s ease-in-out infinite'}}>TODAY&apos;S DEALS</div>
        <div style={{fontSize:'clamp(6px,2vw,11px)',color:'#fff',letterSpacing:'1px',marginTop:'4px'}}>CLICK TO SHOP</div>
      </div>
    </div>
  )
}
