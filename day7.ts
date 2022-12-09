// https://adventofcode.com/2022/day/7

import * as fs from "fs";

export interface TreeNode {
  children: TreeNode[];
  parent: TreeNode | null;
  size: number;
  name: string;
  isDir: boolean;
}

let sumOfSmallDirectories = 0;

function getDirSize(treeNode: TreeNode, dirSizes: number[]): number {
  let size = 0;
  for (let child of treeNode.children) {
    if (child.isDir) {
      const dirSize = getDirSize(child, dirSizes);
      dirSizes.push(dirSize);
      if (dirSize < 100000) {
        sumOfSmallDirectories += dirSize;
      }
      size += dirSize;
    } else {
      size += child.size;
    }
  }
  return size;
}

function getFileTree(commands: string[]): TreeNode {
  const root: TreeNode = {
    children: [],
    parent: null,
    size: 0,
    name: "/",
    isDir: true,
  };
  let currNode = root;
  for (const command of commands) {
    const lines = command.split("\n");
    const firstLine = lines[0];
    if (firstLine.startsWith("cd")) {
      const dir = firstLine.split(" ")[1];
      if (dir === "/") {
        currNode = root;
      } else if (dir === "..") {
        currNode = currNode.parent;
      } else {
        const newNode = {
          children: [],
          parent: currNode,
          size: 0,
          name: dir,
          isDir: true,
        };
        currNode.children.push(newNode);
        currNode = newNode;
      }
    } else if (firstLine.startsWith("ls")) {
      const contents = lines.slice(1);
      for (const content of contents) {
        const size = content.split(" ")[0];
        if (size === "dir" || size === "") {
          continue;
        }
        const name = content.split(" ")[1];
        const file = {
          parent: currNode,
          children: [],
          size: parseInt(size),
          name,
          dirSize: 0,
          isDir: false,
        };
        currNode.children.push(file);
      }
    }
  }

  return root;
}

function getSmallestDirectoryToFreeSpace(
  dirSizes: number[],
  rootSize: number
): number {
  const totalDiskSpace = 70000000;
  const necessaryDiskSpace = 30000000;
  dirSizes.sort((a, b) => a - b);
  const unusedSpace = totalDiskSpace - rootSize;
  if (unusedSpace >= necessaryDiskSpace) {
    return 0;
  }
  for (const dirSize of dirSizes) {
    if (unusedSpace + dirSize > necessaryDiskSpace) {
      return dirSize;
    }
  }
}

function getLargeDirectoriesSum() {
  const input = fs.readFileSync("day7input.txt", "utf8");
  const commands = input.split("$ ");
  const root = getFileTree(commands);
  let dirSizes = [];
  const rootSize = getDirSize(root, dirSizes);
  console.log("Part 1: ", sumOfSmallDirectories);
  console.log("Part 2: ", getSmallestDirectoryToFreeSpace(dirSizes, rootSize));
  return sumOfSmallDirectories;
}

getLargeDirectoriesSum();
