const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

async function request(path, opts) {
  const res = await fetch(`${API_BASE}${path}`, opts)
  const contentType = res.headers.get('content-type') || ''
  let payload = null
  if (contentType.includes('application/json')) payload = await res.json()
  else payload = await res.text()
  if (!res.ok) throw new Error(payload && payload.error ? payload.error : 'Request failed')
  return payload
}

export async function listCustomers() {
  try {
    return await request('/api/customers')
  } catch (err) { console.error(err); return [] }
}

export async function createCustomer(body) {
  try {
    return await request('/api/customers', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify(body) })
  } catch (err) { console.error(err); return null }
}

export async function addRepair(customerId, body) {
  try {
    return await request(`/api/customers/${customerId}/repairs`, { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify(body) })
  } catch (err) { console.error(err); return null }
}

export async function getCustomer(customerId) {
  try {
    return await request(`/api/customers/${customerId}`)
  } catch (err) { console.error(err); return null }
}

export async function deleteCustomer(customerId) {
  try { return await request(`/api/customers/${customerId}`, { method: 'DELETE' }) } catch (err) { console.error(err); return null }
}

export async function updateCustomer(customerId, body) {
  try { return await request(`/api/customers/${customerId}`, { method: 'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(body) }) } catch (err) { console.error(err); return null }
}

export async function listRepairs() {
  try { return await request('/api/repairs') } catch (err) { console.error(err); return [] }
}

export async function updateRepair(repairId, body) {
  try { return await request(`/api/repairs/${repairId}`, { method: 'PUT', headers: { 'content-type':'application/json' }, body: JSON.stringify(body) }) } catch (err) { console.error(err); return null }
}

export async function deleteRepair(repairId) {
  try { return await request(`/api/repairs/${repairId}`, { method: 'DELETE' }) } catch (err) { console.error(err); return null }
}
