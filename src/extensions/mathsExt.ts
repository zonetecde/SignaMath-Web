// @ts-ignore
import nerdamer from 'nerdamer/all';
import * as math from 'mathjs';

export default class MathsExt {
	static Deriver(formula: string, variableName: string): any {
		const deriver = nerdamer(
			'simplify(' + nerdamer('diff(' + formula + ', ' + variableName + ')').toString() + ')'
		).toString();

		return [deriver, nerdamer.convertToLaTeX(deriver)];
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
