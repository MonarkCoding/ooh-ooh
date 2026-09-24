# Feuille de route

## Jalons

| # | Jalon | Contenu | Critère de fin |
|---|---|---|---|
| 0 | **Conception** | Brainstorming, docs d'architecture, jeux, sécurité, design | Docs validées |
| 1 | **Fondations** | Monorepo, outillage (lint, format, tests, CI), design system de base, SDK de jeu | CI verte, page d'accueil stylée |
| 2 | **Comptes** | Better Auth (Discord + e-mail), profil, suppression de compte | Inscription et connexion de bout en bout |
| 3 | **Salons** | Créer ou rejoindre un salon par lien, lobby, choix du jeu, reconnexion | 4 navigateurs dans un même salon |
| 4 | **Premier jeu** | Duel éclair (le plus simple, valide tout le SDK) | Partie complète + résultat en base |
| 5 | **Autres jeux** | Qui me connaît ?, Bluff Quiz, Longueur d'onde | Chaque jeu testé isolément |
| 6 | **Historique** | Historique des parties, classements entre amis | Pages historique et classement |
| 7 | **Mise en ligne** | Docker, hébergement gratuit, en-têtes de sécurité, revue sécurité | URL publique utilisable |

## Journal des décisions

| Date | Décision | Motif |
|---|---|---|
| 2026-09-24 | Jeu à distance, 2–4 joueurs | Usage réel : amis en appel Discord |
| 2026-09-24 | Hub multi-jeux, 4 jeux au MVP | Variété ; le bluff est rendu jouable à 2 grâce aux leurres |
| 2026-09-24 | Chaque jeu = package isolé | Modifier un jeu sans impacter les autres |
| 2026-09-24 | Comptes : Discord OAuth + e-mail/mot de passe | Inclusif, historique persistant |
| 2026-09-24 | Direction visuelle « Élégant & sombre » | Choix utilisateur |
| 2026-09-24 | Hébergement gratuit, serveur unique Dockerisé | Budget nul, portabilité conservée |
| 2026-09-24 | SvelteKit + Colyseus + Postgres/Drizzle + Better Auth | Temps réel autoritaire, typage bout en bout |
