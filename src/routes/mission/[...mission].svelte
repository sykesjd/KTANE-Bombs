<script lang="ts">
	import { Permission, type Mission, type MissionPack } from '$lib/types';
	import { formatTime, hasPermission, pluralize } from '$lib/util';
	import CompletionList from '$lib/CompletionList.svelte';
	import type { RepoModule } from '$lib/repo';
	import { page, session } from '$app/stores';

	type Variant = Pick<Mission, 'name' | 'completions' | 'tpSolve'>;

	export let mission: Mission & { missionPack: MissionPack };
	export let variants: Variant[] | null;
	export let modules: RepoModule[] | null;

	function getModule(moduleID: string) {
		let module = modules?.filter((module) => module.ModuleID == moduleID);
		if (module?.length === 1) {
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
<div class="block" style="position: relative;">
	<h1 class="header">{mission.name}</h1>
	<div style="text-align: center;">
		<a href="https://steamcommunity.com/sharedfiles/filedetails/?id={mission.missionPack.steamId}">
			{mission.missionPack.name}
		</a>
		by {mission.missionPack.author}
	</div>
	{#if hasPermission($session.user, Permission.VerifyMission)}
		<a href={$page.url.href + '/edit'} class="top-right">Edit</a>
	{/if}
</div>
{#if mission.factory !== null}
	<div class="block" style="text-align: center">Factory: {mission.factory}</div>
{/if}
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
	<div class="flex column">
		<div class="block header">Solves</div>
		<CompletionList {mission} />
		{#each variants ?? [] as variant}
			<div class="block header" style="margin-top: calc(var(--gap) * 3);">
				{variant.name}
			</div>
			<CompletionList mission={variant} />
		{/each}
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

	.header {
		font-weight: bold;
		text-align: center;
	}

	.top-right {
		position: absolute;
		top: var(--gap);
		right: var(--gap);
	}
</style>
