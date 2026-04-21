'use client'
import { MOBILE_ADS } from '@/lib/mobileOverlays'

export function AppleMobile() {
  return (
    <div style={{position:'absolute',...MOBILE_ADS,zIndex:3,display:'flex',alignItems:'center',justifyContent:'center',background:'#ff0000'}}>
      <img src="/cocacola.png" alt="Coca Cola" style={{width:'80%',height:'80%',objectFit:'contain'}}/>
    </div>
  )
}
