<script lang="ts">
	import SaisieMath from './SaisieMath.svelte';

	function handleFunctionNameChanged(e: CustomEvent<any>): void {}

	function handleVariableNameChanged(e: CustomEvent<any>): void {}

	function handleFunctionChanged(e: CustomEvent<any>): void {}
</script>

<div class="md:w-2/12 md:min-w-[200px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
	<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>

	<div class="mt-3 flex flex-row items-center rounded-lg bg-white">
		<SaisieMath
			on:valueChanged={handleFunctionNameChanged}
			classes="text-center w-10 text-right pl-2 rounded-l-lg"
			value={'f'}
			maxLength={3}
		/>
		<SaisieMath classes="w-3 pl-1" value={'('} maxLength={1} isDisabled />
		<SaisieMath
			on:valueChanged={handleVariableNameChanged}
			classes="w-4 pl-0.5"
			value={'x'}
			maxLength={1}
		/>
		<SaisieMath classes="w-7 " value={') = '} maxLength={1} isDisabled />
		<SaisieMath
			on:valueChanged={handleFunctionChanged}
			classes="w-full pl-1 rounded-r-lg"
			value={'x^2 - 4x'}
			maxLength={999}
		/>
	</div>
</div>
