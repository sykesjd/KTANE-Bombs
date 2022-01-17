<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

	export async function load({ params, fetch }: LoadInput): Promise<LoadOutput> {
		const { mission } = params;

		const json = await fetch(`/mission/${encodeURIComponent(mission)}.json`);
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
			error: 'Mission not found.'
		};
	}
</script>

<script lang="ts">
	import type { Mission } from '$lib/types';
	import { formatTime, pluralize } from '$lib/util';
	import CompletionCard from '$lib/CompletionCard.svelte';

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
</script>

<svelte:head>
	<title>{mission.name}</title>
</svelte:head>
<h1 class="header">{mission.name}</h1>
<div class="main-content">
	<div class="bombs">
		{#each mission.bombs as bomb}
			<div class="block">
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
		{#if mission.completions.length !== 0}
			{#each mission.completions as completion}
				<CompletionCard {completion} />
			{/each}
		{:else}
			<div class="block" style="text-align: center;"><i>No completions, be the first!</i></div>
		{/if}
	</div>
</div>

<style>
	.main-content {
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
</style>
