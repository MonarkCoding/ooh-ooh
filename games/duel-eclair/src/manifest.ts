import { defineManifest } from '@ooh/game-sdk';

export const manifest = defineManifest({
	id: 'duel-eclair',
	name: 'Duel éclair',
	tagline: 'Bonne réponse, et vite.',
	description:
		'Dix questions, dix secondes chacune. Plus vous répondez vite, plus vous marquez — et les séries rapportent des bonus.',
	minPlayers: 2,
	maxPlayers: 4,
	estimatedMinutes: 5,
	tags: ['quiz', 'rapidité'],
	icon: ['M13 2 4 14h7l-1 8 9-12h-7z']
});
