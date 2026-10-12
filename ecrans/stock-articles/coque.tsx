import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Boxes, ClipboardCheck, Factory, PackageOpen, Settings, Truck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'

const NAVIGATION = [
  { titre: 'Articles', icone: Boxes, lien: '/stock-articles' },
  { titre: 'Commandes fournisseurs', icone: Truck, badge: '4' },
  { titre: 'Réceptions', icone: PackageOpen, badge: '2' },
  { titre: 'Inventaires', icone: ClipboardCheck },
  { titre: 'Fournisseurs', icone: Factory },
]

/** Structure commune aux écrans du back-office de stock : navigation latérale et en-tête. */
export function Coque({ enTete, children }: { enTete: ReactNode; children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" asChild>
            <Link to="/stock-articles">
              <span data-logo-slot="ferrand-pro" className="flex size-8 shrink-0 items-center justify-center rounded-control bg-primary font-medium text-primary-foreground">F</span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-medium">Ferrand Pro</span>
                <span className="truncate text-xs text-muted-foreground">Gestion du stock</span>
              </span>
            </Link>
          </SidebarMenuButton></SidebarMenuItem></SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Stock</SidebarGroupLabel>
            <SidebarGroupContent><SidebarMenu>
              {NAVIGATION.map((n) => (
                <SidebarMenuItem key={n.titre}>
                  <SidebarMenuButton asChild={!!n.lien} isActive={!!n.lien} tooltip={n.titre}>
                    {n.lien ? <Link to={n.lien}><n.icone />{n.titre}</Link> : <><n.icone />{n.titre}</>}
                  </SidebarMenuButton>
                  {n.badge && <SidebarMenuBadge>{n.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu></SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem><SidebarMenuButton tooltip="Paramètres"><Settings />Paramètres</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Camille Lefèvre">
                <Avatar className="size-8"><AvatarFallback>CL</AvatarFallback></Avatar>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate">Camille Lefèvre</span>
                  <span className="truncate text-xs text-muted-foreground">Gestionnaire de stock</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {enTete}
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
