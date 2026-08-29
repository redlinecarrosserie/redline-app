'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function VehiclePage() {
const params = useParams()
const id = params.id as string

const [vehicle, setVehicle] = useState<any>(null)
const [tasks, setTasks] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
async function loadVehicle() {
const { data: vehicleData } = await supabase
.from('vehicles')
.select('*')
.eq('id', id)
.single()

const { data: taskData } = await supabase
.from('repair_tasks')
.select('*')
.eq('vehicle_id', id)

setVehicle(vehicleData)
setTasks(taskData || [])
setLoading(false)
}

if (id) loadVehicle()
}, [id])
  if (loading) {
return <div className="main">Chargement...</div>
}

if (!vehicle) {
return <div className="main">Véhicule introuvable.</div>
}

async function changeStatus(newStatus: string) {
const { error } = await supabase
.from('vehicles')
.update({ status: newStatus })
.eq('id', id)

if (!error) {
setVehicle({ ...vehicle, status: newStatus })
}
}

return (
<div className="shell">
<aside className="sidebar">
<img
className="logo"
src="/logo-redline.png"
alt="Redline Carrosserie"
/>

<nav className="nav">
<Link href="/dashboard">Accueil</Link>
<Link href="/vehicles/new">Nouveau véhicule</Link>
<Link href="/search">Recherche</Link>
</nav>
</aside>
<main className="main">
<div className="topbar">
<div>
<h1>{vehicle.plate}</h1>
<div className="muted">
{vehicle.brand} {vehicle.model}
</div>
</div>

<Link className="btn" href="/dashboard">
← Retour
</Link>
</div>

<div className="card">
<h2>Informations véhicule</h2>

<p><strong>Client :</strong> {vehicle.client_name || '-'}</p>
<p><strong>Téléphone :</strong> {vehicle.phone || '-'}</p>
<p><strong>Kilométrage :</strong> {vehicle.mileage || '-'}</p>
<p><strong>Assurance :</strong> {vehicle.insurance || '-'}</p>
<p><strong>N° sinistre :</strong> {vehicle.claim_number || '-'}</p>
<p><strong>Date d'entrée :</strong> {vehicle.entry_date || '-'}</p>

<p><strong>Statut :</strong></p>

<select
value={vehicle.status || 'En attente'}
onChange={(e) => changeStatus(e.target.value)}
>
<option value="En attente">En attente</option>
<option value="En cours">En cours</option>
<option value="En peinture">En peinture</option>
<option value="Terminé">Terminé</option>
</select>
</div>
<div className="card">
<h2>Travaux à effectuer</h2>

{tasks.length === 0 ? (
<p>Aucun travail enregistré.</p>
) : (
<table className="table">
<thead>
<tr>
<th>Zone</th>
<th>Travail</th>
<th>Priorité</th>
<th>Statut</th>
</tr>
</thead>

<tbody>
{tasks.map(task => (
<tr key={task.id}>
<td>{task.zone}</td>
<td>{task.work}</td>
<td>{task.priority}</td>
<td>{task.status}</td>
</tr>
))}
</tbody>
</table>
)}
</div>
</main>
</div>
)
}

