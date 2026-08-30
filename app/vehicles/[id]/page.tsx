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
  const [editingTask, setEditingTask] = useState<any>(null)
const [loading, setLoading] = useState(true)
const [deleting, setDeleting] = useState(false)
  const [statusDate, setStatusDate] = useState('')

useEffect(() => {
async function deleteVehicle() {
if (!confirm('Supprimer définitivement ce véhicule ?')) return

setDeleting(true)

await supabase
.from('repair_tasks')
.delete()
.eq('vehicle_id', id)

const { error } = await supabase
.from('vehicles')
.delete()
.eq('id', id)

if (error) {
alert('Erreur : ' + error.message)
setDeleting(false)
return
}

window.location.href = '/dashboard'
}

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
    setStatusDate(vehicleData?.arrival_date || '')


setTasks(taskData || [])
setLoading(false)
}

if (id) loadVehicle()
}, [id])
 async function deleteVehicle() {
if (!confirm('Supprimer définitivement ce véhicule ?')) return

setDeleting(true)

await supabase
.from('repair_tasks')
.delete()
.eq('vehicle_id', id)

const { error } = await supabase
.from('vehicles')
.delete()
.eq('id', id)

if (error) {
alert('Erreur : ' + error.message)
setDeleting(false)
return
}

window.location.href = '/dashboard'
}

  async function saveTask(task: any) {
const { error } = await supabase
.from('repair_tasks')
.update({
condition_before: task.condition_before,
  zone: task.zone,
work: task.work,
priority: task.priority,
status: task.status
})
.eq('id', task.id)

if (!error) {
setTasks(tasks.map(t => t.id === task.id ? task : t))
setEditingTask(null)
}
}

  if (loading) {
return <div className="main">Chargement...</div>
}

if (!vehicle) {
return <div className="main">Véhicule introuvable.</div>
}


async function changeStatus(newStatus: string) {
const { error } = await supabase
.from('vehicles')
.update({ status: newStatus, arrival_date: statusDate || null
 })

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
  <button
type="button"
className="btn"
onClick={deleteVehicle}
disabled={deleting}
>
{deleting ? 'Suppression...' : 'Supprimer le véhicule'}
    </button>
<h1>{vehicle.plate}</h1>
<div className="muted">
{vehicle.brand} {vehicle.model}
</div>
</div>

<Link className="btn" href="/dashboard">
← Retour
</Link>
</div>
<Link
className="btn btn-primary"
href={`/vehicles/${id}/suivi`}
>
Fiche de suivi
</Link>
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
  <option value="À venir">À venir</option>
<option value="En attente">En attente</option>
<option value="En cours">En cours</option>
<option value="En peinture">En peinture</option>
<option value="Terminé">Terminé</option>
</select>
  <input
type="date"
value={statusDate}
onChange={(e) => setStatusDate(e.target.value)}
/>
</div>
<div className="card">
<h2>Travaux à effectuer</h2>

{tasks.length === 0 ? (
<p>Aucun travail enregistré.</p>
) : (
<table className="table">
<thead>
<tr>
<th>État avant réparations</th>
  
<th>Travail</th>
<th>Priorité</th>
<th>Statut</th>
  <th>Action</th>
</tr>
</thead>

<tbody>
{tasks.map(task => (
<tr key={task.id}>

  {editingTask?.id === task.id ? (
<>
  <td>
<input
  style={{ width: '140px' }}
value={editingTask.condition_before || ''}
onChange={(e) =>
setEditingTask({
...editingTask,
condition_before: e.target.value
})
}
/>
</td>

<td>
<input
  style={{ width: '140px' }}
value={editingTask.work || ''}
onChange={(e) =>
setEditingTask({ ...editingTask, work: e.target.value })
}
/>
</td>

<td>
<select
  style={{ width: '140px' }}
value={editingTask.priority || 'Moyenne'}
onChange={(e) =>
setEditingTask({ ...editingTask, priority: e.target.value })
}
>
<option value="Basse">Basse</option>
<option value="Moyenne">Moyenne</option>
<option value="Haute">Haute</option>
</select>
</td>

<td>
<select
  style={{ width: '140px' }}
value={editingTask.status || 'À faire'}
onChange={(e) =>
setEditingTask({ ...editingTask, status: e.target.value })
}
>
<option value="À faire">À faire</option>
<option value="En cours">En cours</option>
<option value="Terminé">Terminé</option>
</select>
</td>
</>
) : (
  <>
<td>{task.condition_before || '-'}</td>
<td>{task.zone}</td>
<td>{task.work}</td>
<td>{task.priority}</td>
<td>{task.status}</td>
</>
)}
<td>
{editingTask?.id === task.id ? (
<>
<button onClick={() => saveTask(editingTask)}>
Enregistrer
</button>
<button onClick={() => setEditingTask(null)}>
Annuler
</button>
</>
) : (
<button onClick={() => setEditingTask({ ...task })}>
Modifier
</button>
)}
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

