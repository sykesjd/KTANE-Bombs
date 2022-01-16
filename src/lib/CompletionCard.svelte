<script lang="ts">
	import type { Completion } from './types';
	import { formatTime } from './util';

	export let completion: Completion;

	function getPersonColor(size: number, index: number): string {
		return size === 1 ? 'rgb(200, 0, 200)' : index === 0 ? 'rgb(0, 127, 255)' : 'red';
	}
</script>

<div class="completion">
	<span class:first={completion.first}>{formatTime(completion.time)}</span>
	<div class="team">
		{#each completion.team as person, i}
			<span style="text-decoration: 1px underline {getPersonColor(completion.team.length, i)}"
				>{person}</span
			>
		{/each}
	</div>
	<a href={completion.proof}>Link</a>
</div>

<style>
	.completion {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--gap);

		padding: var(--gap);
		background: var(--foreground);
	}

	.completion .first {
		text-decoration: 1px solid goldenrod underline;
	}

	.team {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
	}
</style>
