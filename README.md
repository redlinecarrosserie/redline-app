# Redline Carrosserie — Version 1

Première base fonctionnelle de l'application atelier :
- connexion;
- tableau de bord;
- création d'un dossier véhicule;
- ajout de travaux;
- recherche par immatriculation;
- logo Redline Carrosserie intégré;
- préparation pour synchronisation multi-appareils avec Supabase.

## 1. Lancer en mode démonstration

Installe Node.js 20+ puis :

```bash
npm install
npm run dev
```

Ouvre ensuite http://localhost:3000

Sans fichier `.env.local`, l'application fonctionne en mode démonstration local.

## 2. Activer la vraie base de données Supabase

1. Crée un projet Supabase.
2. Dans Supabase > SQL Editor, exécute `supabase/schema.sql`.
3. Dans Authentication, crée au moins un utilisateur avec email + mot de passe.
4. Copie `.env.example` vers `.env.local` et renseigne :
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Redémarre `npm run dev`.

## 3. Prochaines fonctions prévues

- état du véhicule à l'entrée;
- photos avant/après;
- modification des statuts depuis la tablette;
- historique;
- génération PDF;
- rôles patron/employé;
- installation PWA sur téléphone/tablette.
