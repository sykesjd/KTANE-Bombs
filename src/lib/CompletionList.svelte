<script lang="ts">
	import CompletionCard from './CompletionCard.svelte';
	import type { Mission } from './types';

	export let mission: Pick<Mission, 'completions' | 'tpSolve'>;
</script>

<div class="completions">
	{#if mission.completions.length !== 0 || mission.tpSolve}
		{#each mission.completions as completion}
			<CompletionCard {completion} />
		{/each}
		{#if mission.tpSolve}
			<div class="block">Solved by <span class="tp-solve">Twitch Plays</span></div>
		{/if}
	{:else}
		<div class="block" style="text-align: center;"><i>No completions, be the first!</i></div>
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
