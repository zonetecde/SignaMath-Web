<script lang="ts">
	import Katex from 'svelte-katex';
	import type Solution from '../../models/solution';
	import SaisieMath from '../SaisieMath.svelte';

	export let inRangeSolutions: Solution[];
	export let variableName: string = 'x';
	export let borneMax: string = '+inf';
	export let borneMin: string = '-inf';
</script>

<div class="h-12 lg:h-16 w-full bg-white border border-black flex flex-row">
	<!-- Nom de la variable -->
	<section
		class="w-1/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-2xl"
	>
		<SaisieMath
			value={variableName}
			maxLength={1}
			placeholder="x"
			eventName="handleVariableNameChanged"
			on:handleVariableNameChanged
			classes="text-center"
		/>
	</section>

	<!-- Endroit où la formule s'annule en 0 -->
	<div class="w-full flex items-center justify-evenly relative text-md lg:text-xl">
		{#each inRangeSolutions as solution}
			<div class="select-none"><Katex>{solution.latex}</Katex></div>
		{/each}

		<!-- Borne min & max -->
		<section class="absolute left-3">
			<SaisieMath
				value={borneMin}
				maxLength={999}
				placeholder="-inf"
				eventName="handleBorneMinChanged"
				classes="text-left pt-2"
				on:handleBorneMinChanged
			/>
		</section>
		<section class="absolute right-3">
			<SaisieMath
				value={borneMax}
				maxLength={999}
				placeholder="+inf"
				eventName="handleBorneMaxChanged"
				classes="text-right pt-2"
				on:handleBorneMaxChanged
			/>
		</section>
	</div>
</div>
