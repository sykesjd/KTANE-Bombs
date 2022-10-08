<script lang="ts">
	export let dialog: HTMLDialogElement | undefined = undefined;

	function onClick(event: Event) {
		if (event.target === dialog) {
			dialog.close();
		}
	}
</script>

<dialog bind:this={dialog} on:click={onClick}>
	<div>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		background-color: var(--background);
		border: none;
		color: inherit;
		padding: 0;
	}

	div {
		padding: calc(var(--gap) * 3);
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
