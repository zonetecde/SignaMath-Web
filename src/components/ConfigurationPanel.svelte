<script lang="ts">
	import SaisieFonction from './SaisieFonction.svelte';
	import TableauDeSigne from './TableauDeSigne.svelte';

	let formula: string;
	let functionName: string;
	let variableName: string;

	let borneMin: string = '-inf';
	let borneMax: string = '+inf';

	const variableNameChanged = (e: CustomEvent<any>) => {
		variableName = e.detail;
	};

	const functionChanged = (e: CustomEvent<any>) => {
		formula = e.detail;
	};

	const functionNameChanged = (e: CustomEvent<any>) => {
		functionName = e.detail;
	};

	const borneMaxChanged = (e: CustomEvent<any>) => {
		borneMax = e.detail;
	};

	const borneMinChanged = (e: CustomEvent<any>) => {
		borneMin = e.detail;
	};
</script>

<div class="flex flex-col md:flex-row h-full w-full">
	<div class="md:w-2/12 md:min-w-[300px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
		<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>

		<SaisieFonction
			on:handleFunctionNameChanged={functionNameChanged}
			on:handleVariableNameChanged={variableNameChanged}
			on:handleFunctionChanged={functionChanged}
			{variableName}
			{functionName}
			{formula}
		/>
	</div>

	<div class="w-full h-full">
		<TableauDeSigne
			{functionName}
			{variableName}
			{formula}
			{borneMin}
			{borneMax}
			on:handleVariableNameChanged={variableNameChanged}
			on:handleBorneMaxChanged={borneMaxChanged}
			on:handleBorneMinChanged={borneMinChanged}
		/>
	</div>
</div>
