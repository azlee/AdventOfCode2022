// https://adventofcode.com/2022/day/16
import * as fs from "fs";

type Valve = {
  name: string;
  flow: number;
  tunnels: string[];
};

type Step = {
  curr: Valve;
  flowTotal: number;
  stepNum: 1;
  openValves: Set<string>;
};

function vertexWithMinDistance(
  distances: { [key: string]: number },
  visited: Set<string>
): string {
  let minDistance = Infinity,
    minVertex = null;
  for (let vertex in distances) {
    let distance = distances[vertex];
    if (distance < minDistance && !visited.has(vertex)) {
      minDistance = distance;
      minVertex = vertex;
    }
  }
  return minVertex;
}

function dijkstra(map: Map<string, Valve>, source: Valve) {
  const distances: { [key: string]: number } = {};
  const parents: { [key: string]: Valve } = {};
  const visited: Set<string> = new Set();
  const vertices = Array.from(map.values());
  for (let i = 0; i < vertices.length; i++) {
    if (vertices[i].name === source.name) {
      distances[source.name] = 0;
    } else {
      distances[vertices[i].name] = Infinity;
    }
  }
  let currVertex = vertexWithMinDistance(distances, visited);
  while (currVertex !== null) {
    const vertex = map.get(currVertex);
    let distance = distances[currVertex],
      neighbors = vertex.tunnels;
    for (let neighborName of neighbors) {
      let newDistance = distance + 1;
      if (distances[neighborName] > newDistance) {
        distances[neighborName] = newDistance;
      }
    }
    visited.add(currVertex);
    currVertex = vertexWithMinDistance(distances, visited);
  }

  console.log(parents);
  console.log(distances);
  return distances;
}

// for each destination and end valve get the min number of steps to get there
// ex. for AA-BB the min number of steps is 1
function getMinNumberSteps(
  map: Map<string, Valve>
): Map<string, Map<string, number>> {
  const minSteps: Map<string, Map<string, number>> = new Map();
  for (let valve of Array.from(map.values())) {
    const distances = dijkstra(map, valve);
    console.log("distances for " + valve.name, distances);
    minSteps.set(valve.name, new Map(Object.entries(distances)));
  }
  return minSteps;
}

function parseInput(): [Map<string, Valve>, Valve, Valve[]] {
  const input = fs.readFileSync("day16input.txt", "utf8");
  const lines = input.split("\n");
  const map: Map<string, Valve> = new Map();
  let firstValve = null;
  let nonZeroValves = [];
  for (const line of lines) {
    const splitStr = line.split(";");
    const name = splitStr[0].substr(6, 2);
    const flow = splitStr[0].split("=")[1];
    const tunnels = splitStr[1]
      .split(/valve[s]*/)[1]
      .split(",")
      .map((s) => s.trim());
    const valve = { name, flow: Number(flow), tunnels };
    if (flow !== "0") {
      nonZeroValves.push(valve);
    }
    if (name === "AA") {
      firstValve = valve;
    }
    map.set(name, valve);
  }
  return [map, firstValve, nonZeroValves];
}

function getOptimalPressure(
  map: Map<string, Valve>,
  firstValve: Valve,
  minStepsMap: Map<string, Map<string, number>>,
  nonZeroValves: Set<string>,
  time: number
): number {
  const queue = [];
  const firstStep: Step = {
    curr: firstValve,
    flowTotal: 0,
    stepNum: 1,
    openValves: new Set(),
  };
  const seen = {}; // key is `${time}_${valve}_${Array.from(openValves).sort()}` and value is the highest score we've seen
  queue.push(firstStep);
  let optimalPressure = 0;
  while (queue.length) {
    const step = queue.shift();
    let additionalPressure = 0;
    const { curr, flowTotal, openValves, stepNum } = step;
    const unopenedZeroValves = new Set(
      [...Array.from(nonZeroValves)].filter((v) => !openValves.has(v))
    );
    for (const openValve of Array.from(openValves)) {
      additionalPressure += map.get(openValve as string).flow;
    }
    console.log("");
    console.log("== " + "Minute " + stepNum + " ==");
    console.log(
      "You are on " +
        curr.name +
        " total is now " +
        flowTotal +
        " and unopened valves are " +
        Array.from(unopenedZeroValves)
    );
    console.log(
      "Valves " +
        Array.from(step.openValves).sort() +
        " are open, releasing " +
        additionalPressure +
        " pressure."
    );
    const seenKey = `${stepNum}_${curr.name}_${Array.from(openValves).sort()}`;
    if (seen[seenKey] >= flowTotal) continue;
    seen[seenKey] = flowTotal;
    // open the curr valve and don't move
    if (stepNum === time) {
      optimalPressure = Math.max(optimalPressure, flowTotal);
    } else {
      // go to unopened valves only. make sure we have enough steps left
      if (unopenedZeroValves.size) {
        for (const unopenedValveName of Array.from(unopenedZeroValves)) {
          const numStepsToGetThere = minStepsMap
            .get(curr.name)
            .get(unopenedValveName);
          const newSetOpenValve = new Set(
            JSON.parse(JSON.stringify(Array.from(openValves)))
          );
          const unopenedValue = map.get(unopenedValveName);
          // open valve path
          newSetOpenValve.add(unopenedValveName);
          console.log(
            `You move ${numStepsToGetThere} steps to get to valve ${unopenedValue.name}`
          );
          const newStepNum = stepNum + numStepsToGetThere + 1; // add one to open the valve
          if (newStepNum <= time) {
            const newStepOpenValve = {
              curr: unopenedValue,
              flowTotal:
                flowTotal +
                (numStepsToGetThere + 1) * additionalPressure +
                unopenedValue.flow, // release new open valve
              stepNum: newStepNum,
              openValves: newSetOpenValve,
            };
            queue.push(newStepOpenValve);
          }
        }
      } else {
        if (!openValves.has(curr.name) && curr.flow) {
          // console.log("You open valve " + curr.name);
          const newSetOpenValve = new Set(
            JSON.parse(JSON.stringify(Array.from(openValves)))
          );
          newSetOpenValve.add(curr.name);
          const newStepOpenValve = {
            curr: curr,
            flowTotal: flowTotal + additionalPressure,
            stepNum: stepNum + 1,
            openValves: newSetOpenValve,
          };
          queue.push(newStepOpenValve);
        }
      }
    }
  }
  return optimalPressure;
}

function part1() {
  const [map, firstValve, nonZeroValves] = parseInput();
  console.log(map, firstValve, nonZeroValves);
  const minNumSteps = getMinNumberSteps(map);
  console.log(
    getOptimalPressure(
      map,
      firstValve,
      minNumSteps,
      new Set(nonZeroValves.map((v) => v.name)),
      30
    )
  );
}

part1();
