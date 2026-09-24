<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '@ooh/ui';
</script>

<svelte:head>
	<title>{page.status} — Ooh Ooh</title>
</svelte:head>

<section class="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
	<p class="font-display text-7xl font-semibold text-accent-strong">{page.status}</p>
	<h1 class="mt-4 text-2xl font-semibold">
		{page.status === 404 ? 'Cette page est introuvable' : 'Une erreur est survenue'}
	</h1>
	<p class="mt-3 text-muted">
		{page.status === 404
			? "Le lien est peut-être erroné, ou la page n'existe plus."
			: 'Réessayez dans un instant.'}
	</p>
	<div class="mt-8"><Button href="/">Retour à l'accueil</Button></div>
</section>
