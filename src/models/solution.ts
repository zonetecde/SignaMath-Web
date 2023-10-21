/**
 * Classe Solution
 * Contient une solution d'une équation sous sa forme latex et
 * sous sa forme 'math'
 */
export default class Solution {
	formula: string;
	latex: string;

	constructor(formula: string, latex: string) {
		this.formula = formula;
		this.latex = latex;
	}
}
