<script lang="ts">
	import Input from '$lib/Input.svelte';
	import MissionCard from '$lib/MissionCard.svelte';
	import { Bomb, Mission, Pool, type MissionPackSelection } from '$lib/types';
	import { toasts } from 'svelte-toasts';

	export let packs: MissionPackSelection[];

	let files: FileList;
	let missions: MissionWithPack[] = [];
	let selectedMissions: Record<number, boolean> = {};

	type MissionWithPack = Mission & { missionPack: MissionPackSelection | null };

	function parseMissions(text: string) {
		let missions: MissionWithPack[] = [];
		let mission: MissionWithPack | null = null;
		let bomb: Bomb | null = null;
		let lineIndex = 0;
		const lines = text.split('\n');

		function readLine() {
			return lines[lineIndex++];
		}

		while (lineIndex < lines.length) {
			let line = readLine().trim();
			if (line === '[State] Enter GameplayState') {
				mission = {
					completions: [],
					bombs: [],
					name: '',
					tpSolve: false,
					factory: '',
					missionPack: null
				};

				missions = [...missions, mission];
			} else if (line.startsWith('[BombGenerator] Generator settings: ') && mission !== null) {
				let match = line.match(/Time: (\d+), NumStrikes: (\d+)/);
				if (match === null) throw new Error('This regex should always match');

				bomb = new Bomb();
				bomb.time = parseInt(match[1]);
				bomb.strikes = parseInt(match[2]);
				bomb.pools = [];
				bomb.widgets = 1;
				bomb.modules = 0;

				match = readLine().match(/(\d+) Pools:/);
				if (match === null) throw new Error('This regex should always match');
				let pools = parseInt(match[1]);
				for (let i = 0; i < pools; i++) {
					match = readLine().match(/\[(.+)\] Count: (\d+)(?:, Sources: (.+))?/);
					if (match === null) throw new Error('This regex should always match');
					const count = parseInt(match[2]);

					const modules = match[1].split(', ');
					// If the sources are listed, update the "module" to include the source.
					const sources = match[3]?.split(', ');
					if (sources !== undefined && sources.length === 1) {
						const source = sources[0] == 'Modded' ? 'MODS' : 'VANILLA';
						modules[0] = `ALL_${source}_${modules[0].substring(4)}`;
					}

					bomb.pools.push(new Pool(modules, count));
					bomb.modules += count;
				}

				mission.bombs.push(bomb);
			} else if (line.startsWith('[WidgetGenerator] Added widget: ') && bomb !== null) {
				bomb.widgets++;
			} else if (line.startsWith('[Tweaks] LFAEvent ') && mission !== null) {
				const match = line.match(/LFAEvent (\d+)/);
				if (match === null) throw new Error('This regex should always match');

				let json = '';
				for (let i = 0; i < parseInt(match[1]); i++) {
					json += readLine();
				}

				const event = JSON.parse(json);
				if (event.type === 'ROUND_START') mission.name = event.mission;
			} else if (line.startsWith('[Factory] Creating gamemode') && mission !== null) {
				const match = line.match(/Creating gamemode '(.+)'\./);
				if (match === null) throw new Error('This regex should always match');

				mission.factory = match[1].replace('Finite', 'Sequence');
			}
		}

		return missions;
	}

	async function readFiles() {
		missions = (
			await Promise.all(
				Array.from(files ?? []).map(async (file) => {
					const text = await file.text();

					return parseMissions(text);
				})
			)
		).flat();
	}

	function sendMissions() {
		fetch('/upload/missions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(missions.filter((_, index) => selectedMissions[index]))
		})
			.then((response) => {
				const plural = Object.values(selectedMissions).filter((value) => value).length > 1;
				const word = `Misison${plural ? 's' : ''}`;
				if (response.ok) {
					toasts.success(`${word} uploaded successfully!`);
				} else {
					toasts.error(`${word} failed to upload.`);
				}
			})
			.catch(() => toasts.error('An error occurred.'));
	}
</script>

<div class="block flex column">
	<div>Select a logfile that contains the mission to upload.</div>
	<div>
		<label for="logfile">Logfile:</label>
		<input id="logfile" type="file" accept=".txt,.log" required bind:files on:change={readFiles} />
	</div>
</div>
{#if missions.length !== 0}
	<div class="block">Select one or more missions from the logfile.</div>
	<form on:submit|preventDefault={sendMissions}>
		<div class="missions">
			{#each missions as mission, i}
				<div class="flex">
					<MissionCard {mission} selectable={true} bind:selected={selectedMissions[i]} />
					<div class="block">
						<Input
							label="Mission Pack"
							id="mission-pack"
							bind:value={mission.missionPack}
							options={packs}
							display={(pack) => (pack === null ? '' : pack.name)}
							validate={(pack) => pack !== null}
							required={selectedMissions[i]}
						/>
					</div>
				</div>
			{/each}
		</div>
		{#if Object.values(selectedMissions).some((a) => a)}
			<div class="block">
				<button type="submit"
					>Upload Mission{Object.values(selectedMissions).filter((a) => a).length == 1
						? ''
						: 's'}</button
				>
			</div>
		{/if}
	</form>
{/if}

<style>
	form {
		display: contents;
	}
</style>
