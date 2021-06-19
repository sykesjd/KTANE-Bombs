<script lang="ts">
	import { Bomb, ChallengeBomb } from './types';
	import { formatTime, getSlug } from './util';

	export let challengeBomb: ChallengeBomb;

	const bombs = challengeBomb.Bombs;
	const statBomb = new Bomb();
	statBomb.Modules = bombs.map((bomb) => bomb.Modules).reduce((a, b) => a + b, 0);
	statBomb.Time = bombs.map((bomb) => bomb.Time).reduce((a, b) => a + b, 0);
	statBomb.Strikes = bombs.map((bomb) => bomb.Strikes).reduce((a, b) => a + b, 0);
	statBomb.Widgets = bombs.map((bomb) => bomb.Widgets).reduce((a, b) => a + b, 0);
</script>

<a class="bomb" href={`bomb/${getSlug(challengeBomb)}`}>
	<div>{challengeBomb.Name}</div>
	<div class="stats">
		{statBomb.Modules} Modules · {formatTime(statBomb.Time)} · {statBomb.Strikes}
		Strikes · {statBomb.Widgets}
		Widgets
	</div>
</a>

<style>
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
	}

	.stats {
		font-style: italic;
		font-size: 85%;
		color: var(--light-text-color);
	}
</style>
