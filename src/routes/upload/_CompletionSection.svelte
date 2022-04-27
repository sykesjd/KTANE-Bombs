<script lang="ts">
	import CompletionCard from '$lib/CompletionCard.svelte';
	import { Completion } from '$lib/types';
	import { parseTime } from '$lib/util';
	import { toasts } from 'svelte-toasts';

	export let missionNames: string[];

	let missionName: string = '';

	let completion: Completion = new Completion();
	let proofString: string = '';
	let timeString: string = '';
	let teamString: string = '';

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
			completion.proof = url.toString();
		} else {
			completion.proof = '';
		}

		completion.time = parseTime(timeString) ?? 0;
		completion.team = teamString
			.split(',')
			.map((name) => name.trim())
			.filter((name) => name.length !== 0);

		valid =
			missionNames.includes(missionName) &&
			completion.proof !== '' &&
			parseTime(timeString) != null &&
			completion.team.length !== 0;
	}

	function upload() {
		fetch('/upload/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ completion, missionName })
		})
			.then((response) => {
				if (response.ok) {
					toasts.success('Solve uploaded successfully!');
				} else {
					toasts.error('Solve failed to upload.');
				}
			})
			.catch(() => toasts.error('An error occurred.'));
	}
</script>

<div class="block form">
	<form>
		<label for="mission">Mission:</label>
		<input id="mission" list="missions" bind:value={missionName} />
		<datalist id="missions">
			{#each missionNames as mission}
				<option>{mission}</option>
			{/each}
		</datalist>
		<label for="proof">Proof:</label>
		<input
			id="proof"
			type="url"
			placeholder="https://ktane.timwi.de"
			required
			bind:value={proofString}
		/>
		<label for="time">Time Remaining:</label>
		<input
			id="time"
			type="text"
			pattern="^(?:\d+:)?(?:\d{'{'}1,2}:)?\d{'{'}1,2}(?:\.\d{'{'}1,2})?$"
			placeholder="1:23:45.67"
			required
			bind:value={timeString}
		/>
		<label for="proof">Team:</label>
		<input
			id="proof"
			type="text"
			placeholder="Defuser, Expert 1, ..."
			required
			bind:value={teamString}
		/>
	</form>
</div>
<CompletionCard {completion} />
<div class="block">
	<button on:click={upload} disabled={!valid}>Upload Completion</button>
</div>
