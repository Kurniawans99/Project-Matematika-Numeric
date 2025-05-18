export function lagrangeInterpolation(x, points) {
  return points.reduce((acc, { x: xi, y: yi }, i) => {
    const term = points.reduce((t, { x: xj }, j) => {
      return i !== j ? t * ((x - xj) / (xi - xj)) : t;
    }, yi);
    return acc + term;
  }, 0);
}
