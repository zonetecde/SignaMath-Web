export default class ExpressionElement {
	public Expression: string;
	public Interdite: boolean | null;

	constructor(isInterdite: boolean | null, expression: string) {
		this.Interdite = isInterdite;
		this.Expression = expression;
	}

	/**
	 * ToString
	 * @returns Retourne la formule avec son exposant
	 */
	toString() {
		return this.Expression.trim();
	}
}

export class ExpressionElement2 {
	public Expression: string;
	public Interdite: boolean | null;
	public Exposant: string | null;
	public IsNumerator: boolean | null;

	constructor(
		isNumerator: boolean | null,
		isInterdite: boolean | null,
		expression: string,
		exposant: string = ''
	) {
		this.Expression = expression;
		this.IsNumerator = isNumerator;
		this.Interdite = isInterdite;
		this.Exposant = exposant;
	}

	/**
	 * ToString
	 * @returns Retourne la formule avec son exposant
	 */
	toString() {
		return this.Expression.trim() + (this.Exposant !== '' ? '^(' + this.Exposant + ')' : '');
	}
}
