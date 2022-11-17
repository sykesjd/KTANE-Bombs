<script lang="ts">
	import Input from '$lib/controls/Input.svelte';
	import type { MissionPack } from '$lib/types';
	import { isOnlyDigits } from '$lib/util';
	import toast from 'svelte-french-toast';

	let pack: MissionPack = {
		name: '',
		steamId: ''
	};

	$: valid = pack.name.length > 0 && pack.steamId.length > 0;

	function parseSteamId(str: string): string | null {
		let trimmed = str.trim();
		if (isOnlyDigits(trimmed)) return trimmed;
		else {
			trimmed = trimmed.replace('https://steamcommunity.com/sharedfiles/filedetails/?id=', '');
			trimmed = trimmed.substring(0, trimmed.search(/[^0-9]/));
			if (isOnlyDigits(trimmed)) return trimmed;
		}
		return null;
	}

	function upload() {
		fetch('/upload/missionpack', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pack)
		})
			.then(response => {
				if (response.ok) {
					toast.success(`Mission pack uploaded successfully!`);
				} else {
					toast.error(`Mission pack failed to upload.`);
				}
			})
			.catch(() => toast.error('An error occurred.'));
	}
</script>

<div class="block flex grow">
	<Input label="Name" id="pack-name" required bind:value={pack.name} />
	<Input
		label="Steam ID"
		id="pack-steam-id"
		parse={parseSteamId}
		validate={value => value != null}
		instantFormat={false}
		bind:value={pack.steamId} />
</div>
<div class="block">
	<button on:click={upload} disabled={!valid}>Upload</button>
</div>
