import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, YAxis } from 'recharts'
import { toast } from 'sonner'
import {
  ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, ExternalLink, MoreHorizontal, PackagePlus,
  Plus, Search, ShoppingCart, TrendingUp, TriangleAlert, Truck, X,
} from 'lucide-react'
import { useEtat, type MetaEcran } from '@/studio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Coque } from './coque'
import {
  ARTICLES, CATEGORIES, ENTREPOTS, LIBELLE_STATUT, PASTILLE_STATUT, couverture, euros, mouvements, nombre, statut, total,
  type Article, type Statut,
} from './donnees'

export const meta: MetaEcran = {
  titre: 'Stock - Articles',
  description: 'Tableau de bord du gestionnaire de stock : alertes de réapprovisionnement, liste filtrable des articles, panneau de détail au clic.',
  etats: ['chargement', 'aucun-resultat'],
}

const PAR_PAGE = 10

// donnée fictive : valeur du stock en fin de semaine, en euros (la dernière est la valeur actuelle)
const VARIATIONS = [0.9, 0.88, 0.91, 0.93, 0.92, 0.95, 0.97, 0.95, 0.98, 1.01, 0.975, 1]
const configValeur = { v: { label: 'Valeur du stock', color: 'var(--chart-1)' } } satisfies ChartConfig

type FiltreStatut = 'tous' | 'a-reappro' | Statut
type Tri = { colonne: 'stock' | 'couverture' | 'nom'; sens: 'asc' | 'desc' } | null

