import { PLATFORM_MAX_PLAYERS, PLATFORM_MIN_PLAYERS } from '@ooh/game-sdk';
import { describe, expect, it } from 'vitest';
import { findGame, games } from './games.registry';

describe('registre des jeux', () => {
	it('contient les jeux du MVP', () => {
		expect(games.map((g) => g.id)).toEqual([
			'qui-me-connait',
			'bluff-quiz',
			'longueur-onde',
			'duel-eclair'
		]);
	});

	it("n'a pas d'identifiant en double", () => {
		expect(new Set(games.map((g) => g.id)).size).toBe(games.length);
	});

	it('respecte les limites de joueurs de la plateforme', () => {
		for (const game of games) {
			expect(game.minPlayers).toBeGreaterThanOrEqual(PLATFORM_MIN_PLAYERS);
			expect(game.maxPlayers).toBeLessThanOrEqual(PLATFORM_MAX_PLAYERS);
		}
	});

	it('retrouve un jeu par identifiant', () => {
		expect(findGame('duel-eclair')?.name).toBe('Duel éclair');
		expect(findGame('inconnu')).toBeUndefined();
	});
});
