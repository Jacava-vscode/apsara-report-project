import React, { useEffect, useState } from 'react'
import { listCustomers } from '../api'

export default function AdminQRCode(){
  const [customers, setCustomers] = useState([])

  useEffect(()=>{ listCustomers().then(setCustomers).catch(()=>{}) }, [])

  return (
    <div style={{padding:16}}>
      <h2>QR Code Management</h2>
      <p>Generate and view QR codes for customers.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
        {customers.map(c => (
          <div key={c._id} style={{padding:12,background:'#fff',border:'1px solid #eee',borderRadius:8}}>
            <div style={{fontWeight:600}}>{c.name}</div>
            <div style={{fontSize:13,color:'#666'}}>{c.email}</div>
            {c.qrCode ? <img src={c.qrCode} alt={`QR for ${c.name}`} style={{width:'100%',marginTop:8}}/> : <div style={{marginTop:8,color:'#999'}}>No QR</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
