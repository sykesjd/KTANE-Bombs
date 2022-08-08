<script lang="ts">
	export let id: string;
	export let value: any;
	export let label: string;
	export let type: string = 'text';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let options: any[] | null = null;
	export let display = (value: any) => value.toString();
	export let parse = (value: string): any => value;
	export let validate = (_value: any) => true;

	let displayValue = display(value);

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		displayValue = e.currentTarget.value;

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

<div>
	<label for={id}>
		{label}
		<slot />
	</label>
	<input
		{id}
		{type}
		{placeholder}
		{required}
		list={id + '-list'}
		value={displayValue}
		on:input={handleInput}
		on:change={() => (displayValue = display(value))}
	/>
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
