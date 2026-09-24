import { defineManifest } from '@ooh/game-sdk';

export const manifest = defineManifest({
	id: 'longueur-onde',
	name: "Longueur d'onde",
	tagline: 'Un indice, un cadran, êtes-vous sur la même fréquence ?',
	description:
		'Un joueur voit une cible cachée sur un spectre et donne un indice. Les autres placent leur aiguille au plus près de la cible.',
	minPlayers: 2,
	maxPlayers: 4,
	estimatedMinutes: 10,
	tags: ['social', 'coop'],
	icon: ['M3 18a9 9 0 0 1 18 0', 'M12 18l4.5-6', 'M6.5 13.5l1 .8', 'M12 9v1.3', 'M17.5 13.5l-1 .8']
});
