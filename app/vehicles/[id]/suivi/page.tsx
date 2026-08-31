'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SuiviPage() {
const params = useParams()
const id = params.id as string

const [vehicle, setVehicle] = useState<any>(null)
  const [schemaZones, setSchemaZones] = useState<number[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
async function loadVehicle() {
const { data } = await supabase
.from('vehicles')
.select('*')
.eq('id', id)
.single()

setVehicle(data)
  setSchemaZones(data?.schema_zones || [])
setLoading(false)
}

loadVehicle()
}, [id])
async function toggleSchemaZone(zone: number) {
const updatedZones = schemaZones.includes(zone)
? schemaZones.filter((z) => z !== zone)
: [...schemaZones, zone]

setSchemaZones(updatedZones)

await supabase
.from('vehicles')
.update({ schema_zones: updatedZones })
.eq('id', id)
}

if (loading) return <div className="main">Chargement...</div>
if (!vehicle) return <div className="main">Véhicule introuvable.</div>

return (
<div className="main">
<Link className="btn" href={`/vehicles/${id}`}>
← Retour au véhicule
</Link>

<div className="card" style={{ marginTop: 20 }}>
<h1>Fiche de suivi véhicule</h1>

<h2>Identification</h2>
<p><strong>Nom et prénom :</strong> {vehicle.client_name || '-'}</p>
  <p><strong>Mail :</strong> {vehicle.email || '-'}</p>
  <p><strong>Adresse du client :</strong> {vehicle.client_address || '-'}</p>

  <p><strong>Cabinet d’expertise :</strong> {vehicle.expertise_cabinet || '-'}</p>

<p><strong>Téléphone :</strong> {vehicle.phone || '-'}</p>
<p><strong>Véhicule :</strong> {vehicle.brand} {vehicle.model}</p>
<p><strong>Immatriculation :</strong> {vehicle.plate}</p>
<p><strong>Kilométrage :</strong> {vehicle.mileage || '-'}</p>
<p><strong>Date entrée :</strong> {vehicle.entry_date || '-'}</p>
<p><strong>Date sortie :</strong> {vehicle.exit_date || '-'}</p>
<p><strong>Assurance :</strong> {vehicle.insurance || '-'}</p>
<p><strong>N° sinistre :</strong> {vehicle.claim_number || '-'}</p>
</div>

<div className="card">
<h2>État à l’arrivée</h2>
<p>☐ Carrosserie OK</p>
<p>☐ Intérieur OK</p>
<p>☐ Accessoires OK</p>
<p>☐ Centralisation OK</p>
<p>☐ Radars avant / arrière OK</p>
<p>☐ Éclairage OK</p>
<p>☐ Anomalies tableau de bord</p>
<p><strong>Observations :</strong></p>
</div>

<div className="card">


<div style={{ position: 'relative', width: '100%', maxWidth: '900px', marginBottom: '20px' }}>
<img
src="/unnamed.jpg"
alt="Schéma véhicule"
style={{ width: '100%', display: 'block' }}
/>
  {schemaZones.map((zone) => (
<div
key={zone.number}
style={{
position: 'absolute',
left: `${zone.x}%`,
top: `${zone.y}%`,
width: '28px',
height: '28px',
borderRadius: '50%',
background: 'red',
color: 'white',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontWeight: 'bold',
}}
>
{zone.number}
</div>
))}

</div>


<h2>Croquis véhicule — Zones à réparer</h2>
<p>☐ 1 — Capot</p>
<p>☐ 2 — Pare-chocs avant</p>
<p>☐ 3 — Aile avant gauche</p>
<p>☐ 4 — Aile avant droite</p>
<p>☐ 5 — Aile arrière gauche</p>
<p>☐ 6 — Aile arrière droite</p>
<p>☐ 7 — Hayon / Coffre</p>
<p>☐ 8 — Pare-chocs arrière</p>
<p>☐ 9 — Bas de caisse gauche</p>
<p>☐ 10 — Bas de caisse droit</p>
<p>☐ 11 — Pavillon</p>
 <p>☐ 12 - Porte (AVD)</p>
<p>☐ 13 - Porte (AVG)</p>
<p>☐ 14 - Porte (ARD)</p>
<p>☐ 15 - Porte (ARG)</p>
<p>☐ 16 - Montant (gauche)</p>
<p>☐ 17 - Montant (droit)</p>
<p>☐ 18 - Remplacement pare-brise</p>
<p>☐ 19 - Coque de rétroviseur (gauche)</p>
<p>☐ 20 - Coque de rétroviseur (droite)</p>
<p>☐ 21 - Jante (AVD)</p>
<p>☐ 22 - Jante (AVG)</p>
<p>☐ 23 - Jante (ARG)</p>
<p>☐ 24 - Jante (ARD)</p>

<p><strong>Observation :</strong></p>
<textarea placeholder="Écrire une observation..." rows={4} style={{ width: '100%' }} />

</div>

<div className="card">
<h2>Pièces commandées</h2>
<p>Désignation — Fournisseur — Commandé le — Livraison prévue — Reçu le</p>
</div>


<div className="card">
<h2>Déroulement des opérations</h2>

<table className="table">
<thead>
<tr>
<th>✓</th>
<th>Opération</th>
<th>Métier</th>
<th>Date</th>
<th>Par</th>
</tr>
</thead>

<tbody>
{[
['1. DÉMONTAGE', 'Carrossier'],
['2. REDRESSAGE / SOUDURE', 'Carrossier'],
['3. PRÉPARATION', 'Préparateur'],
['4. MASQUAGE', 'Préparateur'],
['5. PEINTURE CABINE', 'Peintre'],
['6. VERNIS / FINITION', 'Peintre'],
['7. REMONTAGE', 'Carrossier'],
['8. FINITIONS', 'Carrossier'],
['9. NETTOYAGE', 'Préparateur'],
['10. CONTRÔLE QUALITÉ', 'Gérant'],
].map(([operation, metier]) => (
<tr key={operation}>
<td>
<input type="checkbox" />
</td>
<td><strong>{operation}</strong></td>
<td>{metier}</td>
<td>
<input type="date" />
</td>
<td>
<input type="text" placeholder="Nom" />
</td>
</tr>
))}
</tbody>
</table>
</div>

<div className="card">
<h2>Notifications WhatsApp</h2>
<p>☐ Prise en charge</p>
<p>☐ Pièce reçue</p>
<p>☐ Véhicule en cabine de peinture</p>
<p>☐ Véhicule prêt à livrer</p>
<p>☐ Satisfaction client</p>
</div>

<div className="card">
<h2>Contrôle qualité finale</h2>
<p>☐ Couleur uniforme</p>
<p>☐ Pièces remontées</p>
<p>☐ Grain</p>
<p>☐ Nettoyage intérieur</p>
<p>☐ Nettoyage extérieur</p>
<p>☐ Centralisation</p>
<p>☐ Radar avant et arrière</p>
<p>☐ Éclairage</p>
</div>

<div className="card">
<h2>Livraison</h2>
<p>Date : __________</p>
<p>Heure : __________</p>
<p>Montant : __________ €</p>
<p>Satisfaction : ☐ Très bien &nbsp; ☐ Bien &nbsp; ☐ Moyen &nbsp; ☐ Mauvais</p>
<p>Signature client : ____________________</p>
</div>
</div>
)
}
