<script lang="ts">
	export let id: string;
	export let value: any;
	export let label: string;
	export let options: any[];
	export let display = (obj: any) => obj.toString();

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
		let newValue = e.currentTarget.value;
		for (const option of options) {
			if (newValue === display(option)) {
				value = option;
				return;
			}
		}
	};
</script>

<div class="flex column content-width">
	<label for={id}>
		{label}
		<slot />
	</label>
	<select {id} on:input={handleInput}>
		{#each options as option}
			<option selected={option === value}>{display(option)}</option>
		{/each}
	</select>
</div>

<style>
	select {
		background-color: rgb(15, 15, 15);
		padding: var(--gap);
		border: none;
		border-radius: 5px;
		color: white;
		width: 100%;
		box-sizing: border-box;
	}
</style>
