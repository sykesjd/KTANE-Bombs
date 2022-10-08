<script lang="ts">
	import type { FrontendUser } from '$lib/types';

	export let user: FrontendUser;
</script>

<div class="block user">
	{#if user.avatar.length == 1}
		<img class="avatar"
			src="https://cdn.discordapp.com/embed/avatars/{user.avatar}.png?size=32"
			alt="Avatar"/>
	{:else}
		<img class="avatar"
			src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp?size=32"
			alt="Avatar"/>
	{/if}
	<span class="username">{user.username}</span>
	{#if user.discordName?.length > 0}
		<span class="discord">Discord: {user.discordName}</span>
	{/if}
</div>

<style>
	.user {
		display: flex;
		flex-direction: row;
		gap: var(--gap);
		align-items: center;
	}
	.discord {
		margin-left: 50px;
	}

	.avatar {
		border-radius: 50%;
		height: 20px;
	}
</style>
