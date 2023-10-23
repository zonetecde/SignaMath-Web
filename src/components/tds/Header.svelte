<script lang="ts">
	import Katex from 'svelte-katex';
	import type Solution from '../../models/solution';
	import SaisieMath from '../saisie/SaisieMath.svelte';

	export let inRangeSolutions: Solution[];
	export let variableName: string = 'x';
	export let borneMax: string = '+inf';
	export let borneMin: string = '-inf';
</script>

<div class="h-fit min-h-[54px] w-full bg-white border border-black flex flex-row">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-auto border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieMath
			value={variableName}
			maxLength={1}
			placeholder="x"
			eventName="handleVariableNameChanged"
			on:handleVariableNameChanged
			classes="text-center "
		/>
	</section>

	<!-- Endroit où la formule s'annule en 0 -->
	<div class="w-full text-md lg:text-lg flex flex-row relative items-center">
		<div class="w-full select-none" />

		{#each inRangeSolutions as solution, i (i)}
			<!-- Conteneur de la solution qui prend toute sa width -->
			<div class={'select-none w-full'}>
				<!-- Conteneur de l'afficheur de la solution qui prend que la width dont il a besoin -->
				<div class="w-fit transform -translate-x-1/2 text-xs md:text-xs lg:text-lg py-3">
					<Katex>{solution.latex}</Katex>
				</div>
			</div>
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
