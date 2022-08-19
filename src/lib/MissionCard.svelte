<script lang="ts">
	import MissionCardInner from './MissionCardInner.svelte';
	import type { Mission } from './types';

	export let mission: Mission;
	export let selectable: boolean = false;
	export let selected: boolean = false;
	export let id: string = '';
</script>

{#if selectable}
	<input {id} type="checkbox" bind:checked={selected} />
	<label for={id} class="mission" class:selected>
		<MissionCardInner {mission} />
	</label>
{:else}
	<a class="mission" href="mission/{encodeURIComponent(mission.name)}">
		<MissionCardInner {mission} />
	</a>
{/if}

<style>
	.mission {
		flex-grow: 1;

		display: grid;
		background: var(--foreground);
		padding: 10px;
		padding-right: 0;
		column-gap: 20px;

		grid-template-columns: 1fr 10px;
		grid-template-rows: auto auto;
		color: inherit;
		text-decoration: inherit;
	}

	input {
		display: none;
	}

	.mission.selected {
		outline: var(--accent) 2px solid;
	}

	label {
		cursor: pointer;
	}
</style>
