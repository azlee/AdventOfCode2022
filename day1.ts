// https://adventofcode.com/2022/day/1

import * as fs from "fs";
const input = fs.readFileSync("day1input.txt", "utf8");

const elfCalorieGroups: string[] = input.split(/\n\s*\n/);

let totalCalories = [];

for (const elfCalorieGroup of elfCalorieGroups) {
  let elfCaloriesSum = 0;
  for (const calories of elfCalorieGroup.split("\n")) {
    elfCaloriesSum += parseInt(calories);
  }
  totalCalories.push(elfCaloriesSum);
}

totalCalories.sort((a, b) => b - a);
console.log(totalCalories);
const totalCaloriesTopThreeElves =
  totalCalories[0] + totalCalories[1] + totalCalories[2];
const maxTotalCalories = totalCalories[0];

console.log("maxTotalCalories", maxTotalCalories);
console.log("totalCaloriesTopThreeElves", totalCaloriesTopThreeElves);
