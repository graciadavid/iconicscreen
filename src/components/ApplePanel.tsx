'use client'

type Props = {
  style: {top:number,left:number,width:number,height:number}
  fixed?: boolean
}

export function ApplePanel({ style, fixed = true }: Props) {
  if (style.width === 0) return null
  return (
    <div style={{position:fixed?'fixed':'absolute',top:style.top,left:style.left,width:style.width,height:style.height,zIndex:3,display:'flex',alignItems:'center',justifyContent:'center',background:'#ff0000'}}>
      <img src="/cocacola.png" alt="Coca Cola" style={{width:'80%',height:'80%',objectFit:'contain'}}/>
    </div>
  )
}
