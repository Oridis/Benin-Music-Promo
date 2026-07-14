# 🇧🇯 Bénin Music Promo - Documentation Officielle & Technique

Bienvenue sur la documentation complète et technique de **Bénin Music Promo**, la plateforme de référence pour la mise en relation sécurisée entre les artistes indépendants béninois et les promoteurs de l'industrie musicale (radios, télés, influenceurs, blogueurs, curateurs de playlists, DJs, clubs).

Cette plateforme a été conçue pour résoudre le manque de transparence, structurer le marché et sécuriser les transactions financières liées à la promotion musicale au Bénin, grâce à un système innovant de portefeuille et de **compte séquestre sécurisé**.

---

## 📌 Sommaire
1. [Vue d'ensemble & Concept](#1-vue-densemble--concept)
2. [Architecture du Projet](#2-architecture-du-projet)
3. [Fonctionnalités Implémentées](#3-fonctionnalités-implémentées)
4. [Règles Métier (Commissions, Remboursements, Arbitrage)](#4-règles-métier-commissions-remboursements-arbitrage)
5. [Dépendances & Technologies](#5-dépendances--technologies)
6. [Déploiement Progressive Web App (PWA)](#6-déploiement-progressive-web-app-pwa)
7. [Foire Aux Questions (FAQ) Technique](#7-foire-aux-questions-faq-technique)

---

## 1. Vue d'ensemble & Concept

Historiquement, la promotion musicale en Afrique de l'Ouest, et particulièrement au Bénin, repose sur des arrangements informels. Les artistes envoient des fonds via Mobile Money à des promoteurs ou animateurs sans aucune garantie que la diffusion sera effectuée. En cas de refus ou de non-diffusion, récupérer son argent s'avère extrêmement difficile.

**Bénin Music Promo** professionnalise ce secteur en s'interposant comme un tiers de confiance :
*   **Pour l'Artiste** : Une vitrine claire des tarifs des promoteurs, l'assurance que son argent n'est transféré qu'après présentation de preuves matérielles, et un remboursement instantané sans frais en cas de non-réponse ou de refus.
*   **Pour le Promoteur** : Un flux constant de propositions qualifiées d'artistes sérieux, la certitude que les fonds sont déjà disponibles et bloqués, et un outil professionnel pour prouver sa valeur.

---

## 2. Architecture du Projet

L'application suit une architecture Single Page Application (SPA) robuste et modulaire en **React 19** et **TypeScript**, structurée de manière à séparer les composants d'interface, la gestion d'état locale persistante et les modules utilitaires.

### Structure du Code source :
*   `src/App.tsx` : Composant central et orchestrateur de l'application. Gère :
    *   L'authentification fictive et les rôles utilisateurs (Artiste, Promoteur, Administrateur).
    *   La base de données en mémoire représentant l'état global (offres, demandes de promo, transactions, messages).
    *   Le système de toasts animés en cascade via `AnimatePresence`.
    *   L'état de la connexion réseau (gestion dynamique online/offline).
*   `src/components/` : Dossier hébergeant tous les sous-composants spécialisés :
    *   `ArtistDashboard.tsx` : Espace de travail de l'artiste (catalogue, création de demandes de promotion, suivi de campagnes, FAQ dynamique, profil).
    *   `PromoteurDashboard.tsx` : Interface d'administration pour les professionnels des médias (gestion des forfaits musicaux, traitement des requêtes d'artistes, transmission de preuves de diffusion).
    *   `AdminDashboard.tsx` : Console de supervision globale pour la modération et l'arbitrage des litiges.
    *   `PromoteurCard.tsx` : Fiche détaillée présentant un promoteur, ses canaux de diffusion, ses statistiques d'acceptation et ses avis d'artistes.
    *   `WalletModal.tsx` : Module de rechargement/retrait intégrant MTN MoMo, Moov Money et Celtiis Cash.
    *   `ChatWindow.tsx` : Messagerie instantanée sécurisée pour l'échange direct sur l'avancement d'un contrat de promotion.
    *   `ProfileCameraCapture.tsx` : Module d'accès webcam pour simplifier l'onboarding et l'authentification visuelle des utilisateurs.
    *   `PWAInstallModal.tsx` : Pop-up native invitant les utilisateurs mobiles à ajouter la plateforme sur l'écran d'accueil.

---

## 3. Fonctionnalités Implémentées

### 💳 Portefeuille Mobile Money National
Parfaitement calibré pour l'écosystème béninois, le module intègre les trois fournisseurs dominants :
1.  **MTN Mobile Money** (MoMo) : Frais d'opérateur calculés à 1%.
2.  **Moov Money** (Flooz) : Frais d'opérateur calculés à 1%.
3.  **Celtiis Cash** : Frais d'opérateur calculés à 0.5% (promotionnel).

Les reçus numériques sont automatiquement compilés et téléchargeables au format texte/JSON ou imprimables via l'interface utilisateur.

### 🎥 Capture d'Identité par Webcam Intégrée
Plutôt que d'obliger l'utilisateur à charger des documents lourds, l'application utilise l'API `getUserMedia` du navigateur pour permettre la capture de portraits d'identité en un clic.

### 💬 Messagerie Directe & Contexte Commande
Chaque contrat de promotion génère un canal de chat dédié et privé. L'artiste et le promoteur peuvent y dialoguer de façon réactive. L'historique des discussions est rattaché à l'identifiant unique du dossier de promotion pour simplifier la médiation en cas de litige.

### 🔔 Toasts Elastiques & Fluides
Les notifications de succès, d'erreur ou d'alerte financière s'affichent sous forme de toasts réactifs dotés d'animations de type "elastic rubber" grâce à la puissance des ressorts physiques (`type: "spring"`) de la bibliothèque Motion.

### 📡 Mode Offline & Résilience Réseau
Afin de faire face aux micro-coupures de réseau fréquentes sur le continent, la plateforme dispose d'un témoin de statut réseau et d'un simulateur offline. Lorsqu'il est hors-ligne, l'utilisateur est notifié et les actions sensibles sont désactivées pour protéger l'intégrité de ses fonds.

### 💡 Guide d'Onboarding Interactif (Visite Guidée)
Pour les nouveaux artistes, un guide interactif étape par étape (Overlay) s'affiche automatiquement lors de leur première connexion. Ce guide met en surbrillance les éléments clés de la plateforme à l'aide de ressorts physiques et de transitions soignées :
*   Le fonctionnement de la résilience réseau et de la file de cache locale.
*   L'utilisation intelligente des filtres de catalogue (par zone d'audience béninoise ou par type de média).
*   La préparation de la première œuvre à soumettre (téléchargement audio, style, etc.) et le dépôt en compte séquestre.
*   La navigation dans le catalogue des promoteurs disponibles au Bénin.
*   Le suivi en direct, le dialogue par chat contextuel et la validation finale après présentation des preuves matérielles de diffusion.
Un bouton flottant d'aide permet de relancer la visite à tout moment pour une parfaite autonomie.

### 🎵 Discographie & Plateformes de Streaming
Les profils d'artistes intègrent désormais une section dédiée **"Discographie"** qui leur permet de lier directement leurs comptes de streaming officiels :
*   **Spotify** (Vert brillant)
*   **Audiomack** (Orange/Ambre emblématique)
*   **Apple Music** (Rose vif)
*   **YouTube** (Rouge classique)
*   **Deezer** (Bleu ciel)

Cette intégration facilite l'évaluation artistique : lorsqu'un promoteur examine une demande de promotion, il a accès à la biographie de l'artiste et à des badges cliquables et animés pour écouter son univers musical d'un simple clic, directement depuis la fiche de la demande.

---

## 4. Règles Métier (Commissions, Remboursements, Arbitrage)

Le contrat de confiance de **Bénin Music Promo** s'appuie sur des formules financières et des processus de modération stricts :

### A. Structure des Tarifs & Commission de Plateforme
*   **Frais de Service Plateforme** : **10%** sont prélevés sur chaque commande de promotion finalisée (ex: sur une commande de 50 000 FCFA, 5 000 FCFA sont retenus par la plateforme pour assurer la maintenance et l'arbitrage, et 45 000 FCFA sont reversés au promoteur).
*   **Affichage Transparent** : Le montant affiché sur le forfait du promoteur inclut déjà les frais de plateforme. L'artiste paie exactement le montant affiché.
*   **Frais de Dépôt Mobile Money** : Les frais de transaction imposés par les opérateurs de télécommunication béninois (0.5% à 1%) sont imputés lors du rechargement et détaillés sur le reçu.

### B. Cycle de Vie d'un Séquestre & Remboursement
1.  **Dépôt en Séquestre** : L'artiste soumet sa chanson et valide le paiement. Les fonds sont prélevés de son solde et placés sur le compte de séquestre de Bénin Music Promo.
2.  **Délai d'acceptation (48 heures)** :
    *   Si le promoteur **accepte** la demande, la commande passe au statut *En cours*.
    *   Si le promoteur **refuse** explicitement la demande, ou s'il **ne répond pas dans les 48 heures**, la commande est annulée.
3.  **Remboursement Instantané** : En cas d'annulation ou de refus, la plateforme effectue un remboursement immédiat de **100% du montant bloqué** directement sur le portefeuille de l'artiste. **Aucun frais de service n'est retenu** pour protéger l'artiste.

### C. Procédure de Validation et de Litige (Arbitrage)
*   **Soumission de Preuves** : Le promoteur doit obligatoirement téléverser un justificatif concret (URL d'écoute, lien de rediffusion radio, capture d'écran, etc.) pour déclarer la promotion comme *Terminée*.
*   **Période de Validation Artiste** : L'artiste dispose d'un bouton pour valider la promotion, ce qui libère instantanément les fonds vers le portefeuille du promoteur.
*   **Ouverture de Litige** : Si l'artiste juge la preuve insuffisante ou la diffusion non conforme, il peut cliquer sur "Contester" (Litige). Les fonds restent alors gelés dans le séquestre.
*   **Arbitrage de l'Administrateur** : L'administrateur examine les preuves fournies et l'historique du chat. Il tranche souverainement en débloquant les fonds pour le promoteur ou en remboursant l'artiste.

---

## 5. Dépendances & Technologies

L'application s'appuie sur les dépendances modernes suivantes (déclarées dans `package.json`) :

*   **react** & **react-dom** (`^19.0.1`) : Utilisation des hooks React natifs (`useState`, `useEffect`, `useRef`, `useMemo`).
*   **vite** (`^6.2.3`) : Serveur de développement ultra-rapide et bundler optimisé.
*   **tailwindcss** & **@tailwindcss/vite** (`^4.1.14`) : Moteur CSS de nouvelle génération compilé directement à la volée.
*   **motion** (`^12.23.24`) : Bibliothèque de référence pour les animations d'interface, fournissant les composants `<AnimatePresence>` et `<motion.div>`.
*   **lucide-react** (`^0.546.0`) : Bibliothèque d'icônes SVG légères et customisables.
*   **express** (`^4.21.2`) & **tsx** / **esbuild** : Support d'architecture full-stack prêt pour d'éventuelles routes API d'intégration réelles.

---

## 6. Déploiement Progressive Web App (PWA)

Pour déployer l'application sous forme de PWA installable sur les smartphones des artistes et promoteurs au Bénin :

### A. Configuration du Manifeste (`manifest.json`)
Pour que les navigateurs mobiles proposent l'installation, créez ou assurez-vous de la présence de `/public/manifest.json` avec la configuration minimale requise :
```json
{
  "short_name": "Bénin Music",
  "name": "Bénin Music Promo",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/assets/icon-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "#0f172a",
  "theme_color": "#58001e",
  "display": "standalone",
  "orientation": "portrait"
}
```

### B. Enregistrement du Service Worker
Ajoutez ce script d'enregistrement dans votre fichier d'initialisation frontend (`src/main.tsx` ou `index.html`) :
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker enregistré avec succès !', reg))
      .catch(err => console.error('Échec de l\'enregistrement du Service Worker', err));
  });
}
```

### C. Script du Service Worker (`public/sw.js`)
Ce script permet la mise en cache des actifs statiques clés pour que l'application s'ouvre instantanément, même sans connexion internet :
```javascript
const CACHE_NAME = 'bmp-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
```

---

## 7. Foire Aux Questions (FAQ) Technique

### Pourquoi avoir choisi Motion pour les Toasts ?
> Le système de toasts utilise `AnimatePresence` pour permettre des transitions de sortie fluides. L'utilisation d'une transition physique `layout` de Motion garantit que lorsqu'un toast intermédiaire est fermé, les autres se repositionnent verticalement de façon continue, éliminant tout saut visuel brutal.

### Comment les données sont-elles conservées ?
> Dans cette version de démonstration avancée, l'état global est managé via des hooks de state réactifs dans `App.tsx` assurant une réactivité en temps réel. Pour un passage en production, ces données peuvent être sérialisées en base de données relationnelle ou connectées à Firestore.

---

*Fait avec rigueur pour l'excellence de l'industrie musicale béninoise. 🇧🇯✨*
