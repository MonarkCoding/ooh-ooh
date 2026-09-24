<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tone?: 'neutral' | 'accent' | 'info';
		children: Snippet;
	}

	let { tone = 'neutral', children }: Props = $props();
</script>

<span class="badge {tone}">{@render children()}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border: 1px solid var(--ooh-border);
		border-radius: 999px;
		font: 500 0.75rem/1.2 var(--ooh-font-body);
		letter-spacing: 0.02em;
		white-space: nowrap;
	}
	.neutral {
		color: var(--ooh-text-muted);
		background: var(--ooh-surface);
	}
	.accent {
		color: var(--ooh-accent-strong);
		background: rgb(139 92 246 / 0.12);
		border-color: rgb(139 92 246 / 0.3);
	}
	.info {
		color: var(--ooh-accent-2);
		background: rgb(34 211 238 / 0.1);
		border-color: rgb(34 211 238 / 0.28);
	}
</style>
