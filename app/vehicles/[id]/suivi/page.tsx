'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SuiviPage() {
const params = useParams()
const id = params.id as string

const [vehicle, setVehicle] = useState<any>(null)
  const [schemaZones, setSchemaZones] = useState<{ number: number; x: number; y: number }[]>([])
  const [suiviData, setSuiviData] = useState<any>({})
const [uploadingPhoto, setUploadingPhoto] = useState(false)

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
  setSuiviData(data?.suivi_data || {})

setLoading(false)
}

loadVehicle()
}, [id])
async function toggleSchemaZone(zone: number, x: number, y: number) {
const exists = schemaZones.some((z) => z.number === zone)

const updatedZones = exists
? schemaZones.filter((z) => z.number !== zone)
: [...schemaZones, { number: zone, x, y }]

setSchemaZones(updatedZones)

await supabase
.from('vehicles')
.update({ schema_zones: updatedZones })
.eq('id', id)
}

  async function updateSuiviData(key: string, value: any) {
const updatedData = {
...suiviData,
[key]: value,
}
    setSuiviData(updatedData)

await supabase
.from('vehicles')
.update({ suivi_data: updatedData })
.eq('id', id)
}
  async function uploadVehiclePhoto(file: File) {
setUploadingPhoto(true)

const fileName = `${id}/${Date.now()}-${file.name}`

const { error } = await supabase.storage
.from('vehicle_photos')
.upload(fileName, file)

if (error) {
alert('Erreur pendant l’envoi de la photo')
setUploadingPhoto(false)
return
}

const { data } = supabase.storage
.from('vehicle_photos')
.getPublicUrl(fileName)

const photos = [...(suiviData.photos || []), data.publicUrl]
await updateSuiviData('photos', photos)

setUploadingPhoto(false)
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

{[
['client_name', 'Nom et prénom'],
['email', 'Mail'],
['client_address', 'Adresse du client'],
['expertise_cabinet', "Cabinet d’expertise"],
['phone', 'Téléphone'],
['brand', 'Marque'],
['model', 'Modèle'],
['plate', 'Immatriculation'],
['mileage', 'Kilométrage'],
['entry_date', "Date d’entrée"],
['exit_date', 'Date sortie'],
['insurance', 'Assurance'],
['claim_number', 'N° sinistre'],
].map(([key, label]) => (
<label key={key} style={{ display: 'block', marginBottom: '10px' }}>
<strong>{label} :</strong>
<input
value={vehicle[key] || ''}
onChange={(e) =>
setVehicle({
...vehicle,
[key]: e.target.value,
})
}
onBlur={async (e) => {
await supabase
.from('vehicles')
.update({ [key]: e.target.value })
.eq('id', id)
}}
style={{
width: '100%',
padding: '8px',
marginTop: '4px',
boxSizing: 'border-box',
}}
/>
</label>
))}

</div>

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
  <div className="card">
<h2>État à l’arrivée</h2>
{[
['carrosserie', 'Carrosserie OK'],
['interieur', 'Intérieur OK'],
['accessoires', 'Accessoires OK'],
['centralisation', 'Centralisation OK'],
['radars', 'Radars avant / arrière OK'],
['eclairage', 'Éclairage OK'],
['tableau_bord', 'Anomalies tableau de bord'],
].map(([key, label]) => (
<label key={key} style={{ display: 'block' }}>
<input
type="checkbox"
checked={!!suiviData[key]}
onChange={(e) => updateSuiviData(key, e.target.checked)}
/>{' '}
{label}
</label>
))}
  <p><strong>Observations :</strong></p>
  <textarea
value={suiviData.observations || ''}
onChange={(e) => updateSuiviData('observations', e.target.value)}
placeholder="Écrire une observation..."
rows={4}
style={{ width: '100%' }}
/>



</div>
  <div className="card">
<h2>Photos du véhicule</h2>
    <input
type="file"
accept="image/*"
multiple
onChange={(e) => {
const files = Array.from(e.target.files || [])
files.forEach((file) => uploadVehiclePhoto(file))
}}
/>
    {uploadingPhoto && <p>Envoi de la photo...</p>}
    {suiviData.photos?.map((photo: string, index: number) => (
<a key={index} href={photo} target="_blank" rel="noopener noreferrer">
<img src={photo} alt={`Photo ${index + 1}`} style={{ width: '150px', margin: '10px', cursor: 'pointer' }} />
</a>
))}

</div>
  </div>

<div className="card">


<div style={{ position: 'relative', width: '100%', maxWidth: '900px', marginBottom: '20px' }}>

<img
src="/unnamed.jpg"
alt="Schéma véhicule"
style={{ width: '100%', display: 'block' }}
  onClick={(e) => {
const rect = e.currentTarget.getBoundingClientRect()
const x = ((e.clientX - rect.left) / rect.width) * 100
const y = ((e.clientY - rect.top) / rect.height) * 100
toggleSchemaZone(schemaZones.length + 1, x, y)
}}
/>
 {schemaZones.map((zone) => (
<div
 onClick={(e) => { e.stopPropagation(); toggleSchemaZone(zone.number, zone.x, zone.y) }} 
key={zone.number}
style={{
position: 'absolute',
left: `${zone.x}%`,
top: `${zone.y}%`,
transform: 'translate(-50%, -50%)',
width: '28px',
height: '28px',
borderRadius: '50%',
background: 'red',
color: 'white',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontWeight: 'bold',
cursor: 'pointer',
  zIndex: 10,
}}
>
{zone.number}
</div>
))}


</div>


<h2>Croquis véhicule — Zones à réparer</h2>
{[
'Capot',
'Pare-chocs avant',
'Aile avant gauche',
'Aile avant droite',
'Aile arrière gauche',
'Aile arrière droite',
'Hayon / Coffre',
'Pare-chocs arrière',
'Bas de caisse gauche',
'Bas de caisse droit',
'Pavillon',
'Porte (AVD)',
'Porte (AVG)',
'Porte (ARD)',
'Porte (ARG)',
'Montant (gauche)',
'Montant (droit)',
'Remplacement pare-brise',
'Coque de rétroviseur (gauche)',
'Coque de rétroviseur (droite)',
'Jante (AVD)',
'Jante (AVG)',
'Jante (ARG)',
'Jante (ARD)',
].map((label, index) => {
const key = `zone_${index + 1}`

return (
<label key={key} style={{ display: 'block' }}>
<input
type="checkbox"
checked={!!suiviData[key]}
onChange={(e) => updateSuiviData(key, e.target.checked)}
/>{' '}
{index + 1} {label}
</label>
)
})}


<p><strong>Observation :</strong></p>
<textarea
value={suiviData.croquis_observation || ''}
onChange={(e) => updateSuiviData('croquis_observation', e.target.value)}
placeholder="Écrire une observation..."
rows={4}
style={{ width: '100%' }}
/>


</div>

<div className="card">
<h2>Pièces commandées</h2>

<table className="table">
<thead>
<tr>
<th>Pièce</th>
<th>Fournisseur</th>
<th>Référence</th>
<th>Commandé le</th>
<th>Livraison prévue</th>
<th>Reçu</th>
</tr>
</thead>

<tbody>
{[1, 2, 3, 4, 5].map((ligne) => (
<tr key={ligne}>
<td>
<input
type="text"
value={suiviData[`piece_${ligne}_nom`] || ''}
onChange={(e) => updateSuiviData(`piece_${ligne}_nom`, e.target.value)}
/>
</td>

<td>
<input
type="text"
value={suiviData[`piece_${ligne}_fournisseur`] || ''}
onChange={(e) => updateSuiviData(`piece_${ligne}_fournisseur`, e.target.value)}
/>
</td>

<td>
<input
type="text"
value={suiviData[`piece_${ligne}_reference`] || ''}
onChange={(e) => updateSuiviData(`piece_${ligne}_reference`, e.target.value)}
/>
</td>

<td>
<input
type="date"
value={suiviData[`piece_${ligne}_commande`] || ''}
onChange={(e) => updateSuiviData(`piece_${ligne}_commande`, e.target.value)}
/>
</td>

<td>
<input
type="date"
value={suiviData[`piece_${ligne}_livraison`] || ''}
onChange={(e) => updateSuiviData(`piece_${ligne}_livraison`, e.target.value)}
/>
</td>

<td>
<input
type="checkbox"
checked={!!suiviData[`piece_${ligne}_recue`]}
onChange={(e) => updateSuiviData(`piece_${ligne}_recue`, e.target.checked)}
/>
</td>
</tr>
))}
</tbody>
</table>
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
<input
type="checkbox"
checked={!!suiviData[`operation_${operation}`]}
onChange={(e) => updateSuiviData(`operation_${operation}`, e.target.checked)}
/>
</td>
<td><strong>{operation}</strong></td>
<td>{metier}</td>
<td>
<input
type="date"
value={suiviData[`date_${operation}`] || ''}
onChange={(e) => updateSuiviData(`date_${operation}`, e.target.value)}
/>
</td>
<td>
<input
type="text"
placeholder="Nom"
value={suiviData[`par_${operation}`] || ''}
onChange={(e) => updateSuiviData(`par_${operation}`, e.target.value)}
/>

</td>
</tr>
))}
</tbody>
</table>
</div>

