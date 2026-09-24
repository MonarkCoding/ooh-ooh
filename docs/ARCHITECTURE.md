# Architecture

## 1. Vue d'ensemble

```
Navigateur (SvelteKit)
   │  HTTPS (pages, API REST, auth)          WebSocket (parties en temps réel)
   ▼                                          ▼
┌──────────────────────── Serveur Node unique ────────────────────────┐
│  SvelteKit (adapter-node)   Better Auth   Colyseus (rooms de jeu)   │
│                    └──────── @ooh/core ─────────┘                   │
│                         (salons, scores, historique)                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  ▼
                        PostgreSQL (Drizzle ORM)
```

Un **seul processus** sert les pages, l'API, l'authentification et les
WebSockets : c'est ce qui rend l'hébergement gratuit réaliste (un seul
service à faire tourner) tout en gardant une séparation stricte dans le code.

## 2. Stack

| Couche | Choix | Raison |
|---|---|---|
| Langage | TypeScript (strict) partout | Types partagés client/serveur, moins de bugs |
| Front | SvelteKit + Tailwind CSS | Bundles légers, réactivité native, SSR |
| Animations | Svelte transitions + Motion One | Fluides, légères |
| Temps réel | **Colyseus** | Serveur autoritaire, rooms, synchro d'état, reconnexion intégrés |
| Auth | **Better Auth** | Discord OAuth + email/mot de passe, sessions en base |
| Base de données | PostgreSQL + **Drizzle ORM** | Typage fort, migrations SQL lisibles |
| Validation | **Zod** | Chaque entrée (HTTP et WebSocket) est validée |
| E-mails | Resend (offre gratuite) | Vérification d'adresse, réinitialisation de mot de passe |
| Tests | Vitest (unitaires), Playwright (E2E) | Logique de jeu testée sans réseau |
| Outillage | pnpm workspaces, ESLint, Prettier | Monorepo, frontières de modules vérifiées |

## 3. Structure du monorepo

```
ooh-ooh/
├── apps/
│   └── web/                  # SvelteKit + point d'entrée serveur (HTTP + Colyseus)
├── packages/
│   ├── game-sdk/             # Contrat qu'un jeu doit implémenter (types, BaseGameRoom)
│   ├── core/                 # Salons, lobby, persistance des résultats, classements
│   ├── db/                   # Schéma Drizzle, migrations
│   └── ui/                   # Composants et design tokens partagés
└── games/
    ├── qui-me-connait/
    ├── bluff-quiz/
    ├── longueur-onde/
    └── duel-eclair/
```

## 4. Modularité des jeux (exigence clé)

Chaque dossier de `games/` est un **package pnpm autonome** :

```
games/bluff-quiz/
├── package.json
├── manifest.ts          # id, nom, description, icône, minPlayers, maxPlayers, durée estimée
├── server/
│   ├── BluffQuizRoom.ts # extends BaseGameRoom (logique autoritaire)
│   ├── logic.ts         # règles pures (fonctions sans effet de bord) → testables
│   └── state.ts         # état synchronisé (schéma Colyseus)
├── client/
│   └── BluffQuiz.svelte # interface du jeu
├── shared/
│   └── messages.ts      # schémas Zod des messages client → serveur
├── content/
│   └── questions.fr.json
└── tests/
```

### Règles de frontières (vérifiées par ESLint en CI)

- Un jeu **ne peut importer que** `@ooh/game-sdk` et `@ooh/ui`.
- Un jeu **n'importe jamais** un autre jeu, ni `@ooh/core`, ni `@ooh/db`.
- Un jeu **ne touche jamais la base de données** : il renvoie un résultat de
  partie (`GameResult`) au SDK, et c'est `@ooh/core` qui le persiste.

### Contrat (esquisse)

```ts
// packages/game-sdk
export interface GameManifest {
  id: string;               // "bluff-quiz" — stable, sert de clé en base
  name: string;
  description: string;
  minPlayers: number;       // 2
  maxPlayers: number;       // 4
  estimatedMinutes: number;
}

export interface GameResult {
  ranking: { userId: string; score: number }[];
  stats?: Record<string, number>;   // statistiques propres au jeu (facultatif)
}

export abstract class BaseGameRoom<State> extends Room<State> {
  // Fourni par le SDK : authentification du joueur, reconnexion,
  // validation Zod des messages, rate limiting, fin de partie.
  protected abstract onGameStart(): void;
  protected endGame(result: GameResult): void;
}
```

### Ajouter un jeu

1. Créer `games/<nouveau-jeu>/` en suivant le gabarit.
2. L'enregistrer par **une ligne** dans `apps/web/src/lib/games.registry.ts`.

Retirer un jeu = supprimer cette ligne. Aucun autre fichier n'est concerné.

## 5. Informations cachées

Les données secrètes (bonne réponse, cible de Longueur d'onde, réponse du
joueur ciblé…) **ne sont jamais placées dans l'état synchronisé** avant leur
révélation. Elles restent en mémoire serveur ou sont envoyées par message
privé au seul joueur concerné.

## 6. Modèle de données (première version)

| Table | Rôle |
|---|---|
| `user`, `session`, `account`, `verification` | Gérées par Better Auth |
| `profile` | Pseudo affiché, avatar, préférences |
| `match` | Une partie : jeu, date de début et de fin |
| `match_player` | Participation : joueur, score, rang |
| `friendship` | Liens entre joueurs (ajout automatique après une partie jouée ensemble, ou manuel) |

Les classements sont calculés à partir de `match_player`, filtrés sur le
cercle d'amis.

## 7. Déploiement (priorité : gratuit)

- **Application** : image Docker unique sur une offre gratuite supportant
  les WebSockets (candidats : Render, Koyeb). Limite connue des offres
  gratuites : **mise en veille après inactivité** → premier chargement lent
  (~30–60 s). Acceptable pour un usage entre amis.
- **Base de données** : PostgreSQL managé gratuit (candidats : Neon, Supabase).
- **Portabilité** : tout passe par Docker et des variables d'environnement,
  pour pouvoir migrer vers un VPS sans réécriture.

Les conditions des offres gratuites évoluent : elles seront revérifiées au
moment du déploiement.
