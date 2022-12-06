// https://adventofcode.com/2022/day/6

import * as fs from "fs";
function getMarker(markerLen: number): number {
  const input = fs.readFileSync("day6input.txt", "utf8");
  let i = 0;
  while (i < input.length) {
    const charSet = new Set();
    let len = 0;
    while (len < markerLen) {
      const char = input.charAt(i + len);
      if (charSet.has(char)) {
        break;
      } else {
        charSet.add(char);
        len++;
      }
    }
    if (len === markerLen) {
      break;
    }
    i++;
  }
  return i + markerLen;
}

function getMarkerPart1(): number {
  return getMarker(4);
}

function getMarkerPart2(): number {
  return getMarker(14);
}

console.log(getMarkerPart1());
console.log(getMarkerPart2());
