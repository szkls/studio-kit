#!/usr/bin/env node
/**
 * Contrôle des écrans : ce qu'une relecture humaine mettrait plus d'une minute à repérer.
 * Usage : npm run controle            (tous les écrans)
 *         npm run controle -- connexion   (un seul écran)
 * Chaque message dit quoi corriger. Une ligne précédée d'un commentaire « // manque: <raison> »
 * est acceptée : c'est un manque assumé, à reporter dans MANQUES.md.
 */
import fs from 'node:fs'
import path from 'node:path'

const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const dossierEcrans = path.join(racine, 'ecrans')
const cible = process.argv[2]

const COULEURS_TW = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white'
const PREFIXES = 'bg|text|border|border-[trblxy]|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent|shadow'

const regles = [
  {
    nom: 'Couleur écrite en dur',
    motif: /#[0-9a-fA-F]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/,
    conseil: "Utilise un nom de couleur du thème (bg-primary, text-muted-foreground, border-border, bg-success...). Si aucune ne convient, note le manque dans MANQUES.md.",
  },
  {
    nom: 'Couleur de palette Tailwind',
    motif: new RegExp(`(?<![\\w-])(${PREFIXES})-(${COULEURS_TW})(-\\d{2,3})?(\\/\\d+)?(?![\\w-])`),
    conseil: "Les couleurs de palette (bg-blue-600, text-gray-500...) contournent le thème. Remplace par la couleur d'usage : primary, muted-foreground, destructive, success, warning, info, chart-1 à 5.",
  },
  {
    nom: 'Valeur arbitraire',
    motif: /(?<![\w-])(text|p[trblxy]?|m[trblxy]?|gap(-[xy])?|space-[xy]|w|h|min-w|max-w|min-h|max-h|rounded(-[a-z]+)?|leading|tracking|top|left|right|bottom|inset)-\[[^\]]+\]/,
    conseil: "Utilise l'échelle du studio : tailles text-xs/sm/base/lg/xl/2xl/3xl/4xl/5xl/6xl (12 à 48 px), espacements multiples de 4 (p-1 = 4 px, p-4 = 16 px), arrondis rounded-control / rounded-surface.",
  },
  {
    nom: 'Arrondi hors thème',
    motif: /(?<![\w-])rounded-(sm|md|lg|xl|2xl|3xl|4xl)(?![\w-])/,
    conseil: "Utilise rounded-control (boutons, champs, badges) ou rounded-surface (cartes, panneaux, fenêtres) pour que l'arrondi suive la marque.",
  },
  {
    nom: 'Élément brut au lieu d\'un composant',
    motif: /<(button|input|select|textarea|table|dialog)[\s>]/,
    conseil: "Utilise le composant du catalogue (Button, Input, Select, Textarea, Table, Dialog) : il a déjà ses états, son focus et ses couleurs. Si aucun ne convient, ajoute « // manque: <raison> » au-dessus et une ligne dans MANQUES.md.",
  },
  {
    nom: 'Style en ligne',
    motif: /style=\{\{[^}]*(color|background|border|font|padding|margin|radius)/i,
    conseil: 'Pas de style en ligne : utilise les classes du thème.',
  },
  {
    nom: 'Thème sombre',
    motif: /(?<![\w-])dark:/,
    conseil: 'Les écrans sont livrés en clair uniquement : retire les variantes dark:.',
  },
]

function fichiers(dossier) {
  if (!fs.existsSync(dossier)) return []
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith('_') || d.name === 'references') return []
    const p = path.join(dossier, d.name)
    return d.isDirectory() ? fichiers(p) : /\.(tsx|ts|css)$/.test(d.name) ? [p] : []
  })
}

const liste = fichiers(cible ? path.join(dossierEcrans, cible) : dossierEcrans)
let total = 0
for (const f of liste) {
  const lignes = fs.readFileSync(f, 'utf8').split('\n')
  lignes.forEach((ligne, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(ligne)) return
    if (i > 0 && /\/\/\s*manque:/.test(lignes[i - 1])) return
    for (const r of regles) {
      const tous = [...ligne.matchAll(new RegExp(r.motif.source, 'g'))].map((m) => m[0])
      if (tous.length) {
        total += tous.length
        console.log(`\n${path.relative(racine, f)}:${i + 1}  ${r.nom} : « ${tous.join(' », « ')} »\n  → ${r.conseil}`)
      }
    }
  })
}
if (liste.length === 0) console.log(cible ? `Aucun fichier pour l'écran « ${cible} ».` : 'Aucun écran à contrôler.')
else if (total === 0) console.log(`RIEN À SIGNALER (${liste.length} fichier${liste.length > 1 ? 's' : ''} contrôlé${liste.length > 1 ? 's' : ''})`)
else { console.log(`\n${total} écart${total > 1 ? 's' : ''} à corriger.`); process.exit(1) }
