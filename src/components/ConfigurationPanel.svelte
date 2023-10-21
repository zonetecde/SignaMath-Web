<script lang="ts">
	import SaisieFonction from './SaisieFonction.svelte';
	import TableauDeSigne from './TableauDeSigne.svelte';

	let formula: string;
	let functionName: string;
	let variableName: string;
</script>

<div class="flex flex-col md:flex-row h-full w-full">
	<div class="md:w-2/12 md:min-w-[300px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
		<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>

		<SaisieFonction
			on:handleFunctionNameChanged={(e) => {
				functionName = e.detail;
			}}
			on:handleVariableNameChanged={(e) => {
				variableName = e.detail;
			}}
			on:handleFunctionChanged={(e) => {
				formula = e.detail;
			}}
		/>
	</div>

	<div class="w-full h-full">
		<TableauDeSigne {functionName} {variableName} {formula} />
	</div>
</div>
