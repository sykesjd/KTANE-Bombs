<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

	export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
		const url = `/completers.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					completers: await res.json()
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
	import type { Completer } from '$lib/types';

	export let completers: Completer[];
</script>

<svelte:head>
	<title>Completers</title>
</svelte:head>
<h1 class="header">Completers</h1>
<div class="table">
	<b class="block">Name</b>
	<b class="block" title="Number of distinct missions solved.">Distinct</b>
	<b class="block" title="Number of missions solved (including duplicates).">Total</b>
	<b class="block">Defuser</b>
	<b class="block">Expert</b>
	<b class="block">EFM</b>
	{#each completers as completer}
		<div class="block">{completer.name}</div>
		<div class="block">{completer.distinct}</div>
		<div class="block">{completer.defuser + completer.expert + completer.efm}</div>
		<div class="block">{completer.defuser}</div>
		<div class="block">{completer.expert}</div>
		<div class="block">{completer.efm}</div>
	{/each}
</div>

<style>
	.table {
		display: grid;
		grid-template-columns: auto auto auto auto auto auto;
		gap: var(--gap);
		text-align: center;
	}

	.table b.block {
		position: sticky;
		top: 44px;
	}
</style>
