import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Locate, Search as SearchIcon } from "lucide-react";
import { metroData } from "../../metroData";
import {
  stationPositions,
  MAP_WIDTH,
  MAP_HEIGHT,
  lineColors,
} from "../../stationPositions";
import { areConnected, shortestPath, componentOf } from "../../metroGraph";

const INTERCHANGES = new Set(
  metroData.lines
    .flatMap((l) => l.stations)
    .filter((s, _, arr) => arr.filter((x) => x === s).length > 1),
);

const buildLabelOrientations = () => {
  const acc = {};
  metroData.lines.forEach((line) => {
    const stations = line.stations;
    for (let i = 0; i < stations.length; i++) {
      const cur = stations[i];
      const pos = stationPositions[cur];
      if (!pos) continue;

      const neighbors = [];
      if (i > 0) neighbors.push(stations[i - 1]);
      if (i < stations.length - 1) neighbors.push(stations[i + 1]);

      neighbors.forEach((nb) => {
        const np = stationPositions[nb];
        if (!np) return;
        if (!acc[cur]) acc[cur] = { dx: 0, dy: 0 };
        acc[cur].dx += Math.abs(np.x - pos.x);
        acc[cur].dy += Math.abs(np.y - pos.y);
      });
    }
  });

  const result = new Map();
  Object.entries(acc).forEach(([station, { dx, dy }]) => {
    result.set(station, dx >= dy ? "horizontal" : "vertical");
  });
  return result;
};

const LABEL_ORIENTATION = buildLabelOrientations();