function PastilleStatut({ s }: { s: Statut }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${PASTILLE_STATUT[s]}`} />
      {LIBELLE_STATUT[s]}
    </span>
  )
}

export default function StockArticles() {
  const etat = useEtat()
  const [recherche, setRecherche] = useState(etat === 'aucun-resultat' ? 'tournevis à cliquet' : '')
  const [categorie, setCategorie] = useState('toutes')
  const [entrepot, setEntrepot] = useState('tous')
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('tous')
  const [tri, setTri] = useState<Tri>({ colonne: 'couverture', sens: 'asc' })
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<string[]>([])
  const [ouvert, setOuvert] = useState<Article | null>(null)

  const aReappro = ARTICLES.filter((x) => statut(x) !== 'disponible')
  const ruptures = aReappro.filter((x) => statut(x) === 'rupture')
  const dejaCommandes = aReappro.filter((x) => x.commandeEnCours)
  const valeurStock = ARTICLES.reduce((s, x) => s + total(x) * x.prixAchat, 0)
  const valeurSemaines = VARIATIONS.map((k, i) => ({ i, v: Math.round(valeurStock * k) }))
  const kEuros = (n: number) => `${nombre(Math.round(n / 1000))} k€`

  const quantite = (x: Article) => (entrepot === 'tous' ? total(x) : x.entrepots.find((e) => e.nom === entrepot)?.quantite ?? 0)

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    const liste = ARTICLES.filter((x) =>
      (!q || x.nom.toLowerCase().includes(q) || x.ref.toLowerCase().includes(q))
      && (categorie === 'toutes' || x.categorie === categorie)
      && (filtreStatut === 'tous' || (filtreStatut === 'a-reappro' ? statut(x) !== 'disponible' : statut(x) === filtreStatut)))
    if (!tri) return liste
    const val = (x: Article) => (tri.colonne === 'nom' ? x.nom : tri.colonne === 'stock' ? total(x) : couverture(x) ?? 9999)
    return [...liste].sort((a, b) => {
      const [va, vb] = [val(a), val(b)]
      const r = typeof va === 'string' ? va.localeCompare(String(vb), 'fr') : va - (vb as number)
      return tri.sens === 'asc' ? r : -r
    })
  }, [recherche, categorie, filtreStatut, tri])

  const pages = Math.max(1, Math.ceil(resultats.length / PAR_PAGE))
  const pageCourante = Math.min(page, pages)
  const visibles = resultats.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE)

  const filtresActifs = [
    recherche && { cle: 'recherche', libelle: `Recherche : « ${recherche} »`, retirer: () => setRecherche('') },
    categorie !== 'toutes' && { cle: 'categorie', libelle: `Catégorie : ${categorie}`, retirer: () => setCategorie('toutes') },
    entrepot !== 'tous' && { cle: 'entrepot', libelle: `Entrepôt : ${entrepot}`, retirer: () => setEntrepot('tous') },
    filtreStatut !== 'tous' && {
      cle: 'statut',
      libelle: `Statut : ${filtreStatut === 'a-reappro' ? 'à réapprovisionner' : LIBELLE_STATUT[filtreStatut].toLowerCase()}`,
      retirer: () => setFiltreStatut('tous'),
    },
  ].filter(Boolean) as { cle: string; libelle: string; retirer: () => void }[]

  const reinitialiser = () => { setRecherche(''); setCategorie('toutes'); setEntrepot('tous'); setFiltreStatut('tous'); setPage(1) }
  const trier = (colonne: NonNullable<Tri>['colonne']) =>
    setTri((t) => (t?.colonne === colonne ? (t.sens === 'asc' ? { colonne, sens: 'desc' } : null) : { colonne, sens: 'asc' }))
  const IconeTri = ({ colonne }: { colonne: NonNullable<Tri>['colonne'] }) =>
    tri?.colonne !== colonne ? <ArrowUpDown className="text-muted-foreground" /> : tri.sens === 'asc' ? <ArrowUp /> : <ArrowDown />
  const ariaTri = (colonne: NonNullable<Tri>['colonne']) =>
    tri?.colonne === colonne ? (tri.sens === 'asc' ? 'ascending' : 'descending') : 'none'

  const tousCoches = visibles.length > 0 && visibles.every((x) => selection.includes(x.ref))
  const certainsCoches = visibles.some((x) => selection.includes(x.ref))
  const basculerTous = () =>
    setSelection((s) => (tousCoches ? s.filter((r) => !visibles.some((x) => x.ref === r)) : [...new Set([...s, ...visibles.map((x) => x.ref)])]))
  const basculer = (ref: string) => setSelection((s) => (s.includes(ref) ? s.filter((r) => r !== ref) : [...s, ref]))

  const commander = (refs: string[]) => {
    toast.success(refs.length > 1 ? `Brouillon de commande créé pour ${refs.length} articles.` : 'Brouillon de commande fournisseur créé.', {
      description: 'Retrouvez-le dans Commandes fournisseurs.',
    })
    setSelection([])
  }

  return (
    <Coque enTete={<span className="text-sm font-medium">Articles</span>}>
      <main className="flex flex-col gap-6 p-6">
        {/* Titre et actions de page */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold">Articles</h1>
            <p className="text-sm text-muted-foreground">{nombre(ARTICLES.length)} articles suivis sur {ENTREPOTS.length} entrepôts, mis à jour le 12 oct. 2026 à 9 h 40</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast('Export en cours de préparation.', { description: 'Le fichier sera disponible dans vos téléchargements.' })}>
              <Download />Exporter…
            </Button>
            <Button onClick={() => toast('Création d’article : écran à venir.')}><Plus />Nouvel article</Button>
          </div>
        </div>

        {/* Indicateurs : chacun a sa forme, selon la question qu'il pose */}
        <section aria-labelledby="titre-indicateurs" className="grid gap-4 lg:grid-cols-3">
          <h2 id="titre-indicateurs" className="sr-only">Indicateurs du stock</h2>

          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-2 text-foreground">
                <TriangleAlert className="size-4 text-warning" />À réapprovisionner
              </CardDescription>
              {etat === 'chargement' ? <Skeleton className="h-8 w-16" /> : (
                <CardTitle className="text-3xl font-semibold tabular-nums">{aReappro.length} articles</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt><PastilleStatut s="rupture" /></dt><dd className="tabular-nums">{ruptures.length}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt><PastilleStatut s="bas" /></dt><dd className="tabular-nums">{aReappro.length - ruptures.length}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 text-muted-foreground">
                  <dt className="flex items-center gap-2"><Truck className="size-4" />Déjà commandés</dt><dd className="tabular-nums">{dejaCommandes.length}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button variant="outline" className="w-full" onClick={() => { setFiltreStatut('a-reappro'); setPage(1) }}>
                Afficher les {aReappro.length} articles
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Valeur du stock, prix d'achat</CardDescription>
              {etat === 'chargement' ? <Skeleton className="h-8 w-32" /> : (
                <CardTitle className="text-3xl font-semibold tabular-nums">{euros(Math.round(valeurStock)).replace(/,00/, '')}</CardTitle>
              )}
              <CardAction>
                <Badge variant="outline"><TrendingUp />+2,6 % sur septembre</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ChartContainer config={configValeur} className="h-28 w-full" aria-label={`Valeur du stock sur 12 semaines, de ${kEuros(valeurSemaines[0].v)} à ${kEuros(valeurStock)}`}>
                <AreaChart data={valeurSemaines} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
                  <YAxis hide domain={['dataMin - 1000', 'dataMax + 500']} />
                  <Area dataKey="v" type="monotone" stroke="var(--color-v)" fill="var(--color-v)" fillOpacity={0.12} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ChartContainer>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>28 juil. : {kEuros(valeurSemaines[0].v)}</span><span>13 oct. : {kEuros(valeurStock)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Taux de service, 30 derniers jours</CardDescription>
              {etat === 'chargement' ? <Skeleton className="h-8 w-20" /> : (
                <CardTitle className="text-3xl font-semibold tabular-nums">94,2 %</CardTitle>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="relative">
                <Progress value={94.2} aria-label="Taux de service 94,2 %, objectif 97 %" />
                <span aria-hidden="true" className="absolute -top-1 h-4 w-0.5 bg-foreground" style={{ left: '97%' }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Commandes servies complètes</span><span>Objectif 97 %</span>
              </div>
              <p className="flex items-center gap-2 text-sm">
                <ArrowDown className="size-4 shrink-0 text-warning" />2,8 points sous l'objectif, dont 61 % liés aux ruptures
              </p>
              <dl className="mt-2 flex flex-col gap-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Commandes servies complètes</dt><dd className="tabular-nums">1 184</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Commandes incomplètes</dt><dd className="tabular-nums">73</dd></div>
              </dl>
            </CardContent>
          </Card>
        </section>

        {/* Liste des articles */}
        <Card className="gap-0 py-0">
          <div className="flex flex-col gap-4 border-b border-border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <InputGroup className="w-full sm:w-80">
                <InputGroupAddon><Search /></InputGroupAddon>
                <InputGroupInput
                  aria-label="Rechercher un article par nom ou référence"
                  placeholder="Nom ou référence, ex. OUT-18V"
                  value={recherche}
                  onChange={(e) => { setRecherche(e.target.value); setPage(1) }}
                />
                {recherche && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton size="icon-xs" aria-label="Effacer la recherche" onClick={() => setRecherche('')}><X /></InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
              <Select value={categorie} onValueChange={(v) => { setCategorie(v); setPage(1) }}>
                <SelectTrigger className="w-48" aria-label="Catégorie"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les catégories</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={entrepot} onValueChange={(v) => { setEntrepot(v); setPage(1) }}>
                <SelectTrigger className="w-48" aria-label="Entrepôt"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les entrepôts</SelectItem>
                  {ENTREPOTS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtreStatut} onValueChange={(v) => { setFiltreStatut(v as FiltreStatut); setPage(1) }}>
                <SelectTrigger className="w-48" aria-label="Statut du stock"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="a-reappro">À réapprovisionner</SelectItem>
                  <SelectItem value="rupture">Rupture</SelectItem>
                  <SelectItem value="bas">Sous le seuil</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex min-h-8 flex-wrap items-center gap-2" aria-live="polite">
              <span className="text-sm font-medium tabular-nums">
                {resultats.length} {resultats.length > 1 ? 'articles' : 'article'}
              </span>
              {filtresActifs.map((f) => (
                <Badge key={f.cle} variant="secondary" className="gap-1 pr-1">
                  {f.libelle}
                  <Button variant="ghost" size="icon-xs" aria-label={`Retirer le filtre ${f.libelle}`} onClick={f.retirer}><X /></Button>
                </Badge>
              ))}
              {filtresActifs.length > 1 && <Button variant="link" size="sm" onClick={reinitialiser}>Retirer tous les filtres</Button>}
            </div>
          </div>

          {selection.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-accent px-4 py-2">
              <span className="text-sm font-medium tabular-nums">{selection.length} {selection.length > 1 ? 'articles sélectionnés' : 'article sélectionné'}</span>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Button size="sm" onClick={() => commander(selection)}><ShoppingCart />Créer une commande fournisseur</Button>
              <Button size="sm" variant="ghost" onClick={() => toast('Export de la sélection en cours de préparation.')}><Download />Exporter la sélection</Button>
              <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSelection([])}>Annuler la sélection</Button>
            </div>
          )}

          {etat === 'chargement' ? (
            <div className="flex flex-col gap-2 p-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : resultats.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>Aucun article ne correspond à ces filtres</EmptyTitle>
                <EmptyDescription>Vérifiez l'orthographe ou retirez un filtre. La recherche porte sur le nom et la référence.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent><Button variant="outline" onClick={reinitialiser}>Retirer tous les filtres</Button></EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 pl-4">
                    <Checkbox
                      aria-label="Sélectionner les articles de la page"
                      checked={tousCoches ? true : certainsCoches ? 'indeterminate' : false}
                      onCheckedChange={basculerTous}
                    />
                  </TableHead>
                  <TableHead aria-sort={ariaTri('nom')}>
                    <Button variant="ghost" size="sm" className="-ml-2" onClick={() => trier('nom')}>Article<IconeTri colonne="nom" /></Button>
                  </TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right" aria-sort={ariaTri('stock')}>
                    <Button variant="ghost" size="sm" className="-mr-2" onClick={() => trier('stock')}>
                      {entrepot === 'tous' ? 'Stock total' : 'Stock entrepôt'}<IconeTri colonne="stock" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Seuil</TableHead>
                  <TableHead className="text-right" aria-sort={ariaTri('couverture')}>
                    <Button variant="ghost" size="sm" className="-mr-2" onClick={() => trier('couverture')}>Couverture<IconeTri colonne="couverture" /></Button>
                  </TableHead>
                  <TableHead>Commande en cours</TableHead>
                  <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibles.map((x) => {
                  const s = statut(x)
                  const c = couverture(x)
                  const coche = selection.includes(x.ref)
                  return (
                    <TableRow
                      key={x.ref}
                      data-state={coche ? 'selected' : undefined}
                      className="cursor-pointer"
                      onClick={() => setOuvert(x)}
                    >
                      <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox aria-label={`Sélectionner ${x.nom}`} checked={coche} onCheckedChange={() => basculer(x.ref)} />
                      </TableCell>
                      <TableCell className="max-w-80">
                        <Button
                          variant="link"
                          className="h-auto w-full min-w-0 flex-col items-start gap-0 p-0 text-left text-foreground"
                          onClick={(e) => { e.stopPropagation(); setOuvert(x) }}
                        >
                          <span className="block w-full truncate font-medium" title={x.nom}>{x.nom}</span>
                          <span className="block text-xs font-normal text-muted-foreground tabular-nums">{x.ref}</span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{x.categorie}</TableCell>
                      <TableCell><PastilleStatut s={s} /></TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{nombre(quantite(x))}</TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">{nombre(x.seuil)}</TableCell>
                      <TableCell className="text-right tabular-nums">{c === null ? '-' : c === 0 ? '0 j' : `${c} j`}</TableCell>
                      <TableCell>
                        {x.commandeEnCours ? (
                          <span className="flex flex-col">
                            <span className="tabular-nums">{nombre(x.commandeEnCours.quantite)} u.</span>
                            <span className="text-xs text-muted-foreground">livraison le {x.commandeEnCours.livraison}</span>
                          </span>
                        ) : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="pr-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label={`Actions pour ${x.nom}`}><MoreHorizontal /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link to={`/fiche-article?ref=${x.ref}`}><ExternalLink />Ouvrir la fiche</Link></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => commander([x.ref])}><ShoppingCart />Créer une commande fournisseur</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => toast('Transfert : choisissez les entrepôts dans la fiche.')}><PackagePlus />Transférer entre entrepôts…</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onSelect={() => toast('Article archivé.', { action: { label: 'Annuler', onClick: () => toast('Archivage annulé.') } })}>
                              Archiver l'article
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {resultats.length > 0 && etat !== 'chargement' && (
            <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-2">
              <span className="text-sm text-muted-foreground tabular-nums">
                Articles {(pageCourante - 1) * PAR_PAGE + 1} à {Math.min(pageCourante * PAR_PAGE, resultats.length)} sur {resultats.length}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled={pageCourante === 1} onClick={() => setPage(pageCourante - 1)}><ChevronLeft />Précédente</Button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Button key={n} variant={n === pageCourante ? 'outline' : 'ghost'} size="icon-sm" aria-label={`Page ${n}`} aria-current={n === pageCourante ? 'page' : undefined} onClick={() => setPage(n)}>
                    {n}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" disabled={pageCourante === pages} onClick={() => setPage(pageCourante + 1)}>Suivante<ChevronRight /></Button>
              </div>
            </nav>
          )}
        </Card>
      </main>

      <PanneauArticle article={ouvert} onFermer={() => setOuvert(null)} onCommander={(x) => { commander([x.ref]); setOuvert(null) }} />
    </Coque>
  )
}

/** Panneau latéral : ce qu'on consulte cent fois par jour, sans quitter la liste. */
function PanneauArticle({ article, onFermer, onCommander }: { article: Article | null; onFermer: () => void; onCommander: (x: Article) => void }) {
  const x = article
  return (
    <Sheet open={!!x} onOpenChange={(o) => !o && onFermer()}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-lg">
        {x && (() => {
          const s = statut(x)
          const c = couverture(x)
          const max = Math.max(...x.entrepots.map((e) => e.quantite), x.seuil / 3, 1)
          return (
            <>
              <SheetHeader className="border-b border-border">
                <SheetDescription className="tabular-nums">{x.ref}</SheetDescription>
                <SheetTitle className="pr-8 text-lg">{x.nom}</SheetTitle>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                  <PastilleStatut s={s} />
                  <span className="text-muted-foreground">{x.categorie}, {x.fournisseur}</span>
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                <dl className="grid grid-cols-3 gap-4">
                  <div><dt className="text-xs text-muted-foreground">Stock total</dt><dd className="text-xl font-semibold tabular-nums">{nombre(total(x))}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Couverture</dt><dd className="text-xl font-semibold tabular-nums">{c === null ? '-' : `${c} j`}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Ventes, 30 jours</dt><dd className="text-xl font-semibold tabular-nums">{nombre(x.ventes30j)}</dd></div>
                </dl>

                {x.commandeEnCours && (
                  <div className="flex items-start gap-2 rounded-control bg-muted p-3 text-sm">
                    <Truck className="mt-0.5 size-4 shrink-0" />
                    <p>
                      Commande <span className="font-medium tabular-nums">{x.commandeEnCours.numero}</span> de {nombre(x.commandeEnCours.quantite)} unités,
                      livraison prévue le {x.commandeEnCours.livraison}.
                    </p>
                  </div>
                )}

                <section aria-labelledby="titre-entrepots" className="flex flex-col gap-3">
                  <h3 id="titre-entrepots" className="text-sm font-semibold">Stock par entrepôt</h3>
                  <ul className="flex flex-col gap-3">
                    {x.entrepots.map((e) => (
                      <li key={e.nom} className="grid grid-cols-3 items-center gap-4 text-sm">
                        <span className="truncate">{e.nom}</span>
                        <Progress value={(e.quantite / max) * 100} aria-label={`${e.quantite} unités à ${e.nom}`} />
                        <span className={`text-right tabular-nums ${e.quantite === 0 ? 'text-destructive' : ''}`}>
                          {e.quantite === 0 ? 'Rupture' : `${nombre(e.quantite)} u.`}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">Seuil de réapprovisionnement : {nombre(x.seuil)} unités au total. Prix d'achat : {euros(x.prixAchat)}.</p>
                </section>

                <Separator />

                <section aria-labelledby="titre-mouvements" className="flex flex-col gap-3">
                  <h3 id="titre-mouvements" className="text-sm font-semibold">Derniers mouvements</h3>
                  <ul className="flex flex-col divide-y divide-border">
                    {mouvements(x).map((m, i) => (
                      <li key={i} className="flex items-start justify-between gap-4 py-2 text-sm first:pt-0">
                        <span className="min-w-0">
                          <span className="block truncate">{m.detail}</span>
                          <span className="block text-xs text-muted-foreground">{m.type}, {m.entrepot}, {m.date}</span>
                        </span>
                        <span className="shrink-0 font-medium tabular-nums">{m.quantite > 0 ? `+${m.quantite}` : m.quantite}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <SheetFooter className="flex-row border-t border-border">
                <Button variant="outline" asChild className="flex-1">
                  <Link to={`/fiche-article?ref=${x.ref}`}>Ouvrir la fiche</Link>
                </Button>
                <Button className="flex-1" onClick={() => onCommander(x)}><ShoppingCart />Commander</Button>
              </SheetFooter>
            </>
          )
        })()}
      </SheetContent>
    </Sheet>
  )
}
