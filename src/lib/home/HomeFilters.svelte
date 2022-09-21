<script lang="ts">
	import Checkbox from "$lib/controls/Checkbox.svelte";
	import Input from "$lib/controls/Input.svelte";

	export let div: HTMLDivElement | null = null;
	//let hasOptions = ["Has Boss", "Has Semi-Boss", "Has PseudoNeedy", "Has Needy"];
</script>

<div class="popup disappear hidden" id="filters"
	on:click bind:this={div}>
	<div class="hstack columns">
		<div>
			<p>Module Count<br> [1] - [500]</p>
			<p>Time<br>[1]min - [720]min</p>
			<p>Strikes<br>[1] - [40]</p>
			<p>Widgets<br>[0] - [20]</p>
		</div>
		<div class="center-divider"></div>
		<div>
			<p>	Has Boss<br>
				Has Semi-Boss<br>
				Has PseudoNeedy<br>
				Has Needy<br>
				Has Rule Seed</p>
			<p>	Sort Order:<br>
				Alphabetical<br>
				Date Published<br>
				Module Count<br>
				Bomb Time<br>
				Solves</p>
			<!-- {#each hasOptions as option, index}
				<input type="radio">
			{/each} -->
		</div>
	</div>
	<p class="centered"><u>Module Selector</u></p>
	<div class="hstack columns">
		<p class="centered"><b><u>____Yes____</u></b><br>Module One<br>Module Two</p>
		<div class="center-divider small"></div>
		<p class="centered"><b><u>_____No_____</u></b><br>Module Three<br>Module Four</p>
	</div>
</div>

<style>
	p {
		margin-top: .2em;
	}
	.centered {
		text-align: center;
		margin-bottom: 0;
	}
	.columns p.centered {
		width: 119px;
	}
	.columns {
		align-items: flex-start;
	}
	.center-divider {
		width: 0;
		height: 220px;
		border: 1px solid #00000066;
		margin: 0 .5em;
	}
	.center-divider.small {
		height: 60px;
	}
</style>
