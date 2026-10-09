import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { contraste, melanger, rendreLisible, texteSur } from './couleurs'

/** Variables du thème, dans l'ordre du fichier exporté. */
const VARIABLES = [
  '--background', '--foreground', '--card', '--card-foreground', '--popover', '--popover-foreground',
  '--muted', '--muted-foreground', '--border', '--input',
  '--primary', '--primary-foreground', '--secondary', '--secondary-foreground', '--accent', '--accent-foreground', '--ring',
  '--destructive', '--success', '--success-foreground', '--warning', '--warning-foreground', '--info', '--info-foreground',
  '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
  '--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-primary-foreground',
  '--sidebar-accent', '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring',
  '--rayon-controle', '--rayon-surface', '--radius',
]

const POLICES = ['Roboto', 'Inter', 'DM Sans', 'Manrope', 'Nunito', 'Source Sans 3', 'IBM Plex Sans', 'Work Sans', 'Montserrat', 'Open Sans', 'Lato', 'Poppins']

type Reglages = { action: string; controle: number; pilule: boolean; surface: number; police: string }
const CLE = 'studio-theme'

function lireStockage(): Reglages | null {
  try { const v = localStorage.getItem(CLE); return v ? JSON.parse(v) : null } catch { return null }
}
function ecrireStockage(r: Reglages | null) {
  try { r ? localStorage.setItem(CLE, JSON.stringify(r)) : localStorage.removeItem(CLE) } catch { /* stockage indisponible */ }
}

