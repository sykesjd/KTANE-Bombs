<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

	export async function load({ page, fetch }: LoadInput): Promise<LoadOutput> {
		const { bomb } = page.params;

		const json = await fetch('/bombs.json');
		const bombs: ChallengeBomb[] = await json.json();
		const matching = bombs.filter((possibleBomb) => getSlug(possibleBomb) == bomb);

		const repo = await fetch('https://ktane.timwi.de/json/raw');

		if (json.ok && repo.ok && matching.length === 1) {
			return {
				props: {
					bomb: matching[0],
					repo: await repo.json()
				}
			};
		}

		return {
			status: json.status,
			error: new Error(`Could not load.`)
		};
	}
</script>

<script lang="ts">
	import type { ChallengeBomb } from '$lib/types';
	import { formatTime, getPools, getSlug } from '$lib/util';

	export let bomb: ChallengeBomb;
	export let repo;
	const modules = repo.KtaneModules;

	function getModule(moduleID: string) {
		let module = modules.filter((module) => module.ModuleID == moduleID);
		if (module.length === 1) {
			return module[0];
		}

		return {
			Name: moduleID,
			ModuleID: moduleID,
			X: 0,
			Y: 0
		};
	}

	function getPersonColor(size: number, index: number): string {
		return size === 1 ? 'rgb(200, 0, 200)' : index === 0 ? 'rgb(0, 127, 255)' : 'red';
	}
</script>

<svelte:head>
	<title>{bomb.Name}</title>
</svelte:head>
<div class="main-content">
	<div class="header">
		<div class="bomb-name">{bomb.Name}</div>
		<div>
			{bomb.Modules} Modules · {formatTime(bomb.Time)} · {bomb.Strikes} Strikes · {bomb.Widgets} Widgets
		</div>
	</div>
	<div class="pools">
		{#each getPools(bomb) as pool}
			<div class="pool">
				<div class="modules">
					{#each pool.Modules.map(getModule) as module}
						<div class="module">
							<img
								src="https://ktane.timwi.de/iconsprite"
								alt={module.Name}
								style="object-position: -{module.X * 32}px -{module.Y * 32}px"
							/>
							<span>{module.Name}</span>
						</div>
					{/each}
				</div>
				{#if pool.Count !== 1}
					<span style="white-space: nowrap"> ×{pool.Count}</span>
				{/if}
			</div>
		{/each}
	</div>
	<div class="completions">
		{#each bomb.Completions as completion}
			<div class="completion">
				<span>{formatTime(completion.Time)}</span>
				<div class="team">
					{#each completion.Team as person, i}
						<span style="text-decoration: 1px underline {getPersonColor(completion.Team.length, i)}"
							>{person}</span
						>
					{/each}
				</div>
				<a href={completion.Proof}>Link</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.main-content {
		padding: var(--gap);

		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto 1fr;
		gap: var(--gap);
	}

	.header {
		grid-column: 1 / span 2;
		padding: var(--gap);
		background: var(--foreground);
	}

	.bomb-name {
		font-size: 200%;
	}

	.pools {
		display: flex;
		flex-wrap: wrap;
		/*
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		*/
		gap: var(--gap);
		align-content: start;
	}

	.pool {
		padding: var(--gap);
		flex-grow: 1;
		background: var(--foreground);

		display: flex;
		gap: var(--gap);
		align-items: center;
	}

	.pool > div {
		flex-grow: 1;
	}

	.modules {
		display: flex;
		flex-wrap: wrap;
		gap: calc(var(--gap) * 3);
	}

	.module {
		display: flex;
		align-items: center;
		gap: var(--gap);
	}

	.module > img {
		height: 32px;
		width: 32px;
		object-fit: none;
		image-rendering: crisp-edges;
	}

	.completions {
		display: flex;
		flex-direction: column;
		grid-template-columns: 1fr;
		gap: var(--gap);
	}

	.completion {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--gap);

		padding: var(--gap);
		background: var(--foreground);
	}

	.team {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
	}
</style>
