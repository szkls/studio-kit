import { useSearchParams } from 'react-router-dom'

/**
 * L'état affiché de l'écran : 'normal' par défaut, sinon la valeur de ?etat= dans l'adresse.
 * Dans un écran :  const etat = useEtat();  if (etat === 'vide') return <EtatVide />
 */
export function useEtat(): string {
  const [params] = useSearchParams()
  return params.get('etat') ?? 'normal'
}
