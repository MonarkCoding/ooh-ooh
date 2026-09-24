import { describe, expect, it } from 'vitest';
import {
	createSeededRandom,
	defineManifest,
	sample,
	shuffle,
	type GameManifest
} from '../src/index.js';

const valid: GameManifest = {
	id: 'mon-jeu',
	name: 'Mon jeu',
	tagline: 'Une accroche',
	description: 'Une description.',
	minPlayers: 2,
	maxPlayers: 4,
	estimatedMinutes: 10,
	tags: ['quiz'],
	icon: ['M4 4h16v16H4z']
};

describe('defineManifest', () => {
	it('accepte un manifeste valide et le fige', () => {
		const manifest = defineManifest(valid);
		expect(manifest.id).toBe('mon-jeu');
		expect(Object.isFrozen(manifest)).toBe(true);
	});

	it.each<[string, Partial<GameManifest>]>([
		['id hors kebab-case', { id: 'Mon Jeu' }],
		['moins de 2 joueurs', { minPlayers: 1 }],
		['plus de 4 joueurs', { maxPlayers: 5 }],
		['min > max', { minPlayers: 4, maxPlayers: 2 }],
		['tag inconnu', { tags: ['inconnu' as never] }],
		['icône avec balise', { icon: ['<script>'] }]
	])('rejette : %s', (_label, override) => {
		expect(() => defineManifest({ ...valid, ...override })).toThrow();
	});
});

describe('aléatoire', () => {
	it('est déterministe à graine égale', () => {
		const a = createSeededRandom(7);
		const b = createSeededRandom(7);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});

	it('shuffle conserve les éléments sans modifier la source', () => {
		const source = [1, 2, 3, 4, 5];
		const mixed = shuffle(source, createSeededRandom(1));
		expect(source).toEqual([1, 2, 3, 4, 5]);
		expect([...mixed].sort()).toEqual(source);
	});

	it('sample tire des éléments distincts et refuse un tirage impossible', () => {
		const picked = sample(['a', 'b', 'c', 'd'], 3, createSeededRandom(3));
		expect(new Set(picked).size).toBe(3);
		expect(() => sample(['a'], 2, createSeededRandom(3))).toThrow(RangeError);
	});
});
