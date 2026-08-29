import './styles.css'

export const metadata = {
  title: 'Redline Carrosserie',
  description: 'Gestion atelier carrosserie',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
