'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SuiviPage() {
const params = useParams()
const id = params.id as string

const [vehicle, setVehicle] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
async function loadVehicle() {
const { data } = await supabase
.from('vehicles')
.select('*')
.eq('id', id)
.single()

setVehicle(data)
setLoading(false)
}

loadVehicle()
}, [id])
if (loading) {
return <main className="content">Chargement...</main>
}

if (!vehicle) {
return <main className="content">Véhicule introuvable.</main>
}

return (
<div className="shell">
<aside className="sidebar">
<img
src="/logo-redline.png"
alt="Redline Carrosserie"
className="logo"
/>

<nav>
<Link href="/dashboard">Tableau de bord</Link>
<Link href={`/vehicles/${id}`}>Fiche véhicule</Link>
</nav>
</aside>

<main className="content">
<div className="card">
<h1>FICHE DE SUIVI VÉHICULE</h1>

<h2>
{vehicle.plate} — {vehicle.brand} {vehicle.model}
</h2>
<div className="grid">
<label>
Client
<input value={vehicle.client_name || ''} readOnly />
</label>

<label>
Téléphone
<input value={vehicle.phone || ''} readOnly />
</label>

<label>
Assurance
<input value={vehicle.insurance || ''} readOnly />
</label>

<label>
N° Sinistre
<input value={vehicle.claim_number || ''} readOnly />
</label>

<label>
Date d'entrée
<input value={vehicle.entry_date || ''} readOnly />
</label>

<label>
Kilométrage
<input value={vehicle.mileage || ''} readOnly />
</label>
</div>

<h2>Réception du véhicule</h2>
<div className="suivi-section">
<label>
<input type="checkbox" /> Photos avant réparation
</label>

<label>
<input type="checkbox" /> État des lieux signé
</label>

<label>
<input type="checkbox" /> Accord assurance
</label>

<label>
<input type="checkbox" /> Expertise réalisée
</label>
</div>

<h2>Opérations à réaliser</h2>

<div className="suivi-section">
<label><input type="checkbox" /> Démontage</label>
<label><input type="checkbox" /> Carrosserie</label>
<label><input type="checkbox" /> Peinture</label>
<label><input type="checkbox" /> Remontage</label>
<label><input type="checkbox" /> Nettoyage</label>
</div>
<h2>Pièces commandées</h2>




<h2>Contrôle qualité</h2>

<div className="suivi-section">
<label><input type="checkbox" /> Ajustements vérifiés</label>
<label><input type="checkbox" /> Peinture contrôlée</label>
<label><input type="checkbox" /> Éclairage contrôlé</label>
<label><input type="checkbox" /> Véhicule nettoyé</label>
</div>
<h2>Livraison du véhicule</h2>

<div className="suivi-section">
<label>
Date de livraison prévue
<input type="date" />
</label>

<label>
<input type="checkbox" /> Client prévenu
</label>

<label>
<input type="checkbox" /> Documents préparés
</label>

<label>
<input type="checkbox" /> Véhicule livré
</label>
</div>

<h2>Observations</h2>

<textarea
rows={5}
placeholder="Observations sur le véhicule..."
/>
<div style={{ marginTop: '20px' }}>
<Link
href={`/vehicles/${id}`}
className="btn btn-primary"
>
Retour à la fiche véhicule
</Link>
</div>
</div>
</main>
</div>
)
}
