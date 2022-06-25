<script lang="ts">
	import { Bomb } from './types';
	import type { Mission } from './types';
	import { formatTime, getSolveTypes, listify } from './util';

	export let mission: Mission;
	const solveTypes = getSolveTypes(mission);

	const bombs = mission.bombs;
	const statBomb = new Bomb();
	statBomb.modules = bombs.map((bomb) => bomb.modules).reduce((a, b) => a + b, 0);
	statBomb.time = bombs.map((bomb) => bomb.time).reduce((a, b) => a + b, 0);
	statBomb.strikes = bombs.map((bomb) => bomb.strikes).reduce((a, b) => a + b, 0);
	statBomb.widgets = bombs.map((bomb) => bomb.widgets).reduce((a, b) => a + b, 0);

	const orBlank = (condition: boolean, color: string) => (condition ? color : 'transparent');

	const color = `linear-gradient(${orBlank(
		solveTypes.normalSolve,
		'hsl(210, 100%, 65%)'
	)} 33.3%, ${orBlank(solveTypes.efmSolve, 'hsl(300, 100%, 75%)')} 33.31% 66.6%, ${orBlank(
		mission.tpSolve,
		'#9146ff'
	)} 66.61%)`;

	const solvers = [
		solveTypes.normalSolve ? 'by a team' : null,
		solveTypes.efmSolve ? 'via EFM' : null,
		mission.tpSolve ? 'on Twitch Plays' : null
	].flatMap((solver) => solver ?? []);
	const title =
		solvers.length === 0
			? "This mission hasn't been solved."
			: `This mission has been solved ${listify(solvers)}.`;
</script>

<div>{mission.name}</div>
<div class="indicator" style:background={color} {title} />
<div class="stats">
	{statBomb.modules} Modules · {formatTime(statBomb.time)} · {statBomb.strikes}
	Strikes · {statBomb.widgets}
	Widgets
	{#if mission.factory !== null}
		· {mission.factory}
	{/if}
</div>

<style>
	.stats {
		font-style: italic;
		font-size: 85%;
		color: var(--light-text-color);
	}

	.indicator {
		grid-column: 2;
		grid-row: 1 / span 2;
	}
</style>
