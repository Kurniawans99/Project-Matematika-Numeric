/** 
  Merupakan fungsi untuk menghitung nilai Polinom Interpolasi Lagrange di x tertentu.
  @param {number} x - Titik evaluasi.
  @param {Array<{x:number,y:number}>} points - Array titik (x_i, y_i), x_i harus unik.
  @returns {number} Nilai P(x) hasil interpolasi.
*/
export function evaluateLagrangePolynomial(x, points) {
  if (!points || points.length === 0) return NaN;

  let result = 0;
  for (let i = 0; i < points.length; i++) {
    let term = points[i].y;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        if (points[i].x === points[j].x) {
          console.error(
            `Error: Titik x harus unik (x_${i} = x_${j} = ${points[i].x}).`
          );
          return NaN;
        }
        term = (term * (x - points[j].x)) / (points[i].x - points[j].x);
      }
    }
    result += term;
  }
  return result;
}

/**
 * Menghasilkan string LaTeX untuk rumus Polinom Interpolasi Lagrange.
 * @param {Array<Object>} points - Array objek titik, masing-masing dengan properti x dan y.
 * @returns {string} String LaTeX dari rumus P(x).
 */
export const generateLagrangeFormulaTex = (points) => {
  if (!points || points.length === 0) {
    return ""; // Tidak ada rumus jika tidak ada poin
  }

  let P_x_formula_string = "P(x) = ";

  const termsArray = points
    .map((pt_i, index_i) => {
      if (
        Math.abs(pt_i.y) === 0 &&
        points.length > 1 &&
        points.some((p) => Math.abs(p.y) !== 0)
      ) {
        return null;
      }

      let current_term_latex = `${pt_i.y}`;

      const basisFactors = points
        .filter((_, index_j) => index_i !== index_j)
        .map((pt_j) => {
          if (pt_i.x === pt_j.x) {
            return `\\text{(Error: x_i tidak boleh sama dengan x_j pada x=${pt_i.x})}`;
          }
          return `\\frac{(x - ${pt_j.x})}{(${pt_i.x} - ${pt_j.x})}`;
        });

      if (basisFactors.length > 0) {
        current_term_latex += ` \\cdot ${basisFactors.join(" \\cdot ")}`;
      }
      return current_term_latex;
    })
    .filter((term) => term !== null);

  if (termsArray.length === 0) {
    if (points.length > 0 && points.every((p) => Math.abs(p.y) === 0)) {
      P_x_formula_string += "0";
    } else {
      P_x_formula_string = "P(x) = \\text{Tidak dapat membentuk rumus}";
    }
  } else {
    P_x_formula_string += termsArray.join(" + ").replace(/\+ -/g, "- ");
  }

  return P_x_formula_string;
};
