import React, { useEffect, useState } from 'react'
import { listCustomers, listRepairs } from '../api'

export default function AdminDashboard(){
  const [metrics, setMetrics] = useState({ customers:0, repairs:0, activeRepairs:0 })
  const [recentRepairs, setRecentRepairs] = useState([])

  useEffect(()=>{ load() }, [])
  async function load(){
    try{
      const customers = await listCustomers()
      const repairs = await listRepairs()
      const active = repairs.filter(r=> r.status === 'In Progress').length
      setMetrics({ customers: customers.length, repairs: repairs.length, activeRepairs: active })
      setRecentRepairs(repairs.slice(0,6))
    }catch(err){ console.error(err) }
  }

  return (
    <div style={{padding:16}}>
      <h2>Dashboard</h2>
      <div style={{display:'flex',gap:12,marginTop:12}}>
        <div className="panel" style={{flex:1}}>
          <h3>Total Customers</h3>
          <div style={{fontSize:28}}>{metrics.customers}</div>
        </div>
        <div className="panel" style={{flex:1}}>
          <h3>Total Repairs</h3>
          <div style={{fontSize:28}}>{metrics.repairs}</div>
        </div>
        <div className="panel" style={{flex:1}}>
          <h3>Active Repairs</h3>
          <div style={{fontSize:28}}>{metrics.activeRepairs}</div>
        </div>
      </div>

      <div style={{marginTop:16}}>
        <h3>Recent Repairs</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left'}}><th>Customer</th><th>Device</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recentRepairs.map(r => (
              <tr key={r._id}><td>{r.customerId?.name}</td><td>{r.deviceType}</td><td>{new Date(r.repairDate).toLocaleString()}</td><td>{r.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
