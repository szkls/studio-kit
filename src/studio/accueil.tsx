import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Palette, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { listeEcrans } from './ecrans'
import { PanneauTheme } from './theme-panneau'

/** Page d'accueil : la liste des écrans maquettés du projet. */
export function Accueil() {
  const ecrans = listeEcrans()
  const dev = import.meta.env.DEV
  const [corbeille, setCorbeille] = useState<string[]>([])
  const [theme, setTheme] = useState(false)

  const chargerCorbeille = () => {
    if (!dev) return
    fetch('/__studio/corbeille').then((r) => r.json()).then(setCorbeille).catch(() => setCorbeille([]))
  }
  useEffect(chargerCorbeille, [])

  const supprimer = async (nom: string) => { await fetch(`/__studio/supprimer?ecran=${nom}`, { method: 'POST' }); chargerCorbeille() }
  const restaurer = async (dossier: string) => { await fetch(`/__studio/restaurer?dossier=${dossier}`, { method: 'POST' }); chargerCorbeille() }

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Écrans</h1>
          <p className="mt-1 text-sm text-muted-foreground">{ecrans.length} écran{ecrans.length > 1 ? 's' : ''} maquetté{ecrans.length > 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" onClick={() => setTheme(true)}><Palette />Thème</Button>
      </header>

      <Separator className="mt-8" />

      {ecrans.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyTitle>Aucun écran pour l'instant</EmptyTitle>
            <EmptyDescription>Demande un écran à l'IA, par exemple « génère-moi l'écran de connexion ». Il apparaîtra ici.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul>
          {ecrans.map((e) => (
            <li key={e.nom} className="flex items-center justify-between gap-4 border-b border-border py-4">
              <div className="min-w-0">
                <Link to={`/${e.nom}`} className="font-medium text-primary hover:underline">{e.meta.titre}</Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono text-xs">/{e.nom}</span>
                  {e.meta.etats && e.meta.etats.length > 0 && <Badge variant="secondary">{e.meta.etats.length + 1} états</Badge>}
                </div>
                {e.meta.description && <p className="mt-1 text-sm text-muted-foreground">{e.meta.description}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button asChild variant="outline" size="sm"><Link to={`/${e.nom}`}><ExternalLink />Ouvrir</Link></Button>
                {dev && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive"><Trash2 />Supprimer</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Envoyer « {e.meta.titre} » à la corbeille ?</AlertDialogTitle>
                        <AlertDialogDescription>Le dossier part dans ecrans/_corbeille. Tu pourras le restaurer depuis cette page.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => supprimer(e.nom)}>Envoyer à la corbeille</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {corbeille.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-medium">Corbeille</h2>
          <ul className="mt-2">
            {corbeille.map((d) => (
              <li key={d} className="flex items-center justify-between gap-4 py-2 text-sm text-muted-foreground">
                <span className="font-mono text-xs">{d}</span>
                <Button variant="ghost" size="sm" onClick={() => restaurer(d)}><RotateCcw />Restaurer</Button>
              </li>
            ))}
          </ul>
        </section>
      )}
      <PanneauTheme ouvert={theme} surFermer={() => setTheme(false)} />
    </main>
  )
}
