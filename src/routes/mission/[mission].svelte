<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

	export async function load({ page, fetch }: LoadInput): Promise<LoadOutput> {
		const { mission } = page.params;

		const json = await fetch(`/mission/${mission}.json`);
		const missionObject: Mission = await json.json();

		const repo = await fetch('https://ktane.timwi.de/json/raw');

		if (json.ok && repo.ok) {
			return {
				props: {
					mission: missionObject,
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
	import type { Mission } from '$lib/types';
	import { formatTime, pluralize } from '$lib/util';

	export let mission: Mission;
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
	<title>{mission.name}</title>
</svelte:head>
<div class="main-content">
	<div class="header">
		<div class="mission-name">{mission.name}</div>
	</div>
	<div class="bombs">
		{#each mission.bombs as bomb}
			<div class="foreground padding">
				{pluralize(bomb.modules, 'Module')} · {formatTime(bomb.time)} · {pluralize(
					bomb.strikes,
					'Strike'
				)} · {pluralize(bomb.widgets, 'Widget')}
			</div>
			<div class="pools">
				{#each bomb.pools as pool}
					<div class="pool">
						<div class="modules">
							{#each pool.modules.map(getModule) as module}
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
						{#if pool.count !== 1}
							<span style="white-space: nowrap"> ×{pool.count}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="completions">
		{#each mission.completions as completion}
			<div class="completion">
				<span class:first={completion.first}>{formatTime(completion.time)}</span>
				<div class="team">
					{#each completion.team as person, i}
						<span style="text-decoration: 1px underline {getPersonColor(completion.team.length, i)}"
							>{person}</span
						>
					{/each}
				</div>
				<a href={completion.proof}>Link</a>
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

	@media (max-width: 500px) {
		.main-content {
			display: flex;
			flex-direction: column;
		}
	}

	.header {
		grid-column: 1 / span 2;
		padding: var(--gap);
		background: var(--foreground);
	}

	.mission-name {
		font-size: 200%;
	}

	.bombs {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
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

	.completion .first {
		text-decoration: 1px solid goldenrod underline;
	}

	.team {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
	}
</style>
