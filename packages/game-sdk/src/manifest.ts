import { z } from 'zod';

/** Bornes de joueurs de la plateforme (voir docs/GAMES.md). */
export const PLATFORM_MIN_PLAYERS = 2;
export const PLATFORM_MAX_PLAYERS = 4;

export const GAME_TAGS = ['social', 'bluff', 'quiz', 'coop', 'rapidité'] as const;
export type GameTag = (typeof GAME_TAGS)[number];

const playerCount = z.number().int().min(PLATFORM_MIN_PLAYERS).max(PLATFORM_MAX_PLAYERS);

const manifestSchema = z
	.object({
		/** Identifiant stable (kebab-case) : sert de clé en base, ne jamais le renommer. */
		id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id attendu en kebab-case'),
		name: z.string().min(1).max(40),
		/** Accroche courte affichée sur les cartes. */
		tagline: z.string().min(1).max(80),
		description: z.string().min(1).max(400),
		minPlayers: playerCount,
		maxPlayers: playerCount,
		estimatedMinutes: z.number().int().positive().max(60),
		tags: z.array(z.enum(GAME_TAGS)).min(1).readonly(),
		/**
		 * Icône 24×24 au trait : liste de tracés SVG (attribut `d`).
		 * Rendue sans injection de HTML brut.
		 */
		icon: z
			.array(z.string().regex(/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/, 'tracé SVG invalide'))
			.min(1)
			.readonly()
	})
	.refine((m) => m.minPlayers <= m.maxPlayers, {
		message: 'minPlayers doit être inférieur ou égal à maxPlayers'
	});

export type GameManifest = z.infer<typeof manifestSchema>;

/**
 * Déclare le manifeste d'un jeu. Il est validé immédiatement : une erreur de
 * déclaration fait échouer le démarrage et les tests plutôt que la production.
 */
export function defineManifest(manifest: GameManifest): Readonly<GameManifest> {
	return Object.freeze(manifestSchema.parse(manifest));
}
