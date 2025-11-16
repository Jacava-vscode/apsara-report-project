import React from 'react'

export default function AdminSidebar({ active, onNavigate }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'customers', label: 'Customer Management' },
    { key: 'repairs', label: 'Repair History' },
    { key: 'qrcode', label: 'QR Codes' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'settings', label: 'Settings' }
  ]

  return (
    <aside className="admin-sidebar" style={{width:220}}>
      <div style={{padding:16, borderBottom:'1px solid #eee'}}>
        <strong>Admin Panel</strong>
      </div>
      <nav>
        <ul style={{listStyle:'none', margin:0, padding:8}}>
          {items.map(i => (
            <li key={i.key} style={{marginBottom:6}}>
              <button aria-current={active===i.key} onClick={() => onNavigate(i.key)} style={{width:'100%', textAlign:'left', padding:10, border:0, background: active===i.key ? '#eef6ff' : 'transparent', cursor:'pointer'}}>
                {i.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
