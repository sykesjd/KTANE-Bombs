<script context="module" lang="ts">
	import { authLoad, jsonLoadStatic } from '$lib/loaders';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = authLoad(
		jsonLoadStatic({
			queue: 'verify/queue'
		})
	);
</script>

<script lang="ts">
	import type { QueueItem } from '$lib/types';
	import MissionCard from '$lib/MissionCard.svelte';

	export let queue: QueueItem[];

	async function verify(item: QueueItem, accept: boolean) {
		try {
			await fetch('verify/item', {
				method: 'POST',
				body: JSON.stringify({
					item,
					accept
				})
			});
		} catch (error) {
			console.error('Failed to verify item.', error);
			return;
		}

		queue = queue.filter((otherItem) => otherItem !== item);
	}
</script>

<h1 class="header">Verify Queue</h1>

<div class="flex column">
	{#each queue as item}
		<div class="flex">
			{#if item.type === 'mission'}
				<MissionCard mission={item.mission} />
			{/if}
			<div class="block flex content-width" style="align-items: center;">
				<button on:click={() => verify(item, true)}>Accept</button>
				<button on:click={() => verify(item, false)}>Reject</button>
			</div>
		</div>
	{/each}
</div>
