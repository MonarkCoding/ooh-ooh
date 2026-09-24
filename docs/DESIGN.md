# Direction visuelle — « Élégant & sombre »

## Intention

Une ambiance de salon de jeu nocturne : fonds profonds, surfaces en verre
dépoli, accents néon utilisés **avec parcimonie** pour guider l'attention
(action principale, joueur actif, révélation). Élégant d'abord, ludique dans
les moments clés (révélations, scores).

## Design tokens (première proposition)

| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#0B0B12` | Fond de l'application |
| `--surface` | `rgba(255,255,255,0.04)` + flou 16 px | Cartes, panneaux (verre dépoli) |
| `--border` | `rgba(255,255,255,0.08)` | Contours discrets |
| `--text` | `#EDEDF4` | Texte principal |
| `--text-muted` | `#8B8BA3` | Texte secondaire |
| `--accent` | `#8B5CF6` (violet) | Action principale, focus |
| `--accent-2` | `#22D3EE` (cyan) | Joueur actif, minuteurs |
| `--success` | `#34D399` | Bonne réponse |
| `--danger` | `#F87171` | Mauvaise réponse, erreurs |

Couleurs par joueur (4 max, distinctes et accessibles) : violet, cyan, ambre, rose.

## Typographie

- Titres : **Space Grotesk** (caractère, lisible).
- Texte : **Inter**.
- Chiffres (scores, minuteurs) : chiffres tabulaires pour éviter les sauts.

## Mouvement

- Transitions de 150 à 300 ms, courbes douces ; animations plus marquées
  réservées aux révélations et aux podiums.
- `prefers-reduced-motion` respecté partout.

## Accessibilité

- Contraste texte ≥ 4,5:1 (WCAG AA).
- Jamais d'information portée **uniquement** par la couleur (icône ou texte en plus).
- Navigation clavier complète, focus visible.
- Cibles tactiles ≥ 44 px (mobile-first).
