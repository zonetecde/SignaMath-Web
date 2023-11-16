<script lang="ts">
	import { onMount } from 'svelte';
	import Sheller from '../../api/sheller';
	import Solver from '../../api/solver';
	import MathsExt from '../../extensions/mathsExt';
	import Choix from '../../models/choix';
	import ExpressionElement from '../../models/expression';
	import type Solution from '../../models/solution';
	import FunctionRow from './FunctionRow.svelte';
	import Header from './Header.svelte';
	import Row from './row/Row.svelte';
	import Variation from './tdv/Variation.svelte';
	import ConvexiteRow from './ConvexiteRow.svelte';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let formula: string = 'x^2 - 4x';
	$: {
		// Lorsque la formule change on reprend les signes selon la formule
		// et non selon les rows
		formulaBase;
		updateGlobalSigns = 0;
	}

	export let borneMin: string = '-inf';
	export let borneMax: string = '+inf';

	// La formule de base écrite par l'utilisateur,
	// qui est différente de celle dérivée
	export let formulaBase: string = 'x^2 - 4x';

	// Permet d'afficher ce que l'utilisateur veut
	export let choix: Choix = Choix.Variation;

	// Hook pour recalculer les signes d'une colonne après qu'une expression a été changé
	let updateGlobalSigns: number = 0;

	// Shell la fonction et la décompose en plusieurs parties à chaque fois que la formule est modifié
	$: lignes = Sheller.Sheller(formula);

	// Hook pour cacher les boutons "ajouter une row"
	let newLineHasBeenAdded: number = 0;
	$: {
		lignes;
		newLineHasBeenAdded += 1;
	}

	let solutions: Solution[] = [];

	// Calcul des solutions
	$: {
		// Hook si l'utilisateur change une expression dans le tableau
		// ou si une nouvelle formule est entrée par le user
		formula;
		updateGlobalSigns;

		solutions = [];

		lignes.forEach((line) => {
			let lineSolutions = Solver.solveEquation(line.toString(), variableName);

			// Ajoute les solutions qui n'ont pas déjà été ajoutées
			lineSolutions.forEach((solution) => {
				if (solutions.some((s) => s.value === solution.value) === false) {
					solution.isForbidden = line.Interdite ?? false;

					solution.associatedEquations.push(line.toString());
					solutions.push(solution);
				} else {
					// Il existe déjà: on ajoute la formule qui a aussi sa solution associé
					const existingSolution = solutions.find((s) => s.value === solution.value)!;
					existingSolution.isForbidden = existingSolution.isForbidden || (line.Interdite ?? false);

					// Vérifie quand même que la solution associé n'existe pas déjà non plus
					if (existingSolution.associatedEquations.some((s) => s === line.toString()) === false) {
						existingSolution.associatedEquations.push(line.toString());
					}
				}
			});
		});

		// Order les solutions par valeur (ordre croissat)
		solutions.sort((a, b) => {
			return a.integer - b.integer;
		});
	}

	// Prend uniquement les solutions dans l'intervalle demandé
	let inRangeSolutions: Solution[] = [];
	$: {
		solutions;
		inRangeSolutions = solutions.filter((solution) => {
			return (
				solution.integer > Solver.toInteger(borneMin) &&
				solution.integer < Solver.toInteger(borneMax)
			);
		});

		// Update les signes car les solutions ont changé
		// (ajouté pour bypass le bug de -4x et 4x (-4 et 4) le signe ne changeait pas)
		setTimeout(() => {
			updateColumnSigns();
		});
	}

	$: {
		choix;
		// empty signs at first
		signs = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
		// calcul seulement après que l'ui s'update les signes des colonnes
		setTimeout(() => {
			updateColumnSigns();
		});
	}

	// Tableau contenant le signe final de la fonction
	let signs: string[] = ['-', '+'];
	let websiteMounted = false;
	onMount(() => {
		websiteMounted = true;
	});
	function updateColumnSigns() {
		// Recalcul les solutions grâce à ce hook
		signs = [];

		if (websiteMounted) {
			// Pour chaque colonne du tableau
			for (let i = 0; i < inRangeSolutions.length + 1; i++) {
				const selecteur = '.column-' + i;

				// Récupère toutes les divs dans la colonne
				let signsDiv = document.querySelectorAll(selecteur);

				// Calcul du signe
				let sign = 1;

				Array.from(signsDiv).forEach((signDiv) => {
					sign *= signDiv.innerHTML.trim() === '+' ? 1 : -1;
				});

				// Ajout du signe
				signs.push(sign === 1 ? '+' : '-');
			}
		}
	}

	/**
	 * Ajoute une nouvelle row dans le tableau
	 * @param e L'index de la row
	 */
	function createNewRow(e: any): void {
		const rowIndex = e.detail.index;
		const item = new ExpressionElement(e.detail.isForbidden, variableName);
		lignes.splice(rowIndex, 0, item);

		lignes = lignes; // trigger le {#each} et le calcul des solutions

		// bring le focus dans l'input de la nouvelle row
	}

	/**
	 * Supprime une ligne
	 * @param e.detail L'index de la ligne à supprimer
	 */
	function deleteLine(e: CustomEvent<any>): void {
		// On ne peut pas supprimer toutes les lignes
		const rowIndex = e.detail;
		lignes.splice(rowIndex, 1);
		lignes = lignes; // trigger le {#each} et le calcul des solutions

		// On ne peut pas avoir un tableau vide, donc ajoute une ligne
		// uniquement fait d'un 'x'
		if (lignes.length === 0) {
			createNewRow({ detail: { index: 0 } });
		}
	}

	let isBorneMinForbidden: boolean = false;
	let isBorneMaxForbidden: boolean = false;

	$: {
		isBorneMinForbidden = solutions.some((x) => x.value === borneMin);
		isBorneMaxForbidden = solutions.some((x) => x.value === borneMax);
	}
</script>

<div class="w-full h-full flex items-center justify-center flex-col">
	<div class="w-11/12 md:w-10/12" id="tableau-de-signe">
		<Header
			{variableName}
			{borneMax}
			{borneMin}
			{inRangeSolutions}
			on:handleVariableNameChanged
			on:handleBorneMaxChanged
			on:handleBorneMinChanged
		/>

		{#each lignes as line, index}
			<Row
				{index}
				expression={line}
				{inRangeSolutions}
				{variableName}
				on:updateColumnsSigns={updateColumnSigns}
				on:createNewRow={createNewRow}
				{newLineHasBeenAdded}
				on:expressionChanged={() => {
					updateGlobalSigns += 1; // hook permettant de recalculer les solutions
				}}
				on:deleteLine={deleteLine}
			/>
		{/each}

		<FunctionRow
			{isBorneMinForbidden}
			{isBorneMaxForbidden}
			{inRangeSolutions}
			{functionName}
			{signs}
			{variableName}
			{choix}
			on:handleFunctionNameChanged
			on:handleVariableNameChanged
		/>

		{#if choix === Choix.Convexite}
			<ConvexiteRow
				{isBorneMaxForbidden}
				{isBorneMinForbidden}
				{inRangeSolutions}
				{functionName}
				{signs}
				on:handleFunctionNameChanged
				on:handleVariableNameChanged
			/>
		{/if}

		{#if choix === Choix.Variation}
			<Variation
				{isBorneMinForbidden}
				{isBorneMaxForbidden}
				{inRangeSolutions}
				{functionName}
				{signs}
				{variableName}
				{borneMax}
				{borneMin}
				formula={formulaBase}
				on:handleFunctionNameChanged
				on:handleVariableNameChanged
			/>
		{/if}
	</div>
</div>
