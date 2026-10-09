#!/usr/bin/env node
/**
 * Génère src/theme.css à partir de l'en-tête de DESIGN.md (la charte du projet).
 * Usage : npm run theme   (lancé aussi automatiquement par l'app quand DESIGN.md change)
 * Ce qui manque dans DESIGN.md garde la valeur du socle du studio.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SOCLE = {
  surface: '#ffffff', 'surface-alt': '#fafafa', 'surface-sunken': '#f5f5f5', hover: '#f5f5f5',
  border: '#e5e5e5', 'border-strong': '#d4d4d4', 'text-body': '#171717', 'text-heading': '#171717',
  'text-secondary': '#525252', 'action-primary': '#2563eb', 'on-action': '#ffffff',
  'selected-bg': '#eff6ff', 'selected-fg': '#1d4ed8', 'focus-ring': '#2563eb',
  success: '#16a34a', warning: '#d97706', 'warning-strong': '#f59e0b', error: '#dc2626', info: '#0284c7',
  'data-1': '#0d9488', 'data-2': '#7c3aed', 'data-3': '#ea580c', 'data-4': '#c026d3', 'data-5': '#4d7c0f',
}

/** Lit l'en-tête YAML simple de DESIGN.md (clés imbriquées par indentation). */
export function lireEnTete(texte) {
  const m = texte.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const racine = {}
  const pile = [{ indent: -1, obj: racine }]
  for (const brute of m[1].split('\n')) {
    if (!brute.trim() || brute.trim().startsWith('#')) continue
    const indent = brute.search(/\S/)
    const ligne = brute.trim().replace(/\s+#.*$/, '')
    const sep = ligne.indexOf(':')
    if (sep < 0) continue
    const cle = ligne.slice(0, sep).trim().replace(/^["']|["']$/g, '')
    const val = ligne.slice(sep + 1).trim().replace(/^["']|["']$/g, '')
    while (pile.length > 1 && indent <= pile[pile.length - 1].indent) pile.pop()
    const parent = pile[pile.length - 1].obj
    if (val === '') { parent[cle] = {}; pile.push({ indent, obj: parent[cle] }) } else parent[cle] = val
  }
  return racine
}

function px(v, defaut) {
  if (v === undefined || v === '') return defaut
  if (/^\d+(\.\d+)?$/.test(v)) return `${v}px`
  return v
}

function hexVersRgb(h) {
  const v = h.replace('#', '')
  const x = v.length === 3 ? v.split('').map((c) => c + c).join('') : v.slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16))
}
function luminance(h) {
  const [r, g, b] = hexVersRgb(h).map((c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contraste = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

export function genererTheme(racine) {
  const fichier = path.join(racine, 'DESIGN.md')
  const entete = fs.existsSync(fichier) ? lireEnTete(fs.readFileSync(fichier, 'utf8')) : {}
  const c = { ...SOCLE, ...(entete.colors ?? {}) }
  const r = entete.rounded ?? {}
  const t = entete.typography ?? {}
  const police = (t.body && t.body.fontFamily) || (t['body-dense'] && t['body-dense'].fontFamily) || 'Roboto'
  const nom = entete.name ?? 'socle-studio'
  const alertes = []
  if (contraste(c['action-primary'], c['on-action']) < 4.5)
    alertes.push(`Contraste du texte sur la couleur d'action : ${contraste(c['action-primary'], c['on-action']).toFixed(2)}:1, sous 4,5:1.`)

  const v = {
    '--font-marque': `"${police}", system-ui, sans-serif`,
    '--background': c.surface, '--foreground': c['text-body'],
    '--card': c.surface, '--card-foreground': c['text-body'],
    '--popover': c.surface, '--popover-foreground': c['text-body'],
    '--muted': c['surface-sunken'], '--muted-foreground': c['text-secondary'],
    '--border': c.border, '--input': c['border-strong'],
    '--primary': c['action-primary'], '--primary-foreground': c['on-action'],
    '--secondary': c['surface-sunken'], '--secondary-foreground': c['text-body'],
    '--accent': c.hover, '--accent-foreground': c['text-body'],
    '--ring': c['focus-ring'],
    '--destructive': c.error, '--success': c.success, '--success-foreground': '#ffffff',
    '--warning': c['warning-strong'] ?? c.warning, '--warning-foreground': c['text-body'],
    '--info': c.info, '--info-foreground': '#ffffff',
    '--chart-1': c['data-1'], '--chart-2': c['data-2'], '--chart-3': c['data-3'], '--chart-4': c['data-4'], '--chart-5': c['data-5'],
    '--sidebar': c['surface-alt'], '--sidebar-foreground': c['text-body'],
    '--sidebar-primary': c['action-primary'], '--sidebar-primary-foreground': c['on-action'],
    '--sidebar-accent': c['selected-bg'], '--sidebar-accent-foreground': c['selected-fg'],
    '--sidebar-border': c.border, '--sidebar-ring': c['focus-ring'],
    '--rayon-controle': px(r.control ?? r.md, '6px'),
    '--rayon-surface': px(r.surface ?? r.xl, '12px'),
    '--rayon-badge': px(r.badge ?? r.full, '9999px'),
    '--radius': px(r.lg, '8px'),
  }
  const importPolice = police === 'Roboto' ? '' :
    `@import url("https://fonts.googleapis.com/css2?family=${encodeURIComponent(police)}:wght@400;500;600;700&display=swap");\n\n`
  const css = `/* FICHIER GÉNÉRÉ depuis DESIGN.md (${nom}) - ne pas modifier à la main.
   Pour changer la marque : modifier l'en-tête de DESIGN.md (ou le panneau Thème de l'app), puis npm run theme. */
${importPolice}:root {
${Object.entries(v).map(([k, x]) => `  ${k}: ${x};`).join('\n')}
}
`
  const cible = path.join(racine, 'src/theme.css')
  const avant = fs.existsSync(cible) ? fs.readFileSync(cible, 'utf8') : ''
  if (avant !== css) fs.writeFileSync(cible, css)
  return { nom, police, alertes, change: avant !== css }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const res = genererTheme(racine)
  console.log(`src/theme.css ${res.change ? 'régénéré' : 'déjà à jour'} depuis DESIGN.md (${res.nom}, police ${res.police}).`)
  for (const a of res.alertes) console.log(`ATTENTION : ${a}`)
}
