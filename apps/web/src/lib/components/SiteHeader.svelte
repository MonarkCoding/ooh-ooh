<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@ooh/ui';
	import Logo from './Logo.svelte';
</script>

<header class="sticky top-0 z-40 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
	<nav
		class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
		aria-label="Navigation principale"
	>
		<a
			href={resolve('/')}
			class="flex items-center gap-2.5 rounded-lg"
			aria-label="Ooh Ooh — accueil"
		>
			<Logo />
			<span class="font-display text-lg font-semibold tracking-tight">Ooh Ooh</span>
		</a>

		<!-- Ancres vers les sections de l'accueil : affichées uniquement sur cette page. -->
		{#if page.url.pathname === resolve('/')}
			<ul class="hidden items-center gap-1 text-sm text-muted sm:flex">
				<li><a class="nav-link" href="#jeux">Jeux</a></li>
				<li><a class="nav-link" href="#fonctionnement">Fonctionnement</a></li>
			</ul>
		{/if}

		<Button variant="secondary" disabled title="Bientôt disponible">Se connecter</Button>
	</nav>
</header>

<style>
	.nav-link {
		display: inline-block;
		padding: 0.5rem 0.875rem;
		border-radius: var(--ooh-radius-sm);
		transition: color var(--ooh-duration-fast) var(--ooh-ease);
	}
	.nav-link:hover {
		color: var(--ooh-text);
	}
</style>
