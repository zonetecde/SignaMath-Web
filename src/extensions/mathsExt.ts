import * as math from 'mathjs';
import nerdamer from 'nerdamer';
import { toast } from 'svelte-sonner';

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
		try {
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
			let derive = math
				.derivative(math.parse(formula).toString(), variableName, {
					simplify: !formula.includes('/')
				})
				.toString();

			// Si on a une fraction (une seul, sinon la fonction est considéré trop grande)
			// Alors on simplifie uniquement le numérateur
			if (derive.count('/') === 1) {
				// Récupère le numérateur
				let num = derive.split('/')[0].replaceAll(' ', '');
				let croppedNum = '';

				// entre ... )" / et la prenthèse ouvrante si le numérateur est entre parenthèses
				// récupère ici le numérateur à l'aide des parenthèses qui l'englobe
				if (num[num.length - 1] === ')') {
					let offset = 0;
					for (let i = num.length - 1; i >= 0; i--) {
						const element = num[i];
						if (element === ')') offset++;
						else if (offset === 1 && element === '(') {
							croppedNum = num.substring(i, num.length);
							break;
						} else if (element === '(') offset--;
					}
				}

				const denominateur = derive.split('/')[1];

				let num_simplifier: string = croppedNum;
				try {
					num_simplifier = nerdamer('simplify(' + croppedNum + ')').toString();
				} catch {}
				derive = `(${num.replace(croppedNum, num_simplifier)})/${denominateur}`;
			}

			// Enlève les multiplications par 1 inutiles
			derive = derive.replaceAll('*1', '').replaceAll('* 1', '');

			return derive;
		} catch {
			toast.error('Erreur lors de la dérivation votre fonction.');

			return formula;
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
