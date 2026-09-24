# Jeux du MVP

Tous les jeux se jouent de **2 à 4 joueurs**, à distance, sur des manches
courtes. Les scores alimentent l'historique et les classements.

Règles communes :

- Chaque phase a un **minuteur serveur** ; un joueur inactif ne bloque pas la partie.
- Un joueur déconnecté dispose de **60 s** pour revenir avant d'être considéré comme absent.
- Les textes saisis sont limités en longueur et affichés comme texte brut.

---

## 1. Qui me connaît ?

**Principe** — Un joueur est « sous les projecteurs ». Il répond secrètement à
une question sur lui-même ; les autres devinent sa réponse.

**Déroulé d'une manche**

1. Question tirée au sort, à choix multiples (4 propositions). Ex. : « Ton
   super-pouvoir idéal ? — Voler / Invisibilité / Téléportation / Lire les pensées ».
2. Le joueur ciblé répond en secret (20 s).
3. Les autres devinent (20 s).
4. Révélation animée.

Le rôle de cible tourne ; une partie = chaque joueur est ciblé 2 fois.

**Score**

- Devineur : **+100** par bonne réponse.
- Cible : **+50** par joueur qui a deviné juste (récompense le fait d'être connu).

---

## 2. Bluff Quiz

**Principe** — Une question de culture générale à la réponse surprenante.
Chacun invente une fausse réponse crédible, puis tous doivent retrouver la vraie.

**Déroulé d'une manche**

1. Affichage de la question (ex. : « Quel animal possède trois cœurs ? »).
2. Chaque joueur écrit un bluff (45 s).
   Si un bluff correspond à la vraie réponse (comparaison normalisée :
   casse, accents, espaces), il est refusé et le joueur doit en écrire un autre.
3. Le serveur mélange : vraie réponse + bluffs des joueurs + **leurres**
   pré-écrits dans la banque de questions, pour avoir au moins 5 propositions.
   C'est ce qui rend le jeu intéressant même à 2.
4. Vote (30 s) — impossible de voter pour son propre bluff.
5. Révélation : qui a piégé qui.

Une partie = 6 manches.

**Score**

- Trouver la vraie réponse : **+1000**.
- Chaque joueur piégé par ton bluff : **+500**.

---

## 3. Longueur d'onde

**Principe** — Un spectre entre deux extrêmes (ex. « Froid ↔ Chaud »,
« Sous-coté ↔ Surcoté »). Une cible secrète est placée sur ce spectre ;
l'« émetteur » la voit et donne un indice, les autres la localisent.

**Déroulé d'une manche**

1. Carte de spectre tirée au sort ; cible secrète entre 0 et 100, visible
   par l'émetteur seul.
2. L'émetteur écrit un indice (60 s). Ex. : spectre « Froid ↔ Chaud », indice « Un café ».
3. Chaque autre joueur place **sa propre aiguille** (30 s). Les joueurs
   peuvent en discuter en vocal.
4. Révélation de la cible, avec animation du cadran.

Le rôle d'émetteur tourne ; une partie = chaque joueur émet 2 fois.

**Score** (selon la distance entre aiguille et cible)

- ≤ 4 : **4 pts** · ≤ 10 : **3 pts** · ≤ 16 : **2 pts** · au-delà : 0.
- Émetteur : reçoit le **meilleur score** obtenu par les devineurs.

---

## 4. Duel éclair

**Principe** — Quiz de rapidité : bonne réponse et vitesse.

**Déroulé**

1. 10 questions à choix multiples (4 propositions), 10 s chacune.
2. La bonne réponse **n'est envoyée au client qu'après la clôture** de la question.
3. Le temps de réponse est mesuré **côté serveur** (anti-triche), avec une
   compensation de latence plafonnée.

**Score**

- Bonne réponse : `500 + 500 × (temps restant / temps total)`, arrondi.
- Série de 3 bonnes réponses d'affilée ou plus : **+100** par question.
- Mauvaise réponse ou absence : 0.

---

## Idées pour plus tard

- Imposteur (à partir de 4 joueurs), Enchères de savoir, Blind test,
  Téléphone dessiné.
- Banques de questions personnalisées créées par le groupe.
