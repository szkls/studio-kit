import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { CalendarDays, Home, LogOut, Plus, Settings, Stethoscope, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useEtat, type MetaEcran } from '@/studio'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const meta: MetaEcran = {
  titre: 'Exemple - Tableau de bord',
  description: "Écran d'exemple : accueil du secrétariat, assemblé à partir des composants et du bloc tableau de bord.",
  etats: ['vide', 'chargement'],
}

const indicateurs = [
  { titre: "Rendez-vous aujourd'hui", valeur: '86', evolution: '+12 %', hausse: true, detail: 'par rapport à mardi dernier' },
  { titre: 'Pris en ligne', valeur: '61 %', evolution: '+8 pts', hausse: true, detail: 'objectif 60 % atteint' },
  { titre: 'Appels au secrétariat', valeur: '142', evolution: '-18 %', hausse: false, detail: 'sur les 7 derniers jours' },
  { titre: 'Absences non excusées', valeur: '4', evolution: '-2', hausse: false, detail: 'cette semaine' },
]

const semaine = [
  { jour: 'Lun', enLigne: 48, telephone: 39 }, { jour: 'Mar', enLigne: 52, telephone: 34 }, { jour: 'Mer', enLigne: 44, telephone: 31 },
  { jour: 'Jeu', enLigne: 58, telephone: 29 }, { jour: 'Ven', enLigne: 61, telephone: 25 }, { jour: 'Sam', enLigne: 22, telephone: 8 },
]
const config = {
  enLigne: { label: 'En ligne', color: 'var(--chart-1)' },
  telephone: { label: 'Téléphone', color: 'var(--chart-2)' },
} satisfies ChartConfig

const rdv = [
  { heure: '08:30', patient: 'Jean Dupont', praticien: 'Dr Claire Morel', motif: 'Renouvellement', canal: 'En ligne' },
  { heure: '09:00', patient: 'Amina Benali', praticien: 'Dr Paul Leroy', motif: 'Première consultation', canal: 'Téléphone' },
  { heure: '09:15', patient: 'Lucas Petit', praticien: 'Dr Claire Morel', motif: 'Suivi', canal: 'En ligne' },
  { heure: '09:45', patient: 'Martine Lefèvre', praticien: 'Dr Sarah Cohen', motif: 'Vaccination', canal: 'Téléphone' },
  { heure: '10:30', patient: 'Hugo Martin', praticien: 'Dr Paul Leroy', motif: 'Certificat médical', canal: 'En ligne' },
]

const navigation = [
  { titre: 'Accueil', icone: Home, actif: true }, { titre: 'Agenda', icone: CalendarDays },
  { titre: 'Patients', icone: Users }, { titre: 'Praticiens', icone: Stethoscope }, { titre: 'Paramètres', icone: Settings },
]

export default function TableauDeBord() {
  const etat = useEtat()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg">
            <span data-logo-slot="medika" className="flex size-8 items-center justify-center rounded-control bg-primary font-medium text-primary-foreground">M</span>
            <span className="font-medium">Medika</span>
          </SidebarMenuButton></SidebarMenuItem></SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup><SidebarGroupContent><SidebarMenu>
            {navigation.map((n) => (
              <SidebarMenuItem key={n.titre}>
                <SidebarMenuButton isActive={n.actif} tooltip={n.titre}><n.icone />{n.titre}</SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu></SidebarGroupContent></SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild tooltip="Se déconnecter">
            <Link to="/exemple-connexion"><LogOut />Se déconnecter</Link>
          </SidebarMenuButton></SidebarMenuItem></SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-base font-medium">Accueil du secrétariat</h1>
          <Button size="sm" className="ml-auto"><Plus />Nouveau rendez-vous</Button>
        </header>

        <div className="flex flex-col gap-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {indicateurs.map((i) => (
              <Card key={i.titre}>
                <CardHeader>
                  <CardDescription>{i.titre}</CardDescription>
                  {etat === 'chargement' ? <Skeleton className="h-8 w-20" /> : <CardTitle className="text-3xl font-medium tabular-nums">{i.valeur}</CardTitle>}
                  <CardAction><Badge variant="outline">{i.hausse ? <TrendingUp /> : <TrendingDown />}{i.evolution}</Badge></CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">{i.detail}</CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Prises de rendez-vous de la semaine</CardTitle>
              <CardDescription>En ligne et par téléphone</CardDescription>
            </CardHeader>
            <CardContent>
              {etat === 'chargement' ? <Skeleton className="h-64 w-full" /> : (
                <ChartContainer config={config} className="h-64 w-full">
                  <AreaChart data={semaine} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="jour" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Area dataKey="telephone" type="monotone" fill="var(--color-telephone)" fillOpacity={0.15} stroke="var(--color-telephone)" stackId="a" />
                    <Area dataKey="enLigne" type="monotone" fill="var(--color-enLigne)" fillOpacity={0.15} stroke="var(--color-enLigne)" stackId="a" />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prochains rendez-vous</CardTitle>
              <CardDescription>Ce matin, tous praticiens</CardDescription>
            </CardHeader>
            <CardContent>
              {etat === 'vide' ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><CalendarDays /></EmptyMedia>
                    <EmptyTitle>Aucun rendez-vous ce matin</EmptyTitle>
                    <EmptyDescription>Les rendez-vous pris en ligne ou par téléphone apparaîtront ici.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent><Button variant="outline" size="sm"><Plus />Ajouter un rendez-vous</Button></EmptyContent>
                </Empty>
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Heure</TableHead><TableHead>Patient</TableHead><TableHead>Praticien</TableHead><TableHead>Motif</TableHead><TableHead>Canal</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {rdv.map((r) => (
                      <TableRow key={r.heure + r.patient}>
                        <TableCell className="tabular-nums">{etat === 'chargement' ? <Skeleton className="h-4 w-10" /> : r.heure}</TableCell>
                        <TableCell className="font-medium">{r.patient}</TableCell>
                        <TableCell>{r.praticien}</TableCell>
                        <TableCell className="text-muted-foreground">{r.motif}</TableCell>
                        <TableCell><Badge variant={r.canal === 'En ligne' ? 'secondary' : 'outline'}>{r.canal}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
