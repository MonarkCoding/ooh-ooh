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

| Couche          | Choix                                | Raison                                                           |
| --------------- | ------------------------------------ | ---------------------------------------------------------------- |
| Langage         | TypeScript (strict) partout          | Types partagés client/serveur, moins de bugs                     |
| Front           | SvelteKit + Tailwind CSS             | Bundles légers, réactivité native, SSR                           |
| Animations      | Svelte transitions + Motion One      | Fluides, légères                                                 |
| Temps réel      | **Colyseus**                         | Serveur autoritaire, rooms, synchro d'état, reconnexion intégrés |
| Auth            | **Better Auth**                      | Discord OAuth + email/mot de passe, sessions en base             |
| Base de données | PostgreSQL + **Drizzle ORM**         | Typage fort, migrations SQL lisibles                             |
| Validation      | **Zod**                              | Chaque entrée (HTTP et WebSocket) est validée                    |
| E-mails         | Resend (offre gratuite)              | Vérification d'adresse, réinitialisation de mot de passe         |
| Tests           | Vitest (unitaires), Playwright (E2E) | Logique de jeu testée sans réseau                                |
| Outillage       | pnpm workspaces, ESLint, Prettier    | Monorepo, frontières de modules vérifiées                        |

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
├── src/
│   ├── index.ts         # entrée publique, sûre côté client (manifeste)
│   ├── manifest.ts      # id, nom, accroche, icône, joueurs, durée, tags
│   ├── server/          # logique autoritaire : GameDefinition (jalons 4–5)
│   ├── client/          # interface Svelte du jeu (jalons 4–5)
│   └── content/         # banques de questions
└── tests/
```

### Règles de frontières (vérifiées en CI par `tools/check-boundaries.mjs`)

- Un jeu **ne peut importer que** ses propres fichiers, `@ooh/game-sdk`,
  `@ooh/ui`, `zod` et `svelte`.
- Un jeu **n'importe jamais** un autre jeu, ni `@ooh/core`, ni `@ooh/db`, ni
  un module Node (`node:*`), et ne sort jamais de son dossier par un chemin relatif.
- Son `package.json` ne déclare aucune autre dépendance.
- Un jeu **ne touche jamais la base de données** : il produit un `GameResult`,
  que la plateforme persiste.

### Contrat : une logique pure, indépendante du réseau

La logique d'un jeu ne dépend **ni de Colyseus ni du réseau**. Elle décrit
seulement comment l'état évolue ; la plateforme fournit le transport. Cela
rend chaque jeu testable en isolation, sans serveur, et le protège des
évolutions de la couche temps réel.

```ts
// packages/game-sdk — voir src/game.ts
interface GameDefinition<State, Message, View> {
	manifest: GameManifest;
	message: ZodType<Message>; // tout message non conforme est rejeté
	setup(ctx): State;
	onMessage(state, from, message, ctx): State;
	deadline?(state): number | null; // échéance de la phase en cours
	onTimeout?(state, ctx): State;
	view(state, viewer): View; // SEULE donnée envoyée à un joueur
	result(state): GameResult | null;
}
```

`GameRunner` (dans le SDK) exécute une partie et garantit que :

- seuls les messages validés, émis par un joueur de la partie, atteignent le jeu ;
- plus rien n'est traité une fois le résultat connu ;
- une exception dans la logique d'un jeu ne corrompt pas l'état courant ;
- l'horloge (`now`) et l'aléatoire (`random`) sont injectés : tests déterministes,
  aléatoire cryptographique en production.

Au jalon 3, une room Colyseus générique dans `@ooh/core` enveloppera un
`GameRunner` : elle relaie les messages, appelle `tick()` et diffuse à chaque
joueur **sa** vue.

### Ajouter un jeu

1. Créer `games/<nouveau-jeu>/` sur le modèle des jeux existants.
2. L'enregistrer par **une ligne** dans `apps/web/src/lib/games.registry.ts`.

Retirer un jeu = supprimer cette ligne. Aucun autre fichier n'est concerné.

## 5. Informations cachées

Les données secrètes (bonne réponse, cible de Longueur d'onde, réponse du
joueur ciblé…) restent dans le `State`, qui **ne quitte jamais le serveur**.
Les clients ne reçoivent que le résultat de `view(state, joueur)` : filtrer
les secrets y est une responsabilité explicite de chaque jeu, couverte par
ses tests.

## 6. Modèle de données (première version)

| Table                                        | Rôle                                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `user`, `session`, `account`, `verification` | Gérées par Better Auth                                                             |
| `profile`                                    | Pseudo affiché, avatar, préférences                                                |
| `match`                                      | Une partie : jeu, date de début et de fin                                          |
| `match_player`                               | Participation : joueur, score, rang                                                |
| `friendship`                                 | Liens entre joueurs (ajout automatique après une partie jouée ensemble, ou manuel) |

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
