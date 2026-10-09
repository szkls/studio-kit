#!/usr/bin/env python3
"""Contrôle mécanique d'un écran HTML, pour agent-ui-designer.

Vérifie ce qu'une IA laisse passer en se relisant : échelle typo, multiples
de 4, gris teintés, labels, textes alternatifs, focus supprimé, tics d'IA,
données de remplissage. Ne demande rien d'autre que Python 3 (bibliothèque
standard), ne se connecte à rien, ne modifie aucun fichier.

Usage :
    python3 controle.py design/<ecran>/index.html [autres fichiers…]
    python3 controle.py design/<ecran>/index.html --json
    python3 controle.py fichier.html --design chemin/DESIGN.md

Le script cherche tout seul un DESIGN.md en remontant depuis le fichier
(dossier courant, puis parents, y compris un sous-dossier design/). Les
tailles, couleurs et rayons déclarés dans son en-tête étendent ou
remplacent les valeurs par défaut.

Code de sortie : 0 si aucun P0 ni P1, 2 s'il en reste, 1 si un fichier
n'a pas pu être lu.
"""

import argparse
import json
import os
import re
import sys
from html.parser import HTMLParser

# ---------------------------------------------------------------- réglages

ECHELLE_TYPO = {12, 14, 16, 18, 20, 24, 28, 32, 40, 48}
ECHELLE_Z = {0, 10, 20, 30, 40}
TAILLE_ICONE_MIN = 14

TW_TEXTE = {
    "xs": 12, "sm": 14, "base": 16, "lg": 18, "xl": 20, "2xl": 24,
    "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128,
}
TW_RAYON = {
    "rounded-none": 0, "rounded-sm": 2, "rounded": 4, "rounded-md": 6,
    "rounded-lg": 8, "rounded-xl": 12, "rounded-2xl": 16, "rounded-3xl": 24,
}
PREFIXES_ESPACE = (
    "p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe",
    "m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
    "gap", "gap-x", "gap-y", "space-x", "space-y",
)
RE_ESPACE_TW = re.compile(
    r"^-?(" + "|".join(sorted((re.escape(p) for p in PREFIXES_ESPACE), key=len, reverse=True))
    + r")-(.+)$"
)
NEUTRES_TEINTES = re.compile(r"(?:^|:)(?:bg|text|border|ring|divide|from|to|via|fill|stroke|outline|shadow)-(slate|gray|zinc|stone)-\d{2,3}\b")
COULEUR_TEXTE_TW = re.compile(r"(?:^|:)text-([a-z]+)-(\d{2,3})$")
NEUTRES_NOMS = {"neutral", "black", "white", "gray", "slate", "zinc", "stone", "current", "inherit", "transparent"}

DONNEES_BIDON = re.compile(
    r"\b(lorem ipsum|dolor sit amet|john doe|jane doe|jean dupont|acme|foo bar|"
    r"utilisateur ?[0-9]+|user ?[0-9]+|test@test|exemple entreprise|company name|nom de l'entreprise)\b",
    re.I,
)
EMOJI = re.compile(
    "[\U0001F300-\U0001FAFF\U0001F600-\U0001F64F\U0001F680-\U0001F6FF☀-⛿✀-➿⭐⭕]"
)
TIRET_LONG = re.compile("—")
DEMI_TIRET = re.compile("–")
POINT_MEDIAN = re.compile("·")
NUMERO_SECTION = re.compile(r"^\s*0\d\s*(?:[/.\-:]|$)")

# Gris Tailwind teintés (slate, gray, zinc, stone), repérés aussi en valeur hexadécimale.
GRIS_TEINTES_HEX = set("""
#f8fafc #f1f5f9 #e2e8f0 #cbd5e1 #94a3b8 #64748b #475569 #334155 #1e293b #0f172a #020617
#f9fafb #f3f4f6 #e5e7eb #d1d5db #9ca3af #6b7280 #4b5563 #374151 #1f2937 #111827 #030712
#f4f4f5 #e4e4e7 #d4d4d8 #a1a1aa #71717a #52525b #3f3f46 #27272a #18181b #09090b
#fafaf9 #f5f5f4 #e7e5e4 #d6d3d1 #a8a29e #78716c #57534e #44403c #292524 #1c1917 #0c0a09
""".split())

TYPES_SANS_LABEL ={"hidden", "submit", "button", "reset", "image"}
VIDES = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

