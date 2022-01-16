<script lang="ts">
	import { Bomb, Mission } from './types';
	import { formatTime } from './util';

	export let mission: Omit<Mission, 'completions'>;
	export let selectable: boolean = false;
	export let selected: boolean = false;

	const bombs = mission.bombs;
	const statBomb = new Bomb();
	statBomb.modules = bombs.map((bomb) => bomb.modules).reduce((a, b) => a + b, 0);
	statBomb.time = bombs.map((bomb) => bomb.time).reduce((a, b) => a + b, 0);
	statBomb.strikes = bombs.map((bomb) => bomb.strikes).reduce((a, b) => a + b, 0);
	statBomb.widgets = bombs.map((bomb) => bomb.widgets).reduce((a, b) => a + b, 0);
</script>

{#if selectable}
	<input id="selected" type="checkbox" bind:checked={selected} />
	<label for="selected" class="mission" class:selected>
		<div>{mission.name}</div>
		<div class="stats">
			{statBomb.modules} Modules · {formatTime(statBomb.time)} · {statBomb.strikes}
			Strikes · {statBomb.widgets}
			Widgets
		</div>
	</label>
{:else}
	<a class="mission" href="mission/{encodeURIComponent(mission.name)}">
		<div>{mission.name}</div>
		<div class="stats">
			{statBomb.modules} Modules · {formatTime(statBomb.time)} · {statBomb.strikes}
			Strikes · {statBomb.widgets}
			Widgets
		</div>
	</a>
{/if}

<style>
	.mission {
		flex-grow: 1;

		display: grid;
		background: var(--foreground);
		padding: 10px;
		column-gap: 20px;

		grid-template-columns: 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		color: inherit;
		text-decoration: inherit;
	}

	.stats {
		font-style: italic;
		font-size: 85%;
		color: var(--light-text-color);
	}

	input {
		display: none;
	}

	.mission.selected {
		outline: red 1px solid;
	}

	label {
		cursor: pointer;
	}
</style>
