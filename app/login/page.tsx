'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, supabaseConfigured } from '@/lib/supabaseClient'

export default function LoginPage(){
  const router = useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState('')
  async function submit(e:FormEvent){
    e.preventDefault(); setMsg('')
    if(!supabaseConfigured){ router.push('/dashboard'); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(error){ setMsg('Identifiant ou mot de passe incorrect.'); return }
    router.push('/dashboard')
  }
  return <div className="login-wrap"><form className="login-card" onSubmit={submit}>
    <img className="logo" src="/logo-redline.png" alt="Redline Carrosserie" />
    <h2>Connexion</h2><p className="muted">Accès atelier sécurisé</p>
    {msg && <div className="error">{msg}</div>}
    {!supabaseConfigured && <div className="success">Mode démonstration : Supabase n'est pas encore configuré.</div>}
    <div className="field"><label>Email / identifiant</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="atelier@redline.fr" /></div>
    <div className="field"><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></div>
    <button className="btn btn-primary" style={{width:'100%'}}>Se connecter</button>
  </form></div>
}
