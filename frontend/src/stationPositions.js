// Precomputed schematic (not geographic) coordinates for every station, used
// by MetroMap.jsx. Regenerate by hand if stations are ever added/removed —
// this intentionally isn't computed at runtime so the map layout is stable.
export const stationPositions = {
  "Dahisar East": { x: 148, y: 238 },
  "Anand Nagar": { x: 148, y: 294 },
  "Kandarpada": { x: 148, y: 350 },
  "Kandivali West": { x: 148, y: 406 },
  "Shimpoli": { x: 148, y: 462 },
  "Borivali West": { x: 148, y: 518 },
  "Shivaji Nagar": { x: 148, y: 574 },
  "Link Road Goregaon West": { x: 148, y: 630 },
  "DN Nagar": { x: 148, y: 686 },
  "Versova": { x: 70, y: 686 },
  "Azad Nagar": { x: 226, y: 686 },
  "Andheri": { x: 304, y: 686 },
  "Western Express Highway": { x: 382, y: 686 },
  "Chakala (JB Nagar)": { x: 460, y: 686 },
  "Marol Naka": { x: 538, y: 686 },
  "Saki Naka": { x: 616, y: 686 },
  "Asalpha": { x: 694, y: 686 },
  "Jagruti Nagar": { x: 772, y: 686 },
  "Ghatkopar": { x: 850, y: 686 },
  "Juhu Circle": { x: 148, y: 742 },
  "Santacruz West": { x: 148, y: 798 },
  "Bandra West": { x: 148, y: 854 },
  "Kalanagar": { x: 226, y: 854 },
  "Bandra Kurla Complex": { x: 226, y: 910 },
  "Kurla East": { x: 304, y: 910 },
  "Chembur": { x: 382, y: 966 },
  "Mankhurd": { x: 460, y: 1022 },
  "Amar Mahal": { x: 850, y: 742 },
  "Bhakti Park": { x: 850, y: 798 },
  "Wadala": { x: 850, y: 854 },
  "Mulund": { x: 850, y: 630 },
  "Teen Hath Naka": { x: 850, y: 574 },
  "Kasarvadavali": { x: 850, y: 518 },
  "Borivali East": { x: 226, y: 350 },
  "Magathane": { x: 304, y: 350 },
  "Poinsur": { x: 382, y: 350 },
  "Gundavali": { x: 460, y: 406 },
  "Mira Road": { x: 148, y: 126 },
  "Bhayandar": { x: 148, y: 70 },
  "Andheri East": { x: 382, y: 630 },
  "CSMIA": { x: 538, y: 574 },
  "Swami Samarth Nagar": { x: 226, y: 630 },
  "Jogeshwari": { x: 304, y: 630 },
  "SEEPZ": { x: 382, y: 574 },
  "Powai": { x: 538, y: 518 },
  "Vikhroli": { x: 772, y: 518 },
  "Thane": { x: 1162, y: 462 },
  "Bhiwandi": { x: 1162, y: 406 },
  "Kalyan": { x: 1162, y: 350 },
};

export const MAP_WIDTH = 1220;
export const MAP_HEIGHT = 1080;

// One color per line, reused for both the map and any legend.
export const lineColors = {
  "Line-1": "#f43f5e", // rose
  "Line-2A": "#eab308", // yellow
  "Line-2B": "#f97316", // orange
  "Line-4": "#22c55e", // green
  "Line-5": "#a8a29e", // stone (visually "disconnected/muted")
  "Line-6": "#ec4899", // pink
  "Line-7": "#a855f7", // purple
  "Line-9 & 7A": "#3b82f6", // blue
};
