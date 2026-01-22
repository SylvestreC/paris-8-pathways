# Parcours de formation et insertion professionnelle  

### Université Paris 8 – Dashboard de visualisation de données

## Présentation générale

Ce projet propose une **interface web interactive de visualisation et d'exploration de données**, dédiée à l'analyse des **parcours de formation et d'insertion professionnelle des étudiants de l'Université Paris 8**. L'interface est accessible à partir de cet URL : https://parcours-paris8-viz.lovable.app/.

L'objectif est de rendre visibles, comparables et interprétables les relations entre :

- les **niveaux de formation** (Licence / Master),

- les **domaines, mentions, parcours ou spécialisations**,

- les **secteurs professionnels** dans lesquels les étudiants s'insèrent après l'obtention de leur diplôme.

Le projet s'inscrit dans une démarche :

- exploratoire,

- pédagogique,

- méthodologiquement explicite,

- et techniquement volontairement frugale.

---

## Objectifs du projet

- Mettre à disposition un **outil de visualisation synthétique** des trajectoires formation → emploi  

- Permettre une **analyse transversale** des données par domaine, parcours ou secteur  

- Offrir un **dashboard lisible et interactif**, utilisable par des enseignants, chercheurs ou institutions  

- Expérimenter une chaîne technique **sans base de données classique**, reposant sur des outils accessibles  

---

## Architecture générale

### Principe de fonctionnement

- Les données sont **collectées via un Google Form**, accessible uniquement à des utilisateurs authentifiés (comptes Google autorisés).

- Les réponses alimentent automatiquement une **Google Sheet**, qui constitue la **source unique de données**.

- La Google Sheet est publiée en **CSV public** (lecture seule).

- L'interface web charge dynamiquement ce CSV pour générer les visualisations.

Le site est **entièrement statique** et ne permet aucune écriture directe sur les données.

---

## Visualisations intégrées

Le dashboard repose sur **trois types de graphes complémentaires**, conçus pour mettre en lumière des dimensions différentes des données :

1. **Graphique de distribution**  

   - Répartition des étudiants par domaine, parcours ou secteur  

   - Sert de point d'entrée analytique et de filtre global  

2. **Diagramme de flux (Sankey / alluvial)**  

   - Visualisation des trajectoires *formation → secteur professionnel*  

   - La largeur des flux correspond au volume d'étudiants  

   - Graphe narratif central du projet  

3. **Graphe réseau biparti**  

   - Relations entre domaines/parcours et secteurs professionnels  

   - Analyse structurelle des correspondances formation–emploi  

Les graphes sont **coordonnés entre eux** : une sélection ou un filtre impacte l'ensemble du dashboard.

---

## Choix technologiques

Le projet a été **conçu et généré avec Lovable**, puis structuré et finalisé à l'aide des technologies suivantes :

### Frontend

- **Vite** – outil de build rapide et moderne  

- **React** – architecture par composants  

- **TypeScript** – typage statique pour la robustesse et la lisibilité  

- **Tailwind CSS** – design utilitaire et responsive  

- **shadcn/ui** – composants UI accessibles et cohérents  

### Visualisation de données

- **D3.js** – génération des graphes interactifs et animés  

### Données

- **Google Forms** – collecte contrôlée des données  

- **Google Sheets** – stockage et normalisation  

- **CSV public** – chargement dynamique côté client  

---

## Philosophie du projet

Ce projet ne vise ni l'exhaustivité statistique, ni la prédiction.  

Il s'agit d'un **outil exploratoire**, reposant sur des données déclaratives, dont les objectifs principaux sont :

- la **compréhension globale des trajectoires**,

- la **mise en relation visuelle** des formations et des débouchés,

- la **réflexion méthodologique** sur les usages de la visualisation de données en contexte universitaire.

Les choix techniques privilégient :

- la transparence,

- la reproductibilité,

- la simplicité de maintenance,

- l'accessibilité pour des utilisateurs non spécialistes du développement.

---

## Déploiement

Le projet est conçu pour être déployé via **GitHub Pages** en tant que site statique.

Aucune configuration serveur ni base de données n'est requise.

---

## Données de démonstration

Le dépôt peut inclure un **jeu de données de démonstration synthétique**, destiné :

- au développement,

- aux tests,

- à la présentation du dashboard.

Ces données sont fictives, mais structurées de manière réaliste afin de faire émerger des tendances visibles dans les visualisations.

---

## Perspectives d'évolution

- Ajout de filtres temporels (année d'obtention du diplôme)

- Enrichissement des secteurs et sous-secteurs

- Export des visualisations

- Adaptation à d'autres établissements ou jeux de données similaires

---

## Licence et usage

Ce projet est destiné à un usage :

- académique,

- pédagogique,

- exploratoire.

Toute réutilisation des visualisations ou du code doit mentionner la source.
