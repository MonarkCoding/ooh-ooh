<script lang="ts">
	import '../app.css';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';

	let { children } = $props();
</script>

<a href="#contenu" class="skip-link">Aller au contenu</a>

<div class="backdrop" aria-hidden="true"></div>

<div class="relative flex min-h-dvh flex-col">
	<SiteHeader />
	<main id="contenu" class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<style>
	.skip-link {
		position: absolute;
		top: -100px;
		left: 1rem;
		z-index: 50;
		padding: 0.5rem 1rem;
		border-radius: var(--ooh-radius-sm);
		background: var(--ooh-accent);
		color: #fff;
	}
	.skip-link:focus {
		top: 1rem;
	}

	/* Halo lumineux et trame discrète derrière tout le site. */
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background:
			radial-gradient(60rem 40rem at 10% -10%, rgb(139 92 246 / 0.18), transparent 60%),
			radial-gradient(50rem 35rem at 100% 10%, rgb(34 211 238 / 0.1), transparent 60%),
			radial-gradient(40rem 30rem at 50% 110%, rgb(139 92 246 / 0.08), transparent 60%);
	}
	.backdrop::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px),
			linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%);
	}
</style>
