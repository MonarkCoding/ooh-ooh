import type { GameContext, GameDefinition, GameResult, PlayerId } from './game.js';

export type DispatchError = 'unknown-player' | 'invalid-message' | 'game-over';

export type DispatchOutcome = { ok: true } | { ok: false; error: DispatchError };

type Listener = () => void;

/**
 * Exécute une partie de manière autoritaire, indépendamment du transport.
 *
 * Garanties offertes aux jeux :
 * - `onMessage` ne reçoit que des messages validés, émis par un joueur de la partie ;
 * - plus aucun message ni minuteur n'est traité une fois le résultat connu ;
 * - une exception dans la logique d'un jeu ne corrompt pas l'état courant.
 */
export class GameRunner<State, Message, View> {
	#state: State;
	#result: GameResult | null;
	readonly #players: ReadonlySet<PlayerId>;
	readonly #listeners = new Set<Listener>();

	constructor(
		private readonly definition: GameDefinition<State, Message, View>,
		private readonly ctx: GameContext
	) {
		const { minPlayers, maxPlayers } = definition.manifest;
		const count = ctx.players.length;
		if (count < minPlayers || count > maxPlayers) {
			throw new RangeError(
				`${definition.manifest.id} se joue de ${minPlayers} à ${maxPlayers} joueurs (reçu : ${count})`
			);
		}
		this.#players = new Set(ctx.players.map((p) => p.id));
		if (this.#players.size !== count) throw new Error('Identifiants de joueurs en double');

		this.#state = definition.setup(ctx);
		this.#result = definition.result(this.#state);
	}

	get result(): GameResult | null {
		return this.#result;
	}

	get isOver(): boolean {
		return this.#result !== null;
	}

	/** Échéance courante, ou `null`. */
	get deadline(): number | null {
		if (this.isOver) return null;
		return this.definition.deadline?.(this.#state) ?? null;
	}

	/** Traite un message brut reçu du réseau. */
	dispatch(from: PlayerId, raw: unknown): DispatchOutcome {
		if (this.isOver) return { ok: false, error: 'game-over' };
		if (!this.#players.has(from)) return { ok: false, error: 'unknown-player' };

		const parsed = this.definition.message.safeParse(raw);
		if (!parsed.success) return { ok: false, error: 'invalid-message' };

		this.#commit(this.definition.onMessage(this.#state, from, parsed.data, this.ctx));
		return { ok: true };
	}

	/**
	 * À appeler périodiquement par la plateforme.
	 * @returns `true` si une échéance a été traitée.
	 */
	tick(): boolean {
		const deadline = this.deadline;
		if (deadline === null || this.ctx.now() < deadline || !this.definition.onTimeout) {
			return false;
		}
		this.#commit(this.definition.onTimeout(this.#state, this.ctx));
		return true;
	}

	viewFor(viewer: PlayerId | null): View {
		return this.definition.view(this.#state, viewer);
	}

	/** S'abonne aux changements d'état. Retourne la fonction de désabonnement. */
	subscribe(listener: Listener): () => void {
		this.#listeners.add(listener);
		return () => this.#listeners.delete(listener);
	}

	#commit(next: State): void {
		// Le résultat est calculé avant de remplacer l'état : si la logique du
		// jeu lève une exception, l'état précédent reste intact.
		const result = this.definition.result(next);
		this.#state = next;
		this.#result = result;
		for (const listener of this.#listeners) listener();
	}
}