function urlPolice(police: string) {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(police)}:wght@400;500;700&display=swap`
}

function chargerPolice(police: string) {
  if (police === 'Roboto') return
  const id = 'studio-police'
  let lien = document.getElementById(id) as HTMLLinkElement | null
  if (!lien) { lien = document.createElement('link'); lien.id = id; lien.rel = 'stylesheet'; document.head.appendChild(lien) }
  lien.href = urlPolice(police)
}

function lireReglagesActuels(): Reglages {
  const cs = getComputedStyle(document.documentElement)
  const rem = (v: string) => (v.endsWith('rem') ? parseFloat(v) * 16 : parseFloat(v)) || 0
  const controle = rem(cs.getPropertyValue('--rayon-controle').trim())
  const police = cs.getPropertyValue('--font-marque').split(',')[0].replace(/["']/g, '').trim() || 'Roboto'
  return {
    action: cs.getPropertyValue('--primary').trim() || '#2563eb',
    controle: controle >= 999 ? 8 : controle,
    pilule: controle >= 999,
    surface: rem(cs.getPropertyValue('--rayon-surface').trim()),
    police,
  }
}

function appliquer(r: Reglages) {
  const s = document.documentElement.style
  const action = r.action
  const texte = texteSur(action)
  s.setProperty('--primary', action)
  s.setProperty('--primary-foreground', texte)
  s.setProperty('--ring', action)
  s.setProperty('--sidebar-primary', action)
  s.setProperty('--sidebar-primary-foreground', texte)
  s.setProperty('--sidebar-ring', action)
  s.setProperty('--sidebar-accent', melanger(action, '#ffffff', 0.9))
  s.setProperty('--sidebar-accent-foreground', rendreLisible(action, melanger(action, '#ffffff', 0.9), 4.5))
  s.setProperty('--rayon-controle', r.pilule ? '9999px' : `${r.controle}px`)
  s.setProperty('--rayon-surface', `${r.surface}px`)
  s.setProperty('--font-marque', `"${r.police}", system-ui, sans-serif`)
  chargerPolice(r.police)
}

function exporter(police: string): string {
  const cs = getComputedStyle(document.documentElement)
  const lignes = VARIABLES.map((v) => `  ${v}: ${cs.getPropertyValue(v).trim()};`)
  const importPolice = police === 'Roboto' ? '' : `@import url("${urlPolice(police)}");\n\n`
  return `/* THÈME DE LA MARQUE - exporté depuis le panneau Thème le ${new Date().toLocaleDateString('fr-FR')}.\n   Remplace src/theme.css par ce fichier. */\n${importPolice}:root {\n  --font-marque: "${police}", system-ui, sans-serif;\n${lignes.join('\n')}\n}\n`
}

/** À appeler une fois au démarrage : réapplique les réglages enregistrés dans ce navigateur. */
export function restaurerTheme() {
  const r = lireStockage()
  if (r) appliquer(r)
}

export function PanneauTheme({ ouvert, surFermer }: { ouvert: boolean; surFermer: () => void }) {
  const [r, setR] = useState<Reglages>(() => lireStockage() ?? lireReglagesActuels())
  const [copie, setCopie] = useState(false)

  useEffect(() => { if (ouvert) setR(lireStockage() ?? lireReglagesActuels()) }, [ouvert])

  const maj = (partiel: Partial<Reglages>) => {
    const suivant = { ...r, ...partiel }
    setR(suivant)
    appliquer(suivant)
    ecrireStockage(suivant)
  }

  const ratio = contraste(r.action, texteSur(r.action))
  const lisible = ratio >= 4.5

  const telecharger = () => {
    const blob = new Blob([exporter(r.police)], { type: 'text/css' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'theme.css'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const copier = async () => {
    try { await navigator.clipboard.writeText(exporter(r.police)); setCopie(true); setTimeout(() => setCopie(false), 1500) } catch { /* presse-papiers indisponible */ }
  }
  const reinitialiser = () => {
    document.documentElement.removeAttribute('style')
    document.getElementById('studio-police')?.remove()
    ecrireStockage(null)
    setR(lireReglagesActuels())
  }

  return (
    <Sheet open={ouvert} onOpenChange={(o) => !o && surFermer()}>
      <SheetContent side="right" className="w-80 gap-0 overflow-y-auto sm:max-w-80">
        <SheetHeader>
          <SheetTitle>Thème</SheetTitle>
          <SheetDescription>Les réglages s'appliquent à tous les écrans. Exporte le fichier pour les garder dans le projet.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="couleur-action">Couleur d'action</Label>
            <div className="flex items-center gap-3">
              <input id="couleur-action" type="color" value={r.action} onChange={(e) => maj({ action: e.target.value })}
                className="size-10 shrink-0 cursor-pointer rounded-control border border-input bg-background p-1" />
              <span className="font-mono text-sm tabular-nums">{r.action}</span>
            </div>
            <p className={lisible ? 'text-xs text-muted-foreground' : 'text-xs text-destructive'}>
              Contraste du texte sur le bouton : {ratio.toFixed(1)}:1 {lisible ? '- lisible' : '- trop faible (4,5:1 minimum)'}
            </p>
            {!lisible && (
              <Button variant="outline" size="sm" onClick={() => maj({ action: rendreLisible(r.action, texteSur(r.action)) })}>
                Prendre la nuance lisible la plus proche
              </Button>
            )}
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Arrondi des boutons et champs</Label>
              <span className="text-sm tabular-nums text-muted-foreground">{r.pilule ? 'pilule' : `${r.controle} px`}</span>
            </div>
            <Slider min={0} max={24} step={2} value={[r.controle]} disabled={r.pilule} onValueChange={([v]) => maj({ controle: v })} />
            <div className="flex items-center gap-2">
              <Switch id="pilule" checked={r.pilule} onCheckedChange={(v) => maj({ pilule: v })} />
              <Label htmlFor="pilule">En pilule</Label>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Arrondi des cartes et fenêtres</Label>
              <span className="text-sm tabular-nums text-muted-foreground">{r.surface} px</span>
            </div>
            <Slider min={0} max={32} step={2} value={[r.surface]} onValueChange={([v]) => maj({ surface: v })} />
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label>Police</Label>
            <Select value={r.police} onValueChange={(v) => maj({ police: v })}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{POLICES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Button onClick={telecharger}>Exporter theme.css</Button>
            <Button variant="outline" onClick={copier}>{copie ? 'Copié' : 'Copier le thème'}</Button>
            <Button variant="ghost" onClick={reinitialiser}>Revenir au thème du projet</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
