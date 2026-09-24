<script lang="ts">
	/** Aperçu décoratif d'un salon, affiché sur la page d'accueil. */
	const players = [
		{ name: 'Léa', initial: 'L', color: 'var(--ooh-player-1)', ready: true },
		{ name: 'Sami', initial: 'S', color: 'var(--ooh-player-2)', ready: true },
		{ name: 'Inès', initial: 'I', color: 'var(--ooh-player-3)', ready: true },
		{ name: 'Tom', initial: 'T', color: 'var(--ooh-player-4)', ready: false }
	];
</script>

<figure class="preview" aria-label="Aperçu d'un salon de jeu">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-xs tracking-[0.18em] text-subtle uppercase">Salon</p>
			<p class="font-display text-2xl font-semibold tracking-[0.2em]">K7QF</p>
		</div>
		<span class="live"><span class="dot"></span> En ligne</span>
	</div>

	<ul class="mt-6 space-y-2.5">
		{#each players as player (player.name)}
			<li class="player">
				<span class="avatar" style:--player={player.color}>{player.initial}</span>
				<span class="flex-1 font-medium">{player.name}</span>
				{#if player.ready}
					<span class="text-xs font-medium text-success">Prêt</span>
				{:else}
					<span class="typing" aria-label="En attente">
						<span></span><span></span><span></span>
					</span>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="next-game">
		<p class="text-xs text-subtle">Prochain jeu</p>
		<p class="mt-0.5 font-display font-semibold">Bluff Quiz</p>
	</div>
</figure>

<style>
	.preview {
		position: relative;
		width: 100%;
		max-width: 22rem;
		padding: 1.5rem;
		border: 1px solid var(--ooh-border-strong);
		border-radius: var(--ooh-radius-lg);
		background: linear-gradient(160deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02));
		backdrop-filter: blur(24px);
		box-shadow:
			0 30px 80px -30px rgb(139 92 246 / 0.55),
			inset 0 1px 0 rgb(255 255 255 / 0.08);
		animation: float 7s var(--ooh-ease) infinite alternate;
	}

	.live {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		color: var(--ooh-accent-2);
	}
	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 12px currentColor;
		animation: pulse 2s ease-in-out infinite;
	}

	.player {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--ooh-border);
		border-radius: var(--ooh-radius);
		background: rgb(255 255 255 / 0.03);
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--player) 22%, transparent);
		border: 1px solid color-mix(in srgb, var(--player) 60%, transparent);
		color: var(--player);
		font: 600 0.875rem/1 var(--ooh-font-display);
	}

	.typing {
		display: inline-flex;
		gap: 3px;
	}
	.typing span {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ooh-text-subtle);
		animation: pulse 1.2s ease-in-out infinite;
	}
	.typing span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing span:nth-child(3) {
		animation-delay: 0.3s;
	}

	.next-game {
		margin-top: 1.25rem;
		padding: 0.875rem 1rem;
		border-radius: var(--ooh-radius);
		background: linear-gradient(90deg, rgb(139 92 246 / 0.22), rgb(34 211 238 / 0.1));
		border: 1px solid rgb(139 92 246 / 0.35);
	}

	@keyframes float {
		from {
			transform: translateY(0) rotate(-1deg);
		}
		to {
			transform: translateY(-10px) rotate(0.5deg);
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.preview,
		.dot,
		.typing span {
			animation: none;
		}
	}
</style>
