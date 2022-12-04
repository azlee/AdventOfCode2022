// https://adventofcode.com/2022/day/2

import * as fs from "fs";

enum Choice {
  A = "A",
  B = "B",
  C = "C",
  X = "X",
  Y = "Y",
  Z = "Z",
}
enum Score {
  LOSS = 0,
  DRAW = 3,
  WIN = 6,
}

const Outcome = {
  X: Score.LOSS,
  Y: Score.DRAW,
  Z: Score.WIN,
};

function getShapeScore(choice: Choice): number {
  if (choice === Choice.A || choice === Choice.X) {
    return 1;
  } else if (choice === Choice.B || choice === Choice.Y) {
    return 2;
  }
  return 3;
}

function isWin(oppPlay: Choice, myPlay: Choice): boolean {
  return (
    (myPlay === Choice.X && oppPlay === Choice.C) ||
    (myPlay === Choice.Y && oppPlay === Choice.A) ||
    (myPlay === Choice.Z && oppPlay === Choice.B)
  );
}

function isDraw(oppPlay: Choice, myPlay: Choice): boolean {
  return (
    (myPlay === Choice.X && oppPlay === Choice.A) ||
    (myPlay === Choice.Y && oppPlay === Choice.B) ||
    (myPlay === Choice.Z && oppPlay === Choice.C)
  );
}

function getOutcomeScore(oppPlay: Choice, myPlay: Choice): number {
  if (isWin(oppPlay, myPlay)) {
    return Score.WIN;
  } else if (isDraw(oppPlay, myPlay)) {
    return Score.DRAW;
  }
  return Score.LOSS;
}

function getScore(oppPlay: Choice, myPlay: Choice): number {
  return getShapeScore(myPlay) + getOutcomeScore(oppPlay, myPlay);
}

function getShapeToChoose(oppPlay: Choice, outcome: Choice) {
  for (const shape of [Choice.X, Choice.Y, Choice.Z]) {
    if (getOutcomeScore(oppPlay, shape) === Outcome[outcome]) {
      return shape;
    }
  }
  return Choice.X;
}

const input = fs.readFileSync("day2input.txt", "utf8");
const rounds: string[] = input.split("\n");

let totalScore = 0;
let totalScorePart2 = 0;
for (const round of rounds) {
  // part 1
  const plays = round.split(" ");
  const oppPlay = plays[0];
  const myPlay = plays[1];
  totalScore += getScore(oppPlay as Choice, myPlay as Choice);
  // part 2
  const myPlayPart2 = getShapeToChoose(oppPlay as Choice, myPlay as Choice);
  totalScorePart2 += getShapeScore(myPlayPart2) + Outcome[myPlay];
}

console.log("Part 1: totalScore", totalScore);
console.log("Part 2: totalScore", totalScorePart2);
