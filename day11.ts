// https://adventofcode.com/2022/day/10

import * as fs from "fs";

interface Monkey {
  items: number[];
  operation: string; //  "+" | "*"
  operationNum: number | string; // can be a number or "old"
  divisibleTest: number;
  trueMonkey: number;
  falseMonkey: number;
  numInspected: number;
}

function getItems(line: string): number[] {
  let items: string[] = line
    .trim()
    .split(" ")
    .slice(2)
    .map((str) => {
      const splitStr = str.split(",").filter((str) => str !== ",");
      return splitStr[0];
    });

  return items.map((str) => parseInt(str));
}

function getOperationNum(line: string): [string, string | number] {
  const splitStr = line.trim().split(" ");
  const number = parseInt(splitStr[5]);
  return [splitStr[4], isNaN(number) ? splitStr[5] : number];
}

function getDivisibleTest(line: string): number {
  return parseInt(line.trim().split(" ")[3]);
}

function getMonkey(line: string): number {
  return parseInt(line.trim().split(" ")[5]);
}

function parseMonkeys(): Monkey[] {
  const input = fs.readFileSync("day11input.txt", "utf8");
  const lines = input.split("\n");
  const monkeys: Monkey[] = [];
  for (let i = 1; i < lines.length; i += 7) {
    let [operation, operationNum] = getOperationNum(lines[i + 1]);
    const monkey: Monkey = {
      items: getItems(lines[i]),
      operation,
      operationNum,
      divisibleTest: getDivisibleTest(lines[i + 2]),
      trueMonkey: getMonkey(lines[i + 3]),
      falseMonkey: getMonkey(lines[i + 4]),
      numInspected: 0,
    };
    monkeys.push(monkey);
  }
  return monkeys;
}

function processMonkey(
  monkeys: Monkey[],
  i: number,
  divideByThree: boolean
): void {
  let monkey = monkeys[i];
  const {
    items,
    operation,
    operationNum,
    trueMonkey,
    falseMonkey,
    divisibleTest,
  } = monkey;
  for (let itemNum = 0; itemNum < items.length; itemNum++) {
    let worryLevel = items[itemNum];
    if (operation === "+") {
      worryLevel +=
        typeof operationNum === "number" ? operationNum : worryLevel;
    } else {
      worryLevel *=
        typeof operationNum === "number" ? operationNum : worryLevel;
    }
    if (divideByThree) {
      worryLevel = Math.floor(worryLevel / 3);
    }
    monkey.numInspected++;
    if (worryLevel % divisibleTest === 0) {
      // give to true monkey
      monkeys[trueMonkey].items.push(worryLevel);
    } else {
      monkeys[falseMonkey].items.push(worryLevel);
    }
  }
  monkeys[i].items = [];
}

function playMonkeyGame(rounds: number, divideByThree: boolean): Monkey[] {
  const monkeys = parseMonkeys();
  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      processMonkey(monkeys, i, divideByThree);
    }
  }
  return monkeys;
}

function getLevelOfMonkeyBusiness(
  rounds: number,
  divideByThree: boolean
): number {
  const monkeys = playMonkeyGame(rounds, divideByThree);
  console.log(monkeys);
  let monkeyNums = [];
  for (let monkey of monkeys) {
    monkeyNums.push(monkey.numInspected);
  }
  monkeyNums.sort((a, b) => b - a);
  return monkeyNums[0] * monkeyNums[1];
}

console.log("Part 1: ", getLevelOfMonkeyBusiness(20, true));
// console.log("Part 2: ", getLevelOfMonkeyBusiness(10000, true));
