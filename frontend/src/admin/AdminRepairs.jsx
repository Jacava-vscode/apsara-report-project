import React, { useEffect, useState } from 'react'
import { listRepairs, updateRepair, deleteRepair } from '../api'

export default function AdminRepairs(){
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() }, [])
  async function load(){ setLoading(true); setRepairs(await listRepairs()); setLoading(false) }

  async function onUpdate(id, changes){ await updateRepair(id, changes); load() }
  async function onDelete(id){ if(!confirm('Delete repair?')) return; await deleteRepair(id); load() }

  return (
    <div style={{padding:16}}>
      <h2>Repair History Management</h2>
      {loading ? <p>Loading…</p> : (
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead><tr><th>Customer</th><th>Device</th><th>Date</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {repairs.map(r => (
              <tr key={r._id} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td>{r.customerId?.name}</td>
                <td>{r.deviceType}</td>
                <td>{new Date(r.repairDate).toLocaleString()}</td>
                <td style={{maxWidth:320}}>{r.repairDetails}</td>
                <td>
                  <select value={r.status} onChange={e=>onUpdate(r._id, { status: e.target.value })}>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                </td>
                <td>
                  <button onClick={()=>onDelete(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