<div className="card">
<h2>Notifications WhatsApp</h2>
{[
['whatsapp_prise_charge', 'Prise en charge'],
['whatsapp_piece_recue', 'Pièce reçue'],
['whatsapp_peinture', 'Véhicule en cabine de peinture'],
['whatsapp_livraison', 'Véhicule prêt à livrer'],
['whatsapp_satisfaction', 'Satisfaction client'],
].map(([key, label]) => (
<label key={key} style={{ display: 'block' }}>
<input
type="checkbox"
checked={!!suiviData[key]}
onChange={(e) => updateSuiviData(key, e.target.checked)}
/>{' '}
{label}
</label>
))}

</div>

<div className="card">
<h2>Contrôle qualité finale</h2>
{[
['qualite_couleur', 'Couleur uniforme'],
['qualite_brillance', 'Brillance'],
['qualite_poussieres', 'Absence poussières / défauts'],
['qualite_raccords', 'Raccords invisibles'],
['qualite_ajustement', 'Ajustement éléments'],
['qualite_nettoyage', 'Nettoyage intérieur'],
['qualite_vitres', 'Vitres propres'],
['qualite_pneus', 'Pression pneus'],
['qualite_niveaux', 'Niveaux'],
['qualite_eclairage', 'Éclairage'],
].map(([key, label]) => (
<label key={key} style={{ display: 'block' }}>
<input
type="checkbox"
checked={!!suiviData[key]}
onChange={(e) => updateSuiviData(key, e.target.checked)}
/>{' '}
{label}
</label>
))}

