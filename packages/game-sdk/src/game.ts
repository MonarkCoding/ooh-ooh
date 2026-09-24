import type { ZodType } from 'zod';
import type { GameManifest } from './manifest.js';

export type PlayerId = string;

export interface PlayerInfo {
	readonly id: PlayerId;
	readonly name: string;
}

/** Services fournis par la plateforme à la logique d'un jeu. */
export interface GameContext {
	readonly players: readonly PlayerInfo[];
	/** Horloge serveur en millisecondes. Ne jamais utiliser l'heure du client. */
	now(): number;
	/** Aléatoire dans [0, 1). Injecté pour permettre des tests déterministes. */
	random(): number;
}

export interface GameResult {
	/** Classement final, du premier au dernier. */
	readonly ranking: readonly { readonly playerId: PlayerId; readonly score: number }[];
	/** Statistiques propres au jeu (facultatif). */
	readonly stats?: Readonly<Record<string, number>>;
}

/**
 * Contrat qu'implémente la logique serveur d'un jeu.
 *
 * La logique est pure et indépendante du réseau : elle reçoit un état et
 * retourne le suivant. La plateforme se charge du transport, de la validation
 * des messages, des minuteurs et de la persistance des résultats.
 *
 * @typeParam State   État complet, secrets compris — ne quitte jamais le serveur.
 * @typeParam Message Messages client → serveur (validés par `message`).
 * @typeParam View    Ce qu'un joueur a le droit de voir.
 */
export interface GameDefinition<State, Message, View> {
	readonly manifest: Readonly<GameManifest>;
	/** Schéma Zod des messages acceptés. Tout message non conforme est rejeté. */
	readonly message: ZodType<Message>;
	setup(ctx: GameContext): State;
	onMessage(state: State, from: PlayerId, message: Message, ctx: GameContext): State;
	/** Échéance de la phase en cours (ms, horloge serveur), ou `null`. */
	deadline?(state: State): number | null;
	/** Appelé quand l'échéance est dépassée. */
	onTimeout?(state: State, ctx: GameContext): State;
	/**
	 * Vue d'un joueur, ou d'un spectateur si `viewer` vaut `null`.
	 * C'est l'unique donnée envoyée aux clients : les secrets doivent en être exclus.
	 */
	view(state: State, viewer: PlayerId | null): View;
	/** Résultat final, ou `null` tant que la partie continue. */
	result(state: State): GameResult | null;
}

/** Aide à l'inférence de types lors de la déclaration d'un jeu. */
export function defineGame<State, Message, View>(
	definition: GameDefinition<State, Message, View>
): GameDefinition<State, Message, View> {
	return definition;
}
