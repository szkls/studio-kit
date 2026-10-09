import type { ComponentType } from 'react'

/** Ce que chaque écran exporte, en plus de son composant par défaut. */
export type MetaEcran = {
  /** Titre lisible, affiché sur la page d'accueil. */
  titre: string
  /** États disponibles en plus de « normal » (ex. ['vide', 'erreur', 'chargement', 'succes']). */
  etats?: string[]
  /** Une phrase : à quoi sert l'écran. */
  description?: string
}

type ModuleEcran = { default: ComponentType; meta?: MetaEcran }

// Chaque dossier de ecrans/ (hors _corbeille) qui contient un ecran.tsx est un écran.
const modules = import.meta.glob<ModuleEcran>(['/ecrans/*/ecran.tsx', '!/ecrans/_*/**'], { eager: true })

export type EntreeEcran = { nom: string; meta: MetaEcran; charger: () => Promise<ModuleEcran> }

export function listeEcrans(): EntreeEcran[] {
  return Object.keys(modules)
    .map((chemin) => {
      const nom = chemin.split('/')[2]
      const module = modules[chemin]
      return { nom, meta: module.meta ?? { titre: nom }, charger: () => Promise.resolve(module) }
    })
    .sort((a, b) => a.nom.localeCompare(b.nom))
}

export function trouverEcran(nom: string): EntreeEcran | undefined {
  return listeEcrans().find((e) => e.nom === nom)
}
