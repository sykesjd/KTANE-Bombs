<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

	export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
		const url = `/bombs.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					bombs: await res.json()
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
	import type { ChallengeBomb } from '$lib/types';
	import { formatTime, getSlug } from '$lib/util';

	export let bombs: ChallengeBomb[];
</script>

<svelte:head>
	<title>Challenge Bombs</title>
</svelte:head>
<div class="main-content">
	<div class="header">Challenge Bombs</div>
	<div class="bombs">
		{#each bombs as bomb}
			<a class="bomb" href={`bomb/${getSlug(bomb)}`}>
				<div>{bomb.Name}</div>
				<div class="stats">
					{bomb.Modules} Modules · {formatTime(bomb.Time)} · {bomb.Strikes} Strikes · {bomb.Widgets}
					Widgets
				</div>
			</a>
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

	.bomb {
		flex-grow: 1;

		display: grid;
		background: var(--foreground);
		padding: 10px;
		column-gap: 20px;

		grid-template-columns: 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		color: inherit;
		text-decoration: inherit;
		/*
		grid-template-columns: auto 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		*/
	}

	.stats {
		font-style: italic;
		font-size: 85%;
		color: var(--light-text-color);
	}
</style>
