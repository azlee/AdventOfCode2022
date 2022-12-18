// https://adventofcode.com/2022/day/13

import * as fs from "fs";

function isValidPair(pair1, pair2): boolean {
  if (typeof pair1 === "number" && typeof pair2 === "number") {
    return pair1 > pair2 ? false : pair1 < pair2 ? true : undefined;
  } else if (typeof pair1 === "number") {
    return isValidPair([pair1], pair2);
  } else if (typeof pair2 === "number") {
    return isValidPair(pair1, [pair2]);
  }

  for (let i = 0; i < Math.max(pair1.length, pair2.length); i++) {
    if (pair1[i] === undefined) {
      return true;
    }
    if (pair2[i] === undefined) {
      return false;
    }
    const result = isValidPair(pair1[i], pair2[i]);
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
}

function getSumOfCorrectPairs(): number {
  const input = fs.readFileSync("day13input.txt", "utf8");
  const lines = input.split("\n");
  let sumOfCorrectPairs = 0;
  let pairIndex = 1;
  let validIndices = [];
  for (let i = 0; i < lines.length; i += 3) {
    const pair1 = JSON.parse(lines[i]);
    const pair2 = JSON.parse(lines[i + 1]);
    const isValid = isValidPair(pair1, pair2);
    if (isValid) {
      sumOfCorrectPairs += pairIndex;
      validIndices.push(pairIndex);
    }
    pairIndex++;
  }
  return sumOfCorrectPairs;
}

function calculateDecoderKey(): number {
  const input = fs.readFileSync("day13input.txt", "utf8");
  let lines = input
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((raw) => JSON.parse(raw));
  lines = [...lines, [[2]], [[6]]].sort((a, b) => {
    const result = isValidPair(a, b);
    return result === undefined ? 0 : result ? -1 : 1;
  });
  let decoderKey = 1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (JSON.stringify(line) === "[[6]]" || JSON.stringify(line) === "[[2]]") {
      decoderKey *= i + 1;
    }
  }
  return decoderKey;
}

console.log("Part 1: ", getSumOfCorrectPairs());
console.log("Part 2: ", calculateDecoderKey());
