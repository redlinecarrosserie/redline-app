import Link from 'next/link'

const demo=[
  ['AB-123-CD','PEUGEOT 3008','60%','En cours'],
  ['EF-456-GH','RENAULT CLIO','30%','En cours'],
  ['IJ-789-KL','BMW X1','80%','En peinture'],
]
export default function Dashboard(){return <div className="shell"><aside className="sidebar"><img className="logo" src="/logo-redline.png" alt="Redline"/><nav className="nav"><Link className="active" href="/dashboard">Accueil</Link><Link href="/vehicles/new">Nouveau véhicule</Link><Link href="/search">Recherche</Link></nav></aside><main className="main"><div className="topbar"><div><h1>Tableau de bord</h1><div className="muted">Redline Carrosserie</div></div><Link className="btn btn-primary" href="/vehicles/new">+ Nouveau véhicule</Link></div><div className="cards"><div className="card"><div className="metric">12</div><div className="muted">En attente</div></div><div className="card"><div className="metric">8</div><div className="muted">En cours</div></div><div className="card"><div className="metric">4</div><div className="muted">En peinture</div></div><div className="card"><div className="metric">18</div><div className="muted">Terminés</div></div></div><div className="card"><h2>Véhicules en cours</h2><table className="table"><thead><tr><th>Immatriculation</th><th>Véhicule</th><th>Avancement</th><th>Statut</th></tr></thead><tbody>{demo.map((r,i)=><tr key={i}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td><span className="badge red">{r[3]}</span></td></tr>)}</tbody></table></div></main></div>}
