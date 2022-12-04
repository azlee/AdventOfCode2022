// https://adventofcode.com/2022/day/4

import * as fs from "fs";

function isContained(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return (
    (start1 <= start2 && end1 >= end2) || (start2 <= start1 && end2 >= end1)
  );
}

function isOverlap(start1: number, end1: number, start2: number, end2: number) {
  return (
    (start1 >= start2 && start1 <= end2) || (start2 >= start1 && start2 <= end1)
  );
}

function getOverlap() {
  const input = fs.readFileSync("day4input.txt", "utf8");
  const pairs = input.split("\n");
  return pairs.reduce((num, pair) => {
    const [section1, section2] = pair.split(",");
    const [start1, end1] = section1.split("-");
    const [start2, end2] = section2.split("-");
    if (
      isContained(
        parseInt(start1),
        parseInt(end1),
        parseInt(start2),
        parseInt(end2)
      )
    ) {
      num++;
    }
    return num;
  }, 0);
}

function getOverlap2() {
  const input = fs.readFileSync("day4input.txt", "utf8");
  const pairs = input.split("\n");
  return pairs.reduce((num, pair) => {
    const [section1, section2] = pair.split(",");
    const [start1, end1] = section1.split("-");
    const [start2, end2] = section2.split("-");
    if (
      isOverlap(
        parseInt(start1),
        parseInt(end1),
        parseInt(start2),
        parseInt(end2)
      )
    ) {
      num++;
    }
    return num;
  }, 0);
}

console.log(getOverlap());
console.log(getOverlap2());
