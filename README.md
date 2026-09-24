# Ooh Ooh

Plateforme web privée de mini-jeux multijoueurs en temps réel, pensée pour jouer
**entre amis, à distance** (pendant un appel Discord), à **2–4 joueurs**.

> Statut : **conception** — aucune ligne de code applicatif pour l'instant.
> Les décisions ci-dessous sont issues de la phase de brainstorming.

## Principes directeurs

1. **Design** — interface sombre et élégante, fluide, mobile-first.
2. **Efficacité** — temps réel à faible latence, une seule instance serveur, démarrage rapide.
3. **Sécurité** — serveur autoritaire, validation stricte de tout ce qui entre, minimum de données personnelles.
4. **Modularité** — chaque jeu est un module isolé : on peut le modifier, le tester ou le retirer sans toucher aux autres.

## Documentation

| Document | Contenu |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, structure du monorepo, contrat d'un module de jeu, données, déploiement |
| [docs/GAMES.md](docs/GAMES.md) | Règles et scoring des 4 jeux du MVP |
| [docs/SECURITY.md](docs/SECURITY.md) | Modèle de menaces et mesures |
| [docs/DESIGN.md](docs/DESIGN.md) | Direction visuelle et design tokens |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Jalons et journal des décisions |
