// @ts-ignore
import nerdamer from 'nerdamer/all';

class ExpressionElement {
	public Expression: string;
	public Interdite: boolean;
	public Exposant: string;

	constructor(interdite: boolean, expression: string, exposant: string = '') {
		this.Expression = expression;
		this.Interdite = interdite;
		this.Exposant = exposant;
	}
}

export default class Sheller {
	static ShellFunction(formula: string): ExpressionElement[] {
		formula = formula.replaceAll(' ', '');
		const ner = nerdamer(formula);

		console.log(ner.symbol);
		let numerateurs = '';
		let expressions: ExpressionElement[] = [];

		if (formula.includes('/')) {
			let newFormula = ner.symbol.value;
			console.log(newFormula);

			// get tout les str avec ^(-1) (= dénominateur)
			const regex = /(.+?)\^\(-1\)/g;
			let match;

			while ((match = regex.exec(newFormula)) !== null) {
				// Enlève un multiplicateur en début de la formule
				let expr = match[1];

				console.log(expr);

				if (expr.includes(')(') || expr.includes(')*(')) {
					let el = nerdamer(expr);
					console.log(el.symbol.symbols);
					for (var key in el.symbol.symbols) {
						var value = el.symbol.symbols[key];

						console.log(key);
						expressions.push(new ExpressionElement(true, this.removeMultiplicateur(key), ''));
					}
				} else {
					expressions.push(new ExpressionElement(true, this.removeMultiplicateur(expr), ''));
				}
			}

			// Dans newFormula, on d'abord tout les dénominateurs puis tout les autres
			let lastDenom = newFormula.lastIndexOf('^(-1)');
			if (lastDenom === -1) lastDenom = 0;
			// récupère les numérateurs
			numerateurs = this.removeMultiplicateur(newFormula.slice(lastDenom + '^(-1)'.length));
		} else {
			numerateurs = this.removeMultiplicateur(formula);
		}

		console.log(numerateurs);

		if (numerateurs.includes(')(') || numerateurs.includes(')*(')) {
			let el = nerdamer(numerateurs);
			console.log(el.symbol.symbols);
			for (var key in el.symbol.symbols) {
				var value = el.symbol.symbols[key];

				expressions.push(new ExpressionElement(false, this.removeMultiplicateur(key), ''));
			}
		} else {
			expressions.push(new ExpressionElement(false, this.removeMultiplicateur(numerateurs), ''));
		}

		console.log(expressions);
		return expressions;
	}

	static removeMultiplicateur(expression: string): string {
		if (expression.startsWith('*')) {
			return expression.slice(1);
		} else return expression;
	}
}