GRAVITE_ORDRE = {"P0": 0, "P1": 1, "P2": 2}

# ---------------------------------------------------------------- DESIGN.md


def trouver_design_md(depart):
    dossier = os.path.abspath(depart if os.path.isdir(depart) else os.path.dirname(depart))
    for _ in range(6):
        for nom in ("DESIGN.md", os.path.join("design", "DESIGN.md")):
            chemin = os.path.join(dossier, nom)
            if os.path.isfile(chemin):
                return chemin
        parent = os.path.dirname(dossier)
        if parent == dossier:
            break
        dossier = parent
    return None


def bloc_yaml(lignes, cle):
    """Lignes du bloc de premier niveau `cle:` dans un en-tête YAML simple."""
    dedans, sortie = False, []
    for ligne in lignes:
        if re.match(r"^" + re.escape(cle) + r"\s*:", ligne):
            dedans = True
            continue
        if dedans:
            if ligne.strip() and not ligne.startswith((" ", "\t")):
                break
            sortie.append(ligne)
    return sortie


def lire_design_md(chemin):
    infos = {"chemin": chemin, "tailles": set(), "couleurs": set(), "rayons": set(), "texte": ""}
    if not chemin:
        return infos
    with open(chemin, encoding="utf-8") as f:
        texte = f.read()
    infos["texte"] = texte.lower()
    m = re.match(r"^---\s*\n(.*?)\n---", texte, re.S)
    if not m:
        return infos
    lignes = m.group(1).splitlines()
    for ligne in bloc_yaml(lignes, "typography"):
        for v in re.findall(r"(\d+(?:\.\d+)?)px", ligne):
            infos["tailles"].add(round(float(v)))
    for ligne in bloc_yaml(lignes, "colors"):
        for v in re.findall(r"#[0-9a-fA-F]{3,8}\b", ligne):
            infos["couleurs"].add(normaliser_hex(v))
    for ligne in bloc_yaml(lignes, "rounded"):
        for v in re.findall(r"(\d+(?:\.\d+)?)px", ligne):
            infos["rayons"].add(round(float(v)))
        if re.search(r":\s*0\s*$", ligne):
            infos["rayons"].add(0)
    return infos


def normaliser_hex(h):
    h = h.lower().lstrip("#")
    if len(h) in (3, 4):
        h = "".join(c * 2 for c in h[:3])
    return "#" + h[:6]


# ---------------------------------------------------------------- analyse


class Noeud:
    __slots__ = ("tag", "attrs", "ligne", "classes", "texte", "dernier_enfant", "a_image_alt")

    def __init__(self, tag, attrs, ligne):
        self.tag = tag
        self.attrs = attrs
        self.ligne = ligne
        self.classes = (attrs.get("class") or "").split()
        self.texte = ""
        self.dernier_enfant = None
        self.a_image_alt = False


