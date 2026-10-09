#!/usr/bin/env python3
"""Serveur local des maquettes, pour agent-ui-designer.

À copier une fois dans design/serve.py, puis à lancer depuis n'importe où :
    python3 design/serve.py

- Sert le dossier design/ sur http://127.0.0.1:<port>/.
- Le port est propre au projet : choisi au premier lancement, écrit dans
  design/.port, réutilisé ensuite. Deux projets ouverts ne se gênent pas.
- La page d'accueil liste les écrans (chaque dossier design/<ecran>/ qui
  contient un index.html), avec leurs versions et variantes.
- « Supprimer » déplace l'écran dans design/_corbeille/, d'où on peut le
  remettre à la main.
- Si le serveur tourne déjà, le script affiche l'adresse et s'arrête.

Python 3, bibliothèque standard uniquement.
"""

import html
import http.server
import os
import shutil
import socket
import sys
import time
import urllib.parse
import zlib

DOSSIER = os.path.dirname(os.path.abspath(__file__))
FICHIER_PORT = os.path.join(DOSSIER, ".port")
CORBEILLE = "_corbeille"
IGNORES = {CORBEILLE, "captures", "references", "assets", "__pycache__"}


def port_libre(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) != 0


def choisir_port():
    if os.path.isfile(FICHIER_PORT):
        with open(FICHIER_PORT) as f:
            contenu = f.read().strip()
        if contenu.isdigit():
            return int(contenu), True
    depart = 8100 + zlib.crc32(DOSSIER.encode()) % 700
    for port in range(depart, depart + 50):
        if port_libre(port):
            with open(FICHIER_PORT, "w") as f:
                f.write(str(port))
            return port, False
    raise SystemExit("Aucun port libre trouvé entre %d et %d." % (depart, depart + 49))


def ecrans():
    liste = []
    for nom in sorted(os.listdir(DOSSIER)):
        chemin = os.path.join(DOSSIER, nom)
        if nom.startswith((".", "_")) or nom in IGNORES or not os.path.isdir(chemin):
            continue
        index = os.path.join(chemin, "index.html")
        if not os.path.isfile(index):
            continue
        sous = []
        for s in sorted(os.listdir(chemin)):
            if os.path.isfile(os.path.join(chemin, s, "index.html")):
                sous.append(s)
        liste.append((nom, os.path.getmtime(index), sous))
    liste.sort(key=lambda e: e[1], reverse=True)
    return liste


PAGE = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Maquettes - {projet}</title>
<style>
:root {{ color-scheme: light; }}
body {{ margin: 0; font: 14px/1.5 Roboto, system-ui, sans-serif; color: #171717; background: #fafafa; }}
main {{ max-width: 880px; margin: 0 auto; padding: 48px 32px; }}
h1 {{ font-size: 24px; font-weight: 600; margin: 0 0 8px; }}
p.sous-titre {{ margin: 0 0 32px; color: #525252; }}
ul {{ list-style: none; margin: 0; padding: 0; background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; overflow: hidden; }}
li {{ display: flex; align-items: center; gap: 16px; padding: 16px 24px; border-top: 1px solid rgba(0,0,0,.06); }}
li:first-child {{ border-top: 0; }}
.nom {{ flex: 1; min-width: 0; }}
.nom a {{ font-size: 16px; font-weight: 500; color: #1d4ed8; text-underline-offset: 4px; }}
.meta {{ color: #737373; font-size: 12px; }}
.meta a {{ color: #525252; margin-right: 8px; }}
button {{ font: inherit; padding: 8px 16px; border-radius: 6px; border: 1px solid #d4d4d4; background: #fff; color: #b91c1c; cursor: pointer; }}
button:hover {{ background: #fef2f2; }}
button:focus-visible, a:focus-visible {{ outline: 2px solid #2563eb; outline-offset: 2px; }}
.vide {{ padding: 32px 24px; color: #525252; }}
</style></head>
<body><main>
<h1>Maquettes du projet</h1>
<p class="sous-titre">{nombre}. Les plus récentes en premier.</p>
{contenu}
</main></body></html>"""


class Gestion(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=DOSSIER, **k)

    def log_message(self, *a):
        pass

    def do_GET(self):
        if urllib.parse.urlparse(self.path).path in ("/", "/index.html") and not os.path.isfile(
            os.path.join(DOSSIER, "index.html")
        ):
            return self.page_accueil()
        return super().do_GET()

    def page_accueil(self):
        liste = ecrans()
        if liste:
            lignes = []
            for nom, date, sous in liste:
                n = html.escape(nom)
                liens = "".join('<a href="/%s/%s/">%s</a>' % (n, html.escape(s), html.escape(s)) for s in sous)
                quand = time.strftime("%d/%m/%Y %H:%M", time.localtime(date))
                lignes.append(
                    '<li><div class="nom"><a href="/%s/">%s</a>'
                    '<div class="meta">Modifié le %s %s</div></div>'
                    '<form method="post" action="/supprimer" onsubmit="return confirm(\'Supprimer l\\\'écran %s ? Il ira dans la corbeille.\')">'
                    '<input type="hidden" name="ecran" value="%s">'
                    '<button type="submit">Supprimer l\'écran</button></form></li>'
                    % (n, n, quand, ("- versions : " + liens) if liens else "", n, n)
                )
            contenu = "<ul>%s</ul>" % "".join(lignes)
        else:
            contenu = '<ul><li class="vide">Aucun écran pour l\'instant.</li></ul>'
        nombre = "%d écran%s" % (len(liste), "s" if len(liste) > 1 else "")
        corps = PAGE.format(projet=html.escape(os.path.basename(os.path.dirname(DOSSIER))),
                            nombre=nombre, contenu=contenu).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(corps)))
        self.end_headers()
        self.wfile.write(corps)

    def do_POST(self):
        if self.path != "/supprimer":
            self.send_error(404)
            return
        longueur = int(self.headers.get("Content-Length", 0))
        donnees = urllib.parse.parse_qs(self.rfile.read(longueur).decode("utf-8"))
        nom = os.path.basename(donnees.get("ecran", [""])[0])
        source = os.path.join(DOSSIER, nom)
        if nom and nom not in IGNORES and not nom.startswith((".", "_")) and os.path.isdir(source):
            os.makedirs(os.path.join(DOSSIER, CORBEILLE), exist_ok=True)
            cible = os.path.join(DOSSIER, CORBEILLE, "%s-%s" % (nom, time.strftime("%Y%m%d-%H%M%S")))
            shutil.move(source, cible)
        self.send_response(303)
        self.send_header("Location", "/")
        self.end_headers()


def main():
    port, connu = choisir_port()
    url = "http://127.0.0.1:%d/" % port
    if connu and not port_libre(port):
        print("Le serveur tourne déjà : %s" % url)
        return
    serveur = http.server.ThreadingHTTPServer(("127.0.0.1", port), Gestion)
    print("Maquettes servies sur %s (Ctrl+C pour arrêter)" % url)
    sys.stdout.flush()
    try:
        serveur.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
