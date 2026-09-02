'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Vehicle = {
id: string
plate: string
brand: string | null
model: string | null
status: string
  arrival_date: string | null

}

export default function Dashboard() {
const [vehicles, setVehicles] = useState<Vehicle[]>([])
const [loading, setLoading] = useState(true)
 const [selectedStatus, setSelectedStatus] = useState<string | null>(null) 

useEffect(() => {
async function loadVehicles() {
const { data } = await supabase
.from('vehicles')
.select('id, plate, brand, model, status, arrival_date')

setVehicles(data || [])
setLoading(false)
}

loadVehicles()
}, [])

const waiting = vehicles.filter(v => v.status === 'En attente').length
const inProgress = vehicles.filter(v => v.status === 'En cours').length
const painting = vehicles.filter(v => v.status === 'En peinture').length
const finished = vehicles.filter(v => v.status === 'Terminé').length
 const upcoming = vehicles.filter(v => v.status === 'À venir').length 
return (
<div className="shell">
<aside className="sidebar">
<img className="logo" src="/logo-redline.png" alt="Redline Carrosserie" />

<nav className="nav">
<Link className="active" href="/dashboard">Accueil</Link>
<Link href="/vehicles/new">Nouveau véhicule</Link>
<Link href="/search">Recherche</Link>
</nav>
</aside>

<main className="main">
<div className="topbar">
<div>
<h1>Tableau de bord</h1>
<div className="muted">Redline Carrosserie</div>
</div>

<Link className="btn btn-primary" href="/vehicles/new">
+ Nouveau véhicule
</Link>
</div>

<div className="cards">
  <div className="card" onClick={() => setSelectedStatus('À venir')} style={{ cursor: 'pointer' }}>
<div className="metric">{upcoming}</div>
<div className="muted">À venir</div>
</div>
<div className="card">
<div className="metric">{waiting}</div>
<div className="muted">En attente</div>
</div>

<div className="card">
<div className="metric">{inProgress}</div>
<div className="muted">En cours</div>
</div>

<div className="card">
<div className="metric">{painting}</div>
<div className="muted">En peinture</div>
</div>

<div className="card">
<div className="metric">{finished}</div>
<div className="muted">Terminés</div>
</div>
</div>

<div className="card">
<h2>Véhicules</h2>

{loading ? (
<p>Chargement...</p>
) : vehicles.length === 0 ? (
<p>Aucun véhicule enregistré.</p>
) : (
<table className="table">
<thead>
<tr>
<th>Immatriculation</th>
<th>Véhicule</th>
<th>Statut</th>
</tr>
</thead>

<tbody>
{vehicles.map(vehicle => (
<tr key={vehicle.id}>
<td>
<Link href={`/vehicles/${vehicle.id}`}>
<b>{vehicle.plate}</b>
</Link>
</td>
<td>{vehicle.brand} {vehicle.model}</td>
<td>
<span className="badge red">
  {vehicle.status === 'À venir' && vehicle.arrival_date
    ? `À venir le ${new Date(vehicle.arrival_date).toLocaleDateString('fr-FR')}`
    : vehicle.status}
</span>
</td>
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
