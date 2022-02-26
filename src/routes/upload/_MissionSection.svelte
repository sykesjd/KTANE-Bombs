<script lang="ts">
	import MissionCard from '$lib/MissionCard.svelte';
	import { Bomb, Mission, Pool } from '$lib/types';
	import { toasts } from 'svelte-toasts';

	let files: FileList;
	let missions: Mission[] = [];
	let selectedMissions: Record<number, boolean> = {};

	function parseMissions(text: string) {
		let mission: Mission;
		let bomb: Bomb;
		let lineIndex = 0;
		const lines = text.split('\n');

		function readLine() {
			return lines[lineIndex++];
		}

		while (lineIndex < lines.length) {
			let line = readLine();
			if (line === '[State] Enter GameplayState') {
				mission = new Mission();
				mission.completions = [];
				mission.bombs = [];
				mission.name = '';

				missions = [...missions, mission];
			} else if (line.startsWith('[BombGenerator] Generator settings: ')) {
				let match = line.match(/Time: (\d+), NumStrikes: (\d+)/);

				bomb = new Bomb();
				bomb.time = parseInt(match[1]);
				bomb.strikes = parseInt(match[2]);
				bomb.pools = [];
				bomb.widgets = 1;
				bomb.modules = 0;

				match = readLine().match(/(\d+) Pools:/);
				let pools = parseInt(match[1]);
				for (let i = 0; i < pools; i++) {
					match = readLine().match(/\[(.+)\] Count: (\d+)(?:, Sources: (.+))?/);
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
			} else if (line.startsWith('[WidgetGenerator] Added widget: ')) {
				bomb.widgets++;
			} else if (line.startsWith('[Tweaks] LFAEvent ')) {
				const match = line.match(/LFAEvent (\d+)/);
				let json = '';
				for (let i = 0; i < parseInt(match[1]); i++) {
					json += readLine();
				}

			} else if (line.startsWith('[Factory] Creating gamemode')) {
				mission.factory = line.match(/Creating gamemode '(.+)'\./)[1].replace('Finite', 'Sequence');
			}
		}
	}

	$: (async function () {
		missions = [];
		if (files === undefined) return;

		for (const file of Array.from(files)) {
			const text = await file.text();

			parseMissions(text);
		}
	})();

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
		<input id="logfile" type="file" accept=".txt,.log" required bind:files />
	</div>
</div>
{#if missions.length !== 0}
	<div class="block">Select one or more missions from the logfile.</div>
	<div class="missions">
		{#each missions as mission, i}
			<MissionCard {mission} selectable={true} bind:selected={selectedMissions[i]} />
		{/each}
	</div>
	{#if Object.values(selectedMissions).some((a) => a)}
		<div class="block">
			<button on:click={sendMissions}
				>Upload Mission{Object.values(selectedMissions).filter((a) => a).length == 1
					? ''
					: 's'}</button
			>
		</div>
	{/if}
{/if}
