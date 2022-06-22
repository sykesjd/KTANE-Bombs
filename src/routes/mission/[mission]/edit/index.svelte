<script lang="ts">
	import { session } from '$app/stores';
	import Checkbox from '$lib/Checkbox.svelte';
	import Input from '$lib/Input.svelte';
	import NoContent from '$lib/NoContent.svelte';
	import type { RepoModule } from '$lib/repo';
	import Select from '$lib/Select.svelte';
	import { Permission, type Completion, type ID, type Mission, type MissionPack } from '$lib/types';
	import { formatTime, hasPermission, parseTime, pluralize } from '$lib/util';
	import equal from 'fast-deep-equal';
	import type { EditMission } from './_types';

	export let mission: EditMission;
	export let packs: Pick<ID<MissionPack>, 'id' | 'name'>[];
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

	let originalMission: Mission;

	function setOriginalMission() {
		originalMission = JSON.parse(JSON.stringify(mission));
	}

	setOriginalMission();

	$: modified = !equal(mission, originalMission);

	async function saveChanges() {
		await fetch(location.href, {
			method: 'POST',
			body: JSON.stringify(mission)
		});

		if (mission.name != originalMission.name) {
			history.replaceState(null, '', '/mission/' + mission.name + '/edit');
		}

		setOriginalMission();
	}

	async function deleteMission() {
		if (!confirm('This cannot be undone. Are you sure?')) return;

		await fetch('/mission/' + originalMission.name, {
			method: 'DELETE'
		});

		location.href = '/';
	}

	async function deleteCompletion(completion: ID<Completion>) {
		if (!confirm('This cannot be undone. Are you sure?')) return;

		await fetch(location.href, {
			method: 'DELETE',
			body: JSON.stringify(completion)
		});

		mission.completions = mission.completions.filter((comp) => completion.id !== comp.id);
		setOriginalMission();
	}
</script>

<svelte:head>
	<title>{mission.name}</title>
</svelte:head>
<div class="block flex column relative">
	<Input title="Name" id="mission-name" bind:value={mission.name} />
	<Input
		title="Mission Pack"
		id="mission-pack"
		bind:value={mission.missionPack}
		options={packs}
		display={(pack) => pack.name}
		validate={(value) => value !== null}
	/>
	<div class="actions">
		<button on:click={deleteMission}>Delete</button>
	</div>
</div>
<div class="block">
	<Select
		title="Factory"
		id="mission-factory"
		bind:value={mission.factory}
		options={[null, 'Static', 'Sequence']}
		display={(mode) => mode ?? 'None'}
	/>
</div>
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
		{#each mission.completions as completion}
			<div class="block flex column relative">
				<Input title="Proof" id="completion-proof" bind:value={completion.proofs} />
				<Input
					title="Time"
					id="completion-time"
					bind:value={completion.time}
					parse={parseTime}
					display={formatTime}
				/>
				<Input
					title="Team"
					id="completion-team"
					bind:value={completion.team}
					parse={(value) => value.split(',').map((person) => person.trim())}
					display={(list) => list.join(', ')}
				/>
				{#if hasPermission($session.user, Permission.VerifyCompletion)}
					<div class="actions">
						<button on:click={() => deleteCompletion(completion)}>Delete</button>
					</div>
				{/if}
			</div>
		{:else}
			<NoContent>No solves to edit.</NoContent>
		{/each}
		<div class="block">
			<Checkbox id="mission-tp" bind:checked={mission.tpSolve}>
				Solved by <span class="tp-solve">Twitch Plays</span>
			</Checkbox>
		</div>
	</div>
</div>
<div class="bottom-center flex" class:visible={modified}>
	<div class="save-changes block flex">
		There are unsaved changes.
		<button on:click={saveChanges}>Save</button>
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

	.tp-solve {
		padding: 1px 3px;
		border-radius: 5px;
		background-color: #9146ff;
	}

	.header {
		font-weight: bold;
		text-align: center;
	}

	.bottom-center {
		position: fixed;
		bottom: var(--gap);
		justify-content: center;
		margin: var(--gap);
		width: calc((min(100vw, 1150px) - 4 * var(--gap)));

		transform: translateY(100%);
		opacity: 0;
		transition: transform 0.4s, opacity 0.4s;
		transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
	}

	.bottom-center.visible {
		transform: none;
		opacity: 1;
	}

	.save-changes {
		justify-content: center;
		align-items: center;
		box-shadow: var(--foreground) 0 0 10px;
		background-color: rgb(15, 15, 15);
	}
</style>
