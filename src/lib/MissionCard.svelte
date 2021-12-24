<script lang="ts">
	import { Bomb, Mission } from './types';
	import { formatTime, getSlug } from './util';

	export let mission: Mission;

	const bombs = mission.bombs;
	const statBomb = new Bomb();
	statBomb.modules = bombs.map((bomb) => bomb.modules).reduce((a, b) => a + b, 0);
	statBomb.time = bombs.map((bomb) => bomb.time).reduce((a, b) => a + b, 0);
	statBomb.strikes = bombs.map((bomb) => bomb.strikes).reduce((a, b) => a + b, 0);
	statBomb.widgets = bombs.map((bomb) => bomb.widgets).reduce((a, b) => a + b, 0);
</script>

<a class="mission" href={`mission/${getSlug(mission)}`}>
	<div>{mission.name}</div>
	<div class="stats">
		{statBomb.modules} Modules · {formatTime(statBomb.time)} · {statBomb.strikes}
		Strikes · {statBomb.widgets}
		Widgets
	</div>
</a>

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
</style>
