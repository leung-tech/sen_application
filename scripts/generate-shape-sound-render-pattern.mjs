const result = [];
let state = 8262026;
const next = () => {
  state = (state * 1664525 + 1013904223) >>> 0;
  return state;
};
const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
let previousGroup = [];
while (result.length < 60) {
  const candidates = permutations.filter((group) => group[0] !== result.at(-1) && !group.every((position, index) => position === previousGroup[index]));
  const group = candidates[(next() >>> 16) % candidates.length];
  result.push(...group);
  previousGroup = group;
}

const isLegacyCycle = result.every((position, index) => position === index % 3);
const adjacentDuplicates = result.some((position, index) => index > 0 && position === result[index - 1]);
const counts = [0, 1, 2].map((position) => result.filter((item) => item === position).length);
console.log(JSON.stringify({ result, counts, isLegacyCycle, adjacentDuplicates }, null, 2));
