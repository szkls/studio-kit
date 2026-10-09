import { Link } from 'react-router-dom'
import { AlertCircle, Lock } from 'lucide-react'
import { useEtat, type MetaEcran } from '@/studio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

export const meta: MetaEcran = {
  titre: 'Exemple - Connexion',
  description: "Écran d'exemple : connexion à l'espace secrétariat, avec ses états.",
  etats: ['champs-invalides', 'identifiants-incorrects', 'chargement'],
}

export default function Connexion() {
  const etat = useEtat()
  const invalides = etat === 'champs-invalides'
  const chargement = etat === 'chargement'

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2 font-medium">
          <span data-logo-slot="medika" className="flex size-8 items-center justify-center rounded-control bg-primary text-primary-foreground">M</span>
          Medika
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Se connecter</CardTitle>
            <CardDescription>Accédez à l'agenda du centre et aux rendez-vous du jour.</CardDescription>
          </CardHeader>
          <CardContent>
            {etat === 'identifiants-incorrects' && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle />
                <AlertTitle>Identifiants incorrects</AlertTitle>
                <AlertDescription>L'adresse e-mail ou le mot de passe ne correspond pas. Vérifiez les deux et réessayez.</AlertDescription>
              </Alert>
            )}
            <form>
              <FieldGroup>
                <Field data-invalid={invalides || undefined}>
                  <FieldLabel htmlFor="email">Adresse e-mail professionnelle</FieldLabel>
                  <Input id="email" type="email" defaultValue={invalides ? 'claire.morel@medika' : 'claire.morel@medika.fr'} aria-invalid={invalides || undefined} disabled={chargement} />
                  {invalides && <FieldError>Saisissez une adresse complète, par exemple prenom.nom@medika.fr</FieldError>}
                </Field>
                <Field data-invalid={invalides || undefined}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="mdp">Mot de passe</FieldLabel>
                    <Link to="#" className="ml-auto text-sm text-primary underline-offset-4 hover:underline">Mot de passe oublié ?</Link>
                  </div>
                  <Input id="mdp" type="password" defaultValue={invalides ? '' : 'motdepasse'} aria-invalid={invalides || undefined} disabled={chargement} />
                  {invalides ? <FieldError>Saisissez votre mot de passe</FieldError> : <FieldDescription>12 caractères minimum.</FieldDescription>}
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="rester" disabled={chargement} />
                  <FieldLabel htmlFor="rester" className="font-normal">Rester connecté sur ce poste</FieldLabel>
                </Field>
                <Button asChild={!chargement} disabled={chargement}>
                  {chargement ? <span><Spinner />Connexion en cours…</span> : <Link to="/exemple-tableau-de-bord">Se connecter</Link>}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4" />Connexion sécurisée, réservée au personnel du centre
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
