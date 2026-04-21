'use client'
import { AMAZON_TAG } from '@/lib/constants'

type Props = {
  fixed?: boolean
  style: {top:number,left:number,width:number,height:number}
}

export function AmazonPanel({ style }: Props) {
  if (style.width === 0) return null
  return (
    <div
      onClick={() => window.open(`https://www.amazon.com/deals?tag=${AMAZON_TAG}`, '_blank')}
      style={{position:'fixed',top:style.top,left:style.left,width:style.width,height:style.height,zIndex:3,display:'flex',alignItems:'flex-end',justifyContent:'center',cursor:'pointer',paddingBottom:'4%'}}
    >
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'clamp(10px,1.5vw,18px)',fontWeight:900,color:'#FF9900',letterSpacing:'3px',animation:'pulse 1.5s ease-in-out infinite'}}>TODAY&apos;S DEALS</div>
        <div style={{fontSize:'clamp(8px,1vw,12px)',color:'#ffffff',letterSpacing:'2px',marginTop:'8px'}}>CLICK TO SHOP</div>
      </div>
    </div>
  )
}
