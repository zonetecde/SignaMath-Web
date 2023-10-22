// @ts-ignore
import nerdamer from 'nerdamer/all';
import ExpressionElement from '../models/expression';

export default class Sheller {
	static ShellFunction(formula: string): ExpressionElement[] {
		// Enlève les espaces et les signes de multiplication entre deux expressions
		formula = formula.replaceAll(' ', '').replaceAll(')*(', ')(');

		//let expressions = this.DecouperExpression(formula);
		let lignes = this.DecouperExpression(formula);

		let expressions: ExpressionElement[] = [];
		if (lignes.length > 0) {
			for (let i = 0; i < lignes.length; i++) {
				if (lignes[i].Exposant === '') {
					let expression = lignes[i].Expression;

					expression = this.SupprimerParentheses(expression);

					let nouvellesExpressions: ExpressionElement[] = [];
					let decoupe = this.DecouperExpression(expression);
					nouvellesExpressions.push(...decoupe);

					nouvellesExpressions.forEach((ligne) => {
						expressions.push(
							new ExpressionElement(
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
					...decoupe.map(
						(x) => new ExpressionElement(null, expressions[i].Interdite, x.Expression, '')
					)
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
	): ExpressionElement[] {
		if (estDeuxieme) {
			nouvelleFonction = this.SupprimerParentheses(nouvelleFonction);
		}

		let lignes: ExpressionElement[] = [];
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

					let expression = new ExpressionElement(
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
				let expression = new ExpressionElement(true, true, ligneInterdite, '');
				lignes.push(expression);
				indexDebutLigne = i;
			}
		}

		if (indexDebutLigne < nouvelleFonction.length) {
			let derniereLigne = nouvelleFonction.substring(indexDebutLigne).trim();
			let expression = new ExpressionElement(true, false, derniereLigne, '');
			lignes.push(expression);
		}

		console.log(lignes);

		// enlève les exposants seul et les formules invalides
		lignes = lignes.filter((element) => {
			return !(
				element.Expression.startsWith('^') &&
				element.Expression === '' &&
				element.Expression.count('(') !== element.Expression.count(')')
			);
		});

		console.log(lignes);

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
