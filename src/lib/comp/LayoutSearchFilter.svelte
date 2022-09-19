<script lang="ts">
	import Input from '$lib/controls/Input.svelte';

	export let id: string;
	export let label: string = "Find:";
	export let items: { [name: string]: any };
	export let filterFunc: (itemKey:string, text:string) => boolean;
	export let clearSearchFunc: () => void = () => {};
	export let searchText: string = '';
	export let numResults = 0;
	export let showNoneForBlank = false;
	export let searching = false;
	
	let searchField: HTMLInputElement | null;

	function clearSearch() {
		searchText = '';
		searchField = <HTMLInputElement>document.getElementById(id);
		if (searchField) searchField.value = '';
		Object.keys(items).forEach(name => {
			if (showNoneForBlank)
				items[name].classList.add("search-filtered-out");
			else
				items[name].classList.remove("search-filtered-out");
		});
		if (showNoneForBlank) numResults = 0;
		else numResults = Object.keys(items).length;
		clearSearchFunc();
		searchField?.focus();
	}

	export const updateSearch = () => {
		searching = false;
		updateSearchFilter();
	}

	function updateSearchFilter() {
		numResults = 0;
		searching = true;
		Object.keys(items).forEach(item => {
			if (showNoneForBlank && searchText.length == 0)
				items[item].classList.add("search-filtered-out");
			else if (filterFunc(item, searchText)) {
				items[item].classList.remove("search-filtered-out");
				numResults++;
			}
			else
				items[item].classList.add("search-filtered-out");
		});
		searching = false;
		// console.log("Searched: " + searchText);
	}

</script>

<Input label={label} sideLabel={true} id={id} classes="search-field"
		handleInputCall={updateSearch}
		bind:value={searchText}/>
<div class="search-field-clear" on:click={clearSearch}></div>

<style>
	:global(.search-field) { min-width: 55px; }
	:global(.search-filtered-out) { display: none !important; }

	.search-field-clear {
		background: url('$lib/img/clear-button.svg') right center no-repeat;
		width: 1.25em;
		height: 1.25em;
		min-width: 1.25em;
		margin-right: 5px;
		display: inline-block;
		vertical-align: middle;
		cursor: pointer;
	}
</style>