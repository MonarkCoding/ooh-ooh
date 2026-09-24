import { z } from 'zod';
import { defineGame, defineManifest, type PlayerId } from '../src/index.js';

/**
 * Jeu minimal servant de banc d'essai au SDK : deviner un nombre secret
 * entre 1 et 10. Le premier qui trouve gagne ; la manche expire après 10 s.
 */
interface State {
	secret: number;
	deadline: number;
	winner: PlayerId | null;
	expired: boolean;
	attempts: Record<PlayerId, number>;
}

export const guessGame = defineGame({
	manifest: defineManifest({
		id: 'guess-number',
		name: 'Nombre secret',
		tagline: 'Test',
		description: 'Jeu de test.',
		minPlayers: 2,
		maxPlayers: 4,
		estimatedMinutes: 1,
		tags: ['quiz'],
		icon: ['M12 2v20']
	}),
	message: z.object({ type: z.literal('guess'), value: z.number().int().min(1).max(10) }),
	setup: (ctx): State => ({
		secret: 1 + Math.floor(ctx.random() * 10),
		deadline: ctx.now() + 10_000,
		winner: null,
		expired: false,
		attempts: Object.fromEntries(ctx.players.map((p) => [p.id, 0]))
	}),
	onMessage: (state, from, message) => ({
		...state,
		attempts: { ...state.attempts, [from]: (state.attempts[from] ?? 0) + 1 },
		winner: message.value === state.secret ? from : state.winner
	}),
	deadline: (state) => state.deadline,
	onTimeout: (state) => ({ ...state, expired: true }),
	view: (state, viewer) => ({
		attempts: state.attempts,
		myAttempts: viewer ? (state.attempts[viewer] ?? 0) : null,
		// Le secret n'est révélé qu'en fin de partie.
		secret: state.winner || state.expired ? state.secret : null
	}),
	result: (state) => {
		if (!state.winner && !state.expired) return null;
		const ids = Object.keys(state.attempts);
		return {
			ranking: ids
				.map((playerId) => ({ playerId, score: playerId === state.winner ? 1 : 0 }))
				.sort((a, b) => b.score - a.score)
		};
	}
});
