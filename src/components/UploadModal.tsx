'use client'
import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function UploadModal({ onClose }: { onClose: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [scheduledTime, setScheduledTime] = useState<string|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function getNextSlot(): Promise<Date> {
    const { data } = await supabase
      .from('uploads')
      .select('scheduled_at')
      .eq('status', 'queued')
      .order('scheduled_at', {ascending: false})
      .limit(1)
      .single()

    if (data?.scheduled_at) {
      const last = new Date(data.scheduled_at)
      last.setMinutes(last.getMinutes() + 1)
      last.setSeconds(0, 0)
      return last
    }

    const now = new Date()
    now.setSeconds(0, 0)
    now.setMinutes(now.getMinutes() + 1)
    return now
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const nextSlot = await getNextSlot()
    const filename = `${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (!error) {
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filename)
      await supabase.from('uploads').insert({
        url: urlData.publicUrl,
        status: 'queued',
        scheduled_at: nextSlot.toISOString()
      })
      setScheduledTime(nextSlot.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }))
    }
    setUploading(false)
  }

  if (scheduledTime) return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#0a0a0a',border:'1px solid #C9A84C',padding:'40px',width:'min(380px,90vw)',display:'flex',flexDirection:'column',gap:'20px',alignItems:'center',textAlign:'center'}}>
        <div style={{fontSize:'40px'}}>🎉</div>
        <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>YOU&apos;RE ON THE SCREEN</div>
        <div style={{fontSize:'18px',fontWeight:900,color:'#fff',lineHeight:1.3}}>Your photo will appear on</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#C9A84C',lineHeight:1.3}}>{scheduledTime}</div>
        <div style={{fontSize:'11px',color:'#555',letterSpacing:'2px'}}>NEW YORK TIME</div>
        <button onClick={onClose} style={{background:'#C9A84C',color:'#080808',padding:'14px 32px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer',width:'100%',marginTop:'8px'}}>
          AWESOME
        </button>
      </div>
    </div>
  )

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#0a0a0a',border:'1px solid #C9A84C',padding:'40px',width:'min(380px,90vw)',display:'flex',flexDirection:'column',gap:'20px'}}>
        <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>GET ON THE SCREEN</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#fff',lineHeight:1.1}}>Upload your photo<br/>or video</div>
        <div style={{fontSize:'12px',color:'#555',fontFamily:'Arial',lineHeight:1.6}}>Your content will appear on the world&apos;s most iconic screen. Free forever.</div>
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{display:'none'}}/>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{background:'#C9A84C',color:'#080808',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:'pointer'}}>
          {uploading ? 'UPLOADING...' : 'CHOOSE FILE'}
        </button>
        <button onClick={onClose} style={{background:'transparent',color:'#555',padding:'12px',fontSize:'11px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>CANCEL</button>
      </div>
    </div>
  )
}
