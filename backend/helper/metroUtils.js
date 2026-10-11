import { metroData } from "./metroData.js";

const PRICE_PER_STATION = 10;

export const findLine = (stationA, stationB) =>
  metroData.lines.find(
    (line) =>
      line.stations.includes(stationA) && line.stations.includes(stationB),
  );

export const findLinesForStation = (station) =>
  metroData.lines
    .filter((line) => line.stations.includes(station))
    .map((line) => line.line);

/**
 * Given a source, destination and an ordered list of interchange (via)
 * stations, returns the full ordered list of station names the journey
 * passes through, walking one line-segment at a time. This is what lets
 * multi-line (interchange) tickets be validated later — the old code only
 * ever looked for a single line containing BOTH source and destination,
 * which meant any interchange ticket could never be started or completed.
 *
 * Returns null if any leg of the journey isn't a valid single-line segment.
 */
export const buildTicketRoute = (source, destination, via = []) => {
  const waypoints = [source, ...via, destination];
  const fullPath = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const line = findLine(from, to);
    if (!line) return null;

    const { stations } = line;
    const fromIdx = stations.indexOf(from);
    const toIdx = stations.indexOf(to);
    const step = fromIdx < toIdx ? 1 : -1;

    const segment = [];
    for (let idx = fromIdx; idx !== toIdx; idx += step) segment.push(stations[idx]);
    segment.push(to);

    // Skip the first station of every segment after the first — it's the
    // same station as the last one already pushed (the shared waypoint).
    fullPath.push(...(i === 0 ? segment : segment.slice(1)));
  }

  return fullPath;
};

/**
 * Works out a valid route (and via stations, if any) between two stations,
 * price included. Used at purchase time. Only handles a single interchange
 * (source line -> common station -> destination line), which covers every
 * real route on this network; extend the search if that ever changes.
 */
export const planJourney = (source, destination) => {
  const sourceLine = metroData.lines.find((l) => l.stations.includes(source));
  const destinationLine = metroData.lines.find((l) =>
    l.stations.includes(destination),
  );

  if (!sourceLine || !destinationLine) return null;

  if (sourceLine.line === destinationLine.line) {
    const route = buildTicketRoute(source, destination, []);
    if (!route) return null;
    return { via: [], route, price: (route.length - 1) * PRICE_PER_STATION };
  }

  const commonStations = sourceLine.stations.filter((s) =>
    destinationLine.stations.includes(s),
  );
  if (commonStations.length === 0) return null;

  const viaStation = commonStations[0];
  const route = buildTicketRoute(source, destination, [viaStation]);
  if (!route) return null;

  return {
    via: [viaStation],
    route,
    price: (route.length - 1) * PRICE_PER_STATION,
  };
};
