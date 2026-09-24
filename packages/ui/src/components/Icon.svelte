<script lang="ts">
	/**
	 * Icône 24×24 au trait, décrite par des tracés SVG.
	 * Aucune injection de HTML : chaque tracé est passé à l'attribut `d`.
	 */
	interface Props {
		paths: readonly string[];
		size?: number;
		strokeWidth?: number;
		/** Libellé accessible ; sans libellé, l'icône est décorative. */
		label?: string;
	}

	let { paths, size = 24, strokeWidth = 1.75, label }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
>
	{#each paths as d, i (i)}
		<path {d} />
	{/each}
</svg>
