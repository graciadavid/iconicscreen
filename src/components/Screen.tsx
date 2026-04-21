'use client'
import { useUploads } from '@/hooks/useUploads'

type Props = {
  style: {top:number,left:number,width:number,height:number}
  isMobile?: boolean
}

export function Screen({ style, isMobile }: Props) {
  const { uploads, current } = useUploads()
  const currentUpload = uploads[current]

  const mobileStyle = {
    position:'fixed' as const,
    top:'70px',
    left:'50%',
    transform:'translateX(-50%)',
    width:'90vw',
    height:'50vw',
    zIndex:3,
    overflow:'hidden',
    background:'#000',
    border:'2px solid #C9A84C'
  }

  const desktopStyle = {
    position:'fixed' as const,
    top:style.top,
    left:style.left,
    width:style.width,
    height:style.height,
    zIndex:3,
    overflow:'hidden',
    background:'#000'
  }

  if (!isMobile && style.width === 0) return null

  return (
    <div style={isMobile ? mobileStyle : desktopStyle}>
      {currentUpload && (
        <img src={currentUpload.url} alt="on screen" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      )}
      <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px),repeating-linear-gradient(90deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px)',zIndex:4,pointerEvents:'none'}}/>
      {uploads.length > 1 && (
        <div style={{position:'absolute',bottom:'8px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'4px',zIndex:5}}>
          {uploads.map((_,i) => (
            <div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:i===current?'#C9A84C':'rgba(255,255,255,0.3)'}}/>
          ))}
        </div>
      )}
    </div>
  )
}
