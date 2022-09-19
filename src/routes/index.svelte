<script lang="ts">
	import MissionCard from '$lib/cards/MissionCard.svelte';
	import HomeSearchBar from '$lib/home/HomeSearchBar.svelte';
	import type { Mission } from '$lib/types';
	import { onMount } from 'svelte';


	export let missions: Mission[];
	export let missionCards: any = {};

	missions.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

	onMount(async ()=> {
		for (let i = 0; i < missions.length; i++)
			missions[i].id = "mission-" + i;
	});
</script>

<svelte:head>
	<title>Challenge Bombs</title>
</svelte:head>
<h1 class="header">Challenge Bombs</h1>
<HomeSearchBar missions={missions}
	missionCards={missionCards}>
</HomeSearchBar>
<div class="bombs">
	{#each missions as mission, index}
		<MissionCard mission={mission} 
			id={'mission-' + index}
			bind:card={missionCards[mission.name]}/>
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
