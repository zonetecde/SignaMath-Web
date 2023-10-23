// @ts-ignore
import nerdamer from 'nerdamer/all';
import Solution from '../models/solution';
import type ExpressionElement from '../models/expression';

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
	static solveEquation(equation: string, variable: string, y: number = 0) {
		if (equation.includes(variable) === false) return [];

		// Trouve les solutions de l'équation
		while (equation.startsWith(')')) equation = equation.slice(1);

		try {
			var rawSolutions = nerdamer.solveEquations(equation + ' = ' + y, variable);
		} catch {
			return [];
		}

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

			// Trouve son équivalent en nombre approximatif
			var integer = this.toInteger(element);

			// Creer une nouvelle solution
			const solution = new Solution(element, latex, integer);
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
		return strArray.split(',').filter((str) => !str.includes('i') && str !== '');
	}

	/**
	 * Transforme un calcul string en entier (inclus sqrt et autre)
	 * @param str Un string contenant une formule sans 'x'
	 * @returns Le résultat du calcul
	 */
	static toInteger(str: string) {
		if (str === '-inf') {
			return -Infinity;
		} else if (str === '+inf') {
			return Infinity;
		}

		var formula = nerdamer(str);

		// Donne un résultat sous la forme x/y ou x
		const resultat = formula.evaluate().toString();

		// Transforme le résultat en entier
		if (resultat.includes('/')) {
			const denom = parseInt(resultat.split('/')[1]);
			return parseInt(resultat.split('/')[0]) / (denom === 0 ? 1 : denom);
		} else {
			return parseInt(resultat);
		}
	}

	static getParentheses(expression: string) {
		let ouvert: boolean = false;
		let ouvertIndex: number = 0;
		let offset: number = 0;
		for (let index = 0; index < expression.length; index++) {
			const letter = expression[index];
			switch (letter) {
				case '(':
					if (ouvert) offset += 1;
					else {
						ouvert = true;
						ouvertIndex = index;
					}

					break;
				case ')':
					if (ouvert) {
						if (offset > 0) offset -= 1;
						else return expression.slice(ouvertIndex + 1, index);
					}
			}
		}

		return 'wrong formula';
	}

	/**
	 * Calcul d'une formule avec x
	 * @param formula La formule avec x
	 * @param variable Le nom de la variable
	 * @param variableValue La valeur par laquelle la variable doit être remplacé
	 * @returns Le résultat du calcul
	 */
	static formulaToInt(
		formula: ExpressionElement,
		variable: string,
		variableValue: number | string
	): number {
		try {
			var x = nerdamer(formula.toString()).sub(variable, '(' + variableValue + ')');

			if (x.evaluate().symbol.imaginary === true) {
				// racine carré d'un nombre négatif / ou nombre complexe
				return NaN;
			}
		} catch {
			// division par 0 ?
			if (variableValue.toString() === '0') return NaN;
		}

		if (x === undefined) return NaN;

		return this.toInteger(x.toString());
	}
}
