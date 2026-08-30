'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabaseClient'

type Task = {
zone: string
work: string
priority: string
}

export default function NewVehicle() {
const [tasks, setTasks] = useState<Task[]>([
{
zone: 'Pare-chocs avant',
work: 'Peinture',
priority: 'Haute'
}
])

const [msg, setMsg] = useState('')
const [saving, setSaving] = useState(false)
function addTask() {
setTasks([
...tasks,
{
zone: '',
work: '',
priority: 'Moyenne'
}
])
}

function updateTask(i: number, k: keyof Task, v: string) {
setTasks(
tasks.map((t, idx) =>
idx === i ? { ...t, [k]: v } : t
)
)
}

function removeTask(i: number) {
setTasks(tasks.filter((_, idx) => idx !== i))
}
 async function submit(e: FormEvent<HTMLFormElement>) {
e.preventDefault()

if (saving) return

setSaving(true)
setMsg('')

const fd = new FormData(e.currentTarget)

const payload = {
plate: String(fd.get('plate') || '').toUpperCase(),
brand: String(fd.get('brand') || ''),
model: String(fd.get('model') || ''),
client_name: String(fd.get('client_name') || ''),
phone: String(fd.get('phone') || ''),
mileage: Number(fd.get('mileage') || 0),
insurance: String(fd.get('insurance') || ''),
claim_number: String(fd.get('claim_number') || ''),
entry_date: fd.get('entry_date') || null,
status: 'En attente'
}
if (!supabaseConfigured) {
localStorage.setItem(
'redline-demo-vehicle',
JSON.stringify({ ...payload, tasks })
)
setMsg('Dossier enregistré en mode démonstration.')
setSaving(false)
return
}

const { data, error } = await supabase
.from('vehicles')
.insert(payload)
.select('id')
.single()

if (error) {
setMsg('Erreur: ' + error.message)
setSaving(false)
return
}
if (data && tasks.length) {
const validTasks = tasks.filter(t => t.zone && t.work)

if (validTasks.length) {
await supabase.from('repair_tasks').insert(
validTasks.map(t => ({
vehicle_id: data.id,
zone: t.zone,
work: t.work,
priority: t.priority,
status: 'À faire'
}))
)
}
}

setMsg('Dossier véhicule enregistré.')
setSaving(false)
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
<Link href="/vehicles/new">Nouveau véhicule</Link>
</nav>
</aside>

<main className="content">
<h1>Nouveau véhicule</h1>

<form className="form" onSubmit={submit}>
<div className="grid">
<label>
Immatriculation
<input name="plate" required />
</label>

<label>
Marque
<input name="brand" required />
</label>

<label>
Modèle
<input name="model" required />
</label>

<label>
Client
<input name="client_name" required />
</label>

<label>
Téléphone
<input name="phone" />
</label>

<label>
Kilométrage
<input name="mileage" type="number" />
</label>
</div>
<div className="grid">
<label>
Assurance
<input name="insurance" />
</label>

<label>
Numéro de sinistre
<input name="claim_number" />
</label>

<label>
Date d'entrée
<input name="entry_date" type="date" />
</label>
</div>

<h2>Travaux à effectuer</h2>
{tasks.map((task, i) => (
<div className="task-row" key={i}>
<input
placeholder="Zone"
value={task.zone}
onChange={e =>
updateTask(i, 'zone', e.target.value)
}
/>

<input
placeholder="Travail"
value={task.work}
onChange={e =>
updateTask(i, 'work', e.target.value)
}
/>

<select
value={task.priority}
onChange={e =>
updateTask(i, 'priority', e.target.value)
}
>
<option>Haute</option>
<option>Moyenne</option>
<option>Basse</option>
</select>
<button
type="button"
className="btn"
onClick={() => removeTask(i)}
>
Supprimer
</button>
</div>
))}

<button
type="button"
className="btn"
onClick={addTask}
>
+ Ajouter
</button>
<button
type="submit"
className="btn btn-primary"
disabled={saving}
>
{saving ? 'Enregistrement...' : 'Enregistrer le dossier'}
</button>

{msg && <p>{msg}</p>}
</form>
</main>
</div>
)
}

