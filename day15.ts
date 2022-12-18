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
      parseInt(y.split("=")[1]),
      parseInt(x.split("=")[1].slice(0, -1)),
    ];
    const beaconPos = [
      parseInt(y2.split("=")[1]),
      parseInt(x2.split("=")[1].slice(0, -1)),
    ];
    beacons.push(beaconPos);
    sensors.push(sensorPos);
  }

  return [beacons, sensors];
}

function calculatePositionsWithNoBeacon(beacons, sensors, row): number {
  const noBeaconInRow: Set<number> = new Set(); // all the x positions in row where they are no beacons
  for (let i = 0; i < beacons.length; i++) {
    const beacon = beacons[i];
    const sensor = sensors[i];
    const distance =
      Math.abs(beacon[0] - sensor[0]) + Math.abs(sensor[1] - beacon[1]);
    for (let x = sensor[1] - distance; x <= sensor[1] + distance; x++) {
      if (Math.abs(x - sensor[1]) + Math.abs(sensor[0] - row) <= distance) {
        noBeaconInRow.add(x);
      }
    }
  }

  for (let i = 0; i < beacons.length; i++) {
    const beacon = beacons[i];
    if (beacon[0] === row) {
      noBeaconInRow.delete(beacon[1]);
    }
  }
  return noBeaconInRow.size;
}

function foo(): number {
  const [beacons, sensors] = parseInput();
  const numPositionsNoBeacon = calculatePositionsWithNoBeacon(
    beacons,
    sensors,
    2000000
  );
  return numPositionsNoBeacon;
}

console.log("Part 1: ", foo());
