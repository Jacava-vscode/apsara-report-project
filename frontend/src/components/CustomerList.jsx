import React, { useState } from 'react'
import { getCustomer } from '../api'

export default function CustomerList({ customers = [], onAddRepair, onRefresh }) {
  const [expanded, setExpanded] = useState(null)
  const [repairsMap, setRepairsMap] = useState({})
  const [loadingId, setLoadingId] = useState(null)

  async function toggleExpand(id) {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    if (repairsMap[id]) return
    try {
      setLoadingId(id)
      const data = await getCustomer(id)
      setRepairsMap(prev => ({ ...prev, [id]: (data && data.repairs) || [] }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <ul>
      {customers.map(c => (
        <li key={c._id} className="customer">
          <div className="info">
            <strong>{c.name}</strong>
            <div className="meta">{c.email} — {c.phone || '—'}</div>
          </div>

          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <button type="button" onClick={() => onAddRepair && onAddRepair(c._id)}>Add Repair</button>
            <button type="button" onClick={() => toggleExpand(c._id)} aria-expanded={expanded===c._id}>{expanded===c._id ? 'Hide' : 'View Repairs'}</button>
            {c.qrCode && <div className="qr"><img src={c.qrCode} alt={`QR code for ${c.name}`} /></div>}
          </div>

          {expanded === c._id && (
            <div style={{marginTop:8}}>
              {loadingId === c._id ? <div>Loading repairs…</div> : (
                <div>
                  {repairsMap[c._id] && repairsMap[c._id].length === 0 && <div>No repairs</div>}
                  {repairsMap[c._id] && repairsMap[c._id].length > 0 && (
                    <ul style={{paddingLeft:12}}>
                      {repairsMap[c._id].map(r => (
                        <li key={r._id} style={{marginBottom:6}}>
                          <div><strong>{r.deviceType}</strong> — {new Date(r.repairDate).toLocaleString()}</div>
                          <div style={{color:'#555'}}>{r.repairDetails}</div>
                          <div style={{fontSize:12, color:'#777'}}>Status: {r.status}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

        </li>
      ))}
    </ul>
  )
}
