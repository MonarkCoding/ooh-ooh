/**
 * Registre des jeux disponibles sur la plateforme.
 *
 * Ajouter un jeu : créer son module dans `games/` puis ajouter UNE ligne ici.
 * Retirer un jeu : supprimer sa ligne. Aucun autre fichier n'est concerné.
 */
import type { GameManifest } from '@ooh/game-sdk';
import { manifest as quiMeConnait } from '@ooh/game-qui-me-connait';
import { manifest as bluffQuiz } from '@ooh/game-bluff-quiz';
import { manifest as longueurOnde } from '@ooh/game-longueur-onde';
import { manifest as duelEclair } from '@ooh/game-duel-eclair';

export const games: readonly Readonly<GameManifest>[] = [
	quiMeConnait,
	bluffQuiz,
	longueurOnde,
	duelEclair
];

export function findGame(id: string): Readonly<GameManifest> | undefined {
	return games.find((game) => game.id === id);
}
