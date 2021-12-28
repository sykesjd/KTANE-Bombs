<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

	export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
		const url = `/missions.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					missions: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import MissionCard from '$lib/MissionCard.svelte';
	import type { Mission } from '$lib/types';

	export let missions: Mission[];

	missions.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
</script>

<svelte:head>
	<title>Challenge Bombs</title>
</svelte:head>
<div class="main-content">
	<div class="header">Challenge Bombs</div>
	<div class="bombs">
		{#each missions as mission}
			<MissionCard {mission} />
		{/each}
	</div>
</div>

<style>
	.main-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		gap: var(--gap);
		margin: var(--gap);
	}

	.header {
		background: var(--foreground);
		grid-column: 1 / span 2;
		text-align: center;
		padding: var(--gap);
		font-size: 200%;
	}

	.bombs {
		grid-column: 1 / span 2;

		width: 100%;
		height: 100%;
		/*
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		*/
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
	}
</style>
