import React, { useState, useMemo } from "react";
import { MOCK_HEATMAP, MOCK_HOTSPOTS } from "../data/mockData";
import { Download, MapPin, AlertTriangle, Map, ChevronDown } from "lucide-react";

export const Analytics = () => {
  const [selectedArea, setSelectedArea] = useState("Entire Bangalore");

  const areas = [
    "Entire Bangalore",
    "Silk Board",
    "Koramangala",
    "Outer Ring Road",
    "MG Road",
    "Indiranagar",
    "Whitefield"
  ];

  const areaMultipliers = {
    "Entire Bangalore": 1.0,
    "Silk Board": 0.5,
    "Koramangala": 0.4,
    "Outer Ring Road": 0.45,
    "MG Road": 0.25,
    "Indiranagar": 0.2,
    "Whitefield": 0.3
  };

  const mapMarkers = [
    { id: "silk", name: "Silk Board", cx: 220, cy: 100, count: 245, color: "#FF3000" },
    { id: "kora", name: "Koramangala", cx: 220, cy: 160, count: 182, color: "black" },
    { id: "orr", name: "Outer Ring Road", cx: 40, cy: 100, count: 168, color: "black" },
    { id: "mg", name: "MG Road", cx: 40, cy: 160, count: 94, color: "black" },
    { id: "indira", name: "Indiranagar", cx: 120, cy: 60, count: 88, color: "black" },
    { id: "white", name: "Whitefield", cx: 320, cy: 60, count: 75, color: "black" }
  ];

  // Dynamic Heatmap based on area selection
  const filteredHeatmap = useMemo(() => {
    const mult = areaMultipliers[selectedArea] || 1.0;
    if (mult === 1.0) return MOCK_HEATMAP;

    return MOCK_HEATMAP.map((item) => ({
      day: item.day,
      "00-04": Math.round(item["00-04"] * mult),
      "04-08": Math.round(item["04-08"] * mult),
      "08-12": Math.round(item["08-12"] * mult),
      "12-16": Math.round(item["12-16"] * mult),
      "16-20": Math.round(item["16-20"] * mult),
      "20-24": Math.round(item["20-24"] * mult)
    }));
  }, [selectedArea]);

  // Dynamic Hotspot list based on area selection
  const filteredHotspots = useMemo(() => {
    if (selectedArea === "Entire Bangalore") return MOCK_HOTSPOTS;
    return MOCK_HOTSPOTS.filter(
      (hot) =>
        hot.name.toLowerCase().includes(selectedArea.toLowerCase()) ||
        (selectedArea === "Outer Ring Road" && hot.name.includes("ORR"))
    );
  }, [selectedArea]);

  // Heatmap helper to map intensity to color codes
  const getHeatmapColor = (val) => {
    if (val > 80) return "bg-accent text-accent-foreground border border-border";
    if (val > 60) return "bg-foreground text-background border border-border";
    if (val > 40) return "bg-card text-foreground border border-border";
    if (val > 20) return "bg-card/60 text-foreground border border-border/40";
    return "bg-background text-muted-foreground border border-border/20";
  };

  const handleExport = (format) => {
    alert(`Generating audit logs for ${selectedArea} in ${format.toUpperCase()} format.`);
  };

  return (
    <div className="space-y-4 font-display text-xs bg-background text-foreground">

      {/* Top Banner Actions & Area Selector */}
      <div className="panel p-4 border-2 border-border bg-background flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div className="space-y-0.5 font-display">
          <h3 className="text-xs font-black text-foreground uppercase tracking-widest">REPORTS & AUDIT EXPORTS</h3>
          <p className="text-[10px] text-muted-foreground">Generate CSV/PDF incident logs for submission archives</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-display">
          {/* Area Selector Dropdown */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-1.5 bg-background border-2 border-border rounded-none text-xs font-black focus:outline-none cursor-pointer text-foreground uppercase"
            >
              {areas.map((a) => (
                <option key={a} value={a} className="bg-background text-foreground">
                  REGION: {a.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-foreground pointer-events-none" />
          </div>

          <button
            onClick={() => handleExport("csv")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-none bg-background hover:bg-foreground text-foreground hover:text-background dark:hover:bg-accent dark:hover:text-accent-foreground border-2 border-border dark:hover:border-accent transition-all cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            CSV LOG
          </button>

          <button
            onClick={() => handleExport("pdf")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-none bg-accent hover:bg-foreground text-accent-foreground hover:text-background dark:hover:bg-accent dark:hover:text-accent-foreground border-2 border-border dark:hover:border-accent transition-all cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            PDF REPORT
          </button>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="panel p-4 border-2 border-border bg-background space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none">
          <div>
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest">
              14 // INCIDENT HEATMAP MATRIX ({selectedArea.toUpperCase()})
            </h3>
            <p className="text-[10px] text-muted-foreground">Cross-reference of hourly volume indices against weekday schedules</p>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 bg-foreground text-background border-2 border-border rounded-none font-black tracking-wider uppercase">
            MULTIPLIER: {areaMultipliers[selectedArea]}x
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pt-1">
          <div className="min-w-[600px] space-y-1">
            <div className="grid grid-cols-7 text-center text-[9px] font-black text-foreground uppercase tracking-widest mb-1.5">
              <span className="col-span-1 text-left pl-2">DAY</span>
              <span>00:00-04:00</span>
              <span>04:00-08:00</span>
              <span>08:00-12:00</span>
              <span>12:00-16:00</span>
              <span>16:00-20:00</span>
              <span>20:00-24:00</span>
            </div>

            {filteredHeatmap.map((item) => (
              <div key={item.day} className="grid grid-cols-7 items-center text-center text-xs font-mono">
                <span className="col-span-1 text-left font-sans font-black text-foreground pl-2 uppercase tracking-wide">
                  {item.day}
                </span>
                <span className={`py-2 rounded-none mx-0.5 font-extrabold transition-colors ${getHeatmapColor(item["00-04"])}`}>
                  {item["00-04"]}
                </span>
                <span className={`py-2 rounded-none mx-0.5 font-extrabold transition-colors ${getHeatmapColor(item["04-08"])}`}>
                  {item["04-08"]}
                </span>
                <span className={`py-2 rounded-none mx-0.5 font-extrabold transition-colors ${getHeatmapColor(item["08-12"])}`}>
                  {item["08-12"]}
                </span>
                <span className={`py-2 rounded-none mx-0.5 font-extrabold transition-colors ${getHeatmapColor(item["12-16"])}`}>
                  {item["12-16"]}
                </span>
                <span className={`py-2 rounded-none mx-0.5 font-extrabold transition-colors ${getHeatmapColor(item["16-20"])}`}>
                  {item["16-20"]}
                </span>
                <span className={`py-2 rounded-none mx-0.5 font-extrabold transition-colors ${getHeatmapColor(item["20-24"])}`}>
                  {item["20-24"]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-end items-center gap-3 text-[9px] text-foreground pt-1 font-black uppercase tracking-widest select-none">
          <span>LEGEND:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-background border border-border/20"></span>
            <span>LOW (&lt;20)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-card/60 border border-border/40"></span>
            <span>MODERATE (20-40)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-card border border-border"></span>
            <span>HIGH (40-60)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-foreground border border-border"></span>
            <span>SEVERE (60-80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-accent border border-border"></span>
            <span>CRITICAL (&gt;80)</span>
          </div>
        </div>
      </div>

      {/* Map Hotspots and offending areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">

        {/* Hotspot Visual Table */}
        <div className="panel p-4 border-2 border-border bg-background space-y-4 swiss-dots">
          <div>
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest">15 // HIGH INCIDENT INTERSECTIONS</h3>
            <p className="text-[10px] text-muted-foreground">Intersections registry grouped by density indices</p>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {filteredHotspots.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground font-black uppercase">
                NO RECORDED HOTSPOTS IN SELECTED AREA
              </div>
            ) : (
              filteredHotspots.map((hot) => (
                <div
                  key={hot.id}
                  className="p-2.5 bg-background border-2 border-border rounded-none flex items-center justify-between gap-3 group transition-colors duration-300 dark:hover:bg-accent dark:hover:border-accent"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-card text-foreground rounded-none border border-border dark:group-hover:border-accent-foreground dark:group-hover:bg-background dark:group-hover:text-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground uppercase dark:group-hover:text-accent-foreground">{hot.name}</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5 font-bold uppercase dark:group-hover:text-accent-foreground/85">PRIMARY: {hot.mainViolation}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-foreground font-mono dark:group-hover:text-accent-foreground">{hot.violationsCount} COUNTS</span>
                    <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.2 rounded-none border ${
                      hot.rating === "Critical"
                        ? "bg-accent text-accent-foreground border-border dark:group-hover:bg-background dark:group-hover:text-foreground dark:group-hover:border-background"
                        : "bg-card text-foreground border-border dark:group-hover:bg-background dark:group-hover:text-foreground dark:group-hover:border-background"
                    }`}>
                      {hot.rating}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hotspot Map Panel */}
        <div className="panel p-4 border-2 border-border bg-background flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest font-display">GEOGRAPHIC REGISTRY GRID OVERLAY</h3>
            <p className="text-[10px] text-muted-foreground">Crosshairs coordinate system of registry nodes</p>
          </div>

          {/* SVG Map Grid */}
          <div className="aspect-video w-full rounded-none bg-map-bg border-2 border-border relative overflow-hidden flex items-center justify-center mt-2.5">
            <svg viewBox="0 0 400 220" className="w-full h-full opacity-90 swiss-grid-pattern">
              {/* Road vectors representing intersections */}
              <path d="M 40 0 L 40 220" stroke="var(--road-stroke)" strokeWidth="6" />
              <path d="M 220 0 L 220 220" stroke="var(--road-stroke)" strokeWidth="8" />
              <path d="M 0 100 L 400 100" stroke="var(--road-stroke)" strokeWidth="8" />
              <path d="M 0 160 L 400 160" stroke="var(--road-stroke)" strokeWidth="6" />

              {/* Radar nodes */}
              {mapMarkers.map((marker) => {
                const isSelected = selectedArea === "Entire Bangalore" || selectedArea === marker.name;
                const opacity = isSelected ? 1.0 : 0.25;
                const showPing = isSelected && selectedArea !== "Entire Bangalore";
                const isSilk = marker.id === "silk";
                const nodeColor = isSilk ? "var(--accent)" : "var(--foreground)";

                return (
                  <g key={marker.id} opacity={opacity} className="transition-all duration-150">
                    {showPing && (
                      <circle cx={marker.cx} cy={marker.cy} r={8} fill={nodeColor} fillOpacity="0.4" className="animate-ping" />
                    )}
                    <circle cx={marker.cx} cy={marker.cy} r={4} fill={nodeColor} stroke="var(--border)" strokeWidth="1" />
                    <text
                      x={marker.cx + 6}
                      y={marker.cy - 3}
                      fill="var(--foreground)"
                      fontSize="7"
                      fontWeight="900"
                      fontFamily="monospace"
                      textTransform="uppercase"
                    >
                      {marker.name.toUpperCase()} ({marker.count})
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-2 left-2 text-[8px] bg-background border-2 border-border text-foreground px-1.5 py-0.2 rounded-none font-mono font-bold flex items-center gap-1">
              <Map className="w-3 h-3 text-accent" />
              <span>COORDS: GIS_UTM_REF // {selectedArea.toUpperCase()}</span>
            </div>
          </div>

          <div className="p-2 bg-card text-foreground border border-border rounded-none flex items-center gap-2 text-[10px] mt-2.5 font-bold uppercase select-none">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>GIS records update pipeline synced. Coords grid locked.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