</div>

<div className="card">
<h2>Livraison</h2>
<p>
Date :{' '}
<input
type="date"
value={suiviData.livraison_date || ''}
onChange={(e) => updateSuiviData('livraison_date', e.target.value)}
/>
</p>

<p>
Heure :{' '}
<input
type="time"
value={suiviData.livraison_heure || ''}
onChange={(e) => updateSuiviData('livraison_heure', e.target.value)}
/>
</p>

<p>
Montant :{' '}
<input
type="text"
value={suiviData.livraison_montant || ''}
onChange={(e) => updateSuiviData('livraison_montant', e.target.value)}
/> €
</p>

<p>Satisfaction :</p>

{[
['satisfaction_tres_bien', 'Très bien'],
['satisfaction_bien', 'Bien'],
['satisfaction_moyen', 'Moyen'],
['satisfaction_mauvais', 'Mauvais'],
].map(([key, label]) => (
<label key={key} style={{ marginRight: '20px' }}>
<input
type="checkbox"
checked={!!suiviData[key]}
onChange={(e) => updateSuiviData(key, e.target.checked)}
/>{' '}
{label}
</label>
))}

<p>
Signature client :{' '}
<input
type="text"
value={suiviData.signature_client || ''}
onChange={(e) => updateSuiviData('signature_client', e.target.value)}
style={{ width: '300px' }}
/>
</p>

</div>
</div>
)
}
