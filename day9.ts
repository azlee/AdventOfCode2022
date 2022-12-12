// https://adventofcode.com/2022/day/9

import * as fs from "fs";

function getDir(dir: string): number[] {
  if (dir === "D") {
    return [-1, 0];
  } else if (dir === "U") {
    return [1, 0];
  } else if (dir === "L") {
    return [0, -1];
  }
  return [0, 1];
}

function moveHead(pos: number[], dir: number[]): number[] {
  const [x, y] = pos;
  return [x + dir[0], y + dir[1]];
}

function isAdjacent(head: number[], tail: number[]): boolean {
  // if vertically or horizontally adjacent we don't have to move
  return (
    (head[0] === tail[0] && Math.abs(head[1] - tail[1]) <= 1) ||
    (head[1] === tail[1] && Math.abs(head[0] - tail[0]) <= 1)
  );
}

function isDiagonallyAdjacent(head: number[], tail: number[]): boolean {
  return Math.abs(head[0] - tail[0]) === 1 && Math.abs(head[1] - tail[1]) === 1;
}

function moveTail(
  pos: number[],
  dir: number[],
  headPos: number[],
  prevHeadPos: number[]
): number[] {
  const [x, y] = pos;
  if (isAdjacent(headPos, pos)) {
    // don't need to move if adjacent already
    // console.log("adj");
    return pos;
  } else if (isDiagonallyAdjacent(headPos, pos)) {
    // console.log("diag adj");
    // don't need to move
    return pos;
  } else if (
    (dir[0] !== 0 && pos[1] === headPos[1]) ||
    (dir[1] !== 0 && pos[0] === headPos[0])
  ) {
    // console.log("up/down left/right");
    // moving up or down and tail is in same column as head
    return [x + dir[0], y + dir[1]];
  }
  // else move diagonal to get to same row as head
  // return [headPos[0], y + dir[1]];
  return prevHeadPos;
}

function getNumPositionsWhereTailVisitsAtLeastOnce(): number {
  const input = fs.readFileSync("day9input.txt", "utf8");
  const lines = input.split("\n");
  const tailPositionHistory: Set<string> = new Set();
  let headPos = [0, 0];
  let tailPos = [0, 0];
  tailPositionHistory.add(JSON.stringify(tailPos));
  for (const line of lines) {
    const [dx, dy] = getDir(line.split(" ")[0]);
    const steps = parseInt(line.split(" ")[1]);
    for (let i = 0; i < steps; i++) {
      const newHead = moveHead(headPos, [dx, dy]);
      const newTail = moveTail(tailPos, [dx, dy], newHead, headPos);
      const tailStr = JSON.stringify(newTail);
      // console.log("head", newHead, "tail", newTail);
      tailPositionHistory.add(tailStr);
      headPos = newHead;
      tailPos = newTail;
    }
  }
  console.log(tailPositionHistory);
  return tailPositionHistory.size;
}

console.log("Part 1: ", getNumPositionsWhereTailVisitsAtLeastOnce());
