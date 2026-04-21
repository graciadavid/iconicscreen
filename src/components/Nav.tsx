'use client'
import Image from 'next/image'

export function Nav({ onUpload }: { onUpload: () => void }) {
  return (
    <nav style={{position:'relative',zIndex:4,display:'flex',justifyContent:'flex-start',alignItems:'center',padding:'12px 32px',background:'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)'}}>
      <Image src="/logo.png" alt="Iconic Screen" width={200} height={75} style={{objectFit:'contain'}}/>
    </nav>
  )
}
