import React, { useEffect, useMemo, useState } from 'react'
import { listRepairs } from '../api'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString()
}

function toCSV(rows) {
  if (!rows || rows.length === 0) return ''
  const keys = Object.keys(rows[0])
  const escape = v => `"${(''+v).replace(/"/g,'""')}"`
  return [keys.join(','), ...rows.map(r => keys.map(k=>escape(r[k] ?? '')).join(','))].join('\n')
}

export default function ListView(){
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(()=>{ load() }, [])
  async function load(){ setLoading(true); setRepairs(await listRepairs()); setLoading(false) }

  const filtered = useMemo(()=>{
    const Q = q.trim().toLowerCase()
    return repairs.filter(r => {
      if (Q) {
        const hay = [r.deviceType, r.repairDetails, r.customerId?.name, r.customerId?.email, r.customerId?.phone].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(Q)) return false
      }
      if (type !== 'All' && r.deviceType !== type) return false
      if (status !== 'All' && r.status !== status) return false
      if (from) {
        const fromD = new Date(from)
        if (new Date(r.repairDate) < fromD) return false
      }
      if (to) {
        const toD = new Date(to)
        // include whole day
        toD.setHours(23,59,59)
        if (new Date(r.repairDate) > toD) return false
      }
      return true
    })
  }, [repairs, q, type, status, from, to])

  function downloadCSV(){
    const rows = filtered.map(r=>({
      Type: r.deviceType,
      Brand: r.brand || 'N/A',
      Model: r.model || 'N/A',
      Serial: r.serial || 'N/A',
      Location: r.location || 'N/A',
      AssignedTo: r.assignedTo || 'N/A',
      CustomerID: r.customerId?._id ?? '',
      CustomerPhone: r.customerId?.phone ?? '',
      DateCheckIn: formatDate(r.repairDate),
      Status: r.status,
      Details: r.repairDetails
    }))
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `repairs_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deviceTypes = Array.from(new Set(['All', ...repairs.map(r=>r.deviceType || 'Other')]))
  const statuses = Array.from(new Set(['All', ...repairs.map(r=>r.status || 'Pending')]))

  return (
    <div className="listview-wrap">
      <div className="listview-controls">
        <input className="search" placeholder="Search by brand, model, serial, customer..." value={q} onChange={e=>setQ(e.target.value)} />
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value)}>
          {deviceTypes.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary" onClick={downloadCSV}>Download CSV</button>
      </div>

      <div className="table-wrap">
        <table className="list-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Serial number</th>
              <th>Location</th>
              <th>Assigned to</th>
              <th>Customer ID</th>
              <th>Customer phone</th>
              <th>Date check-in</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={11}>No records</td></tr>
            ) : filtered.map(r => (
              <tr key={r._id}>
                <td className="caps">{r.deviceType}</td>
                <td>{r.brand || '—'}</td>
                <td>{r.model || '—'}</td>
                <td>{r.serial || '—'}</td>
                <td>{r.location || '—'}</td>
                <td>{r.assignedTo || '—'}</td>
                <td>{r.customerId?._id ?? '—'}</td>
                <td>{r.customerId?.phone ?? '—'}</td>
                <td>{formatDate(r.repairDate)}</td>
                <td><span className={`badge status-${(r.status||'').toLowerCase().replace(/\s+/g,'-')}`}>{r.status}</span></td>
                <td>
                  <button>View</button>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
