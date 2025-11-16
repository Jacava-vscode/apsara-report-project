import React from 'react'

export default function AdminNotifications(){
  const sample = [
    { id:1, text: 'Database backup completed', level: 'info' },
    { id:2, text: '3 repairs pending review', level: 'warning' }
  ]
  return (
    <div style={{padding:16}}>
      <h2>Notifications</h2>
      <ul>
        {sample.map(n => <li key={n.id}><strong>{n.level.toUpperCase()}:</strong> {n.text}</li>)}
      </ul>
    </div>
  )
}
