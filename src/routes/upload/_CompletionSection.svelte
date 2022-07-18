<script lang="ts">
	import CompletionCard from '$lib/CompletionCard.svelte';
	import Input from '$lib/Input.svelte';
	import { Completion } from '$lib/types';
	import { formatTime, parseTime } from '$lib/util';
	import { toasts } from 'svelte-toasts';

	export let missionNames: string[];

	let missionName: string = '';

	let completion: Completion = new Completion();
	let proofString: string = '';
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
			completion.proofs = [url.toString()];
		} else {
			completion.proofs = [];
		}

		completion.team = teamString
			.split(',')
			.map((name) => name.trim())
			.filter((name) => name.length !== 0);

		valid =
			missionNames.includes(missionName) &&
			completion.proofs.length !== 0 &&
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
	<form class="flex">
		<Input
			id="mission"
			label="Mission"
			options={missionNames}
			validate={(value) => value !== null}
			bind:value={missionName}
		/>
		<Input
			id="proof"
			type="url"
			label="Proof"
			placeholder="https://ktane.timwi.de"
			required
			bind:value={proofString}
		/>
		<Input
			id="time"
			type="text"
			parse={parseTime}
			validate={(value) => value != null}
			display={formatTime}
			label="Time Remaining"
			placeholder="1:23:45.67"
			required
			bind:value={completion.time}
		/>
		<Input
			id="proof"
			type="text"
			label="Team"
			placeholder="Defuser, Expert 1, ..."
			required
			bind:value={teamString}
		/>
	</form>
</div>
<CompletionCard {completion} />
<div class="block">
	<button on:click={upload} disabled={!valid}>Upload</button>
</div>

<style>
	form {
		gap: calc(var(--gap) * 2);
	}
</style>
