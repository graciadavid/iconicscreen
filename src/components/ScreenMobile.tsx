'use client'
import { useUploads } from '@/hooks/useUploads'
import { MOBILE_SCREEN } from '@/lib/mobileOverlays'

export function ScreenMobile() {
  const { current } = useUploads()
  return (
    <div style={{position:'absolute',...MOBILE_SCREEN,zIndex:3,overflow:'hidden',background:'#000'}}>
      {current && <img src={current.url} alt="on screen" style={{width:'100%',height:'100%',objectFit:'cover'}}/>}
      <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px),repeating-linear-gradient(90deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px)',zIndex:4,pointerEvents:'none'}}/>
    </div>
  )
}
