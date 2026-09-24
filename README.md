# Ooh Ooh

Plateforme web privée de mini-jeux multijoueurs en temps réel, pensée pour jouer
**entre amis, à distance** (pendant un appel Discord), à **2–4 joueurs**.

> Statut : **jalon 1 terminé** (fondations). Prochaine étape : comptes utilisateurs.
> Voir [docs/ROADMAP.md](docs/ROADMAP.md).

## Principes directeurs

1. **Design** — interface sombre et élégante, fluide, mobile-first.
2. **Efficacité** — temps réel à faible latence, une seule instance serveur, démarrage rapide.
3. **Sécurité** — serveur autoritaire, validation stricte de tout ce qui entre, minimum de données personnelles.
4. **Modularité** — chaque jeu est un module isolé : on peut le modifier, le tester ou le retirer sans toucher aux autres.

## Documentation

| Document                                     | Contenu                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, structure du monorepo, contrat d'un module de jeu, données, déploiement |
| [docs/GAMES.md](docs/GAMES.md)               | Règles et scoring des 4 jeux du MVP                                            |
| [docs/SECURITY.md](docs/SECURITY.md)         | Modèle de menaces et mesures                                                   |
| [docs/DESIGN.md](docs/DESIGN.md)             | Direction visuelle et design tokens                                            |
| [docs/ROADMAP.md](docs/ROADMAP.md)           | Jalons et journal des décisions                                                |

## Démarrage

Prérequis : Node.js 22+ et pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

| Commande         | Rôle                                                      |
| ---------------- | --------------------------------------------------------- |
| `pnpm check`     | Tout vérifier (formatage, lint, frontières, types, tests) |
| `pnpm lint`      | ESLint + vérification des frontières entre jeux           |
| `pnpm typecheck` | Vérification des types de tous les paquets                |
| `pnpm test`      | Tests unitaires (Vitest)                                  |
| `pnpm build`     | Build de production (`apps/web/build`)                    |
| `pnpm format`    | Formatage automatique (Prettier)                          |

## Structure

```
apps/web/          Application SvelteKit (pages, en-têtes de sécurité, registre des jeux)
packages/game-sdk/ Contrat d'un jeu : manifeste, GameDefinition, GameRunner, aléatoire
packages/ui/       Design tokens et composants partagés (Button, Badge, Icon)
games/*/           Un dossier = un jeu isolé
tools/             Outillage (vérification des frontières de modules)
```
