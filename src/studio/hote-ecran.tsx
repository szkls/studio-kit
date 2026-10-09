import { Suspense, lazy, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { trouverEcran } from './ecrans'
import { BarreOutils } from './barre-outils'

/** Affiche l'écran demandé dans l'adresse (/nom-de-l-ecran), avec la barre d'outils. */
export function HoteEcran() {
  const { ecran = '' } = useParams()
  const entree = trouverEcran(ecran)
  const Composant = useMemo(() => (entree ? lazy(entree.charger) : null), [entree?.nom])
  const outils = import.meta.env.DEV || new URLSearchParams(location.search).has('outils')

  if (!entree || !Composant) {
    return (
      <Empty className="min-h-svh">
        <EmptyHeader>
          <EmptyTitle>Écran introuvable</EmptyTitle>
          <EmptyDescription>Aucun écran ne s'appelle « {ecran} ».</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button asChild><Link to="/">Voir la liste des écrans</Link></Button></EmptyContent>
      </Empty>
    )
  }
  return (
    <>
      <Suspense fallback={null}><Composant /></Suspense>
      {outils && <BarreOutils etats={entree.meta.etats ?? []} />}
    </>
  )
}
