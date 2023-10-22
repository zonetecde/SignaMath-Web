import * as math from 'mathjs';

export default class MathsExt {
	static Deriver(formula: string, variableName: string): string {
		return math.derivative(formula, variableName).toString();
	}
	static roundNumber(num: number) {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	}

	static Simplifier(formula: string): string {
		try {
			return math.simplify(formula).toString();
		} catch {
			return formula;
		}
	}
}
