<script lang="ts">
	import CompletionCard from './CompletionCard.svelte';
	import NoContent from './NoContent.svelte';
	import type { Mission } from './types';

	export let mission: Pick<Mission, 'completions' | 'tpSolve'>;

	$: mission.completions.sort((a, b) => b.time - a.time);
</script>

<div class="completions">
	{#each mission.completions as completion}
		<CompletionCard {completion} />
	{:else}
		<NoContent>No solves, <a href="/upload">be the first</a>!</NoContent>
	{/each}
	{#if mission.tpSolve}
		<div class="block">Solved by <span class="tp-solve">Twitch Plays</span></div>
	{/if}
</div>

<style>
	.completions {
		display: flex;
		flex-direction: column;
		grid-template-columns: 1fr;
		gap: var(--gap);
	}

	.tp-solve {
		padding: 1px 3px;
		border-radius: 5px;
		background-color: #9146ff;
	}
</style>
