import React, { useEffect, useState } from 'react'
import { listCustomers, createCustomer } from './api'
import Toast from './components/Toast'
import CustomerList from './components/CustomerList'
import AdminLayout from './admin/AdminLayout'
import React from 'react'

// Lazy load ListView to keep bundle small
const ListViewWrapper = React.lazy(() => import('./components/ListView'))

export default function App() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null) // { type: 'success'|'error', text }
  const [view, setView] = useState('dashboard') // 'dashboard' | 'data' | 'list' | 'admin'

  useEffect(() => { fetchCustomers() }, [])

  async function fetchCustomers() {
    try {
      setLoading(true)
      const res = await listCustomers()
      setCustomers(res || [])
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Failed to load customers' })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    // basic front-end validation
    if (!form.name.trim() || !form.email.trim()) {
      setToast({ type: 'error', text: 'Name and email are required' })
      return
    }
    try {
      setSubmitting(true)
      const created = await createCustomer(form)
      if (created && created._id) {
        setToast({ type: 'success', text: 'Customer created' })
        setForm({ name: '', email: '', phone: '', address: '' })
        fetchCustomers()
      } else {
        setToast({ type: 'error', text: 'Failed to create customer' })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Unexpected error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Repair form state
  const [repairFor, setRepairFor] = useState(null) // customerId
  const [repairForm, setRepairForm] = useState({ deviceType: 'Computer', repairDetails: '', status: 'In Progress' })

  async function openRepairForm(customerId) {
    setRepairFor(customerId)
    setRepairForm({ deviceType: 'Computer', repairDetails: '', status: 'In Progress' })
  }

  async function submitRepair(e) {
    e.preventDefault()
    if (!repairFor) return
    if (!repairForm.deviceType || !repairForm.repairDetails.trim()) {
      setToast({ type: 'error', text: 'Please provide device type and repair details' })
      return
    }
    try {
      setSubmitting(true)
      const res = await import('./api').then(m => m.addRepair(repairFor, repairForm))
      if (res && res._id) {
        setToast({ type: 'success', text: 'Repair entry added' })
        setRepairFor(null)
        setRepairForm({ deviceType: 'Computer', repairDetails: '', status: 'In Progress' })
        fetchCustomers()
      } else {
        setToast({ type: 'error', text: 'Failed to add repair' })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Unexpected error adding repair' })
    } finally {
      setSubmitting(false)
    }
  }

  // Small helpers for dashboard
  const totalCustomers = customers.length
  const recentCustomers = customers.slice(0, 5)

  function renderView() {
    switch (view) {
      case 'dashboard':
        return (
          <section className="panel" aria-labelledby="dashboard-title">
            <h2 id="dashboard-title">Dashboard</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="panel" style={{padding:12}}>
                <h3>Total Customers</h3>
                <div style={{fontSize:28}}>{totalCustomers}</div>
              </div>
              <div className="panel" style={{padding:12}}>
                <h3>Recent Customers</h3>
                <ul>
                  {recentCustomers.map(c => <li key={c._id}>{c.name} — {c.email}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )
      case 'data':
        return (
          <section className="panel" id="create">
            <h2>Data Entry</h2>
            <form onSubmit={onSubmit} aria-labelledby="create">
              <label htmlFor="name">Name</label>
              <input id="name" required aria-required="true" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />

              <label htmlFor="email">Email</label>
              <input id="email" type="email" required aria-required="true" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />

              <label htmlFor="phone">Phone</label>
              <input id="phone" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />

              <label htmlFor="address">Address</label>
              <input id="address" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />

              <button type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? 'Creating…' : 'Create'}</button>
            </form>

            <div style={{marginTop:16}}>
              <h3>Quick Actions</h3>
              <p>Use the Listview to add repairs to specific customers.</p>
            </div>
          </section>
        )
      case 'list':
        return (
          <section className="panel" id="listview">
            <h2>Listview</h2>
            <div style={{marginTop:8}}>
              <CustomerList customers={customers} onAddRepair={openRepairForm} onRefresh={fetchCustomers} />
            </div>
            <div style={{marginTop:18}}>
              <h3>Advanced Listview</h3>
              <p>Device / repairs combined table with filters:</p>
              <div style={{marginTop:8}}>
                <React.Suspense fallback={<div>Loading listview…</div>}>
                  <ListViewWrapper />
                </React.Suspense>
              </div>
            </div>
          </section>
        )
      case 'admin':
        return <AdminLayout />
      default:
        return null
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="container">
          <h1>Apsara Report</h1>
          <nav aria-label="Main navigation">
            <button onClick={()=>setView('dashboard')} aria-current={view==='dashboard'}>Dashboard</button>
            <button onClick={()=>setView('data')} aria-current={view==='data'}>Data Entry</button>
            <button onClick={()=>setView('list')} aria-current={view==='list'}>Listview</button>
            <button onClick={()=>setView('admin')} aria-current={view==='admin'}>Admin Panel</button>
          </nav>
        </div>
      </header>

      <main className="container">
        {renderView()}
      </main>

      <Toast data={toast} onClose={() => setToast(null)} />
    </div>
  )
}
