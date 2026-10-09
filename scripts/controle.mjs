#!/usr/bin/env node
/**
 * Contrôle des écrans du kit : les règles de l'agent UI que la machine peut vérifier.
 * Usage : npm run controle              (tous les écrans)
 *         npm run controle -- connexion (un seul écran)
 *
 * Gravité (comme l'agent UI) : P0 bloquant, P1 grave, P2 gênant.
 * Une seule passe : corriger tous les P0 et P1 en un lot, relancer une fois, rendre.
 * Les P2 restants vont dans le résumé.
 * Une ligne précédée de « // manque: <raison> » est acceptée (manque assumé, à noter dans MANQUES.md).
 * Code de sortie : 0 sans P0 ni P1, 2 sinon.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dossierEcrans = path.join(racine, 'ecrans')
const cible = process.argv[2]

const COULEURS_TW = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white'
const PREFIXES = 'bg|text|border|border-[trblxy]|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent|shadow'

/** Règles ligne par ligne. `texte: true` = ne regarder que le texte visible et les chaînes. */
const regles = [
  // ---- P0 : bloquant
  { g: 'P0', nom: 'Focus supprimé', motif: /(?<![\w-])(outline-none|focus:outline-none|focus-visible:outline-none)(?![\w-])/,
    conseil: 'Ne jamais retirer le contour de focus : les composants du catalogue gèrent déjà le focus.' },
  { g: 'P0', nom: 'Image sans texte alternatif', motif: /<img(?![^>]*\balt=)[^>]*>/,
    conseil: 'Ajouter alt="…" (alt="" si l\'image est décorative).' },
  { g: 'P0', nom: 'Bouton icône sans nom', motif: /<Button(?=[^>]*size="icon)(?![^>]*aria-label)[^>]*>/,
    conseil: 'Un bouton qui ne montre qu\'une icône a besoin d\'aria-label="…".' },

  // ---- P1 : grave
  { g: 'P1', nom: 'Couleur écrite en dur', motif: /#[0-9a-fA-F]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/,
    conseil: "Utiliser une couleur d'usage du thème (bg-primary, text-muted-foreground, border-border, bg-success, chart-1…). La marque se change dans DESIGN.md." },
  { g: 'P1', nom: 'Couleur de palette Tailwind', motif: new RegExp(`(?<![\\w-])(${PREFIXES})-(${COULEURS_TW})(-\\d{2,3})?(\\/\\d+)?(?![\\w-])`),
    conseil: "Les couleurs de palette contournent la charte. Remplacer par la couleur d'usage : primary, muted-foreground, destructive, success, warning, info, chart-1 à 5." },
  { g: 'P1', nom: 'Valeur arbitraire', motif: /(?<![\w-])(text|p[trblxy]?|m[trblxy]?|gap(-[xy])?|space-[xy]|w|h|size|min-w|max-w|min-h|max-h|rounded(-[a-z]+)?|leading|tracking|top|left|right|bottom|inset|z)-\[[^\]]+\]/,
    conseil: "Utiliser l'échelle du studio : text-xs à text-6xl (12 à 48 px), espacements multiples de 4, rounded-control / rounded-surface / rounded-full." },
  { g: 'P1', nom: 'Arrondi hors charte', motif: /(?<![\w-])rounded(-(sm|md|lg|xl|2xl|3xl|4xl))?(?![\w-])/,
    conseil: 'Utiliser rounded-control (boutons, champs), rounded-surface (cartes, panneaux) ou rounded-full : ils suivent DESIGN.md.' },
  { g: 'P1', nom: "Élément brut au lieu d'un composant", motif: /<(button|input|select|textarea|table|dialog)[\s>/]/,
    conseil: 'Utiliser le composant du catalogue (Button, Input, Select, Textarea, Table, Dialog). Sinon « // manque: <raison> » au-dessus et une ligne dans MANQUES.md.' },
  { g: 'P1', nom: 'Élément cliquable non sémantique', motif: /<(div|span|li|p)\b[^>]*\bonClick=/,
    conseil: 'Un élément cliquable est un Button ou un Link, pas une div.' },
  { g: 'P1', nom: 'tabIndex positif', motif: /tabIndex=\{?["']?[1-9]/, conseil: "Ne pas forcer l'ordre de tabulation : suivre l'ordre du document." },
  { g: 'P1', nom: 'Style en ligne', motif: /style=\{\{[^}]*(color|background|border|font|padding|margin|radius)/i, conseil: 'Pas de style en ligne : classes du thème.' },
  { g: 'P1', nom: 'Thème sombre', motif: /(?<![\w-])dark:/, conseil: 'Thème clair uniquement : retirer les variantes dark:.' },
  { g: 'P1', nom: "Titre en couleur (tic d'IA)", motif: /<(h[1-3]|CardTitle)\b[^>]*className="[^"]*\btext-(primary|destructive|success|warning|info|chart-\d)\b/,
    conseil: "Un titre reste en couleur de contenu ; la couleur d'action est réservée à ce qui agit." },
  { g: 'P1', nom: "Texte en dégradé (tic d'IA)", motif: /bg-clip-text|text-transparent/, conseil: 'Pas de texte en dégradé.' },
  { g: 'P1', nom: "Bordure colorée sur un côté (tic d'IA)", motif: /(?<![\w-])border-[lr]-(2|4|8)(?![\w-])/, conseil: "Pas de bordure épaisse sur un côté de carte pour signaler un statut : badge ou icône + libellé." },
  { g: 'P1', nom: "Étiquette en capitales (tic d'IA)", motif: /className="[^"]*\buppercase\b[^"]*\btracking-|className="[^"]*\btracking-[^"]*\buppercase\b/,
    conseil: "Pas de petite étiquette en capitales espacées au-dessus d'un titre." },
  { g: 'P1', nom: 'Donnée de remplissage', texte: true,
    motif: /\b(lorem ipsum|dolor sit amet|john doe|jane doe|jean dupont|acme|foo bar|utilisateur ?\d+|user ?\d+|test@test|company name|nom de l'entreprise)\b/i,
    conseil: 'Données vraisemblables et propres au contexte (redaction.md) : Camille Lefèvre, Karim Benali, Inès Moreau…' },
  { g: 'P1', nom: 'Tiret long dans le texte', texte: true, motif: /[—–]/, conseil: 'Ni tiret long ni demi-tiret comme séparateur : un tiret court, une virgule ou deux-points.' },
  { g: 'P1', nom: 'Emoji ou pictogramme Unicode', texte: true, motif: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, conseil: 'Une icône Lucide, jamais un emoji.' },

  // ---- P2 : gênant
  { g: 'P2', nom: 'Point médian en série', texte: true, motif: /\S\s·\s\S[^·]*\s·\s/, conseil: 'Pas de points médians entre des mots : virgules ou retour à la ligne.' },
  { g: 'P2', nom: 'Bouton au libellé vague', motif: />\s*(Valider|OK|Ok|Continuer|Cliquez ici|En savoir plus)\s*</,
    conseil: 'Verbe + objet : « Enregistrer le dossier », « Voir le rapport d\'avril ».' },
  { g: 'P2', nom: 'Majuscule à chaque mot', texte: true, motif: />\s*(?:[A-ZÉÈ][a-zéèêàç]+ ){1,4}[A-ZÉÈ][a-zéèêàç]+\s*</,
    conseil: 'Majuscule au premier mot seulement dans les titres et boutons (vérifier : un nom propre est accepté).' },
]

/** Isole le texte visible et les chaînes d'une ligne de JSX (pour les règles de rédaction). */
function texteVisible(ligne) {
  const morceaux = []
  for (const m of ligne.matchAll(/>([^<>{}]+)</g)) morceaux.push(m[1])
  for (const m of ligne.matchAll(/(["'`])((?:(?!\1).){3,})\1/g)) {
    if (!/^(@|\.|\/|[a-z-]+:|[a-z0-9-]+( [a-z0-9:[\]/.-]+)*$)/.test(m[2])) morceaux.push(m[2])
  }
  return morceaux.join(' | ')
}

function fichiers(dossier) {
  if (!fs.existsSync(dossier)) return []
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith('_') || d.name === 'references' || /^v\d+$/.test(d.name)) return []
    const p = path.join(dossier, d.name)
    return d.isDirectory() ? fichiers(p) : /\.(tsx|ts|css)$/.test(d.name) ? [p] : []
  })
}

/** Niveaux de titres sautés (h1 puis h3) dans un fichier. */
function titresSautes(contenu) {
  const niveaux = [...contenu.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]))
  const sauts = []
  for (let i = 1; i < niveaux.length; i++) if (niveaux[i] > niveaux[i - 1] + 1) sauts.push(`h${niveaux[i - 1]} puis h${niveaux[i]}`)
  return sauts
}

const liste = fichiers(cible ? path.join(dossierEcrans, cible) : dossierEcrans)
const constats = []
for (const f of liste) {
  const contenu = fs.readFileSync(f, 'utf8')
  const lignes = contenu.split('\n')
  const rel = path.relative(racine, f)
  lignes.forEach((ligne, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(ligne)) return
    if (i > 0 && /\/\/\s*manque:/.test(lignes[i - 1])) return
    const visible = texteVisible(ligne)
    for (const r of regles) {
      const sujet = r.texte ? visible : ligne
      if (!sujet) continue
      const tous = [...sujet.matchAll(new RegExp(r.motif.source, r.motif.flags.includes('g') ? r.motif.flags : r.motif.flags + 'g'))].map((m) => m[0].trim())
      if (tous.length) constats.push({ g: r.g, nom: r.nom, ou: `${rel}:${i + 1}`, quoi: tous.slice(0, 4).join(' », « '), conseil: r.conseil })
    }
  })
  for (const s of titresSautes(contenu)) constats.push({ g: 'P1', nom: 'Niveau de titre sauté', ou: rel, quoi: s, conseil: 'Les titres se suivent sans sauter de niveau (h1, puis h2, puis h3).' })
}

if (liste.length === 0) {
  console.log(cible ? `Aucun fichier pour l'écran « ${cible} ».` : 'Aucun écran à contrôler.')
  process.exit(0)
}
for (const g of ['P0', 'P1', 'P2']) {
  const lot = constats.filter((c) => c.g === g)
  if (!lot.length) continue
  console.log(`\n${g} - ${g === 'P0' ? 'bloquant' : g === 'P1' ? 'grave, à corriger avant de rendre' : 'gênant, à lister dans le résumé'}`)
  for (const c of lot) console.log(`  ${c.ou}  ${c.nom} : « ${c.quoi} »\n    → ${c.conseil}`)
}
const nb = (g) => constats.filter((c) => c.g === g).length
if (!constats.length) console.log(`RIEN À SIGNALER (${liste.length} fichier${liste.length > 1 ? 's' : ''} contrôlé${liste.length > 1 ? 's' : ''})`)
else console.log(`\nBilan : ${nb('P0')} P0, ${nb('P1')} P1, ${nb('P2')} P2.${nb('P0') + nb('P1') ? ' Corriger les P0 et P1 en un lot, relancer une fois, puis rendre.' : ' Lister les P2 dans le résumé et rendre.'}`)
process.exit(nb('P0') + nb('P1') ? 2 : 0)
