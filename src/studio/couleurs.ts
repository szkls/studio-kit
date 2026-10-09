/** Petits outils de couleur pour le panneau de thème (contraste WCAG, nuances). */

export function hexVersRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim()
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)) as [number, number, number]
}

export function rgbVersHex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('')
}

function luminance(hex: string): number {
  const [r, g, b] = hexVersRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contraste(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/** Mélange une couleur avec une autre (p = part de la seconde, de 0 à 1). */
export function melanger(hex: string, avec: string, p: number): string {
  const a = hexVersRgb(hex)
  const b = hexVersRgb(avec)
  return rgbVersHex(a.map((v, i) => v + (b[i] - v) * p))
}

/** Assombrit la couleur jusqu'à atteindre le contraste demandé avec le texte donné. */
export function rendreLisible(fond: string, texte = '#ffffff', cible = 4.5): string {
  let c = fond
  for (let i = 0; i < 40 && contraste(c, texte) < cible; i++) c = melanger(c, '#000000', 0.05)
  return c
}

/** Texte blanc ou quasi noir, selon ce qui se lit le mieux sur le fond. */
export function texteSur(fond: string): string {
  return contraste(fond, '#ffffff') >= contraste(fond, '#171717') ? '#ffffff' : '#171717'
}
