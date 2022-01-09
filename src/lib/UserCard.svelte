<script lang="ts">
	import type { FrontendUser } from './types';

	export let user: FrontendUser;
</script>

<div class="block user">
	<img
		class="avatar"
		src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp?size=32"
		alt="Avatar"
	/>
	<span>{user.username}</span>
</div>

<style>
	.user {
		display: flex;
		flex-direction: row;
		gap: var(--gap);
		align-items: center;
	}

	.avatar {
		border-radius: 50%;
		height: 20px;
	}
</style>
