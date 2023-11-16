<script lang="ts">
	import SaisieFonction from './SaisieFonction.svelte';
	import SaisieMath from './SaisieMath.svelte';

	export let variableName: string = 'x';
	export let functionName: string = 'f';
	export let formula: string = 'x^2 - 4x';

	export let isDisabled: boolean = false;
	export let canEditFunctionName: boolean = isDisabled ? false : true;
</script>

<div class="w-full mt-3 flex flex-row items-center rounded-lg bg-white overflow-auto">
	<SaisieFonction
		{functionName}
		{variableName}
		on:handleFunctionNameChanged
		on:handleVariableNameChanged
		isDisabled={!canEditFunctionName}
	/>

	<SaisieMath classes="w-7 " value={' = '} maxLength={1} isDisabled />
	<SaisieMath
		on:handleFunctionChanged
		eventName="handleFunctionChanged"
		classes="w-full pl-1 rounded-r-lg"
		value={formula}
		maxLength={999}
		{isDisabled}
	/>
</div>
