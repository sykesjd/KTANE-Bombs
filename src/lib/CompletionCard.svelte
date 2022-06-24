<script lang="ts">
	import type { Completion } from './types';
	import { formatTime } from './util';

	export let completion: Completion;

	function getPersonColor(size: number, index: number): string {
		return size === 1
			? 'hsl(300, 100%, 75%)'
			: index === 0
			? 'hsl(210, 100%, 65%)'
			: 'hsl(0, 100%, 70%)';
	}
</script>

<div class="completion">
	<span
		class="time"
		class:first={completion.first}
		class:old={completion.old}
		title={formatTime(completion.time, true)}>{formatTime(completion.time)}</span
	>
	<div class="team">
		{#each completion.team as person, i}
			<span class="person" style="background-color: {getPersonColor(completion.team.length, i)}"
				>{person}</span
			>
		{/each}
	</div>
	{#each completion.proofs as proof}
		<a href={proof}>Link</a>
	{/each}
</div>

<style>
	.completion {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: min-content;
		align-content: center;
		align-items: center;
		gap: var(--gap);

		padding: var(--gap);
		background: var(--foreground);
	}

	.completion .time {
		padding: 0 3px;
	}

	.completion .first {
		border-radius: 5px;
		color: black;
		background-color: hsl(43, 74%, 70%);
	}

	.completion .old {
		font-style: italic;
	}

	.person {
		border-radius: 5px;
		padding: 1px 3px;
		color: black;
	}

	.team {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
	}
</style>
