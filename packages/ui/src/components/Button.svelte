<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost';
	type Common = { variant?: Variant; size?: 'md' | 'lg'; children: Snippet };
	type Props =
		| (Common & HTMLButtonAttributes & { href?: undefined })
		| (Common & HTMLAnchorAttributes & { href: string });

	let { variant = 'primary', size = 'md', children, ...rest }: Props = $props();
</script>

{#if rest.href !== undefined}
	<a class="btn {variant} {size}" {...rest as HTMLAnchorAttributes}>{@render children()}</a>
{:else}
	<button class="btn {variant} {size}" type="button" {...rest as HTMLButtonAttributes}>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 44px;
		padding: 0 1.25rem;
		border: 1px solid transparent;
		border-radius: var(--ooh-radius);
		font: 600 0.9375rem/1 var(--ooh-font-body);
		letter-spacing: 0.01em;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color var(--ooh-duration-fast) var(--ooh-ease),
			border-color var(--ooh-duration-fast) var(--ooh-ease),
			box-shadow var(--ooh-duration) var(--ooh-ease),
			transform var(--ooh-duration-fast) var(--ooh-ease);
	}
	.lg {
		min-height: 52px;
		padding: 0 1.75rem;
		font-size: 1rem;
	}
	.btn:focus-visible {
		outline: 2px solid var(--ooh-accent-2);
		outline-offset: 3px;
	}
	.btn:active:not(:disabled) {
		transform: translateY(1px);
	}
	.btn:disabled,
	.btn[aria-disabled='true'] {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.primary {
		background: var(--ooh-accent);
		color: #fff;
		box-shadow: var(--ooh-shadow-glow);
	}
	.primary:hover:not(:disabled) {
		background: #7c4ff0;
	}

	.secondary {
		background: var(--ooh-surface);
		border-color: var(--ooh-border-strong);
		color: var(--ooh-text);
		backdrop-filter: blur(var(--ooh-blur));
	}
	.secondary:hover:not(:disabled) {
		background: var(--ooh-surface-hover);
	}

	.ghost {
		background: transparent;
		color: var(--ooh-text-muted);
	}
	.ghost:hover:not(:disabled) {
		color: var(--ooh-text);
		background: var(--ooh-surface);
	}
</style>
