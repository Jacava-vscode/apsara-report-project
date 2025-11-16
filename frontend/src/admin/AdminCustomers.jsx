import React, { useEffect, useState } from 'react'
import { listCustomers, deleteCustomer, updateCustomer } from '../api'

export default function AdminCustomers(){
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  useEffect(()=>{ load() }, [])
  async function load(){ setLoading(true); setCustomers(await listCustomers()); setLoading(false) }

  async function onDelete(id){ if(!confirm('Delete customer?')) return; await deleteCustomer(id); load() }

  function startEdit(c){ setEditing(c._id); setForm({ name:c.name, email:c.email, phone:c.phone, address:c.address }) }

  async function saveEdit(){ await updateCustomer(editing, form); setEditing(null); load() }

  return (
    <div style={{padding:16}}>
      <h2>Customer Management</h2>
      {loading ? <p>Loading…</p> : (
        <table style={{width:'100%'}}>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c._id}>
                <td>{editing===c._id ? <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /> : c.name}</td>
                <td>{editing===c._id ? <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /> : c.email}</td>
                <td>{editing===c._id ? <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /> : c.phone}</td>
                <td>
                  {editing===c._id ? (<>
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={()=>setEditing(null)}>Cancel</button>
                  </>) : (<>
                    <button onClick={()=>startEdit(c)}>Edit</button>
                    <button onClick={()=>onDelete(c._id)}>Delete</button>
                  </>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
