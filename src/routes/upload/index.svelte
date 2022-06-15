<script lang="ts">
	import CompletionSection from './_CompletionSection.svelte';
	import MissionPackSection from './_MissionPackSection.svelte';
	import MissionSection from './_MissionSection.svelte';

	export let missionNames: string[];

	let section: 'solve' | 'mission' | 'missionpack' = 'solve';
</script>

<svelte:head>
	<title>Upload</title>
</svelte:head>

<h1 class="header">Upload</h1>
<div class="section-selector flex grow">
	<div class="block" class:selected={section == 'solve'} on:click={() => (section = 'solve')}>
		Solve
	</div>
	<div class="block" class:selected={section == 'mission'} on:click={() => (section = 'mission')}>
		Mission
	</div>
	<div
		class="block"
		class:selected={section == 'missionpack'}
		on:click={() => (section = 'missionpack')}
	>
		Mission Pack
	</div>
</div>
{#if section == 'mission'}
	<MissionSection />
{:else if section == 'missionpack'}
	<MissionPackSection />
{:else}
	<CompletionSection {missionNames} />
{/if}

<style>
	.section-selector {
		text-align: center;
	}

	.selected {
		padding-bottom: calc(var(--gap) - 3px);
		border-bottom: 3px solid var(--accent);
	}
</style>
