<script lang="ts">
	import SaisieMath from './SaisieMath.svelte';

	export let functionName: string = 'f';
	export let variableName: string = 'x';

	export let isDisabled: boolean = false;
</script>

<SaisieMath
	on:handleFunctionNameChanged
	eventName="handleFunctionNameChanged"
	classes="text-center text-right pl-2 rounded-l-lg"
	classesInput="w-10"
	value={functionName}
	maxLength={3}
	{isDisabled}
	onlyAllowLetter
/>
<SaisieMath classes="pl-1" classesInput="w-3" value={'('} maxLength={1} isDisabled />
<SaisieMath
	on:handleVariableNameChanged
	eventName="handleVariableNameChanged"
	classes="pl-0.5"
	classesInput="w-4"
	value={variableName}
	forbidden={['e', 'i']}
	maxLength={1}
	{isDisabled}
	onlyAllowLetter
/>

<SaisieMath classesInput="w-7" classes="pr-1" value={')'} maxLength={1} isDisabled />
