// https://adventofcode.com/2022/day/3

import * as fs from "fs";

function splitString(str: string): string[] {
  return [str.substr(0, str.length / 2), str.substr(str.length / 2)];
}

function getCommonLetterSet(strs: string[]) {
  const firstSet: Set<string> = new Set();
  for (const letter of strs[0]) {
    firstSet.add(letter);
  }
  let prevSet = firstSet;
  for (let i = 1; i < strs.length; i++) {
    const commonSet: Set<string> = new Set();
    for (const letter of strs[i]) {
      if (prevSet.has(letter)) {
        commonSet.add(letter);
      }
    }
    prevSet = commonSet;
  }
  return Array.from(prevSet)[0];
}

function getItemPriority(item: string) {
  if (item >= "a" && item <= "z") {
    return item.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }
  return item.charCodeAt(0) - "A".charCodeAt(0) + 27;
}

function getSumOfPriorities() {
  const input = fs.readFileSync("day3input.txt", "utf8");
  const rucksacks: string[] = input.split("\n");
  let sum = 0;
  for (const rucksack of rucksacks) {
    const [compartment1, compartment2] = splitString(rucksack);
    const commonItem = getCommonLetterSet([compartment1, compartment2]);
    sum += getItemPriority(commonItem);
  }
  return sum;
}

function getSumOfPrioritiesPart2() {
  const input = fs.readFileSync("day3input.txt", "utf8");
  const rucksacks: string[] = input.split("\n");
  let sum = 0;
  for (let i = 0; i + 2 <= rucksacks.length; i += 3) {
    const elf1 = rucksacks[i];
    const elf2 = rucksacks[i + 1];
    const elf3 = rucksacks[i + 2];
    const commonItem = getCommonLetterSet([elf1, elf2, elf3]);
    sum += getItemPriority(commonItem);
  }
  return sum;
}

console.log("sum", getSumOfPriorities());
console.log("sum2", getSumOfPrioritiesPart2());
