// https://adventofcode.com/2022/day/15

import * as fs from "fs";

function parseInput(): number[][][] {
  const input = fs.readFileSync("day15input.txt", "utf8");
  const lines = input.split("\n");
  const beacons: number[][] = [];
  const sensors: number[][] = [];
  for (const line of lines) {
    const [sensorLine, beaconLine] = line.split(": ");
    let [_, _a, x, y] = sensorLine.split(" ");
    let [_2, _a2, _b, _c, x2, y2] = beaconLine.split(" ");
    const sensorPos = [
      parseInt(x.split("=")[1].slice(0, -1)),
      parseInt(y.split("=")[1]),
    ];
    const beaconPos = [
      parseInt(x2.split("=")[1].slice(0, -1)),
      parseInt(y2.split("=")[1]),
    ];
    beacons.push(beaconPos);
    sensors.push(sensorPos);
  }

  return [beacons, sensors];
}

function calculatePositionsWithNoBeaconInRow(beacons, sensors, row): number {
  const noBeaconInRow: Set<number> = new Set(); // all the x positions in row where they are no beacons
  for (let i = 0; i < beacons.length; i++) {
    const beacon = beacons[i];
    const sensor = sensors[i];
    const distance =
      Math.abs(beacon[0] - sensor[0]) + Math.abs(sensor[1] - beacon[1]);
    for (let x = sensor[0] - distance; x <= sensor[0] + distance; x++) {
      if (Math.abs(x - sensor[0]) + Math.abs(sensor[1] - row) <= distance) {
        noBeaconInRow.add(x);
      }
    }
  }

  for (let i = 0; i < beacons.length; i++) {
    const beacon = beacons[i];
    if (beacon[1] === row) {
      noBeaconInRow.delete(beacon[1]);
    }
  }
  return noBeaconInRow.size;
}

function getPointsToCheck(beacons, sensors, low, high): number[][] {
  // check the perimeter of each diamond
  const deltas = [
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];
  // top, bottom, right, left
  const edges = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const pointsToCheck: number[][] = [];
  for (let b = 0; b < beacons.length; b++) {
    const beacon = beacons[b];
    const sensor = sensors[b];
    const distance =
      Math.abs(beacon[0] - sensor[0]) + Math.abs(sensor[1] - beacon[1]);
    for (let i = 0; i < 4; i++) {
      let edge = [
        sensor[0] + edges[i][0] * (distance + 1),
        sensor[1] + edges[i][1] * (distance + 1),
      ];
      const [dx, dy] = deltas[i];
      let pointNum = 0;
      while (pointNum <= distance) {
        const newPoint = [dx * pointNum + edge[0], dy * pointNum + edge[1]];
        if (
          newPoint[0] >= low &&
          newPoint[0] <= high &&
          newPoint[1] >= low &&
          newPoint[1] <= high
        ) {
          pointsToCheck.push(newPoint);
        } else {
          break;
        }
        pointNum++;
      }
    }
  }
  return pointsToCheck;
}

function findTuningFrequencyInRange(beacons, sensors, low, high): number {
  const pointsToCheck = getPointsToCheck(beacons, sensors, low, high);
  console.log("pointsToCheck len", pointsToCheck.length);
  for (const point of pointsToCheck) {
    let i = 0;
    for (; i < beacons.length; i++) {
      const beacon = beacons[i];
      const sensor = sensors[i];
      const distance =
        Math.abs(beacon[0] - sensor[0]) + Math.abs(beacon[1] - sensor[1]);
      const pointDistance =
        Math.abs(point[0] - sensor[0]) + Math.abs(point[1] - sensor[1]);
      if (pointDistance <= distance) {
        break;
      }
    }
    if (i === beacons.length) {
      console.log("point", point);
      return point[0] * 4000000 + point[1];
    }
  }
  return 0;
}

function part1(): number {
  const [beacons, sensors] = parseInput();
  const numPositionsNoBeacon = calculatePositionsWithNoBeaconInRow(
    beacons,
    sensors,
    2000000
  );
  return numPositionsNoBeacon;
}

function part2(): number {
  const [beacons, sensors] = parseInput();
  const positionWithBeacon = findTuningFrequencyInRange(
    beacons,
    sensors,
    0,
    4000000
  );
  return positionWithBeacon;
}

console.log("Part 1: ", part1());
console.log("Part 2: ", part2());
