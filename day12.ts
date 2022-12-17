// https://adventofcode.com/2022/day/10

import * as fs from "fs";

interface StepsPosition {
  steps: number;
  position: number[];
}

function parseInput(lines: string[]): string[][] {
  const output: string[][] = [];
  for (let line of lines) {
    let row = line.split("");
    output.push(row);
  }
  return output;
}

function findStarts(grid: string[][], findA: boolean): number[][] {
  let starts = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "S") {
        starts.push([i, j]);
      }
      if (findA && grid[i][j] === "a") {
        starts.push([i, j]);
      }
    }
  }
  return starts;
}

function bfs(grid: string[][], startingPositions: number[][]): number {
  const visited = new Set<string>(); // stringified coordinates
  const queue: StepsPosition[] = [];
  for (let position of startingPositions) {
    queue.push({
      position,
      steps: 0,
    });
  }
  let fewestSteps = Number.MAX_SAFE_INTEGER;
  while (queue.length) {
    const { position, steps } = queue.shift();
    const row = position[0];
    const col = position[1];
    const height = grid[row][col];
    if (height === "E") {
      fewestSteps = Math.min(fewestSteps, steps);
    }
    // check adjacent
    for (const dir of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const [newRow, newCol] = [row + dir[0], col + dir[1]];
      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < grid.length &&
        newCol < grid[0].length &&
        !visited.has(JSON.stringify([newRow, newCol]))
      ) {
        const adjHeight = grid[newRow][newCol];
        if (
          height === "S" ||
          height.charCodeAt(0) + 1 === adjHeight.charCodeAt(0) ||
          adjHeight.charCodeAt(0) <= height.charCodeAt(0)
        ) {
          if (adjHeight !== "E") {
            visited.add(JSON.stringify([newRow, newCol]));
          } else {
            // neighbor is E but we can only move here from the z - highest elevation
            if (height !== "z") {
              continue;
            }
          }
          queue.push({
            position: [newRow, newCol],
            steps: steps + 1,
          });
        }
      }
    }
  }
  return fewestSteps;
}

function getFewestSteps() {
  const input = fs.readFileSync("day12input.txt", "utf8");
  const lines = input.split("\n");
  const grid = parseInput(lines);
  const fewestSteps = bfs(grid, findStarts(grid, false));
  return fewestSteps;
}

function getFewestStepsPart2() {
  const input = fs.readFileSync("day12input.txt", "utf8");
  const lines = input.split("\n");
  const grid = parseInput(lines);
  const fewestSteps = bfs(grid, findStarts(grid, true));
  return fewestSteps;
}

console.log("Part 1: ", getFewestSteps());
console.log("Part 2: ", getFewestStepsPart2());
