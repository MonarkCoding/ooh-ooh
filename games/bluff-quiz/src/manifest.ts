import { defineManifest } from '@ooh/game-sdk';

export const manifest = defineManifest({
	id: 'bluff-quiz',
	name: 'Bluff Quiz',
	tagline: 'Inventez le faux, démasquez le vrai.',
	description:
		'Une question à la réponse surprenante : chacun invente une fausse réponse crédible, puis tous tentent de retrouver la vraie parmi les bluffs et les leurres.',
	minPlayers: 2,
	maxPlayers: 4,
	estimatedMinutes: 12,
	tags: ['bluff', 'quiz'],
	icon: ['M4 5h16v6a8 8 0 0 1-16 0z', 'M8 10h2', 'M14 10h2', 'M9 14.5c1.7 1.2 4.3 1.2 6 0']
});
