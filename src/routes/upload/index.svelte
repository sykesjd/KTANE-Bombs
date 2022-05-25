<script lang="ts">
	import CompletionSection from './_CompletionSection.svelte';
	import MissionSection from './_MissionSection.svelte';

	export let missionNames: string[];

	let section = 'solve';
</script>

<svelte:head>
	<title>Upload</title>
</svelte:head>

<h1 class="header">Upload</h1>
<div class="section-selector">
	<div class="block" class:selected={section == 'solve'} on:click={() => (section = 'solve')}>
		Solve
	</div>
	<div class="block" class:selected={section == 'mission'} on:click={() => (section = 'mission')}>
		Mission
	</div>
</div>
{#if section == 'mission'}
	<MissionSection />
{:else}
	<CompletionSection {missionNames} />
{/if}

<style>
	.section-selector {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gap);
		text-align: center;
	}

	.selected {
		padding-bottom: calc(var(--gap) - 3px);
		border-bottom: 3px solid var(--accent);
	}
</style>
