<script lang="ts">
	let { size = 32 }: { size?: number } = $props();
	// Identifiant stable entre rendu serveur et client (évite les conflits si le logo apparaît plusieurs fois).
	const uid = $props.id();
	const id = `logo-gradient-${uid}`;
</script>

<svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
	<defs>
		<linearGradient {id} x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="var(--ooh-accent-strong)" />
			<stop offset="1" stop-color="var(--ooh-accent-2)" />
		</linearGradient>
	</defs>
	<rect width="32" height="32" rx="9" fill="var(--ooh-bg-elevated)" />
	<rect
		x="0.5"
		y="0.5"
		width="31"
		height="31"
		rx="8.5"
		fill="none"
		stroke="var(--ooh-border-strong)"
	/>
	<circle cx="11.5" cy="16" r="5" fill="none" stroke="url(#{id})" stroke-width="2.6" />
	<circle cx="20.5" cy="16" r="5" fill="none" stroke="url(#{id})" stroke-width="2.6" />
</svg>
