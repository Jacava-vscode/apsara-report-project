import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from './AdminDashboard'
import AdminCustomers from './AdminCustomers'
import AdminRepairs from './AdminRepairs'
import AdminQRCode from './AdminQRCode'
import AdminNotifications from './AdminNotifications'
import AdminSettings from './AdminSettings'

export default function AdminLayout() {
  const [section, setSection] = useState('dashboard')

  function renderSection() {
    switch (section) {
      case 'dashboard': return <AdminDashboard />
      case 'customers': return <AdminCustomers />
      case 'repairs': return <AdminRepairs />
      case 'qrcode': return <AdminQRCode />
      case 'notifications': return <AdminNotifications />
      case 'settings': return <AdminSettings />
      default: return <AdminDashboard />
    }
  }

  return (
    <div className="admin-wrap" style={{display:'flex', gap:16}}>
      <AdminSidebar active={section} onNavigate={s=>setSection(s)} />
      <div style={{flex:1}}>
        {renderSection()}
      </div>
    </div>
  )
}
