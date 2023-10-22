<script lang="ts">
	import Solver from '../../api/solver';
	import MathsExt from '../../extensions/mathsExt';
	import ExpressionElement from '../../models/expression';
	import type Solution from '../../models/solution';
	import SaisieFonction from '../SaisieFonction.svelte';
	import ArrowDown from './assets/arrow_down.png';
	import ArrowUp from './assets/arrow_up.png';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let formula: string = 'x^2 - 4x';

	export let inRangeSolutions: Solution[];
	export let signs: string[] = [];

	export let borneMax: string = '+inf';
	export let borneMin: string = '-inf';
</script>

<div class="h-20 lg:h-52 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieFonction
			on:handleFunctionNameChanged
			on:handleVariableNameChanged
			{functionName}
			{variableName}
		/>
	</section>

	<div class={'w-full flex flex-row text-md lg:text-3xl relative'}>
		<div class="w-full select-none flex justify-center items-center">
			<img
				src={signs[0].replace('|', '') === '+' ? ArrowUp : ArrowDown}
				alt={'Flèche vers le ' + signs[0]}
				class={'w-full transform h-full object-fill ' +
					(signs[0] === signs[1] && signs[2] === signs[1]
						? 'scale-x-[1.5] translate-x-1/4 '
						: signs[0] === signs[1]
						? 'scale-x-100 '
						: '')}
			/>
		</div>

		<!-- Si la borneMin !== -inf, alors on calcul sa solution -->
		{#if borneMin !== '-inf'}
			<div class={'absolute left-0 ' + (signs[0].replace('|', '') === '-' ? 'top-7' : 'bottom-7')}>
				<p class="w-fit bg-white rounded-full px-3 bg-opacity-50 text-xs md:text-xs lg:text-xl">
					{MathsExt.roundNumber(
						Solver.formulaToInt(
							new ExpressionElement(true, false, formula, ''),
							variableName,
							borneMin
						)
					)}
				</p>
			</div>
		{/if}

		{#each inRangeSolutions as _, i}
			<!-- On cache la flèche là si la dernière flèche est du même signe, et que ce n'est pas
                une valeur interdite (flèche continue)-->
			<div
				class={'w-full h-full relative ' +
					(signs[i] === signs[i + 1] && signs[i + 1].includes('|') === false ? 'hidden' : '')}
			>
				<div class="h-full select-none flex justify-center items-center relative">
					<img
						src={signs[i + 1].includes('+') ? ArrowUp : ArrowDown}
						alt={'Flèche vers le ' + signs[i + 1]}
						class={'w-full transform h-full object-fill ' +
							(signs[i + 2] === signs[i + 1] && signs[i + 1] === signs[i + 3]
								? 'scale-x-[1.5]'
								: signs[i + 2] === signs[i + 1]
								? 'scale-x-100 '
								: 'bg-red-500')}
					/>

					<!-- Calcul la valeur de la solution -->
					{#if signs[i + 1].includes('|') === false}
						<div
							class={'absolute left-0 ' +
								(signs[i + 1].replace('|', '') === '-' ? 'top-7' : 'bottom-7')}
						>
							<p
								class="w-fit rounded-full bg-white px-3 bg-opacity-50 -translate-x-1/2 text-xs md:text-xs lg:text-xl"
							>
								{MathsExt.roundNumber(
									Solver.formulaToInt(
										new ExpressionElement(true, false, formula, ''),
										variableName,
										inRangeSolutions[i].value
									)
								)}
							</p>
						</div>
					{/if}

					<!-- Bordure de valeur interdite -->
					{#if signs[i + 1].includes('|')}
						<div class="absolute left-0 w-32 h-full border-l border-black" />
						<div class="absolute -left-1 w-32 h-full border-l border-black" />
					{/if}

					<!-- Si la borneMax !== +inf, alors on calcul sa solution -->
					{#if i === inRangeSolutions.length - 1 && borneMax !== '+inf'}
						<div
							class={'absolute right-0 ' +
								(signs[0].replace('|', '') === '+' ? 'top-7' : 'bottom-7')}
						>
							<p
								class="w-fit bg-white px-3 bg-opacity-50 rounded-full text-xs md:text-xs lg:text-xl"
							>
								{MathsExt.roundNumber(
									Solver.formulaToInt(
										new ExpressionElement(true, false, formula, ''),
										variableName,
										borneMax
									)
								)}
							</p>
						</div>{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
