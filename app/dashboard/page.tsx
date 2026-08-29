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
}

export default function Dashboard() {
const [vehicles, setVehicles] = useState<Vehicle[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
async function loadVehicles() {
const { data } = await supabase
.from('vehicles')
.select('id, plate, brand, model, status')

setVehicles(data || [])
setLoading(false)
}

loadVehicles()
}, [])

const waiting = vehicles.filter(v => v.status === 'En attente').length
  const inProgress = vehicles.filter(v => v.status === 'En cours').length
const painting = vehicles.filter(v => v.status === 'En peinture').length
const finished = vehicles.filter(v => v.status === 'Terminé').length

return (
<div className="main">
<h1>Tableau de bord</h1>
<p>Redline Carrosserie</p>

<div className="cards">
<div className="card"><b>{waiting}</b><p>En attente</p></div>
<div className="card"><b>{inProgress}</b><p>En cours</p></div>
<div className="card"><b>{painting}</b><p>En peinture</p></div>
<div className="card"><b>{finished}</b><p>Terminés</p></div>
</div>

<h2>Véhicules</h2>

{loading ? (
<p>Chargement...</p>
) : (
vehicles.map(vehicle => (
<div className="card" key={vehicle.id}>
<Link href={`/vehicles/${vehicle.id}`}>
<b>{vehicle.plate}</b>
</Link>
<p>{vehicle.brand} {vehicle.model}</p>
<p>{vehicle.status}</p>
</div>
))
)}

<br />
<Link href="/vehicles/new">+ Nouveau véhicule</Link>
</div>
)
}
