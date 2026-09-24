<script lang="ts">
	import type { GameManifest } from '@ooh/game-sdk';
	import { Badge, Icon } from '@ooh/ui';

	let { game }: { game: Readonly<GameManifest> } = $props();

	const players = $derived(
		game.minPlayers === game.maxPlayers
			? `${game.minPlayers} joueurs`
			: `${game.minPlayers}–${game.maxPlayers} joueurs`
	);
</script>

<article class="card group">
	<div class="flex items-start gap-4">
		<div class="icon-tile" aria-hidden="true">
			<Icon paths={game.icon} size={26} />
		</div>
		<div class="min-w-0">
			<h3 class="text-xl font-semibold">{game.name}</h3>
			<p class="mt-1 text-sm text-accent-strong">{game.tagline}</p>
		</div>
	</div>

	<p class="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted">{game.description}</p>

	<div class="mt-5 flex flex-wrap items-center gap-2">
		<Badge>
			<Icon
				paths={['M16 20v-1a4 4 0 0 0-8 0v1', 'M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z']}
				size={14}
			/>
			{players}
		</Badge>
		<Badge>
			<Icon paths={['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2']} size={14} />
			~{game.estimatedMinutes} min
		</Badge>
		{#each game.tags as tag (tag)}
			<Badge tone="accent">{tag}</Badge>
		{/each}
	</div>
</article>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1.5rem;
		border: 1px solid var(--ooh-border);
		border-radius: var(--ooh-radius-lg);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.02));
		backdrop-filter: blur(var(--ooh-blur));
		transition:
			border-color var(--ooh-duration) var(--ooh-ease),
			transform var(--ooh-duration) var(--ooh-ease),
			box-shadow var(--ooh-duration) var(--ooh-ease);
	}
	.card:hover {
		border-color: rgb(139 92 246 / 0.4);
		transform: translateY(-2px);
		box-shadow: 0 20px 48px -24px rgb(139 92 246 / 0.5);
	}

	.icon-tile {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 3.25rem;
		height: 3.25rem;
		border: 1px solid rgb(139 92 246 / 0.35);
		border-radius: var(--ooh-radius);
		background: radial-gradient(circle at 30% 20%, rgb(139 92 246 / 0.35), rgb(34 211 238 / 0.08));
		color: var(--ooh-text);
	}
</style>
