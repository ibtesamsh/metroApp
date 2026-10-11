import { metroData } from "./metroData";

const buildAdjacency = () => {
  const adjacency = new Map();
  const addEdge = (a, b) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a).add(b);
    adjacency.get(b).add(a);
  };
  metroData.lines.forEach((line) => {
    for (let i = 0; i < line.stations.length - 1; i++) {
      addEdge(line.stations[i], line.stations[i + 1]);
    }
  });
  return adjacency;
};

export const adjacency = buildAdjacency();

// Maps every station to a numeric id shared by all stations it can reach —
// used to instantly know which stations are (not) reachable from a given
// source, so the map can gray out stations that would 400 on the backend.
export const componentOf = (() => {
  const map = new Map();
  let componentId = 0;
  for (const station of adjacency.keys()) {
    if (map.has(station)) continue;
    const queue = [station];
    map.set(station, componentId);
    while (queue.length) {
      const current = queue.shift();
      for (const neighbor of adjacency.get(current) || []) {
        if (!map.has(neighbor)) {
          map.set(neighbor, componentId);
          queue.push(neighbor);
        }
      }
    }
    componentId += 1;
  }
  return map;
})();

export const areConnected = (a, b) => a && b && componentOf.get(a) === componentOf.get(b);

// Shortest path by station-hops, used only to draw a preview highlight on
// the map. The backend independently computes the authoritative route/price.
export const shortestPath = (start, end) => {
  if (!adjacency.has(start) || !adjacency.has(end)) return null;
  if (start === end) return [start];

  const visited = new Set([start]);
  const parent = new Map();
  const queue = [start];

  while (queue.length) {
    const current = queue.shift();
    if (current === end) break;
    for (const neighbor of adjacency.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  if (!visited.has(end)) return null;

  const path = [end];
  let node = end;
  while (node !== start) {
    node = parent.get(node);
    path.push(node);
  }
  return path.reverse();
};
