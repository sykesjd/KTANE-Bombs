<script lang="ts">
	import Checkbox from '$lib/controls/Checkbox.svelte';
	import CompletionCard from '$lib/cards/CompletionCard.svelte';
	import Input from '$lib/controls/Input.svelte';
	import { Completion } from '$lib/types';
	import { formatTime, parseList, parseTime } from '$lib/util';
	import toast from 'svelte-french-toast';

	export let missionNames: string[];
	export let solverNames: string[];

	let missionName: string = '';
	let teamString: string = '';

	let completion: Completion = new Completion();
	let proofString: string = '';

	let valid: boolean = false;

	$: {
		let url: URL | null = null;
		try {
			url = new URL(proofString);
		} catch {}

		if (url?.protocol === 'http:') {
			url.protocol = 'https:';
		}

		if (url?.protocol === 'https:') {
			completion.proofs = [url.toString()];
		} else {
			completion.proofs = [];
		}

		teamString = correctNameCapitalization(teamString);
		completion.team = parseList(teamString);

		if (completion.team.length > 1) completion.solo = false;

		valid = missionNames.includes(missionName) && completion.proofs.length !== 0 && completion.team.length !== 0;
	}

	function uniqueNames(): string[] {
		return completion.team.filter(n => !solverNames.some(sn => sn.toLowerCase() === n.toLowerCase()));
	}

	function correctNameCapitalization(names: string): string {
		let replaced = parseList(names).map(n => {
			if (solverNames.some(sn => sn.toLowerCase() === n.toLowerCase()))
				return solverNames.find(sn => sn.toLowerCase() === n.toLowerCase());
			else return n;
		});
		return replaced.join(', ');
	}

	function upload() {
		let uNames = uniqueNames();
		if (uNames.length > 0) {
			let conf = `Are you sure? These names are NOT currently credited with any solves: ${uNames.join(', ')}`;
			if (!confirm(conf)) return;
		}
		fetch('/upload/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ completion, missionName })
		})
			.then(response => {
				if (response.ok) {
					toast.success('Solve uploaded successfully!');
				} else {
					toast.error('Solve failed to upload.');
				}
			})
			.catch(() => toast.error('An error occurred.'));
	}
</script>

<form class="block flex">
	<Input
		id="mission"
		label="Mission"
		options={missionNames}
		validate={value => value !== null}
		bind:value={missionName} />
	<Input id="proof" type="url" label="Proof" placeholder="https://ktane.timwi.de" required bind:value={proofString} />
	<Input
		id="time"
		type="text"
		parse={parseTime}
		validate={value => value != null}
		display={value => formatTime(value, value % 1 != 0)}
		instantFormat={false}
		label="Time Remaining"
		placeholder="1:23:45.67"
		required
		bind:value={completion.time} />
	<Input
		id="team"
		type="text"
		label="Team"
		placeholder="Defuser, Expert 1, ..."
		required
		instantFormat={false}
		bind:value={teamString} />
	<Checkbox id="solo" label="Solo" bind:checked={completion.solo} disabled={completion.team.length > 1} />
</form>
<CompletionCard {completion} />
<div class="block">
	<button on:click={upload} disabled={!valid}>Upload</button>
</div>

<style>
	form {
		gap: calc(var(--gap) * 2);
	}
</style>
