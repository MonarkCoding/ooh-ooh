# Sécurité

## Principe fondamental

**Le client n'est jamais digne de confiance.** Le serveur détient l'état de
chaque partie, applique les règles, calcule les scores et chronomètre. Le
client ne fait qu'afficher et envoyer des intentions (« je vote pour B »).

## Modèle de menaces et mesures

| Menace | Mesure |
|---|---|
| Triche (voir la réponse avant l'heure) | Secrets jamais présents dans l'état synchronisé avant révélation |
| Triche (faux score, faux chrono) | Scores et temps calculés uniquement côté serveur |
| Messages malformés ou malveillants | Validation **Zod** de chaque message WebSocket et de chaque requête HTTP ; rejet silencieux et journalisation |
| Flood / déni de service | Rate limiting par IP (HTTP) et par connexion (WebSocket) ; tailles de messages plafonnées |
| Usurpation d'un joueur en partie | Connexion WebSocket ouverte avec un **ticket signé à courte durée de vie** (≈ 30 s), lié à la session |
| Rejoindre un salon sans invitation | Codes de salon aléatoires (entropie suffisante), salons privés, expiration automatique |
| Vol de session | Cookies `HttpOnly`, `Secure`, `SameSite=Lax` ; rotation de session à la connexion |
| CSRF | `SameSite` + vérification de l'origine sur les requêtes qui modifient des données |
| XSS | Échappement automatique de Svelte, aucun `{@html}` sur une donnée utilisateur, **CSP stricte** |
| Mots de passe | Hachage **Argon2id** (via Better Auth), longueur minimale 10, vérification d'e-mail |
| Force brute sur la connexion | Rate limiting renforcé sur les routes d'authentification |
| Énumération de comptes | Messages d'erreur identiques pour « compte inconnu » et « mauvais mot de passe » |
| Injection SQL | Requêtes paramétrées exclusivement (Drizzle) |
| Fuite de secrets | Variables d'environnement uniquement, `.env` ignoré par git, scan de secrets en CI |
| Dépendances vulnérables | `pnpm audit` + Dependabot |

## En-têtes HTTP

`Content-Security-Policy`, `Strict-Transport-Security`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` restrictive, `frame-ancestors 'none'`.

## Données personnelles (RGPD)

- Collecte minimale : pseudo, e-mail (connexion par mot de passe), identifiant
  Discord (connexion OAuth), historique de parties.
- Scopes Discord minimaux : `identify` (+ `email` si nécessaire pour lier les comptes).
- Suppression du compte en libre-service, avec effacement des données associées.
- Aucune donnée vendue ni partagée ; aucun traceur publicitaire.
