import * as math from 'mathjs';

export default class MathsExt {
	static Deriver(formula: string, variableName: string): string {
		return math.derivative(formula, variableName).toString();
	}
	static roundNumber(num: number) {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	}
}
