import { json } from '@sveltejs/kit';
import ExpressionElement, { ExpressionElement2 } from '../models/expression';
import * as math from 'mathjs';

export default class Sheller {
	static Sheller(formula: string): ExpressionElement[] {
		formula = formula.replaceAll(' * 1', ''); // Remplace les multiplications par 1 inutile

		// Transforme la formule en 'node' de mathjs
		const node = math.parse(formula);

		// Si la formule ne contient pas de fraction, on va utiliser
		// alors l'ancienne méthode de shell.
		if (formula.includes('/') === false) {
			const expressions_oldMethod = this.ShellFunction(formula);
			var expressions: ExpressionElement[] = [];

			// Convertie l'objet ExpressionElement2 en ExpressionElement
			expressions_oldMethod.forEach((element) => {
				expressions.push(new ExpressionElement(false, element.toString()));
			});

			return expressions;
		} else if (formula.count('/') >= 2 && formula.length > 40) {
			// Si la formule est beaucoup trop grande, on ne la split pas, on retourne que le gros bloc
			return [new ExpressionElement(false, formula)];
		}

		// Sinon, pour toutes les autres formules du type x/y
		const nodes = this.DoNodeThing(node);

		var expressions: ExpressionElement[] = [];

		nodes.forEach((node) => {
			// Prend uniquement les nodes qui ne sont pas des arrays (les autres étant des sous-parties d'expression)
			// = les "expressions principales" (donc dans x/y c'est le x puis le y)
			if (node.Expression) {
				// utliise l'ancienne méthode pour split l'expression principal
				const elts: ExpressionElement2[] = this.ShellFunction(node.Expression);

				// Si l'expression est dénominateur dans x/y alors tout les éléments ici sont au dénominateur aussi (= on est sur y)
				if (node.Interdite) {
					elts.forEach((x) => {
						x.Interdite = true;
					});
				}

				elts.forEach((elt) => {
					// Prevent des bugs dans les expressions
					if (elt.Expression.count(')') === elt.Expression.count('(')) {
						if (elt.Expression.startsWith('/')) {
							expressions.push(new ExpressionElement(true, elt.toString().slice(1)));
						} else if (elt.Expression.startsWith('*') || elt.Expression.startsWith('^')) {
							expressions.push(new ExpressionElement(elt.Interdite, elt.toString().slice(1)));
						} else {
							expressions.push(new ExpressionElement(elt.Interdite, elt.toString()));
						}
					}
				});
			}
		});

		return expressions;
	}

	/**
	 * Récupère x et y d'une formule du type x/y
	 * @param node Le node de la formule mathématiques entière
	 * @param forbidden Pour la récursive
	 * @returns Les expressions x et y (et autres sous-élément)
	 */
	static DoNodeThing(node: any, forbidden = false): ExpressionElement[] {
		if (math.typeOf(node) === 'OperatorNode' && node.op === '/') {
			const numeratorElements: ExpressionElement[] = this.DoNodeThing(node.args[0], forbidden);

			// tout les dénomateurs sont des valeurs interdites donc true
			const denominatorElements: ExpressionElement[] = this.DoNodeThing(node.args[1], true);
			return numeratorElements.concat(denominatorElements);
		} else if (math.typeOf(node) === 'ParenthesisNode') {
			return this.DoNodeThing(node.content, forbidden);
		} else if (
			math.typeOf(node) === 'OperatorNode' &&
			(node.op === '*' || node.op === '+' || node.op === '^' || node.op === '-')
		) {
			const argsElements: ExpressionElement[] = node.args.map((arg: any) =>
				this.DoNodeThing(arg, forbidden)
			);
			return [{ Expression: node.toString(), Interdite: forbidden }, ...argsElements];
		} else if (math.typeOf(node) === 'ConstantNode') {
			return [{ Expression: node.toString(), Interdite: forbidden }];
		} else if (math.typeOf(node) === 'SymbolNode') {
			return [{ Expression: node.name, Interdite: forbidden }];
		}

		return [];
	}

