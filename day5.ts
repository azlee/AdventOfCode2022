// https://adventofcode.com/2022/day/5

import * as fs from "fs";

function getNumStacks(stacks: string): number {
  const lines = stacks.split("\n");
  const lastLine = lines[lines.length - 1];
  return Math.floor(lastLine.length / 3);
}

// last of output[i] is the top of stack i
// first in each list is the bottom of the stack
function parseStacks(stacks: string): string[][] {
  // get number of stacks
  const numStacks = getNumStacks(stacks);
  const output = [];
  // push empty arrays onto output
  for (let i = 0; i < numStacks; i++) {
    output.push([]);
  }
  const splitStacks: string[] = stacks.split("\n");
  for (let lineNum = 0; lineNum < splitStacks.length - 1; lineNum++) {
    const line = splitStacks[lineNum];
    // iterate through each stack
    for (let i = 1; i < line.length; i += 4) {
      if (line[i] !== " ") {
        output[Math.floor(i / 4)].push(line[i]);
      }
    }
  }
  return output.map((x) => x.reverse());
}

function followProcedure(stacks: string[][], procedure: string): string[][] {
  const instructions = procedure.split("\n");
  for (const instruction of instructions) {
    const [_, numMove, _i, start, _j, end] = instruction.split(" ");
    const startI = parseInt(start) - 1;
    const endI = parseInt(end) - 1;
    for (let i = 0; i < parseInt(numMove); i++) {
      stacks[endI].push(stacks[startI].pop());
    }
  }
  return stacks;
}

function followProcedurePart2(
  stacks: string[][],
  procedure: string
): string[][] {
  const instructions = procedure.split("\n");
  for (const instruction of instructions) {
    const [_, numMove, _i, start, _j, end] = instruction.split(" ");
    const startI = parseInt(start) - 1;
    const endI = parseInt(end) - 1;
    let newElementsToAdd = [];
    for (let i = 0; i < parseInt(numMove); i++) {
      newElementsToAdd.push(stacks[startI].pop());
    }
    // push the elements
    while (newElementsToAdd.length) {
      stacks[endI].push(newElementsToAdd.pop());
    }
  }
  return stacks;
}

function getTop(stacks: string[][]) {
  let res = [];
  for (const stack of stacks) {
    if (stack.length) {
      res.push(stack[stack.length - 1]);
    }
  }
  return res.join("");
}

function getCrateArrangement(): string {
  const input = fs.readFileSync("day5input.txt", "utf8");
  const [stacks, procedure] = input.split(/\n\s*\n/);
  const stacksParsed = parseStacks(stacks);
  const newStacks = followProcedure(stacksParsed, procedure);
  const result = getTop(newStacks);
  return result;
}

function getCrateArrangementPart2(): string {
  const input = fs.readFileSync("day5input.txt", "utf8");
  const [stacks, procedure] = input.split(/\n\s*\n/);
  const stacksParsed = parseStacks(stacks);
  const newStacks = followProcedurePart2(stacksParsed, procedure);
  const result = getTop(newStacks);
  return result;
}

console.log(getCrateArrangement());
console.log(getCrateArrangementPart2());
