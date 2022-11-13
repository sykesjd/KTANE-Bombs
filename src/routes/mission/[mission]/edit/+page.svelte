<script lang="ts">
	import Checkbox from '$lib/controls/Checkbox.svelte';
	import Input from '$lib/controls/Input.svelte';
	import NoContent from '$lib/comp/NoContent.svelte';
	import type { RepoModule } from '$lib/repo';
	import Select from '$lib/controls/Select.svelte';
	import { Permission, type Completion, type ID, type Mission, type MissionPack } from '$lib/types';
	import { displayStringList, formatTime, getModule, hasPermission, parseInteger, parseList, parseTime, pluralize } from '$lib/util';
	import equal from 'fast-deep-equal';
	import { sortBombs } from '../../_shared';
	import type { EditMission } from './_types';
	import { page } from '$app/stores';
	import { applyAction } from '$app/forms';

	export let data;

	let mission: EditMission & { verified: boolean } = data.mission;
	let packs: Pick<ID<MissionPack>, 'id' | 'name'>[] = data.packs;
	let modules: Record<string, RepoModule> | null = data.modules;

	sortBombs(mission, modules);

	let originalMission: Mission;

	function setOriginalMission() {
		originalMission = JSON.parse(JSON.stringify(mission));
	}

	setOriginalMission();

	$: modified = !equal(mission, originalMission);

	function intnan0(val: number): boolean | string {
		return isNaN(val) ? 'int' : val >= 0 ? true : '≥0';
	}
	function intnan1(val: number): boolean | string {
		return isNaN(val) ? 'int' : val > 0 ? true : '>0';
	}

	async function saveChanges() {
		const fData = new FormData();
		fData.append('mission', JSON.stringify(mission));

		const response = await fetch('?/editMission', {
			method: 'POST',
			body: fData
		});
		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = await response.json();

		applyAction(result);
	}

	async function deleteMission() {
		if (!confirm('This cannot be undone. Are you sure?')) return;
		const fData = new FormData();
		fData.append('mission', JSON.stringify(originalMission));

		const response = await fetch('?/deleteMission', {
			method: 'POST',
			body: fData
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = await response.json();

		applyAction(result);
	}

	async function deleteCompletion(completion: ID<Completion>) {
		if (!confirm('This cannot be undone. Are you sure?')) return;
		const fData = new FormData();
		fData.append('completion', JSON.stringify(completion));

		const response = await fetch('?/deleteCompletion', {
			method: 'POST',
			body: fData
		});

		mission.completions = mission.completions.filter(comp => completion.id !== comp.id);
		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = await response.json();

		applyAction(result);
		setOriginalMission();
	}

	for (const bomb of mission.bombs) {
		bomb.pools.sort((a, b) => a.modules.join().localeCompare(b.modules.join()));
	}
</script>

<svelte:head>
	<title>{mission.name}</title>
</svelte:head>
<div class="block flex column relative">
	<Input label="Name" id="mission-name" bind:value={mission.name} />
	<Input label="Authors" id="mission-authors" bind:value={mission.authors} parse={parseList} />
	<Input
		label="Mission Pack"
		id="mission-pack"
		bind:value={mission.missionPack}
		options={packs}
		display={pack => pack.name}
		validate={value => value !== null} />
	<div class="actions">
		<button on:click={deleteMission}>Delete</button>
	</div>
</div>
<div class="block">
	<Select
		label="Factory"
		id="mission-factory"
		bind:value={mission.factory}
		options={[null, 'Static', 'Sequence']}
		display={mode => mode ?? 'None'} />
</div>
{#if !mission.verified}
	<div class="block centered not-verified">This mission has not been verified.</div>
{/if}
<div class="main-content">
	<div class="bombs">
		{#each mission.bombs as bomb}
			<div class="block flex column relative">
				<Input
					label="Number of Modules"
					id="bomb-modules-{bomb.id}"
					parse={parseInteger}
					validate={intnan1}
					required
					bind:value={bomb.modules} />
				<Input
					label="Bomb Time"
					id="bomb-time-{bomb.id}"
					type="text"
					parse={parseTime}
					validate={value => value != null}
					display={formatTime}
					instantFormat={false}
					placeholder="1:23:45.67"
					required
					bind:value={bomb.time} />
				<Input
					label="Number of Strikes"
					id="bomb-strikes-{bomb.id}"
					parse={parseInteger}
					validate={intnan1}
					required
					bind:value={bomb.strikes} />
				<Input
					label="Number of Widgets"
					id="bomb-widgets-{bomb.id}"
					parse={parseInteger}
					validate={intnan0}
					required
					bind:value={bomb.widgets} />
				<Checkbox sideLabel label="Designed for TP" id="designed-for-tp" bind:checked={mission.designedForTP} />
			</div>
			<div class="block flex column relative">
				{#each bomb.pools as pool, index}
					<div class="pool">
						<Input
							label="Count"
							id="pool-count-{bomb.id}-{index}"
							classes="pool-count"
							parse={parseInteger}
							validate={intnan1}
							required
							bind:value={pool.count} />
						<Input
							label="Modules (comma-separated)"
							id="pool-modules-{bomb.id}-{index}"
							classes="pool-modules"
							parse={parseList}
							display={displayStringList}
							validate={value => value != null}
							required
							bind:value={pool.modules} />
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex column">
		<div class="block header">Solves</div>
		{#each mission.completions as completion}
			<div class="block flex column relative">
				<Input label="Proof" id="completion-proof" bind:value={completion.proofs} />
				<Input label="Time" id="completion-time" bind:value={completion.time} parse={parseTime} display={formatTime} />
				<Input
					label="Team"
					id="completion-team"
					bind:value={completion.team}
					parse={value => value.split(',').map(person => person.trim())}
					display={list => list.join(', ')} />
				{#if hasPermission($page.data.user, Permission.VerifyCompletion)}
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

	.not-verified {
		color: red;
	}
	.centered {
		text-align: center;
	}

	.pool {
		padding: var(--gap);
		flex-grow: 1;
		background: var(--foreground);

		display: flex;
		gap: var(--gap);
		align-items: center;
	}

	:global(.pool input.pool-count) {
		width: 6em;
	}
	:global(.pool input.pool-modules) {
		width: 40em;
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
		color: #ddd;
		background-color: rgb(15, 15, 15);
	}
</style>
