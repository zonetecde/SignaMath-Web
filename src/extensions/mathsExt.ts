import * as math from 'mathjs';
import nerdamer from 'nerdamer';

export default class MathsExt {
	static toTex(formuleTableau: string): string | undefined {
		console.log(formuleTableau);
		return math.parse(formuleTableau).toTex();
	}

	static Deriver(formula: string, variableName: string): string {
		const derive = math
			.derivative(formula, variableName, { simplify: !formula.includes('/') })
			.toString();

		console.log(derive);

		// on ne développe que le numérateur
		if (derive.count('/') === 1) {
			const num = derive.split('/')[0];
			return '(' + nerdamer('simplify(' + num + ')').toString() + ')/' + derive.split('/')[1];
		} else {
			return derive;
		}
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
