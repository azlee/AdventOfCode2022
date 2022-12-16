// https://adventofcode.com/2022/day/10

import * as fs from "fs";

function getSumOfSixSignals(): number {
  const input = fs.readFileSync("day10input.txt", "utf8");
  const lines = input.split("\n");
  let x = 1;
  let cycle = 20;
  let signalStrength = 0;
  let cycleNum = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line !== "noop") {
      for (let i = 0; i < 2; i++) {
        cycleNum++;
        if (cycleNum === cycle) {
          signalStrength += x * cycle;
          cycle += 40;
        }
        if (i === 1) {
          x += parseInt(line.split(" ")[1]);
        }
      }
    } else {
      cycleNum++;
      if (cycleNum === cycle) {
        signalStrength += x * cycle;
        cycle += 40;
      }
    }
  }
  return signalStrength;
}

function getCrt(): string[][] {
  const input = fs.readFileSync("day10input.txt", "utf8");
  const lines = input.split("\n");
  const crt: string[][] = [];
  for (let i = 0; i < 6; i++) {
    let row = [];
    for (let j = 0; j < 40; j++) {
      row.push(" ");
    }
    crt.push(row);
  }

  let cycleNum = 0,
    line = 0,
    x = 1;
  let pixelsVisible = [0, 1, 2];
  for (let instruction of lines) {
    if (instruction.split(" ")[0] === "noop") {
      if (pixelsVisible.includes(cycleNum)) {
        crt[line][cycleNum] = "#";
      }
      cycleNum++;
      if (cycleNum % 40 === 0) {
        cycleNum = 0;
        line++;
      }
    } else {
      for (let i = 0; i < 2; i++) {
        if (pixelsVisible.includes(cycleNum)) {
          crt[line][cycleNum] = "#";
        }
        cycleNum++;
        if (cycleNum % 40 === 0) {
          cycleNum = 0;
          line++;
        }
        if (i === 1) {
          x += parseInt(instruction.split(" ")[1]);
          pixelsVisible = [x - 1, x, x + 1];
        }
      }
    }
  }

  return crt;
}

function print(crt: string[][]) {
  for (let i = 0; i < crt.length; i++) {
    console.log(crt[i].join(""));
  }
}

console.log("Part 1: ", getSumOfSixSignals());
console.log("Part 2: ", print(getCrt()));
