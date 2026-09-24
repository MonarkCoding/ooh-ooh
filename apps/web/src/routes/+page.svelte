<script lang="ts">
	import { Badge, Button, Icon } from '@ooh/ui';
	import GameCard from '$lib/components/GameCard.svelte';
	import LobbyPreview from '$lib/components/LobbyPreview.svelte';
	import { games } from '$lib/games.registry';

	const steps = [
		{
			title: 'Connectez-vous',
			text: 'Avec Discord en un clic, ou par e-mail. Votre historique vous suit partout.',
			icon: ['M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4', 'M10 17l5-5-5-5', 'M15 12H3']
		},
		{
			title: 'Créez un salon',
			text: 'Partagez le lien dans votre appel : vos amis rejoignent instantanément.',
			icon: [
				'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7',
				'M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7'
			]
		},
		{
			title: 'Jouez',
			text: 'Enchaînez les parties. Scores, historique et classement entre amis.',
			icon: [
				'M6 9H4a2 2 0 0 1 0-4h2',
				'M18 9h2a2 2 0 0 0 0-4h-2',
				'M6 3h12v7a6 6 0 0 1-12 0z',
				'M9 21h6',
				'M12 16v5'
			]
		}
	];
</script>

<svelte:head>
	<title>Ooh Ooh — Mini-jeux entre amis</title>
	<meta
		name="description"
		content="Des mini-jeux rapides pour 2 à 4 joueurs, pensés pour vos appels entre amis."
	/>
</svelte:head>

<!-- Présentation -->
<section
	class="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-24"
>
	<div class="reveal">
		<Badge tone="info">
			<span class="h-1.5 w-1.5 rounded-full bg-accent-2"></span>
			Pour 2 à 4 joueurs, à distance
		</Badge>

		<h1 class="mt-6 text-5xl leading-[1.05] font-semibold sm:text-6xl">
			Vos soirées entre amis,
			<span class="gradient-text">même à distance.</span>
		</h1>

		<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
			Des mini-jeux rapides et malins, pensés pour vos appels Discord. Bluff, quiz, intuition — un
			lien à partager et la partie commence.
		</p>

		<div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
			<Button size="lg" disabled aria-describedby="bientot">Créer un salon</Button>
			<Button size="lg" variant="secondary" href="#jeux">Découvrir les jeux</Button>
		</div>
		<p id="bientot" class="mt-4 text-sm text-subtle">
			Les salons arrivent très bientôt. En attendant, découvrez les jeux.
		</p>
	</div>

	<div class="reveal flex justify-center lg:justify-end" style:animation-delay="120ms">
		<LobbyPreview />
	</div>
</section>

<!-- Jeux -->
<section id="jeux" class="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
	<header class="max-w-2xl">
		<p class="text-sm font-medium tracking-[0.18em] text-accent-strong uppercase">Les jeux</p>
		<h2 class="mt-3 text-3xl font-semibold sm:text-4xl">
			Quatre façons de mettre vos amis à l'épreuve
		</h2>
		<p class="mt-4 text-muted">
			Des parties courtes, des règles comprises en dix secondes, et de quoi animer la conversation.
		</p>
	</header>

	<ul class="mt-12 grid gap-5 md:grid-cols-2">
		{#each games as game (game.id)}
			<li><GameCard {game} /></li>
		{/each}
	</ul>
</section>

<!-- Fonctionnement -->
<section id="fonctionnement" class="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
	<header class="max-w-2xl">
		<p class="text-sm font-medium tracking-[0.18em] text-accent-strong uppercase">Fonctionnement</p>
		<h2 class="mt-3 text-3xl font-semibold sm:text-4xl">Trois étapes, zéro prise de tête</h2>
	</header>

	<ol class="mt-12 grid gap-5 md:grid-cols-3">
		{#each steps as step, i (step.title)}
			<li class="step">
				<div class="flex items-center justify-between">
					<span class="step-icon"><Icon paths={step.icon} size={22} /></span>
					<span class="font-display text-4xl font-semibold text-border-strong" aria-hidden="true"
						>0{i + 1}</span
					>
				</div>
				<h3 class="mt-6 text-lg font-semibold">{step.title}</h3>
				<p class="mt-2 text-[0.9375rem] leading-relaxed text-muted">{step.text}</p>
			</li>
		{/each}
	</ol>
</section>

<style>
	.gradient-text {
		background: linear-gradient(
			100deg,
			var(--ooh-accent-strong) 0%,
			#c4b5fd 45%,
			var(--ooh-accent-2) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.step {
		padding: 1.5rem;
		border: 1px solid var(--ooh-border);
		border-radius: var(--ooh-radius-lg);
		background: var(--ooh-surface);
	}
	.step-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: var(--ooh-radius);
		background: rgb(34 211 238 / 0.1);
		border: 1px solid rgb(34 211 238 / 0.25);
		color: var(--ooh-accent-2);
	}

	.reveal {
		animation: reveal 700ms var(--ooh-ease) both;
	}
	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reveal {
			animation: none;
		}
	}
</style>
