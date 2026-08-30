'use client'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabaseClient'

type Task={zone:string;work:string;priority:string}
export default function NewVehicle(){
 const [tasks,setTasks]=useState<Task[]>([{zone:'Pare-chocs avant',work:'Peinture',priority:'Haute'}]); const [msg,setMsg]=useState('')
 const [saving,setSaving]=useState(false)
 function addTask(){setTasks([...tasks,{zone:'',work:'',priority:'Moyenne'}])}
 function updateTask(i:number,k:keyof Task,v:string){setTasks(tasks.map((t,idx)=>idx===i?{...t,[k]:v}:t))}
 async function submit(e:FormEvent<HTMLFormElement>){
if (saving) return
setSaving(true)
  

 e.preventDefault(); setMsg(''); const fd=new FormData(e.currentTarget); const payload={plate:String(fd.get('plate')||'').toUpperCase(),brand:String(fd.get('brand')||''),model:String(fd.get('model')||''),client_name:String(fd.get('client_name')||''),phone:String(fd.get('phone')||''),mileage:Number(fd.get('mileage')||0),insurance:String(fd.get('insurance')||''),claim_number:String(fd.get('claim_number')||''),entry_date:fd.get('entry_date')||null,status:'En attente'}
   if(!supabaseConfigured){localStorage.setItem('redline-demo-vehicle',JSON.stringify({...payload,tasks}));setMsg('Dossier enregistré en mode démonstration.');return}
   const {data,error}=await supabase.from('vehicles').insert(payload).select('id').single(); if(error){setSaving(false)setMsg('Erreur: '+error.message);return}
   if(data && tasks.length){await supabase.from('repair_tasks').insert(tasks.filter(t=>t.zone&&t.work).map(t=>({vehicle_id:data.id,zone:t.zone,work:t.work,priority:t.priority,status:'À faire'})))}
   setMsg('Dossier véhicule enregistré.')
 }
 return <div className="shell"><aside className="sidebar"><img className="logo" src="/logo-redline.png" alt="Redline"/><nav className="nav"><Link href="/dashboard">Accueil</Link><Link className="active" href="/vehicles/new">Nouveau véhicule</Link><Link href="/search">Recherche</Link></nav></aside><main className="main"><h1>Nouveau véhicule / devis</h1><form className="form" onSubmit={submit}>{msg&&<div className="success">{msg}</div>}<div className="grid2"><div className="field"><label>Immatriculation</label><input name="plate" required placeholder="AB-123-CD"/></div><div className="field"><label>Kilométrage</label><input name="mileage" type="number"/></div><div className="field"><label>Marque</label><input name="brand" placeholder="Peugeot"/></div><div className="field"><label>Modèle</label><input name="model" placeholder="3008"/></div><div className="field"><label>Nom du client</label><input name="client_name"/></div><div className="field"><label>Téléphone</label><input name="phone"/></div><div className="field"><label>Assurance</label><input name="insurance"/></div><div className="field"><label>N° de sinistre</label><input name="claim_number"/></div><div className="field"><label>Date d'entrée prévue</label><input name="entry_date" type="date"/></div></div><hr/><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2>Travaux à effectuer</h2><button type="button" className="btn btn-secondary" onClick={addTask}>+ Ajouter</button></div>{tasks.map((t,i)=><div className="task-row" key={i}><input value={t.zone} onChange={e=>updateTask(i,'zone',e.target.value)} placeholder="Élément / zone"/><input value={t.work} onChange={e=>updateTask(i,'work',e.target.value)} placeholder="Travail"/><select value={t.priority} onChange={e=>updateTask(i,'priority',e.target.value)}><option>Haute</option><option>Moyenne</option><option>Basse</option></select><button type="button" className="btn btn-secondary" onClick={()=>setTasks(tasks.filter((_,idx)=>idx!==i))}>Supprimer</button></div>)<button
type="submit"
className="btn btn-primary"
disabled={saving}
>
{saving ? 'Enregistrement...' : 'Enregistrer le dossier'}
</button>}</form></main></div>
}
