import { defineManifest } from '@ooh/game-sdk';

export const manifest = defineManifest({
	id: 'qui-me-connait',
	name: 'Qui me connaît ?',
	tagline: 'Vos amis savent-ils vraiment qui vous êtes ?',
	description:
		'Sous les projecteurs, un joueur répond en secret à une question sur lui-même. Les autres doivent deviner sa réponse.',
	minPlayers: 2,
	maxPlayers: 4,
	estimatedMinutes: 10,
	tags: ['social'],
	icon: [
		'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
		'M3 21a7 7 0 0 1 12-5',
		'M17 14.5a2.5 2.5 0 1 1 3 2.4V18',
		'M20 21h.01'
	]
});
