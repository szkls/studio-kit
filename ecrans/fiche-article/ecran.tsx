import { Link, useSearchParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { ArrowLeftRight, Mail, MoreHorizontal, Pencil, Phone, ShoppingCart, Truck } from 'lucide-react'
import { type MetaEcran } from '@/studio'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coque } from '../stock-articles/coque'
import {
  ARTICLES, LIBELLE_STATUT, PASTILLE_STATUT, couverture, euros, historique, mouvements, nombre, statut, total,
} from '../stock-articles/donnees'

export const meta: MetaEcran = {
  titre: 'Stock - Fiche article',
  description: "Fiche détaillée d'un article : stock dans le temps et par entrepôt, mouvements, fournisseur. S'ouvre depuis la liste des articles.",
}

const config = { stock: { label: 'Stock total', color: 'var(--chart-1)' } } satisfies ChartConfig

export default function FicheArticle() {
  const [params] = useSearchParams()
  const x = ARTICLES.find((a) => a.ref === params.get('ref')) ?? ARTICLES[0]
  const s = statut(x)
  const c = couverture(x)
  const serie = historique(x)
  const reserves = x.entrepots.map((e, i) => Math.min(e.quantite, Math.round(e.quantite * [0.12, 0.08, 0.05][i])))
  const totalReserve = reserves.reduce((a, b) => a + b, 0)

  const infos = [
    { libelle: 'Catégorie', valeur: x.categorie },
    { libelle: 'Fournisseur principal', valeur: x.fournisseur },
    { libelle: "Prix d'achat unitaire", valeur: euros(x.prixAchat) },
    { libelle: 'Valeur en stock', valeur: euros(total(x) * x.prixAchat) },
    { libelle: 'Ventes, 30 jours', valeur: `${nombre(x.ventes30j)} unités` },
    { libelle: 'Couverture', valeur: c === null ? '-' : `${c} jours` },
    { libelle: 'Seuil de réapprovisionnement', valeur: `${nombre(x.seuil)} unités` },
    { libelle: 'Dernier mouvement', valeur: x.dernierMouvement },
  ]

  return (
    <Coque
      enTete={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/stock-articles">Articles</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0"><BreadcrumbPage className="truncate">{x.nom}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <main className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm text-muted-foreground tabular-nums">{x.ref}</p>
            <h1 className="text-2xl font-semibold">{x.nom}</h1>
            <p className="flex items-center gap-2 text-sm">
              <span aria-hidden="true" className={`size-2 rounded-full ${PASTILLE_STATUT[s]}`} />
              {LIBELLE_STATUT[s]}
              <span className="text-muted-foreground">, {nombre(total(x))} unités pour un seuil de {nombre(x.seuil)}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast('Transfert : écran à venir.')}><ArrowLeftRight />Transférer…</Button>
            <Button onClick={() => toast.success('Brouillon de commande fournisseur créé.', { description: 'Retrouvez-le dans Commandes fournisseurs.' })}>
              <ShoppingCart />Créer une commande fournisseur
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="Autres actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Pencil />Modifier l'article</DropdownMenuItem>
                <DropdownMenuItem>Modifier le seuil…</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Archiver l'article</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {x.commandeEnCours && (
          <div className="flex items-center gap-2 rounded-surface border border-border bg-muted px-4 py-3 text-sm">
            <Truck className="size-4 shrink-0" />
            <p className="min-w-0 flex-1">
              Commande <span className="font-medium tabular-nums">{x.commandeEnCours.numero}</span> en cours : {nombre(x.commandeEnCours.quantite)} unités attendues le {x.commandeEnCours.livraison}.
            </p>
            <Button variant="link" size="sm" className="shrink-0">Voir la commande</Button>
          </div>
        )}

        <Tabs defaultValue="apercu" className="gap-4">
          <TabsList>
            <TabsTrigger value="apercu">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="mouvements">Mouvements</TabsTrigger>
            <TabsTrigger value="fournisseur">Fournisseur</TabsTrigger>
          </TabsList>

          <TabsContent value="apercu" className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle><h2>Stock sur 12 semaines</h2></CardTitle>
                <CardDescription>Stock total en fin de semaine, les trois entrepôts réunis</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-64 w-full">
                  <LineChart data={serie} margin={{ left: 0, right: 16, top: 16 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="semaine" tickLine={false} axisLine={false} tickMargin={8} interval={1} />
                    <YAxis tickLine={false} axisLine={false} width={40} allowDecimals={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <ReferenceLine
                      y={x.seuil}
                      stroke="var(--muted-foreground)"
                      strokeDasharray="4 4"
                      label={{ value: `Seuil ${x.seuil}`, position: 'insideTopRight', fill: 'var(--muted-foreground)', fontSize: 12 }}
                    />
                    <Line dataKey="stock" type="monotone" stroke="var(--color-stock)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><h2>Informations</h2></CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col divide-y divide-border text-sm">
                  {infos.map((i) => (
                    <div key={i.libelle} className="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
                      <dt className="text-muted-foreground">{i.libelle}</dt>
                      <dd className="text-right tabular-nums">{i.valeur}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle><h2>Stock par entrepôt</h2></CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entrepôt</TableHead>
                      <TableHead className="text-right">En stock</TableHead>
                      <TableHead className="text-right">Réservé</TableHead>
                      <TableHead className="text-right">Disponible</TableHead>
                      <TableHead className="text-right">Ventes, 30 jours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {x.entrepots.map((e, i) => {
                      const reserve = reserves[i]
                      return (
                        <TableRow key={e.nom}>
                          <TableCell>{e.nom}</TableCell>
                          <TableCell className="text-right tabular-nums">{nombre(e.quantite)}</TableCell>
                          <TableCell className="text-right tabular-nums">{nombre(reserve)}</TableCell>
                          <TableCell className={`text-right tabular-nums ${e.quantite === 0 ? 'text-destructive' : ''}`}>
                            {e.quantite === 0 ? 'Rupture' : nombre(e.quantite - reserve)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{nombre(Math.round(x.ventes30j * [0.45, 0.33, 0.22][i]))}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right tabular-nums">{nombre(total(x))}</TableCell>
                      <TableCell className="text-right tabular-nums">{nombre(totalReserve)}</TableCell>
                      <TableCell className="text-right tabular-nums">{nombre(total(x) - totalReserve)}</TableCell>
                      <TableCell className="text-right tabular-nums">{nombre(x.ventes30j)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mouvements">
            <Card>
              <CardHeader>
                <CardTitle><h2>Mouvements récents</h2></CardTitle>
                <CardDescription>Entrées, sorties et transferts des 15 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Origine</TableHead>
                      <TableHead>Entrepôt</TableHead><TableHead className="text-right">Quantité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mouvements(x).map((m, i) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-nowrap">{m.date}</TableCell>
                        <TableCell>{m.type}</TableCell>
                        <TableCell>{m.detail}</TableCell>
                        <TableCell>{m.entrepot}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{m.quantite > 0 ? `+${m.quantite}` : m.quantite}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fournisseur">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle><h2>{x.fournisseur}</h2></CardTitle>
                <CardDescription>Fournisseur principal de cet article depuis mars 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <dl className="grid grid-cols-2 gap-4">
                  <div><dt className="text-muted-foreground">Délai de livraison moyen</dt><dd className="tabular-nums">6 jours ouvrés</dd></div>
                  <div><dt className="text-muted-foreground">Livraisons à l'heure, 12 mois</dt><dd className="tabular-nums">91 %</dd></div>
                  <div><dt className="text-muted-foreground">Minimum de commande</dt><dd className="tabular-nums">{euros(250)}</dd></div>
                  <div><dt className="text-muted-foreground">Référence fournisseur</dt><dd className="tabular-nums">{x.ref.replace(/-/g, '').slice(0, 9)}</dd></div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild><a href="mailto:commandes@exemple.fr"><Mail />Écrire au fournisseur</a></Button>
                  <Button variant="outline" size="sm" asChild><a href="tel:+33320000000"><Phone />03 20 00 00 00</a></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Coque>
  )
}