	static ShellFunction(formula: string): ExpressionElement2[] {
		// Enlève les espaces et les signes de multiplication entre deux expressions
		formula = formula.replaceAll(' ', '').replaceAll(')*(', ')(');

		//let expressions = this.DecouperExpression(formula);
		let lignes = this.DecouperExpression(formula);

		let expressions: ExpressionElement2[] = [];
		if (lignes.length > 0) {
			for (let i = 0; i < lignes.length; i++) {
				if (lignes[i].Exposant === '') {
					let expression = lignes[i].Expression;

					expression = this.SupprimerParentheses(expression);

					let nouvellesExpressions: ExpressionElement2[] = [];
					let decoupe = this.DecouperExpression(expression);
					nouvellesExpressions.push(...decoupe);

					nouvellesExpressions.forEach((ligne) => {
						expressions.push(
							new ExpressionElement2(
								null,
								lignes[i].Expression.includes('/'),
								ligne.Expression.replaceAll('/', '').replaceAll('*', '')
							)
						);
					});
				} else {
					// s'il y a un exposant on ne shell pas l'expression; on garde l'expression
					// total avec l'exposant
					expressions.push(lignes[i]);
				}
			}
		}

		for (let i = 0; i < expressions.length; i++) {
			const expression = expressions[i].Expression.slice(1);

			let decoupe = this.DecouperExpression(expression, true);
			if (decoupe.length > 1) {
				expressions.splice(i, 1);
				expressions.push(
					...decoupe.map((x) => new ExpressionElement2(null, false, x.Expression, ''))
				);
				i = 0;
			}
		}

		// enlève les lignes vides
		expressions = expressions.filter((x) => x.Expression !== '');
		// enlève les '+' inutiles
		expressions.map((x) => {
			if (x.Expression.startsWith('+')) x.Expression = x.Expression.slice(1);
		});

		return expressions;
	}
	static DecouperExpression(
		nouvelleFonction: string,
		estDeuxieme: boolean = false
	): ExpressionElement2[] {
		if (estDeuxieme) {
			nouvelleFonction = this.SupprimerParentheses(nouvelleFonction);
		}

		let lignes: ExpressionElement2[] = [];
		let compteurParenthesesOuvertes = 0;
		let indexDebutLigne = 0;

		for (let i = 0; i < nouvelleFonction.length; i++) {
			if (nouvelleFonction[i] === '(') {
				compteurParenthesesOuvertes += 1;
			} else if (nouvelleFonction[i] === ')') {
				compteurParenthesesOuvertes -= 1;

				if (compteurParenthesesOuvertes === 0 || i == nouvelleFonction.length - 1) {
					let exposant: string = '';
					if (nouvelleFonction.length > i + 1) {
						if (nouvelleFonction[i + 1] === '^') {
							// Il y a un exposant à l'expression, on la garde en entière
							// si l'exposant est un chiffre (ex : ^2)
							if (nouvelleFonction[i + 2] !== '(') {
								exposant += nouvelleFonction[i + 2];
							} else {
								// l'exposant est une expression entre parenthèses
								let endExp = false;
								let z = i + 3; // index dans la parenthèse
								let tempOuverte = 0;

								while (endExp === false) {
									exposant += nouvelleFonction[z];
									if (nouvelleFonction[z + 1] === '(') {
										tempOuverte += 1;
									} else if (nouvelleFonction[z + 1] === ')' && tempOuverte > 0) {
										tempOuverte -= 1;
									} else if (nouvelleFonction[z + 1] === ')') {
										// fin de l'exposant
										endExp = true;
									}

									z += 1;
								}
							}
						}
					}

					let expression = new ExpressionElement2(
						true,
						false,
						nouvelleFonction.substring(indexDebutLigne, i + 1),
						exposant
					);

					// enlève l'exposant de la formule s'il y en a une
					if (expression.Exposant !== '') {
						i -= ('^' + expression.Exposant).length;
						nouvelleFonction = nouvelleFonction.replace('^' + expression.Exposant, '');
					}

					lignes.push(expression);
					indexDebutLigne = i + 1;
				}
			} else if (nouvelleFonction[i] === '/' && compteurParenthesesOuvertes === 0) {
				let ligneInterdite = nouvelleFonction.substring(indexDebutLigne, i).trim();
				let expression = new ExpressionElement2(true, true, ligneInterdite, '');
				lignes.push(expression);
				indexDebutLigne = i;
			}
		}

		if (indexDebutLigne < nouvelleFonction.length) {
			let derniereLigne = nouvelleFonction.substring(indexDebutLigne).trim();
			let expression = new ExpressionElement2(true, false, derniereLigne, '');
			lignes.push(expression);
		}

		// enlève les exposants seul et les formules invalides
		lignes = lignes.filter((element) => {
			return !(
				element.Expression.startsWith('^') &&
				element.Expression === '' &&
				element.Expression.count('(') !== element.Expression.count(')')
			);
		});

		return lignes;
	}

	static SupprimerParentheses(expression: string): string {
		if (expression.startsWith('/(') || expression.startsWith('*(')) {
			expression = expression.replaceAll('/(', '').replaceAll('*(', '');
			expression = expression.slice(0, -1);
		} else if (expression.startsWith('(')) {
			expression = expression.slice(1).slice(0, -1);
		}

		return expression;
	}

	static removeMultiplicateur(expression: string): string {
		if (expression.startsWith('*')) {
			return expression.slice(1);
		} else return expression;
	}
}

declare global {
	interface String {
		count(c: string): number;
	}
}

String.prototype.count = function (c: string): number {
	let result = 0;
	for (let i = 0; i < this.length; i++) {
		if (this[i] === c) {
			result++;
		}
	}

	return result;
};
