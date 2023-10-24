import * as math from 'mathjs';
import nerdamer from 'nerdamer';

export default class MathsExt {
	/**
	 * Transforme une formule mathématiques (str) en formule LaTex
	 * @param formula
	 * @returns L'équivalent Latex de la formule
	 */
	static toTex(formula: string): string {
		return math.parse(formula).toTex();
	}

	/**
	 * Permet de savoir si un str est un nombre
	 * @param str Le str à analyser
	 * @returns Est-ce que le str est un nbre ?
	 */
	static isNumeric(str: string) {
		return /^\d+$/.test(str);
	}

	/**
	 * Dérive est simplifie une expression mathématiques
	 * @param formula La formule à dériver
	 * @param variableName Le nom de la variable dans la formule
	 * @returns La dérivée
	 */
	static Deriver(formula: string, variableName: string): string {
		// Si on a un x comme ceci : x4 xYYYY ou Y un integer
		// Alors on doit inverser YYYYY avec x
		let previousIsX: boolean = false;
		for (let i = 0; i < formula.length; i++) {
			const element = formula[i];
			if (previousIsX && this.isNumeric(element)) {
				// on est dans le cadre de xY
				let z = i + 1;
				let integer = formula[i];
				while (this.isNumeric(formula[z])) {
					integer += formula[z];
					z++;
				}
				// on inverse YYYYY et x
				formula = formula.replace(variableName + integer, integer + variableName);
				previousIsX = false;
			}

			if (element === variableName) {
				previousIsX = true;
			}
		}

		// Calcul la dérivée
		// Si c'est une fonction normal (= sans fraction) on la simplifie
		// Sinon on ne la simplifie pas car elle simplifiera aussi le dénominateur :
		// on la simplifiera nous même après
		const derive = math
			.derivative(math.parse(formula).toString(), variableName, {
				simplify: !formula.includes('/')
			})
			.toString();

		// Si on a une fraction (une seul, sinon la fonction est considéré trop grande)
		// Alors on simplifie uniquement le numérateur
		if (derive.count('/') === 1) {
			// Récupère le numérateur
			const num = derive.split('/')[0];
			const denominateur = derive.split('/')[1];
			let num_simplifier: string = num;
			try {
				num_simplifier = nerdamer('simplify(' + num + ')').toString();
			} catch {}
			return `(${num_simplifier})/${denominateur}`;
		} else {
			return derive;
		}
	}

	/**
	 * Arrondi un nombre
	 * @param num Le nombre à arrondir
	 * @returns Le nombre arrondi
	 */
	static roundNumber(num: number) {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	}

	/**
	 * Simplifie une formule mathématiques
	 * @param formula La formule à simplifier
	 * @returns La formule simplifiée
	 */
	static Simplifier(formula: string): string {
		try {
			return math.simplify(formula).toString();
		} catch {
			return formula;
		}
	}
}
