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
    return pos;
  } else if (isDiagonallyAdjacent(headPos, pos)) {
    // don't need to move
    return pos;
  } else if (
    (dir[0] !== 0 && pos[1] === headPos[1]) ||
    (dir[1] !== 0 && pos[0] === headPos[0])
  ) {
    // moving up or down and tail is in same column as head
    return [x + dir[0], y + dir[1]];
  }
  // else move diagonal to get to same row as head
  return prevHeadPos;
}
function adjust(headPos: number[], tail: number[]): number[] {
  const [x, y] = tail;
  const dr = Math.abs(headPos[0] - tail[0]);
  const dc = Math.abs(headPos[1] - tail[1]);
  if (dr <= 1 && dc <= 1) {
    // don't need to move if adjacent already
    return tail;
  } else if (dr >= 2 && dc >= 2) {
    // else move diagonal to get to same row as head
    return [
      headPos[0] + (x < headPos[0] ? -1 : 1),
      headPos[1] + (y < headPos[1] ? -1 : 1),
    ];
  } else if (dr >= 2) {
    return [headPos[0] + (x < headPos[0] ? -1 : 1), headPos[1]];
  } else if (dc >= 2) {
    return [headPos[0], headPos[1] + (y < headPos[1] ? -1 : 1)];
  }
  return tail;
}

function getNumPositionsWhereTailVisitsAtLeastOncePart2(): number {
  const input = fs.readFileSync("day9input.txt", "utf8");
  const lines = input.split("\n");
  const tailPositionHistory: Set<string> = new Set();
  let positions = [];
  for (let i = 0; i < 10; i++) {
    positions.push([0, 0]);
  }
  tailPositionHistory.add(JSON.stringify([0, 0]));
  for (const line of lines) {
    const [dx, dy] = getDir(line.split(" ")[0]);
    const steps = parseInt(line.split(" ")[1]);
    for (let i = 0; i < steps; i++) {
      let headPos = positions[0];
      let tailPos = positions[1];
      const newHead = moveHead(headPos, [dx, dy]);
      const newTail = moveTail(tailPos, [dx, dy], newHead, headPos);
      let prevHead = positions[1];
      positions[1] = newTail;
      positions[0] = newHead;
      for (let knot = 2; knot < 10; knot++) {
        const newPos = adjust(positions[knot - 1], positions[knot]);
        if (knot === 9) {
          tailPositionHistory.add(JSON.stringify(newPos));
        }
        prevHead = positions[knot];
        positions[knot] = newPos;
      }
    }
  }
  return tailPositionHistory.size;
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
      tailPositionHistory.add(tailStr);
      headPos = newHead;
      tailPos = newTail;
    }
  }
  return tailPositionHistory.size;
}

console.log("Part 1: ", getNumPositionsWhereTailVisitsAtLeastOnce());
console.log("Part 2: ", getNumPositionsWhereTailVisitsAtLeastOncePart2());
