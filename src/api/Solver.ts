// @ts-ignore
import nerdamer from 'nerdamer/all';
import Solution from '../models/solution';

/**
 * Classe Solver
 * Contient des utilities pour résoudre des équations avec nerdamer
 */
export default class Solver {
	/**
	 * Donne les solutions d'une équation
	 * @param equation <str> L'équation à résoudre (= 0)
	 * @param variable <str> La variable à trouver dans l'équation
	 * @returns <Solution[]> Les solutions de l'équation
	 */
	static solveEquation(equation: string, variable: string) {
		// Trouve les solutions de l'équation
		var rawSolutions = nerdamer(`solve(${equation}, ${variable})`);

		// Transforme les solutions en array
		const solutionsArray = this.stringToArray(rawSolutions.toString());

		// Transformme les solutions en objet avec leur formule latex
		const solutions = this.solutionsStrToSolutionObj(solutionsArray);

		return solutions;
	}

	/**
	 * Convertie un array de solutions en objet Solution
	 * @param solutionsStr L'array de string contenant des solutions
	 * @returns L'array d'objet Solution contenant les solutions
	 */
	static solutionsStrToSolutionObj(solutionsStr: string[]) {
		var solutionArray = [];

		// Pour chaque solution dans l'array
		for (var i = 0; i < solutionsStr.length; i++) {
			const element = solutionsStr[i];

			// Trouve son équivalent latex
			var latex = nerdamer.convertToLaTeX(element);

			// Creer une nouvelle solution
			const solution = new Solution(element, latex);
			solutionArray.push(solution);
		}

		return solutionArray;
	}

	/**
	 * Convertie un string de solutions en array
	 * @param strArray  Un string contenant des solutions
	 * sous le format [sqrt(5)-4, 22.6/3]
	 * @returns Un array de string contenant les solutions
	 */
	static stringToArray(strArray: string) {
		// Enlève les []
		strArray = strArray.slice(1).slice(0, -1);
		// Créé un tableau contenant les solutions
		return strArray.split(',');
	}
}
