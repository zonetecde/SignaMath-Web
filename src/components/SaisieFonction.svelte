<script>
	import SaisieMath from './SaisieMath.svelte';
</script>

<div class="mt-3 flex flex-row items-center rounded-lg bg-white">
	<SaisieMath
		on:handleFunctionNameChanged
		eventName="handleFunctionNameChanged"
		classes="text-center w-10 text-right pl-2 rounded-l-lg"
		value={'f'}
		maxLength={3}
	/>
	<SaisieMath classes="w-3 pl-1" value={'('} maxLength={1} isDisabled />
	<SaisieMath
		on:handleVariableNameChanged
		eventName="handleVariableNameChanged"
		classes="w-4 pl-0.5"
		value={'x'}
		maxLength={1}
	/>
	<SaisieMath classes="w-7 " value={') = '} maxLength={1} isDisabled />
	<SaisieMath
		on:handleFunctionChanged
		eventName="handleFunctionChanged"
		classes="w-full pl-1 rounded-r-lg"
		value={'x^2 - 4x'}
		maxLength={999}
	/>
</div>
