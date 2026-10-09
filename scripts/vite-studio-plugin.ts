import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import type { Plugin } from 'vite'
// @ts-ignore - module JavaScript du kit
import { genererTheme } from './theme.mjs'

/** Port stable propre au projet : 5200 + (hash du nom du dossier % 600). */
export function portDuProjet(racine: string): number {
  const nom = path.basename(racine)
  return 5200 + (zlib.crc32(Buffer.from(nom)) % 600)
}

/**
 * Outils du studio pendant le développement :
 * - POST /__studio/supprimer?ecran=<nom> : envoie ecrans/<nom> dans ecrans/_corbeille/
 * - POST /__studio/restaurer?dossier=<nom> : le remet en place
 * - GET  /__studio/corbeille : liste de la corbeille
 * - POST /__studio/theme : enregistre les réglages du panneau Thème dans DESIGN.md
 * DESIGN.md est surveillé : à chaque modification, src/theme.css est régénéré.
 */
export function studioPlugin(): Plugin {
  return {
    name: 'studio-outils',
    configureServer(server) {
      const racine = server.config.root
      const ecrans = path.join(racine, 'ecrans')
      const corbeille = path.join(ecrans, '_corbeille')
      const regenerer = () => {
        const r = genererTheme(racine)
        if (r.change) server.config.logger.info(`[studio] src/theme.css régénéré depuis DESIGN.md`)
        for (const a of r.alertes) server.config.logger.warn(`[studio] ${a}`)
      }
      regenerer()
      const design = path.join(racine, 'DESIGN.md')
      server.watcher.add(design)
      server.watcher.on('change', (f) => { if (path.resolve(f) === design) regenerer() })

      const json = (res: import("node:http").ServerResponse, code: number, data: unknown) => {
        res.statusCode = code
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(data))
      }
      server.middlewares.use('/__studio', (req, res) => {
        const url = new URL(req.url ?? '/', 'http://x')
        const nomSur = (v: string | null) => (v ?? '').replace(/[^a-z0-9-_]/gi, '')
        if (url.pathname === '/corbeille' && req.method === 'GET') {
          const liste = fs.existsSync(corbeille) ? fs.readdirSync(corbeille) : []
          return json(res, 200, liste.sort())
        }
        if (url.pathname === '/supprimer' && req.method === 'POST') {
          const nom = nomSur(url.searchParams.get('ecran'))
          const src = path.join(ecrans, nom)
          if (!nom || nom.startsWith('_') || !fs.existsSync(src)) return json(res, 404, { erreur: 'écran introuvable' })
          fs.mkdirSync(corbeille, { recursive: true })
          const horodatage = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
          fs.renameSync(src, path.join(corbeille, `${nom}-${horodatage}`))
          return json(res, 200, { ok: true })
        }
        if (url.pathname === '/restaurer' && req.method === 'POST') {
          const dossier = nomSur(url.searchParams.get('dossier'))
          const src = path.join(corbeille, dossier)
          const nom = dossier.replace(/-\d{14}$/, '')
          const dst = path.join(ecrans, nom)
          if (!fs.existsSync(src) || fs.existsSync(dst)) return json(res, 409, { erreur: 'restauration impossible' })
          fs.renameSync(src, dst)
          return json(res, 200, { ok: true })
        }
        if (url.pathname === '/theme' && req.method === 'POST') {
          let corps = ''
          req.on('data', (d) => (corps += d))
          req.on('end', () => {
            try {
              const r = JSON.parse(corps) as { action: string; texte: string; selectionFond: string; selectionTexte: string; controle: string; surface: string; police: string }
              let t = fs.readFileSync(design, 'utf8')
              const fin = t.indexOf('\n---', 4)
              let tete = t.slice(0, fin)
              const corpsMd = t.slice(fin)
              const fixer = (cle: string, val: string) => {
                const re = new RegExp(`^(\\s+${cle}:\\s*).*$`, 'm')
                tete = re.test(tete) ? tete.replace(re, `$1"${val}"`) : tete
              }
              // survol : la couleur d'action assombrie de 15 %
              const n = parseInt(r.action.replace('#', ''), 16)
              const fonce = (v: number) => Math.round(v * 0.85).toString(16).padStart(2, '0')
              const survol = `#${fonce((n >> 16) & 255)}${fonce((n >> 8) & 255)}${fonce(n & 255)}`
              fixer('action-primary', r.action)
              fixer('action-primary-hover', survol)
              fixer('focus-ring', r.action)
              fixer('on-action', r.texte)
              fixer('selected-bg', r.selectionFond)
              fixer('selected-fg', r.selectionTexte)
              tete = tete.replace(/^(\s+control:\s*).*$/m, `$1${String(r.controle).replace(/^(\d+)$/, '$1px')}`).replace(/^(\s+surface:\s*)(\d.*)$/m, `$1${String(r.surface).replace(/^(\d+)$/, '$1px')}`)
              tete = tete.replace(/(fontFamily:\s*).*/g, `$1${r.police}`)
              fs.writeFileSync(design, tete + corpsMd)
              regenerer()
              json(res, 200, { ok: true })
            } catch (e) { json(res, 400, { erreur: String(e) }) }
          })
          return
        }
        json(res, 404, { erreur: 'inconnu' })
      })
    },
  }
}
