# Portfolio de Dominic Morissette

Site portfolio officiel de Dominic Morissette, photographe, vidéaste et réalisateur.

- Site public : [dominicmorissette.ca](https://dominicmorissette.ca/)
- Dépôt GitHub : [julienroyal/portfoliophoto](https://github.com/julienroyal/portfoliophoto)
- Production : GitHub Pages, déployé automatiquement depuis `main`

## À lire avant toute modification

Ce projet est un site statique, sans framework, gestionnaire de paquets ni étape de compilation. Il doit continuer à fonctionner directement sur GitHub Pages.

Règles importantes :

1. Conserver les chemins relatifs comme `./assets/images/...` dans le HTML et le JavaScript.
2. Ne pas introduire de dépendance serveur, base de données, fonction infonuagique ou secret côté client.
3. Ne jamais supprimer la balise `google-site-verification`, les métadonnées SEO, `robots.txt`, `sitemap.xml` ou `.nojekyll` sans raison explicite.
4. Préserver le domaine canonique `https://dominicmorissette.ca/` dans les balises canonical, Open Graph, JSON-LD, `robots.txt` et `sitemap.xml`.
5. Ne pas publier `output/`, `outputs/`, `.playwright-cli/` ni `temporary pictures/`.
6. Inspecter `git status` et le diff avant tout commit. Des changements locaux peuvent appartenir à une autre personne.
7. Une demande de modification locale n’autorise pas automatiquement une publication. Pousser seulement lorsque demandé.

## Structure du projet

| Fichier ou dossier | Rôle |
| --- | --- |
| `index.html` | Structure complète de la page, contenu, médias visibles, métadonnées SEO et données structurées |
| `styles.css` | Mise en page, responsive, animations et états des galeries |
| `script.js` | Diaporama du hero, vidéos YouTube, révélations de couleur, documentaires, galeries et lightbox |
| `assets/images/hero/` | Images du diaporama d’accueil |
| `assets/images/photographie/` | Série Photographie |
| `assets/images/portraits/` | Série Portraits |
| `assets/images/evenements/` | Série Événements |
| `assets/images/documentaires/` | Affiches des documentaires |
| `assets/images/dominic-morissette-bio.jpg` | Photo de la biographie |
| `assets/images/dominic-morissette-og.jpg` | Image de partage Open Graph |
| `sitemap.xml` | Page principale et inventaire des images destinées aux moteurs de recherche |
| `robots.txt` | Autorisation d’exploration et URL du sitemap |
| `.github/workflows/static.yml` | Déploiement automatique GitHub Pages après chaque push sur `main` |
| `PRODUCT.md` | Objectif, publics et principes du produit |
| `DESIGN.md` | Direction visuelle et règles de design |

## Sections actuelles

La page unique contient : Hero, Photographie, Portraits, Événements, Vidéos, Documentaires, Biographie et Contact.

Le menu volontairement simplifié ne contient pas nécessairement un lien vers chaque section.

## Modifier une galerie photo

Une image visible ou disponible dans « Voir la série » doit rester synchronisée à plusieurs endroits.

### Images mises de l’avant

Les quatre images visibles de Photographie, Portraits et Événements sont définies dans `index.html` avec :

- `data-gallery="..."`;
- `data-index="..."`;
- un texte `aria-label`;
- un `alt` descriptif;
- les dimensions intrinsèques `width` et `height`.

Le `data-index` doit correspondre exactement à la position de la même image dans `galleryData` de `script.js`. Sinon, un clic ouvrira la mauvaise photo.

### Galerie complète et légendes

Toutes les images et légendes de la lightbox sont définies dans `galleryData` dans `script.js` :

```js
["./assets/images/photographie/exemple.webp", "Légende affichée sous la photo"]
```

Pour ajouter ou remplacer une photo :

1. Convertir l’original en WebP optimisé en conservant son ratio.
2. Déposer le fichier dans le bon sous-dossier de `assets/images/`.
3. Mettre à jour `galleryData` dans `script.js`.
4. Si la photo est mise de l’avant, mettre aussi à jour `index.html` et son `data-index`.
5. Ajouter ou remplacer son URL dans `sitemap.xml`.
6. Vérifier la grille, « Voir la série », la lightbox, la légende et la navigation clavier.

Exemple de conversion avec ImageMagick :

```powershell
magick "photo-source.jpg" -auto-orient -strip -quality 84 "assets/images/photographie/photo.webp"
```

Ne pas forcer toutes les images dans un ratio identique. La composition du site respecte les ratios originaux.

## Modifier le hero

Le diaporama se trouve dans `index.html` sous `[data-hero-slideshow]`. Son comportement se trouve au début de `script.js`.

- Intervalle actuel : `3000` ms.
- Toutes les images doivent partager dimensions intrinsèques et positionnement adaptés.
- Le hero conserve son traitement visuel monochrome.
- Toute nouvelle image importante doit aussi être ajoutée à `sitemap.xml`.

## Modifier les vidéos

La section Vidéos utilise un lecteur YouTube unique et un menu de sélection dans `index.html`.

- Conserver seulement l’identifiant YouTube dans `data-video-id`.
- Pour un Short, utiliser aussi son identifiant vidéo; le script construit l’URL d’intégration.
- Garder titre visible, `aria-label` et données associées cohérents.
- Tester la lecture sur ordinateur et mobile après chaque changement.

## Modifier les documentaires

Les documentaires ne sont pas intégrés dans des lecteurs. Chaque affiche est un lien externe vers la plateforme qui héberge le film ou la bande-annonce.

- Affiches et textes : `index.html`.
- Mise en page desktop et carrousel mobile : `styles.css`.
- Interaction de sélection desktop : `script.js`.
- Toujours conserver `target="_blank"` avec `rel="noopener noreferrer"` sur les liens externes.

## SEO et partage social

Le site utilise un titre et une meta description, une URL canonique, Open Graph, Twitter Cards, JSON-LD, `robots.txt`, un sitemap XML avec images, Google Search Console et IndexNow.

Après changement d’URL, d’image importante ou de structure :

1. Mettre à jour `index.html` et `sitemap.xml`.
2. Vérifier que toutes les URL publiques répondent avec HTTP 200.
3. Soumettre de nouveau `https://dominicmorissette.ca/sitemap.xml` dans Google Search Console si nécessaire.
4. Ne jamais remplacer l’URL canonique par l’URL technique `github.io`.

## Aperçu local et validation

Le site peut être ouvert directement, mais un serveur statique reproduit mieux GitHub Pages :

```powershell
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000/`.

Contrôles minimaux avant publication :

```powershell
node --check script.js
git diff --check
```

Vérifier aussi :

- aucune erreur dans la console navigateur;
- aucun défilement horizontal à 320, 390, 768 et 1440 px;
- hero et vidéos fonctionnels;
- galeries, lightbox, légendes et navigation clavier fonctionnelles;
- blocage du défilement arrière-plan quand une galerie est ouverte;
- image de biographie en couleur;
- liens de documentaires valides.

## Publication GitHub Pages

Le workflow `.github/workflows/static.yml` déploie automatiquement la racine du dépôt après un push sur `main`.

```powershell
git status -sb
git diff --check
git add <fichiers-concernés>
git commit -m "Description concise"
git push origin main
gh run list --repo julienroyal/portfoliophoto --limit 5
```

Attendre la réussite du workflow **Deploy static content to Pages**, puis vérifier le site public avec un paramètre anticache :

```text
https://dominicmorissette.ca/?v=TIMESTAMP
```

## Accès pour Claude, ChatGPT ou autre agent MCP

Le moyen recommandé pour lire et mettre à jour le dépôt à distance est le [serveur MCP GitHub officiel](https://github.com/github/github-mcp-server).

- Point d’accès MCP distant : [https://api.githubcopilot.com/mcp/](https://api.githubcopilot.com/mcp/)
- Dépôt à autoriser : [https://github.com/julienroyal/portfoliophoto](https://github.com/julienroyal/portfoliophoto)
- Documentation officielle : [configuration du serveur MCP GitHub](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md)

Configuration générique pour un client MCP compatible HTTP :

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

Le client doit ensuite s’authentifier auprès de GitHub et obtenir un accès en écriture au dépôt. Si le client ne prend pas en charge OAuth, suivre la méthode d’authentification documentée par GitHub.

Ne jamais enregistrer de jeton personnel, mot de passe ou secret dans ce README, dans un prompt, dans le dépôt ou dans le code du site.

### Prompt de reprise suggéré

```text
Utilise le serveur MCP GitHub pour ouvrir le dépôt julienroyal/portfoliophoto.
Lis d’abord README.md, PRODUCT.md et DESIGN.md. Inspecte ensuite git status et les fichiers touchés.
Le site est statique et déployé sur GitHub Pages depuis main. Préserve les chemins relatifs,
la compatibilité mobile, l’accessibilité, les métadonnées SEO et la synchronisation entre
index.html, galleryData dans script.js et sitemap.xml. Ne publie que si je le demande explicitement.
```

## Contacts du site

- Téléphone : 514 971-3189
- Courriel : [info@dominicmorissette.ca](mailto:info@dominicmorissette.ca)
