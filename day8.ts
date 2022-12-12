// https://adventofcode.com/2022/day/8

import * as fs from "fs";

function parseGrid(input: string): number[][] {
  const lines = input.split("\n");
  let grid = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let row = [];
    for (let j = 0; j < line.length; j++) {
      row.push(parseInt(line[j]));
    }
    grid.push(row);
  }
  return grid;
}

function isVisibleFromDir(
  grid: number[][],
  row: number,
  col: number,
  dir: number[]
): boolean {
  let newX = row + dir[0];
  let newY = col + dir[1];
  const treeLen = grid[row][col];
  while (
    newX >= 0 &&
    newX < grid.length &&
    newY >= 0 &&
    newY < grid[0].length
  ) {
    if (grid[newX][newY] >= treeLen) {
      return false;
    }
    newX += dir[0];
    newY += dir[1];
  }
  return true;
}

function isVisible(grid: number[][], row: number, col: number): boolean {
  let isVisible = false;
  for (let dir of [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
  ]) {
    if (isVisibleFromDir(grid, row, col, dir)) {
      return true;
    }
  }
  return isVisible;
}

function getViewingDistance(
  grid: number[][],
  row: number,
  col: number,
  dir: number[]
): number {
  const [x, y] = dir;
  let i = row + x;
  let j = col + y;
  let prevTreeHeight = 0;
  let viewingDistance = 0;
  while (i >= 0 && j >= 0 && i < grid.length && j < grid[0].length) {
    viewingDistance++;
    prevTreeHeight = grid[i][j];
    if (prevTreeHeight >= grid[row][col]) {
      break;
    }
    i += x;
    j += y;
  }
  return viewingDistance;
}

function getScenicScore(grid: number[][], row: number, col: number): number {
  let score = 1;
  for (const dir of [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ]) {
    score *= getViewingDistance(grid, row, col, dir);
  }
  return score;
}

function getHighestScenicScore(): number {
  const input = fs.readFileSync("day8input.txt", "utf8");
  const grid: number[][] = parseGrid(input);
  let highestScenicScore = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const scenicScore = getScenicScore(grid, i, j);
      highestScenicScore = Math.max(scenicScore, highestScenicScore);
    }
  }
  return highestScenicScore;
}

function getNumVisibleTrees(): number {
  const input = fs.readFileSync("day8input.txt", "utf8");
  const grid: number[][] = parseGrid(input);
  let numVisible = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (isVisible(grid, i, j)) {
        numVisible++;
      }
    }
  }
  return numVisible;
}

console.log("Part 1: ", getNumVisibleTrees());
console.log("Part 2: ", getHighestScenicScore());
