<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

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
			error: `Could not load ${url}`
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
<h1 class="header">Challenge Bombs</h1>
<div class="bombs">
	{#each missions as mission}
		<MissionCard {mission} />
	{/each}
</div>

<style>
	.bombs {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--gap);
	}
</style>
