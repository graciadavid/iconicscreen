'use client'

type Props = {
  style: {top:number,left:number,width:number,height:number}
  fixed?: boolean
}

export function ApplePanel({ style, fixed = true }: Props) {
  if (style.width === 0) return null
  return (
    <div style={{position:fixed?'fixed':'absolute',top:style.top,left:style.left,width:style.width,height:style.height,zIndex:3,display:'flex',alignItems:'center',justifyContent:'center',background:'#ffffff'}}>
      <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
        <svg width="32" height="38" viewBox="0 0 814 1000" fill="#000">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.8 268.9-317.8 71 0 130 46.4 174.4 46.4 42.6 0 109.2-49.9 189.5-49.9 30.5 0 108.2 2.6 168.1 80.6zm-126.7-85.4c-5.2-31.2-16.7-62.9-41-89.2-31.5-34.8-83.5-58.7-132.1-58.7-3.2 0-6.5.3-9.7.6 1.9 32.4 13.8 63.7 37.4 92.7 27.3 33.1 72.5 60.8 145.4 60.8z"/>
        </svg>
        <div style={{fontSize:'clamp(7px,1vw,13px)',fontWeight:900,color:'#000',letterSpacing:'2px'}}>Think Different.</div>
        <div style={{fontSize:'clamp(6px,0.8vw,10px)',color:'#555',letterSpacing:'1px'}}>apple.com</div>
      </div>
    </div>
  )
}
