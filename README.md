# Rapport d'entretien — Conseil clientèle privée

Générateur de rapports d'entretien client, conçu pour gagner en productivité administrative.
Saisie guidée étape par étape → rapport texte formaté, prêt à coller dans un CRM.

> **Outil interne open source.** PostFinance® est une marque de PostFinance SA.
> Cet outil n'est **pas** un produit officiel de PostFinance SA.
> **Aucune donnée n'est transmise à un serveur** : tout reste dans le navigateur de l'utilisateur.

Conçu par **Develly Varela Sanches** — distribué sous licence MIT (libre de réutilisation et de modification).

---

## 🚀 Mettre le logiciel en ligne (lien sécurisé HTTPS, gratuit)

Trois étapes, aucune compétence technique requise. Comptez ~10 minutes.

### Étape 1 — Créer un compte GitHub
1. Allez sur [github.com](https://github.com) et créez un compte gratuit.

### Étape 2 — Créer le dépôt et y déposer les fichiers
1. Cliquez sur **New repository** (nouveau dépôt).
2. Nommez-le par exemple `rapport-entretien-pf`, cochez **Public**, puis **Create repository**.
3. Cliquez sur **uploading an existing file** (téléverser des fichiers existants).
4. Glissez-déposez **tout le contenu de ce dossier** (y compris les sous-dossiers `src/` et `.github/`).
5. Cliquez sur **Commit changes**.

### Étape 3 — Activer GitHub Pages
1. Dans le dépôt, allez dans **Settings** (réglages) → **Pages** (menu de gauche).
2. Sous **Build and deployment** → **Source**, choisissez **GitHub Actions**.
3. C'est tout ! Le déploiement démarre automatiquement.
4. Au bout d'1 à 2 minutes, votre lien sécurisé apparaît, du type :
   ```
   https://VOTRE-NOM.github.io/rapport-entretien-pf/
   ```

Ce lien est **public, en HTTPS, accessible à tous**. Partagez-le à votre organisation.

> 💡 Chaque modification déposée sur GitHub redéploie le site automatiquement.

---

## 🔗 Personnaliser le lien du crédit

Le pied de page affiche « Conçu par **Develly Varela Sanches** » avec un lien cliquable.
Pour pointer vers votre LinkedIn ou votre e-mail, ouvrez le fichier `src/RapportEntretien.jsx`
et modifiez la ligne en haut :

```js
const CREDIT_URL = "https://www.linkedin.com/in/develly-varela-sanches";
// ou : const CREDIT_URL = "mailto:votre.email@exemple.ch";
```

---

## 🧩 Gestion décentralisée & open source

- **Réutiliser / modifier** : n'importe quel collègue peut cliquer sur **Fork** en haut du dépôt
  pour obtenir sa propre copie, l'héberger et la modifier librement.
- **Aucun serveur central** : chaque copie est indépendante. Pas de base de données, pas de back-end.
- **Confidentialité** : les données client saisies ne quittent jamais le navigateur.

---

## 💻 Lancer en local (optionnel, pour développeurs)

Nécessite [Node.js](https://nodejs.org) (version 18+).

```bash
npm install     # installe les dépendances
npm run dev     # lance en local sur http://localhost:5173
npm run build   # génère la version de production dans dist/
```

---

## 🌐 Alternatives d'hébergement (toutes gratuites + HTTPS)

| Plateforme      | Méthode                                              |
|-----------------|------------------------------------------------------|
| **GitHub Pages**| recommandée (voir ci-dessus)                         |
| **Netlify**     | glissez le dossier `dist/` sur app.netlify.com/drop  |
| **Vercel**      | importez le dépôt GitHub sur vercel.com               |
| **Cloudflare Pages** | connectez le dépôt sur pages.cloudflare.com     |

---

## 📄 Licence

MIT © 2026 Develly Varela Sanches — voir le fichier [LICENSE](./LICENSE).
