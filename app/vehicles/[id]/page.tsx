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

setVehicle(vehicleData)

const { data: taskData } = await supabase
.from('repair_tasks')
.select('*')
.eq('vehicle_id', id)

setTasks(taskData || [])
setLoading(false)
}

if (id) loadVehicle()
}, [id])

if (loading) {
return <div style={{ padding: 30 }}>Chargement...</div>
}

if (!vehicle) {
return <div style={{ padding: 30 }}>Véhicule introuvable.</div>
}

return (
<div style={{ padding: 30 }}>
<Link href="/dashboard">← Retour au tableau de bord</Link>

<h1>{vehicle.plate}</h1>

<h2>
{vehicle.brand} {vehicle.model}
</h2>

<p><strong>Client :</strong> {vehicle.client_name || '-'}</p>
<p><strong>Téléphone :</strong> {vehicle.phone || '-'}</p>
<p><strong>Kilométrage :</strong> {vehicle.mileage || '-'}</p>
<p><strong>Assurance :</strong> {vehicle.insurance || '-'}</p>
<p><strong>N° sinistre :</strong> {vehicle.claim_number || '-'}</p>
<p><strong>Statut :</strong> {vehicle.status || 'En attente'}</p>
</div>
)
}