class Analyse(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pile = [Noeud("#racine", {}, 0)]
        self.elements = []        # (noeud) dans l'ordre d'ouverture
        self.textes = []          # (ligne, texte)
        self.styles = []          # (ligne_debut, contenu)
        self.styles_attr = []     # (ligne, contenu)
        self.labels_for = set()
        self.titres = []          # (niveau, ligne, noeud)
        self.fins = []            # noeuds fermés (pour les contrôles de contenu)
        self._dans_style = False
        self._dans_script = False

    # -- ouverture
    def handle_starttag(self, tag, attrs_liste):
        attrs = {k.lower(): (v if v is not None else "") for k, v in attrs_liste}
        ligne = self.getpos()[0]
        n = Noeud(tag, attrs, ligne)
        parent = self.pile[-1]
        n.dernier_enfant = None
        n_prec = parent.dernier_enfant
        self.elements.append((n, n_prec, [p.tag for p in self.pile]))
        if tag == "style":
            self._dans_style = True
        if tag == "script":
            self._dans_script = True
        if "style" in attrs and attrs["style"]:
            self.styles_attr.append((ligne, attrs["style"]))
        if tag == "label" and attrs.get("for"):
            self.labels_for.add(attrs["for"])
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.titres.append((int(tag[1]), ligne, n))
        if tag == "img" and attrs.get("alt", "").strip():
            for p in self.pile:
                p.a_image_alt = True
        if tag in VIDES:
            parent.dernier_enfant = n
            self.fins.append((n, [p.tag for p in self.pile]))
        else:
            self.pile.append(n)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VIDES and self.pile and self.pile[-1].tag == tag:
            self.handle_endtag(tag)

    # -- fermeture
    def handle_endtag(self, tag):
        if tag == "style":
            self._dans_style = False
        if tag == "script":
            self._dans_script = False
        for i in range(len(self.pile) - 1, 0, -1):
            if self.pile[i].tag == tag:
                while len(self.pile) > i:
                    n = self.pile.pop()
                    self.fins.append((n, [p.tag for p in self.pile]))
                    self.pile[-1].dernier_enfant = n
                    self.pile[-1].texte += " " + n.texte
                return

    # -- texte
    def handle_data(self, data):
        ligne = self.getpos()[0]
        if self._dans_style:
            self.styles.append((ligne, data))
            return
        if self._dans_script:
            return
        if data.strip():
            self.textes.append((ligne, data))
            self.pile[-1].texte += data


# ---------------------------------------------------------------- contrôles


class Constats:
    def __init__(self):
        self.par_cle = {}

    def ajouter(self, gravite, regle, detail, ligne, conseil):
        cle = (gravite, regle, detail)
        if cle not in self.par_cle:
            self.par_cle[cle] = {"gravite": gravite, "regle": regle, "detail": detail,
                                 "lignes": [], "conseil": conseil}
        if ligne and ligne not in self.par_cle[cle]["lignes"]:
            self.par_cle[cle]["lignes"].append(ligne)

    def liste(self):
        return sorted(self.par_cle.values(), key=lambda c: (GRAVITE_ORDRE[c["gravite"]], c["regle"], c["lignes"][:1]))


def px_depuis(valeur, unite):
    v = float(valeur)
    return v * 16 if unite in ("rem", "em") else v


def valeur_espace_tw(v):
    """Valeur Tailwind d'espacement → px, ou None si non mesurable."""
    if v in ("auto", "0", "full", "screen", "reverse"):
        return None if v != "0" else 0
    if v == "px":
        return 1
    m = re.match(r"^\[(-?\d+(?:\.\d+)?)(px|rem|em)\]$", v)
    if m:
        return px_depuis(m.group(1), m.group(2))
    m = re.match(r"^(\d+(?:\.\d+)?)$", v)
    if m:
        return float(m.group(1)) * 4
    return None


def classe_sans_variantes(c):
    return c.split(":")[-1].lstrip("!")


def verifier_classes(n, cs, design, tailles_ok):
    classes = [classe_sans_variantes(c) for c in n.classes]
    brutes = n.classes
    for c in classes:
        # taille de texte
        m = re.match(r"^text-(xs|sm|base|lg|xl|[2-9]xl)$", c)
        if m:
            px = TW_TEXTE[m.group(1)]
            if px not in tailles_ok:
                cs.ajouter("P1", "Taille de texte hors échelle", f"{c} ({px} px)", n.ligne,
                           "Utiliser 12, 14, 16, 18, 20, 24, 28, 32, 40 ou 48 px (ex. text-[28px]).")
        m = re.match(r"^text-\[(\d+(?:\.\d+)?)(px|rem)\]$", c)
        if m:
            px = round(px_depuis(m.group(1), m.group(2)))
            if px not in tailles_ok:
                cs.ajouter("P1", "Taille de texte hors échelle", f"{c} ({px} px)", n.ligne,
                           "Ramener sur l'échelle 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 40 / 48.")
        # espacements
        m = RE_ESPACE_TW.match(c)
        if m:
            px = valeur_espace_tw(m.group(2))
            if px is not None and px % 4 != 0:
                cs.ajouter("P1", "Espacement hors multiple de 4", f"{c} ({px:g} px)", n.ligne,
                           "Utiliser 4, 8, 12, 16, 24, 32, 48 ou 64 px.")
        # z-index
        m = re.match(r"^-?z-(\d+|\[(\d+)\])$", c)
        if m:
            z = int(m.group(2) or m.group(1))
            if z not in ECHELLE_Z:
                cs.ajouter("P2", "Niveau de superposition hors échelle", c, n.ligne,
                           "Échelle fixe : 0 contenu, 10 en-tête fixe, 20 flottant, 30 superposition, 40 notification.")
        # rayons
        if design["rayons"] and c in TW_RAYON and TW_RAYON[c] not in design["rayons"]:
            cs.ajouter("P1", "Rayon hors charte", c, n.ligne, "Utiliser un rayon déclaré dans DESIGN.md.")
        m = re.match(r"^rounded(?:-[a-z]{1,2})?-\[(\d+)px\]$", c)
        if m and design["rayons"] and int(m.group(1)) not in design["rayons"]:
            cs.ajouter("P1", "Rayon hors charte", c, n.ligne, "Utiliser un rayon déclaré dans DESIGN.md.")
        # transitions, animations décoratives
        if c == "transition-all":
            cs.ajouter("P2", "Transition sur toutes les propriétés", c, n.ligne,
                       "Lister les propriétés animées (opacity, transform, couleurs).")
        if c in ("animate-bounce", "animate-ping"):
            cs.ajouter("P2", "Animation décorative en boucle", c, n.ligne,
                       "Réserver le mouvement continu à un état réel (chargement).")
        # ombre colorée (halo)
        if re.match(r"^shadow-(?!sm$|md$|lg$|xl$|2xl$|inner$|none$)[a-z]+-\d{2,3}(/\d+)?$", c):
            cs.ajouter("P2", "Ombre colorée (halo)", c, n.ligne, "Ombre en transparence de noir, ou aucune.")
    # gris teintés
    if not any(nom in design["texte"] for nom in ("slate", "zinc", "stone", "gray-")):
        for c in brutes:
            if NEUTRES_TEINTES.search(c):
                cs.ajouter("P1", "Gris teinté (bleuté ou chaud)", classe_sans_variantes(c), n.ligne,
                           "Utiliser l'échelle neutral (gris sans teinte).")
    # thème sombre
    if "dark" not in design["texte"]:
        for c in brutes:
            if c.startswith("dark:"):
                cs.ajouter("P1", "Classes de thème sombre", "dark:…", n.ligne,
                           "Écran livré en clair uniquement : retirer les variantes dark:.")
                break
    # focus supprimé
    if "outline-none" in classes and not any(
        b.startswith(("focus-visible:", "focus:")) and ("ring" in b or "outline" in b) for b in brutes
    ):
        cs.ajouter("P0", "Focus supprimé", f"<{n.tag}> outline-none", n.ligne,
                   "Garder un anneau de focus visible (focus-visible:ring-2).")
    # bordure latérale épaisse colorée
    if any(re.match(r"^border-[lrse]-(?:[2-8]|\[\d+px\])$", c) for c in classes) and any(
        re.match(r"^border-(?!neutral|black|white|transparent)[a-z]+-\d{2,3}$", c) for c in classes
    ):
        cs.ajouter("P1", "Bordure colorée sur un côté (tic d'IA)", f"<{n.tag}>", n.ligne,
                   "Signaler l'état par une pastille et un libellé, pas par une bande latérale.")
    # texte en dégradé
    if "bg-clip-text" in classes and any(c.startswith(("bg-gradient", "bg-linear", "from-")) for c in classes):
        cs.ajouter("P1", "Texte en dégradé (tic d'IA)", f"<{n.tag}>", n.ligne,
                   "L'emphase passe par la taille ou la graisse.")
    # titre en couleur
    if n.tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
        for c in classes:
            m = COULEUR_TEXTE_TW.match(c)
            if m and m.group(1) not in NEUTRES_NOMS:
                cs.ajouter("P1", "Titre en couleur", f"<{n.tag}> {c}", n.ligne,
                           "Un titre est en couleur de contenu (neutral), jamais d'action ni de sélection.")
    # icône trop petite
    if n.tag == "svg":
        taille = None
        for c in classes:
            m = re.match(r"^(?:size|w|h)-(\d+(?:\.\d+)?)$", c)
            if m:
                taille = float(m.group(1)) * 4
        for a in ("width", "height"):
            if re.match(r"^\d+$", n.attrs.get(a, "")):
                taille = float(n.attrs[a])
        if taille is not None and 0 < taille < TAILLE_ICONE_MIN:
            cs.ajouter("P2", "Icône sous 14 px", f"svg {taille:g} px", n.ligne, "Une icône fait au moins 14 px.")


def verifier_css(texte, ligne_debut, cs, design, tailles_ok):
    def ligne_de(index):
        return ligne_debut + texte.count("\n", 0, index)

    for m in re.finditer(r"font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem)", texte, re.I):
        px = round(px_depuis(m.group(1), m.group(2)))
        if px not in tailles_ok:
            cs.ajouter("P1", "Taille de texte hors échelle", f"font-size: {m.group(1)}{m.group(2)} ({px} px)",
                       ligne_de(m.start()), "Ramener sur l'échelle 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 40 / 48.")
    for m in re.finditer(r"\b(padding|margin|gap|row-gap|column-gap)(-[a-z-]+)?\s*:\s*([^;}{]+)", texte, re.I):
        for v, u in re.findall(r"(-?\d+(?:\.\d+)?)(px|rem)\b", m.group(3)):
            px = abs(px_depuis(v, u))
            if px and px % 4 != 0:
                cs.ajouter("P1", "Espacement hors multiple de 4", f"{m.group(1)}{m.group(2) or ''}: {v}{u}",
                           ligne_de(m.start()), "Utiliser 4, 8, 12, 16, 24, 32, 48 ou 64 px.")
    for m in re.finditer(r"z-index\s*:\s*(-?\d+)", texte, re.I):
        if int(m.group(1)) not in ECHELLE_Z:
            cs.ajouter("P2", "Niveau de superposition hors échelle", f"z-index: {m.group(1)}", ligne_de(m.start()),
                       "Échelle fixe : 0, 10, 20, 30, 40.")
    for m in re.finditer(r"outline\s*:\s*(none|0)\b", texte, re.I):
        cs.ajouter("P1", "Focus peut-être supprimé", f"outline: {m.group(1)}", ligne_de(m.start()),
                   "Vérifier qu'un :focus-visible visible remplace le contour.")
    for m in re.finditer(r"transition\s*:\s*all\b", texte, re.I):
        cs.ajouter("P2", "Transition sur toutes les propriétés", "transition: all", ligne_de(m.start()),
                   "Lister les propriétés animées.")
    if "dark" not in design["texte"]:
        for m in re.finditer(r"prefers-color-scheme\s*:\s*dark", texte, re.I):
            cs.ajouter("P1", "Palette sombre automatique", "prefers-color-scheme: dark", ligne_de(m.start()),
                       "Écran livré en clair uniquement.")
    for m in re.finditer(r"border-radius\s*:\s*(\d+)px", texte, re.I):
        if design["rayons"] and int(m.group(1)) not in design["rayons"]:
            cs.ajouter("P1", "Rayon hors charte", f"border-radius: {m.group(1)}px", ligne_de(m.start()),
                       "Utiliser un rayon déclaré dans DESIGN.md.")
    # couleurs : gris teintés et couleurs hors charte
    hors_charte = []
    for m in re.finditer(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b", texte):
        h = normaliser_hex(m.group(0))
        r, g, b = (int(h[i:i + 2], 16) for i in (1, 3, 5))
        ecart = max(r, g, b) - min(r, g, b)
        if (h in GRIS_TEINTES_HEX or 0 < ecart <= 10) and h not in design["couleurs"]:
            cs.ajouter("P1", "Gris teinté (bleuté ou chaud)", h, ligne_de(m.start()),
                       "Utiliser un gris à composantes égales (neutral).")
        elif design["couleurs"] and h not in design["couleurs"] and h not in ("#ffffff", "#000000"):
            hors_charte.append((h, ligne_de(m.start())))
    for h, ligne in hors_charte[:12]:
        cs.ajouter("P2", "Couleur absente de DESIGN.md", h, ligne,
                   "Prendre la couleur dans la charte, ou dans Tailwind et l'ajouter à DESIGN.md.")
    # @apply : mêmes contrôles que les classes
    for m in re.finditer(r"@apply\s+([^;]+);", texte):
        faux = Noeud("style", {"class": m.group(1)}, ligne_de(m.start()))
        verifier_classes(faux, cs, design, tailles_ok)


def controler(chemin, chemin_design=None):
    cs = Constats()
    with open(chemin, encoding="utf-8") as f:
        source = f.read()
    design = lire_design_md(chemin_design or trouver_design_md(chemin))
    tailles_ok = ECHELLE_TYPO | design["tailles"] if design["tailles"] else set(ECHELLE_TYPO)

    a = Analyse()
    a.feed(source)
    a.close()

    ids_labelles = a.labels_for
    a_logo = "data-logo-slot" in source
    a_structure = False

    for n, prec, pile in a.elements:
        attrs = n.attrs
        verifier_classes(n, cs, design, tailles_ok)
        if n.tag in ("header", "nav", "aside"):
            a_structure = True
        # champs sans label
        if n.tag in ("input", "select", "textarea"):
            t = attrs.get("type", "text").lower()
            if t not in TYPES_SANS_LABEL:
                ok = (attrs.get("id") in ids_labelles) or "label" in pile or attrs.get("aria-label") \
                    or attrs.get("aria-labelledby") or attrs.get("title")
                if not ok:
                    cs.ajouter("P0", "Champ sans label", f"<{n.tag} name=\"{attrs.get('name', '')}\">", n.ligne,
                               "Ajouter un <label for> visible ; le placeholder n'est pas un label.")
        # images sans alternative
        if n.tag == "img" and "alt" not in attrs:
            cs.ajouter("P0", "Image sans attribut alt", attrs.get("src", "")[:40], n.ligne,
                       "alt décrivant l'information, ou alt=\"\" si décorative.")
        # tabindex positif
        if re.match(r"^[1-9]\d*$", attrs.get("tabindex", "")):
            cs.ajouter("P1", "tabindex positif", f"<{n.tag} tabindex={attrs['tabindex']}>", n.ligne,
                       "Laisser l'ordre du document décider (tabindex 0 ou -1).")
        # éléments cliquables non sémantiques
        if n.tag in ("div", "span", "li", "td") and "onclick" in attrs:
            cs.ajouter("P1", "Élément cliquable non sémantique", f"<{n.tag} onclick>", n.ligne,
                       "Un lien pour naviguer, un bouton pour agir.")
        # bouton d'envoi désactivé d'avance
        if "disabled" in attrs and (
            (n.tag == "button" and attrs.get("type", "submit") == "submit") or
            (n.tag == "input" and attrs.get("type") == "submit")
        ):
            cs.ajouter("P2", "Bouton d'envoi désactivé d'avance", f"<{n.tag} disabled>", n.ligne,
                       "Laisser envoyer et afficher ce qui manque.")
        # étiquette en capitales au-dessus d'un titre
        if n.tag in ("h1", "h2", "h3") and prec is not None:
            cl = [classe_sans_variantes(c) for c in prec.classes]
            st = prec.attrs.get("style", "").lower()
            if ("uppercase" in cl or "text-transform:uppercase" in st.replace(" ", "")) and prec.tag not in ("button", "a"):
                cs.ajouter("P1", "Étiquette en capitales au-dessus d'un titre (tic d'IA)",
                           (prec.texte.strip()[:30] or prec.tag), prec.ligne,
                           "Supprimer l'étiquette : le titre suffit.")

    for n, pile in a.fins:
        # boutons et liens sans nom
        if n.tag in ("button", "a"):
            nom = n.texte.strip() or n.attrs.get("aria-label") or n.attrs.get("aria-labelledby") \
                or n.attrs.get("title") or n.a_image_alt
            if not nom:
                cs.ajouter("P0", "Bouton ou lien sans nom accessible", f"<{n.tag}>", n.ligne,
                           "Ajouter un libellé visible ou un aria-label.")

    # titres
    niveaux = [t[0] for t in a.titres]
    if niveaux.count(1) > 1:
        cs.ajouter("P2", "Plusieurs titres h1", f"{niveaux.count(1)} h1", a.titres[0][1], "Un seul h1 par écran.")
    if a.titres and 1 not in niveaux:
        cs.ajouter("P2", "Aucun titre h1", "", a.titres[0][1], "Le titre de l'écran est un h1.")
    precedent = 0
    for niveau, ligne, _ in a.titres:
        if precedent and niveau > precedent + 1:
            cs.ajouter("P1", "Niveau de titre sauté", f"h{precedent} puis h{niveau}", ligne,
                       "Les niveaux se suivent sans saut.")
        precedent = niveau

    # textes visibles
    numeros = []
    for ligne, t in a.textes:
        if TIRET_LONG.search(t):
            cs.ajouter("P1", "Tiret long dans le texte", t.strip()[:40], ligne,
                       "Virgule, deux-points, parenthèses ou tiret court.")
        if DEMI_TIRET.search(t):
            cs.ajouter("P2", "Demi-tiret dans le texte", t.strip()[:40], ligne, "Tiret court (-).")
        if POINT_MEDIAN.search(t):
            cs.ajouter("P2", "Point médian comme séparateur", t.strip()[:40], ligne,
                       "Retour à la ligne, filet ou colonnes.")
        if EMOJI.search(t):
            cs.ajouter("P1", "Emoji ou pictogramme Unicode", t.strip()[:40], ligne,
                       "Une icône du jeu d'icônes (Lucide), avec libellé.")
        for m in DONNEES_BIDON.finditer(t):
            cs.ajouter("P1", "Donnée de remplissage", m.group(0), ligne,
                       "Contenu vraisemblable et propre au projet (voir redaction.md).")
        if NUMERO_SECTION.match(t):
            numeros.append(ligne)
    for attr_nom in ("placeholder", "value", "alt", "title", "aria-label"):
        for n, _, _ in a.elements:
            m = DONNEES_BIDON.search(n.attrs.get(attr_nom, ""))
            if m:
                cs.ajouter("P1", "Donnée de remplissage", m.group(0), n.ligne,
                           "Contenu vraisemblable et propre au projet.")
    if len(numeros) >= 2:
        cs.ajouter("P2", "Numéros de section décoratifs (01, 02…)", f"{len(numeros)} occurrences", numeros[0],
                   "Supprimer sauf si l'ordre est une information.")

    # feuilles de style
    for ligne, contenu in a.styles:
        verifier_css(contenu, ligne, cs, design, tailles_ok)
    for ligne, contenu in a.styles_attr:
        verifier_css(contenu, ligne, cs, design, tailles_ok)

    # réglages de page
    if "color-scheme" not in source:
        cs.ajouter("P2", "color-scheme absent", "", None, "Ajouter color-scheme: light sur :root.")
    if a_structure and not a_logo:
        cs.ajouter("P2", "Emplacement de logo absent", "", None,
                   "Poser le monogramme avec data-logo-slot dans l'en-tête ou la navigation.")

    return cs.liste(), design["chemin"]


# ---------------------------------------------------------------- sortie


def afficher(chemin, constats, design):
    print(f"\nContrôle de {chemin}")
    print(f"Charte : {design or 'aucun DESIGN.md trouvé (socle par défaut)'}")
    if not constats:
        print("Aucun défaut détecté. Le rendu reste à regarder (contrastes, alignements).")
        return
    for gravite in ("P0", "P1", "P2"):
        lot = [c for c in constats if c["gravite"] == gravite]
        if not lot:
            continue
        print(f"\n{gravite} ({len(lot)})")
        for c in lot:
            lignes = c["lignes"]
            ou = ("l." + ", ".join(str(x) for x in lignes[:6]) + (" …" if len(lignes) > 6 else "")) if lignes else "page"
            detail = f" : {c['detail']}" if c["detail"] else ""
            print(f"  {ou:<16} {c['regle']}{detail}")
            print(f"  {'':<16} -> {c['conseil']}")
    nb = {g: sum(1 for c in constats if c["gravite"] == g) for g in ("P0", "P1", "P2")}
    print(f"\nBilan : {nb['P0']} P0, {nb['P1']} P1, {nb['P2']} P2."
          + (" À corriger avant de rendre : P0 et P1." if nb["P0"] or nb["P1"] else " Rien de bloquant."))


def main():
    p = argparse.ArgumentParser(description="Contrôle mécanique d'un écran HTML (agent-ui-designer).")
    p.add_argument("fichiers", nargs="+")
    p.add_argument("--design", help="chemin d'un DESIGN.md (sinon recherche automatique)")
    p.add_argument("--json", action="store_true", help="sortie JSON")
    args = p.parse_args()

    bloquant, erreur, resultats = False, False, {}
    for chemin in args.fichiers:
        try:
            constats, design = controler(chemin, args.design)
        except OSError as e:
            print(f"Impossible de lire {chemin} : {e}", file=sys.stderr)
            erreur = True
            continue
        if any(c["gravite"] in ("P0", "P1") for c in constats):
            bloquant = True
        if args.json:
            resultats[chemin] = {"design": design, "constats": constats}
        else:
            afficher(chemin, constats, design)
    if args.json:
        print(json.dumps(resultats, ensure_ascii=False, indent=2))
    sys.exit(1 if erreur else (2 if bloquant else 0))


if __name__ == "__main__":
    main()