const MetroMap = ({
  source,
  destination,
  onSelectSource,
  onSelectDestination,
}) => {
  const [hovered, setHovered] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState("");

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  const previewPath = useMemo(() => {
    if (!source || !destination || source === destination) return null;
    return shortestPath(source, destination);
  }, [source, destination]);
  const previewSet = useMemo(() => new Set(previewPath || []), [previewPath]);

  const showLabels = zoom >= 1;

  // ---- native listeners (scroll/zoom trap) ----
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const next = Math.min(
        3,
        Math.max(0.6, zoomRef.current - e.deltaY * 0.0015),
      );
      setZoom(next);
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        const [a, b] = e.touches;
        pinchRef.current = {
          dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          zoom: zoomRef.current,
        };
        dragRef.current = null;
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        dragRef.current = {
          x: t.clientX,
          y: t.clientY,
          px: panRef.current.x,
          py: panRef.current.y,
        };
      }
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.touches.length === 2 && pinchRef.current) {
        const [a, b] = e.touches;
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const next = (dist / pinchRef.current.dist) * pinchRef.current.zoom;
        setZoom(Math.min(3, Math.max(0.6, next)));
        return;
      }
      if (dragRef.current && e.touches.length === 1) {
        const t = e.touches[0];
        setPan({
          x: dragRef.current.px + (t.clientX - dragRef.current.x),
          y: dragRef.current.py + (t.clientY - dragRef.current.y),
        });
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length === 0) {
        dragRef.current = null;
        pinchRef.current = null;
      }
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      dragRef.current = {
        x: e.clientX,
        y: e.clientY,
        px: panRef.current.x,
        py: panRef.current.y,
      };
    };

    const onMouseMove = (e) => {
      if (!dragRef.current) return;
      setPan({
        x: dragRef.current.px + (e.clientX - dragRef.current.x),
        y: dragRef.current.py + (e.clientY - dragRef.current.y),
      });
    };

    const onMouseUp = () => {
      dragRef.current = null;
    };

    svg.addEventListener("wheel", onWheel, { passive: false });
    svg.addEventListener("touchstart", onTouchStart, { passive: false });
    svg.addEventListener("touchmove", onTouchMove, { passive: false });
    svg.addEventListener("touchend", onTouchEnd, { passive: false });
    svg.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      svg.removeEventListener("wheel", onWheel);
      svg.removeEventListener("touchstart", onTouchStart);
      svg.removeEventListener("touchmove", onTouchMove);
      svg.removeEventListener("touchend", onTouchEnd);
      svg.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleStationClick = (station) => {
    if (dragRef.current) return;
    if (!source) return onSelectSource(station);
    if (station === source) return onSelectSource("");
    if (!areConnected(source, station)) return;
    onSelectDestination(station);
  };

  const isDisabled = (station) =>
    source && station !== source && !areConnected(source, station);

  const focusStation = (name) => {
    const p = stationPositions[name];
    if (!p) return;
    setZoom(1.6);
    setPan({
      x: (MAP_WIDTH / 2 - p.x) * 1.6,
      y: (MAP_HEIGHT / 2 - p.y) * 1.6,
    });
  };

  const filteredSuggestions = query
    ? Object.keys(stationPositions)
        .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
        {Object.entries(lineColors).map(([line, color]) => (
          <span key={line} className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            {line}
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search station…"
          className="w-full rounded-xl border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm
            focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand"
        />
        <AnimatePresence>
          {filteredSuggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lift"
            >
              {filteredSuggestions.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => {
                      focusStation(s);
                      setQuery("");
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-surface-2"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Map viewport */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-surface-2
          min-h-[60vh] md:min-h-[520px]"
        style={{ touchAction: "none", overscrollBehavior: "contain" }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full select-none"
          style={{
            touchAction: "none",
            overscrollBehavior: "contain",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition:
              dragRef.current || pinchRef.current
                ? "none"
                : "transform 200ms ease",
            cursor: dragRef.current ? "grabbing" : "grab",
          }}
        >
          {/* Line segments */}
          {metroData.lines.map((line) => {
            const points = line.stations.map((s) => stationPositions[s]);
            const path = points.map((p) => `${p.x},${p.y}`).join(" ");
            return (
              <polyline
                key={line.line}
                points={path}
                fill="none"
                stroke={lineColors[line.line]}
                strokeWidth={6 / zoom + 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.85}
              />
            );
          })}

          {/* Route highlight */}
          {previewPath && previewPath.length > 1 && (
            <polyline
              points={previewPath
                .map((s) => `${stationPositions[s].x},${stationPositions[s].y}`)
                .join(" ")}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth={4 / zoom + 2}
              strokeDasharray="6 8"
              strokeLinecap="round"
              className="animate-dash-move"
            />
          )}

          {/* Stations */}
          {Object.entries(stationPositions).map(([station, pos]) => {
            const disabled = isDisabled(station);
            const isSource = station === source;
            const isDest = station === destination;
            const onPreview = previewSet.has(station);
            const isHovered = hovered === station;
            const isInterchange = INTERCHANGES.has(station);

            const r = isInterchange ? 16 : 12;
            let fill = "rgb(var(--surface))";
            let stroke = "rgb(var(--muted))";

            if (disabled) {
              stroke = "rgb(var(--border))";
            } else if (isSource) {
              fill = "rgb(var(--success))";
              stroke = fill;
            } else if (isDest) {
              fill = "rgb(var(--accent))";
              stroke = fill;
            } else if (onPreview) {
              fill = "rgb(var(--brand))";
              stroke = fill;
            } else if (isHovered) {
              stroke = "rgb(var(--brand))";
            }

            const labelVisible =
              showLabels || isHovered || isSource || isDest || onPreview;

            const orientation = LABEL_ORIENTATION.get(station) || "vertical";

            const fontSize = 14 / zoom;
            const padX = 10 / zoom;
            const pillH = 22 / zoom;
            const textW = (station.length * 7.6 + 12) / zoom;
            const gap = 14 / zoom;

            return (
              <g
                key={station}
                onClick={() => !disabled && handleStationClick(station)}
                onMouseEnter={() => setHovered(station)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 8 / zoom}
                  fill="transparent"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r / zoom + 4}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={3 / zoom + 1.5}
                  opacity={disabled ? 0.35 : 1}
                />
                {isInterchange && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={6 / zoom + 2}
                    fill="rgb(var(--bg))"
                    opacity={disabled ? 0.4 : 1}
                  />
                )}

                {labelVisible &&
                  (orientation === "horizontal" ? (
                    // === Horizontal track → label centered BELOW the dot ===
                    <g>
                      <rect
                        x={pos.x - textW / 2}
                        y={pos.y + gap}
                        rx={6 / zoom}
                        ry={6 / zoom}
                        width={textW}
                        height={pillH}
                        fill="rgb(var(--surface))"
                        stroke="rgb(var(--border))"
                        strokeWidth={1 / zoom}
                        opacity={disabled ? 0.5 : 0.95}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + gap + pillH / 2 + fontSize * 0.35}
                        fontSize={fontSize}
                        fontWeight={600}
                        textAnchor="middle"
                        fill={
                          disabled ? "rgb(var(--muted))" : "rgb(var(--text))"
                        }
                        className="select-none"
                      >
                        {station}
                      </text>
                    </g>
                  ) : (
                    // === Vertical track → label centered to the RIGHT of the dot ===
                    <g>
                      <rect
                        x={pos.x + gap}
                        y={pos.y - pillH / 2}
                        rx={6 / zoom}
                        ry={6 / zoom}
                        width={textW}
                        height={pillH}
                        fill="rgb(var(--surface))"
                        stroke="rgb(var(--border))"
                        strokeWidth={1 / zoom}
                        opacity={disabled ? 0.5 : 0.95}
                      />
                      <text
                        x={pos.x + gap + padX / 2}
                        y={pos.y + fontSize * 0.35}
                        fontSize={fontSize}
                        fontWeight={600}
                        fill={
                          disabled ? "rgb(var(--muted))" : "rgb(var(--text))"
                        }
                        className="select-none"
                      >
                        {station}
                      </text>
                    </g>
                  ))}
              </g>
            );
          })}
        </svg>

        {/* Zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {[
            {
              icon: <Plus size={16} />,
              onClick: () => setZoom((z) => Math.min(3, z + 0.25)),
              label: "Zoom in",
            },
            {
              icon: <Minus size={16} />,
              onClick: () => setZoom((z) => Math.max(0.6, z - 0.25)),
              label: "Zoom out",
            },
            {
              icon: <Locate size={16} />,
              onClick: () => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              },
              label: "Recenter",
            },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              aria-label={btn.label}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border
                bg-surface shadow-soft transition hover:bg-surface-2"
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-success" /> Source
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-accent" /> Destination
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-border opacity-40" />{" "}
          Not reachable
        </span>
      </div>

      {source && componentOf.get(source) !== undefined && (
        <p className="mt-2 text-xs text-muted">
          Grayed-out stations aren't on a connected line from{" "}
          <span className="font-medium text-text">{source}</span>.
        </p>
      )}
    </div>
  );
};

export default MetroMap;
