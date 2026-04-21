'use client'
import { useRef, useState } from 'react'
import { getNextFreeSlot } from '@/lib/getNextSlot'
import { supabase } from '@/lib/supabase'

type Mode = 'free' | 'reserve'

export function UploadModal({ onClose, mode = 'free' }: { onClose: () => void, mode?: Mode }) {
  const [uploading, setUploading] = useState(false)
  const [scheduledTime, setScheduledTime] = useState<string|null>(null)
  const [copied, setCopied] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [reserveDate, setReserveDate] = useState('')
  const [reserveHour, setReserveHour] = useState('')
  const [reserveMin, setReserveMin] = useState('00')
  const fileRef = useRef<HTMLInputElement>(null)

  async function getReserveSlot(): Promise<Date|null> {
    if (!reserveDate || !reserveHour) return null
    const [year, month, day] = reserveDate.split('-').map(Number)
    const dt = new Date(Date.UTC(year, month-1, day, Number(reserveHour), Number(reserveMin), 0))
    // Convertir de NY a UTC (NY es UTC-4 en verano)
    dt.setHours(dt.getHours() + 4)
    return dt
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const slot = mode === 'reserve' ? await getReserveSlot() : await getNextFreeSlot()
    if (!slot) { setUploading(false); return }

    const filename = `${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('uploads').upload(filename, file, { cacheControl: '3600', upsert: false })
    if (!error) {
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filename)
      await supabase.from('uploads').insert({ url: urlData.publicUrl, status: 'queued', scheduled_at: slot.toISOString() })
      setScheduledTime(slot.toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }))
    }
    setUploading(false)
  }

  function shareX() {
    const text = `My photo is going live on the world's most iconic screen at ${scheduledTime} NY time. Watch it live at iconicscreen.com #IconicScreen`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  function shareWhatsApp() {
    const text = `I'm going on the world's biggest digital billboard! Watch me live at iconicscreen.com My slot: ${scheduledTime} NY time`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  function copyLink() {
    navigator.clipboard.writeText(`Watch me live on the world's most iconic screen at ${scheduledTime} NY time - iconicscreen.com`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generar fechas próximas 30 días
  const dates = Array.from({length:30}, (_,i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const hours = Array.from({length:24}, (_,i) => String(i).padStart(2,'0'))
  const mins = ['00','15','30','45']

  const canUpload = agreed && (mode === 'free' || (reserveDate && reserveHour))

  if (scheduledTime) return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'#0a0a0a',border:'1px solid #C9A84C',padding:'36px',width:'min(400px,100%)',display:'flex',flexDirection:'column',gap:'20px',alignItems:'center',textAlign:'center'}}>
        <div style={{fontSize:'36px'}}>🎉</div>
        <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>YOU ARE ON THE SCREEN</div>
        <div style={{fontSize:'16px',fontWeight:900,color:'#fff',lineHeight:1.3}}>Your photo goes live on</div>
        <div style={{background:'#111',border:'0.5px solid #C9A84C',padding:'16px 24px',width:'100%'}}>
          <div style={{fontSize:'18px',fontWeight:900,color:'#C9A84C',lineHeight:1.3}}>{scheduledTime}</div>
          <div style={{fontSize:'10px',color:'#555',letterSpacing:'3px',marginTop:'4px'}}>NEW YORK TIME</div>
        </div>
        <div style={{fontSize:'11px',color:'#555',letterSpacing:'2px'}}>SHARE YOUR MOMENT</div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',width:'100%'}}>
          <button onClick={shareX} style={{background:'#000',color:'#fff',padding:'14px',fontSize:'12px',fontWeight:900,letterSpacing:'2px',border:'1px solid #333',cursor:'pointer'}}>SHARE ON X</button>
          <button onClick={shareWhatsApp} style={{background:'#25D366',color:'#fff',padding:'14px',fontSize:'12px',fontWeight:900,letterSpacing:'2px',border:'none',cursor:'pointer'}}>SHARE ON WHATSAPP</button>
          <button onClick={copyLink} style={{background:'transparent',color:copied?'#00cc66':'#C9A84C',padding:'14px',fontSize:'12px',fontWeight:900,letterSpacing:'2px',border:`1px solid ${copied?'#00cc66':'#C9A84C'}`,cursor:'pointer'}}>
            {copied ? 'COPIED!' : 'COPY LINK'}
          </button>
        </div>
        <button onClick={onClose} style={{background:'transparent',color:'#333',padding:'10px',fontSize:'11px',letterSpacing:'2px',border:'none',cursor:'pointer',width:'100%'}}>CLOSE</button>
      </div>
    </div>
  )

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',overflowY:'auto'}}>
      <div style={{background:'#0a0a0a',border:'1px solid #C9A84C',padding:'40px',width:'min(400px,100%)',display:'flex',flexDirection:'column',gap:'20px',margin:'auto'}}>

        <div style={{fontSize:'11px',letterSpacing:'4px',color:'#C9A84C'}}>
          {mode === 'reserve' ? 'RESERVE YOUR SLOT' : 'GET ON THE SCREEN'}
        </div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#fff',lineHeight:1.1}}>
          {mode === 'reserve' ? 'Choose your exact moment' : 'Upload your photo or video'}
        </div>

        {/* DATE/TIME PICKER — solo en reserve */}
        {mode === 'reserve' && (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{fontSize:'10px',color:'#555',letterSpacing:'3px'}}>SELECT DATE & TIME (NEW YORK)</div>
            <select value={reserveDate} onChange={e => setReserveDate(e.target.value)}
              style={{padding:'12px',background:'#111',border:'0.5px solid #333',color: reserveDate?'#fff':'#555',fontSize:'13px',fontFamily:'Arial',cursor:'pointer'}}>
              <option value="">— Select date —</option>
              {dates.map(d => (
                <option key={d} value={d}>{new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</option>
              ))}
            </select>
            <div style={{display:'flex',gap:'8px'}}>
              <select value={reserveHour} onChange={e => setReserveHour(e.target.value)}
                style={{flex:1,padding:'12px',background:'#111',border:'0.5px solid #333',color:reserveHour?'#fff':'#555',fontSize:'13px',fontFamily:'Arial',cursor:'pointer'}}>
                <option value="">HH</option>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={reserveMin} onChange={e => setReserveMin(e.target.value)}
                style={{flex:1,padding:'12px',background:'#111',border:'0.5px solid #333',color:'#fff',fontSize:'13px',fontFamily:'Arial',cursor:'pointer'}}>
                {mins.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{fontSize:'10px',color:'#444',fontFamily:'Arial'}}>All times in New York time (EST/EDT)</div>
          </div>
        )}

        {/* DISCLAIMER */}
        <div style={{background:'#111',border:'0.5px solid #333',padding:'16px',fontSize:'11px',color:'#666',fontFamily:'Arial',lineHeight:1.7}}>
          By uploading content to Iconic Screen, you confirm that:<br/>
          • You own all rights to this image or video<br/>
          • You have consent from all people shown<br/>
          • The content does not violate any laws<br/>
          • Iconic Screen is not liable for any claims arising from your content
        </div>

        <label style={{display:'flex',alignItems:'flex-start',gap:'12px',cursor:'pointer'}}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            style={{width:'18px',height:'18px',marginTop:'2px',accentColor:'#C9A84C',cursor:'pointer',flexShrink:0}}/>
          <span style={{fontSize:'12px',color:'#888',fontFamily:'Arial',lineHeight:1.5}}>
            I confirm I have the rights to this content and agree to the terms above
          </span>
        </label>

        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{display:'none'}}/>
        <button onClick={() => canUpload && fileRef.current?.click()} disabled={uploading || !canUpload}
          style={{background:canUpload?'#C9A84C':'#333',color:canUpload?'#080808':'#666',padding:'16px',fontSize:'12px',fontWeight:900,letterSpacing:'3px',border:'none',cursor:canUpload?'pointer':'not-allowed'}}>
          {uploading ? 'UPLOADING...' : 'CHOOSE FILE'}
        </button>

        <button onClick={onClose} style={{background:'transparent',color:'#555',padding:'12px',fontSize:'11px',letterSpacing:'2px',border:'0.5px solid #333',cursor:'pointer'}}>CANCEL</button>
      </div>
    </div>
  )
}
