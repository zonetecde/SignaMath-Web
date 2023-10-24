import { json } from '@sveltejs/kit';
import ExpressionElement, { ExpressionElement2 } from '../models/expression';
import * as math from 'mathjs';

export default class Sheller {
	static Sheller(formula: string): ExpressionElement[] {
		const node = math.parse(formula);

		if (formula.includes('/') === false) {
			console.log('test');
			const oldMethod = this.ShellFunction(formula);
			var expressions: ExpressionElement[] = [];
			oldMethod.forEach((element) => {
				expressions.push(new ExpressionElement(false, element.toString()));
			});
			return expressions;
		} else if (formula.count('/') >= 2 && formula.length > 40) {
			// trop gros: une seul colonne
			return [new ExpressionElement(false, formula)];
		}

		console.log(formula);
		const nodes = this.DoNodeThing(node);

		console.log(nodes);
		var expressions: ExpressionElement[] = [];

		nodes.forEach((node) => {
			// Prend uniquement les nodes qui ne sont pas des arrays
			// = les expressions principales
			if (node.Expression) {
				console.log(node);

				// utliise l'ancienne méthode
				const elts: ExpressionElement2[] = this.ShellFunction(node.Expression);
				if (node.Interdite) {
					elts.forEach((x) => {
						x.Interdite = true;
					});
				}

				elts.forEach((elt) => {
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

		console.log(expressions);
		return expressions;
	}

	static DoNodeThing(node: any, forbidden = false): ExpressionElement[] {
		console.log(node);
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
			console.log(node);
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
				console.log(expressions);
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

		// return [
		// 	new ExpressionElement(false, false, '2x^2-4x+2', ''),
		// 	new ExpressionElement(false, true, '3x+4', '')
		// ];

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
