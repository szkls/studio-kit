#!/usr/bin/env node
/** Régénère CATALOGUE.md : la liste de ce que l'IA a le droit d'utiliser. Usage : npm run catalogue */
import fs from 'node:fs'
import path from 'node:path'

const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const lire = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.tsx')).sort() : [])
const exports = (f) => [...fs.readFileSync(f, 'utf8').matchAll(/export\s*\{([^}]+)\}/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean))
  .concat([...fs.readFileSync(f, 'utf8').matchAll(/export (?:function|const) (\w+)/g)].map((m) => m[1]))
const unique = (a) => [...new Set(a)].filter((x) => /^[A-Z]/.test(x))

const ui = lire(path.join(racine, 'src/components/ui'))
const blocs = lire(path.join(racine, 'src/components/blocs'))
const manques = fs.existsSync(path.join(racine, 'MANQUES.md'))
  ? fs.readFileSync(path.join(racine, 'MANQUES.md'), 'utf8').split('\n').filter((l) => /^\|\s*\d{4}-/.test(l)) : []

let md = `# Catalogue des composants\n\nFichier généré par \`npm run catalogue\`. Ne pas modifier à la main.\n\n`
md += `Règle : un écran n'utilise que ce qui est listé ici. Ce qui manque se construit à partir de ces composants et se note dans MANQUES.md.\n\n`
md += `## Composants (${ui.length}) - statut : stable\n\nImport : \`import { Button } from "@/components/ui/button"\`\n\n| Fichier | Composants exportés |\n|---|---|\n`
for (const f of ui) md += `| ui/${f} | ${unique(exports(path.join(racine, 'src/components/ui', f))).join(', ')} |\n`
md += `\n## Blocs de départ (${blocs.length}) - à copier dans l'écran puis adapter\n\nImport : \`import { LoginForm } from "@/components/blocs/login-form"\`\n\n| Fichier | Composants exportés |\n|---|---|\n`
for (const f of blocs) md += `| blocs/${f} | ${unique(exports(path.join(racine, 'src/components/blocs', f))).join(', ')} |\n`
md += `\n## Manques ouverts (${manques.length})\n\nVoir MANQUES.md.\n`
fs.writeFileSync(path.join(racine, 'CATALOGUE.md'), md)
console.log(`CATALOGUE.md : ${ui.length} composants, ${blocs.length} blocs, ${manques.length} manques.`)
