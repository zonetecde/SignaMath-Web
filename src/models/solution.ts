/**
 * Classe Solution
 * Contient une solution d'une équation sous sa forme latex et
 * sous sa forme 'math'
 */
export default class Solution {
	value: string;
	latex: string;
	integer: number;
	associatedEquations: string[];
	isForbidden: boolean = false;

	constructor(formula: string, latex: string, integer: number) {
		this.value = formula;
		this.latex = latex;
		this.integer = integer;
		this.associatedEquations = [];
	}
}
