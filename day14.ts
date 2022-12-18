// https://adventofcode.com/2022/day/14

import * as fs from "fs";

function formLine(
  grid: string[][],
  x: number,
  y: number,
  x2: number,
  y2: number
): string[][] {
  for (let i = Math.min(x, x2); i <= Math.max(x, x2); i++) {
    grid[y][i] = "#";
  }
  for (let i = Math.min(y, y2); i <= Math.max(y, y2); i++) {
    grid[i][x] = "#";
  }
  return grid;
}

function parseGrid(lines: string[]): string[][] {
  let grid: string[][] = [];
  for (let i = 0; i < 200; i++) {
    let row = [];
    for (let j = 0; j < 600; j++) {
      row.push(".");
    }
    grid.push(row);
  }
  for (let line of lines) {
    let splitLine = line.split(" -> ");
    for (let i = 0; i < splitLine.length - 1; i++) {
      let coord = splitLine[i];
      let coord2 = splitLine[i + 1];
      const [x, y] = [
        parseInt(coord.split(",")[0]),
        parseInt(coord.split(",")[1]),
      ];
      const [x2, y2] = [
        parseInt(coord2.split(",")[0]),
        parseInt(coord2.split(",")[1]),
      ];
      grid = formLine(grid, x, y, x2, y2);
    }
  }
  return grid;
}

function getLowestRow(grid: string[][]): number {
  let lowestRow = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") {
        lowestRow = i;
        break;
      }
    }
  }
  return lowestRow;
}

// return true if sand falls through abyss
function dropSand(grid: string[][], lowestRow: number): boolean {
  let start = [0, 500];
  while (true) {
    const [x, y] = start;
    // try to go down
    const down = [x + 1, y];
    // try to go down and to the left
    const downLeft = [x + 1, y - 1];
    // try to go down and to the right
    const downRight = [x + 1, y + 1];

    let positions = [down, downLeft, downRight];
    let didFall = false;
    for (const position of positions) {
      if (
        position[0] >= 0 &&
        position[1] >= 0 &&
        position[0] < 200 &&
        position[1] < 600
      ) {
        if (grid[position[0]][position[1]] === ".") {
          start = position;
          didFall = true;
          break;
        }
      }
    }
    if (start[0] > lowestRow) {
      return true;
    }
    if (!didFall) {
      grid[start[0]][start[1]] = "o";
      return false;
    }
  }
}

function pourSand(grid: string[][]): number {
  let numSand = 0;
  let lowestRow = getLowestRow(grid);
  while (!dropSand(grid, lowestRow)) {
    numSand++;
  }
  return numSand;
}

function getNumberOfSandBeforeAbyss(): number {
  const input = fs.readFileSync("day14input.txt", "utf8");
  const grid: string[][] = parseGrid(input.split("\n"));
  return pourSand(grid);
}

console.log("Part 1: ", getNumberOfSandBeforeAbyss());
