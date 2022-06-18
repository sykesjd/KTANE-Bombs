<script lang="ts">
	export let id: string;
	export let value: any;
	export let title: string;
	export let type: string = 'text';
	export let options: any[] | null = null;
	export let display = (value: any) => value.toString();
	export let parse = (value: string): any => value;
	export let validate = (value: any) => true;

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		let newValue = parse(e.currentTarget.value);
		if (options !== null) {
			for (const option of options) {
				if (newValue === display(option)) {
					value = option;
					return;
				}
			}

			newValue = null;
		}

		if (validate(newValue)) value = newValue;
	};
</script>

<div class="flex column content-width">
	<label for={id}>{title}</label>
	<input {id} {type} list={id + '-list'} value={display(value)} on:input={handleInput} />
	{#if options}
		<datalist id={id + '-list'}>
			{#each options as option}
				<option value={display(option)} />
			{/each}
		</datalist>
	{/if}
</div>

<style>
	input {
		background-color: rgb(15, 15, 15);
		padding: var(--gap);
		border: none;
		border-radius: 5px;
		color: white;
		width: 100%;
		box-sizing: border-box;
	}
</style>
