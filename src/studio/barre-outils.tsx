import { Suspense, lazy, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LayoutGrid, MessageSquareText, Palette, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PanneauTheme } from './theme-panneau'

/** Agentation (retours visuels pour l'IA) : chargé seulement quand on l'active, et seulement sur le poste du designer. */
const Agentation = lazy(() => import('agentation').then((m) => ({ default: m.Agentation })))

/**
 * Barre d'outils du studio, en bas de chaque écran : retour à la liste, choix de l'état, thème, retours (Agentation).
 * C'est un outil de démonstration, pas une partie de l'écran. Masquable (touche « o » pour la réafficher).
 */
export function BarreOutils({ etats }: { etats: string[] }) {
  const [params, setParams] = useSearchParams()
  const [theme, setTheme] = useState(false)
  const [masquee, setMasquee] = useState(false)
  const [retours, setRetours] = useState(() => { try { return sessionStorage.getItem('studio:retours') === '1' } catch { return false } })
  const etat = params.get('etat') ?? 'normal'

  if (typeof window !== 'undefined') {
    window.onkeydown = (e) => { if (e.key === 'o' && !(e.target as HTMLElement).closest('input,textarea,[contenteditable]')) setMasquee((m) => !m) }
  }
  if (masquee) return null

  const basculerRetours = () => setRetours((r) => {
    try { sessionStorage.setItem('studio:retours', r ? '0' : '1') } catch { /* stockage indisponible */ }
    return !r
  })

  const choisirEtat = (v: string) => {
    const p = new URLSearchParams(params)
    v === 'normal' ? p.delete('etat') : p.set('etat', v)
    setParams(p, { replace: true })
  }

  return (
    <>
      <div role="toolbar" aria-label="Outils du studio"
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-surface border border-border bg-popover p-1 text-popover-foreground shadow-lg">
        <Button asChild variant="ghost" size="sm"><Link to="/"><LayoutGrid />Écrans</Link></Button>
        {etats.length > 0 && (
          <Select value={etat} onValueChange={choisirEtat}>
            <SelectTrigger size="sm" className="w-48" aria-label="État affiché"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['normal', ...etats].map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Button variant="ghost" size="sm" onClick={() => setTheme(true)}><Palette />Theme Builder</Button>
        {import.meta.env.DEV && (
          <Button variant={retours ? 'secondary' : 'ghost'} size="sm" aria-pressed={retours} onClick={basculerRetours}>
            <MessageSquareText />Retours
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={() => setMasquee(true)} aria-label="Masquer la barre (touche o pour la réafficher)"><EyeOff /></Button>
      </div>
      <PanneauTheme ouvert={theme} surFermer={() => setTheme(false)} />
      {import.meta.env.DEV && retours && <Suspense fallback={null}><Agentation appName="kit studio" /></Suspense>}
    </>
  )
}
