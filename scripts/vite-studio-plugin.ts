import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import type { Plugin } from 'vite'

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
 */
export function studioPlugin(): Plugin {
  return {
    name: 'studio-outils',
    configureServer(server) {
      const racine = server.config.root
      const ecrans = path.join(racine, 'ecrans')
      const corbeille = path.join(ecrans, '_corbeille')
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
        json(res, 404, { erreur: 'inconnu' })
      })
    },
  }
}
