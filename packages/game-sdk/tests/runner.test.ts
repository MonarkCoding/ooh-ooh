import { describe, expect, it } from 'vitest';
import { createSeededRandom, GameRunner, type GameContext } from '../src/index.js';
import { guessGame } from './fixture-game.js';

function createContext(playerCount = 2) {
	let clock = 1_000;
	const ctx: GameContext = {
		players: Array.from({ length: playerCount }, (_, i) => ({
			id: `p${i + 1}`,
			name: `J${i + 1}`
		})),
		now: () => clock,
		random: createSeededRandom(42)
	};
	return {
		ctx,
		advance: (ms: number) => {
			clock += ms;
		}
	};
}

/** Le contexte de test utilise la graine 42 : le secret est donc prévisible. */
const SECRET = 1 + Math.floor(createSeededRandom(42)() * 10);

describe('GameRunner', () => {
	it('refuse un nombre de joueurs hors des limites du manifeste', () => {
		expect(() => new GameRunner(guessGame, createContext(1).ctx)).toThrow(RangeError);
		expect(() => new GameRunner(guessGame, createContext(5).ctx)).toThrow(RangeError);
	});

	it('refuse les identifiants de joueurs en double', () => {
		const { ctx } = createContext();
		const [first] = ctx.players;
		if (!first) throw new Error('contexte vide');
		const duplicated = { ...ctx, players: [first, first] };
		expect(() => new GameRunner(guessGame, duplicated)).toThrow();
	});

	it("rejette les messages d'un joueur inconnu", () => {
		const runner = new GameRunner(guessGame, createContext().ctx);
		expect(runner.dispatch('intrus', { type: 'guess', value: 3 })).toEqual({
			ok: false,
			error: 'unknown-player'
		});
	});

	it.each([null, 'guess', { type: 'guess' }, { type: 'guess', value: 11 }, { type: 'hack' }])(
		'rejette le message invalide %j',
		(raw) => {
			const runner = new GameRunner(guessGame, createContext().ctx);
			expect(runner.dispatch('p1', raw)).toEqual({ ok: false, error: 'invalid-message' });
			expect(runner.viewFor('p1').myAttempts).toBe(0);
		}
	);

	it('ne révèle pas le secret pendant la partie', () => {
		const runner = new GameRunner(guessGame, createContext().ctx);
		expect(runner.viewFor('p1').secret).toBeNull();
		expect(runner.viewFor(null).secret).toBeNull();
	});

	it('termine la partie quand un joueur trouve, puis ignore les messages', () => {
		const runner = new GameRunner(guessGame, createContext().ctx);

		expect(runner.dispatch('p2', { type: 'guess', value: SECRET })).toEqual({ ok: true });
		expect(runner.isOver).toBe(true);
		expect(runner.result?.ranking[0]).toEqual({ playerId: 'p2', score: 1 });
		expect(runner.viewFor('p1').secret).toBe(SECRET);
		expect(runner.dispatch('p1', { type: 'guess', value: SECRET })).toEqual({
			ok: false,
			error: 'game-over'
		});
	});

	it("déclenche l'expiration uniquement une fois l'échéance passée", () => {
		const { ctx, advance } = createContext();
		const runner = new GameRunner(guessGame, ctx);

		advance(9_999);
		expect(runner.tick()).toBe(false);
		advance(1);
		expect(runner.tick()).toBe(true);
		expect(runner.isOver).toBe(true);
		expect(runner.deadline).toBeNull();
		expect(runner.tick()).toBe(false);
	});

	it('notifie les abonnés à chaque changement, et plus après désabonnement', () => {
		const runner = new GameRunner(guessGame, createContext().ctx);
		let calls = 0;
		const unsubscribe = runner.subscribe(() => calls++);

		runner.dispatch('p1', { type: 'guess', value: 1 });
		runner.dispatch('p1', { type: 'invalide' });
		unsubscribe();
		runner.dispatch('p2', { type: 'guess', value: 2 });

		expect(calls).toBe(1);
	});

	it("conserve l'état précédent si la logique du jeu lève une exception", () => {
		const faulty = {
			...guessGame,
			onMessage: () => {
				throw new Error('bug');
			}
		};
		const runner = new GameRunner(faulty, createContext().ctx);
		expect(() => runner.dispatch('p1', { type: 'guess', value: 1 })).toThrow('bug');
		expect(runner.viewFor('p1').myAttempts).toBe(0);
	});
});
