<script lang="ts">
	import SaisieFonction from './SaisieFonction.svelte';
	import SaisieMath from './SaisieMath.svelte';

	function handleFunctionNameChanged(e: CustomEvent<any>): void {
		console.log(e);
	}

	function handleVariableNameChanged(e: CustomEvent<any>): void {}

	function handleFunctionChanged(e: CustomEvent<any>): void {}
</script>

<div class="md:w-2/12 md:min-w-[300px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
	<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>

	<SaisieFonction
		on:handleFunctionNameChanged={handleFunctionNameChanged}
		on:handleVariableNameChanged={handleVariableNameChanged}
		on:handleFunctionChanged={handleFunctionChanged}
	/>
</div>
