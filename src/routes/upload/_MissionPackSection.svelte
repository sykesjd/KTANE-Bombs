<script lang="ts">
	import Input from '$lib/controls/Input.svelte';
	import type { MissionPack } from '$lib/types';
	import { toasts } from 'svelte-toasts';

	let pack: MissionPack = {
		name: '',
		steamId: ''
	};

	$: valid = pack.name.length > 0 && pack.steamId.length > 0;

	function upload() {
		fetch('/upload/missionpack', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pack)
		})
			.then((response) => {
				if (response.ok) {
					toasts.success(`Mission pack uploaded successfully!`);
				} else {
					toasts.error(`Mission pack failed to upload.`);
				}
			})
			.catch(() => toasts.error('An error occurred.'));
	}
</script>

<div class="block flex grow">
	<Input label="Name" id="pack-name" bind:value={pack.name} />
	<Input label="Steam ID" id="pack-steam-id" bind:value={pack.steamId} />
</div>
<div class="block">
	<button on:click={upload} disabled={!valid}>Upload</button>
</div>
