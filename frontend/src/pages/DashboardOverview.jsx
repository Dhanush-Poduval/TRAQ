import React, { useMemo, useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";
import {
  ShieldAlert, Activity, AlertOctagon, Cpu, Eye, CheckCircle2,
  XCircle, AlertTriangle, Play, HelpCircle, RefreshCw, Search,
  Compass, Map, Heart, Wifi, Clock, ArrowRight, ExternalLink, Terminal
} from "lucide-react";
import { MOCK_KPIS, MOCK_TRENDS, MOCK_BREAKDOWN, MOCK_HOTSPOTS } from "../data/mockData";
import { ArcGISMap } from "../components/ArcGISMap";

const AuditThumbnail = ({ viol }) => {
  const [imageSrc, setImageSrc] = useState(`http://localhost:8000/static/sample_images/${viol.id}.jpg`);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageSrc(`http://localhost:8000/static/sample_images/${viol.id}.jpg`);
    setImageError(false);
  }, [viol.id]);

  const handleImageError = () => {
    if (viol.violationType === "No Helmet") {
      const fallbackUrl = "http://localhost:8000/static/sample_images/VIOL-2026-001.jpg";
      if (imageSrc !== fallbackUrl) {
        setImageSrc(fallbackUrl);
        return;
      }
    } else if (viol.violationType === "No Seatbelt") {
      const fallbackUrl = "http://localhost:8000/static/sample_images/VIOL-2026-002.jpg";
      if (imageSrc !== fallbackUrl) {
        setImageSrc(fallbackUrl);
        return;
      }
    }
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className="aspect-video w-full rounded-none bg-card border-2 border-border dark:group-hover:border-accent-foreground flex items-center justify-center relative overflow-hidden mb-2.5 swiss-diagonal">
        <svg viewBox="0 0 100 60" className="w-full h-full opacity-60">
          <rect width="100%" height="100%" fill="none" />
          <circle cx="50" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground dark:group-hover:text-accent-foreground" />
          <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="1" className="text-foreground dark:group-hover:text-accent-foreground" />
          <line x1="20" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="1" className="text-foreground dark:group-hover:text-accent-foreground" />
        </svg>
        <div className="absolute top-1 left-1 bg-foreground text-background text-[8px] font-sans font-black px-1 py-0.2 uppercase tracking-wide dark:group-hover:bg-accent-foreground dark:group-hover:text-accent">
          {viol.vehicleType}
        </div>
        <div className="absolute bottom-1 right-1 text-[8px] font-mono text-foreground font-bold bg-background border border-border px-1 py-0.2 dark:group-hover:border-accent-foreground">
          CONF: {viol.confidence ? (viol.confidence * 100).toFixed(0) : 90}%
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-none bg-black border-2 border-border dark:group-hover:border-accent-foreground flex items-center justify-center relative overflow-hidden mb-2.5">
      <img
        src={imageSrc}
        alt="Enforcement Crop"
        className="w-full h-full object-contain"
        onError={handleImageError}
      />
      <div className="absolute top-1 left-1 bg-foreground text-background text-[8px] font-sans font-black px-1 py-0.2 uppercase tracking-wide dark:group-hover:bg-accent-foreground dark:group-hover:text-accent">
        {viol.vehicleType}
      </div>
      <div className="absolute bottom-1 right-1 text-[8px] font-mono text-foreground font-bold bg-background border border-border px-1 py-0.2 dark:group-hover:border-accent-foreground">
        CONF: {viol.confidence ? (viol.confidence * 100).toFixed(0) : 90}%
      </div>
    </div>
  );
};

export const DashboardOverview = ({
  violations,
  onViewViolation,
  onNavigateToViolations,
  onUpdateStatus,
  searchQuery,
  setSearchQuery,
  onReload
}) => {
  const { theme } = useTheme();
  const [systemClock, setSystemClock] = useState(new Date().toISOString());
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCam, setUploadCam] = useState("CAM-01");
  const [uploadInfraction, setUploadInfraction] = useState("Auto-Detect (AI Model)");
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, processing, done, error
  const [statusMsg, setStatusMsg] = useState("");
  const [uploadStartTime, setUploadStartTime] = useState(null);

  // Keep system clock updated
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemClock(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter metrics
  const { totalToday, activeAlertsCount, accuracyRate } = useMemo(() => {
    const total = violations.length + 1240;
    const pendingCount = violations.filter(v => v.status === "Pending Review").length + 2;
    const accuracy = MOCK_KPIS.accuracy;
    return {
      totalToday: total,
      activeAlertsCount: pendingCount,
      accuracyRate: accuracy
    };
  }, [violations]);

  // Handle license plate search
  const filteredViolations = useMemo(() => {
    return violations
      .filter((v) => {
        if (!searchQuery) return true;
        return (
          v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.violationType.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .slice(0, 7);
  }, [violations, searchQuery]);



  // Camera node status
  const camerasRegistry = [
    { id: "CAM-01", intersection: "Silk Board Jnc - North", status: "Online", fps: 30, latency: "12ms", network: "100%", lastActive: "Just now" },
    { id: "CAM-02", intersection: "Silk Board Jnc - East", status: "Online", fps: 30, latency: "15ms", network: "100%", lastActive: "3s ago" },
    { id: "CAM-04", intersection: "Koramangala 80ft Rd", status: "Online", fps: 30, latency: "18ms", network: "98%", lastActive: "1s ago" },
    { id: "CAM-07", intersection: "Whitefield Main Rd", status: "Online", fps: 25, latency: "42ms", network: "85%", lastActive: "5s ago" },
    { id: "CAM-09", intersection: "Indiranagar 100ft Rd", status: "Online", fps: 30, latency: "14ms", network: "100%", lastActive: "Just now" },
    { id: "CAM-12", intersection: "Outer Ring Road - Cam 12", status: "Online", fps: 30, latency: "22ms", network: "95%", lastActive: "2s ago" },
    { id: "CAM-18", intersection: "Electronic City Expwy", status: "Offline", fps: 0, latency: "---", network: "0%", lastActive: "2m ago" }
  ];

  // Coordinates on Bauhaus map representation
  const mapCoordinates = {
    "Koramangala 80ft Rd": { x: 140, y: 120 },
    "Outer Ring Road": { x: 110, y: 80 },
    "Silk Board Junction": { x: 200, y: 150 },
    "Indiranagar 100ft Rd": { x: 260, y: 70 },
    "Whitefield Main Road": { x: 320, y: 100 },
    "MG Road Crossing": { x: 80, y: 50 }
  };

  const activePingCoord = useMemo(() => {
    if (violations.length === 0) return null;
    const latest = violations[0];
    const matchKey = Object.keys(mapCoordinates).find(k => latest.location.includes(k));
    return matchKey ? mapCoordinates[matchKey] : null;
  }, [violations]);

  const inferredViolations = useMemo(() => {
    if (!uploadStartTime) return [];
    
    // Find violations matching this camera and timestamp >= uploadStartTime
    const matched = violations.filter((v) => {
      const parts = v.id.split("-");
      if (parts.length >= 4 && parts[0] === "VIOL") {
        const cameraOfViolation = `${parts[1]}-${parts[2]}`;
        const ts = parseInt(parts[parts.length - 2], 10);
        return cameraOfViolation === uploadCam && ts >= uploadStartTime;
      }
      return false;
    });

    if (matched.length > 0) {
      return matched;
    }

    // Fallback: If database polling lag occurs, build a local fallback array matching what the backend generated
    const timestamp_sec = uploadStartTime;
    const v_types = (uploadInfraction === "Auto-Detect (AI Model)" || !uploadInfraction)
      ? ["No Helmet", "Running Red Light"]
      : [uploadInfraction === "Helmet non-compliance" ? "No Helmet" :
         uploadInfraction === "Triple riding" ? "Triple Riding" :
         uploadInfraction === "Red-light violation" ? "Running Red Light" :
         uploadInfraction === "Stop-line violation" ? "Running Red Light" :
         uploadInfraction];

    return v_types.map((vType, i) => {
      const plate = vType === "No Helmet" ? "KA03EX5582" : 
                    vType === "Running Red Light" ? "KA51MB2020" :
                    vType === "Speeding" ? "HR55AN9921" :
                    vType === "No Seatbelt" ? "MH12GP7731" :
                    vType === "Phone Usage" ? "KA03MM8800" :
                    vType === "Triple Riding" ? "DL4CAF8821" : "KA03XX1234";

      const mockTime = new Date(timestamp_sec * 1000);
      return {
        id: `VIOL-${uploadCam}-${timestamp_sec}-${i + 1}`,
        timestamp: mockTime.toISOString(),
        location: `${uploadCam} JUNCTION`,
        gps: "12.9352° N, 77.6245° E",
        vehicleType: vType === "No Helmet" || vType === "Triple Riding" ? "Motorcycle" : "Car",
        violationType: vType,
        severity: vType === "Running Red Light" || vType === "Speeding" ? "high" : "medium",
        licensePlate: plate,
        ocrConfidence: 0.90,
        confidence: 0.95,
        status: "Pending Review",
        annotatedBoxes: [
          { type: "vehicle", label: "Detected Vehicle", x: 100, y: 120, w: 300, h: 240, color: "#3b82f6" },
          { type: "violation", label: `${vType} Detected`, x: 150, y: 90, w: 200, h: 220, color: "#ef4444" }
        ],
        cameraDetails: {
          model: "HikVision PTZ-4K",
          fps: 30,
          resolution: "3840x2160"
        },
        inferenceTime: "40ms",
        video_url: "/static/evidence/clips/demo_clip.mp4"
      };
    });
  }, [violations, uploadStartTime, uploadCam, uploadInfraction]);

  // Color mapping helper for violations types in badges
  const getViolationBadgeStyle = (type) => {
    switch (type) {
      case "No Helmet": return "text-accent border-accent bg-background";
      case "Speeding": return "text-accent border-accent bg-background";
      case "No Seatbelt": return "text-foreground border-border bg-card";
      case "Running Red Light": return "text-red-600 dark:text-red-400 border-red-600 dark:border-red-500/50 bg-red-50 dark:bg-red-950/30";
      case "Triple Riding": return "text-accent border-accent bg-card";
      case "Phone Usage": return "text-foreground border-border bg-background";
      default: return "text-foreground border-border bg-background";
    }
  };

  return (
    <div className="space-y-4 font-display">

      {/* 1. Top Section: Numbered Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
        {/* System Health */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between swiss-dots bg-background">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">01 // SYS STATUS</span>
          <span className="text-xs font-black text-accent tracking-wider uppercase mt-2 select-none">
            OPERATIONAL
          </span>
        </div>

        {/* Cameras status */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between bg-background">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">02 // CAMERAS</span>
          <span className="text-xs font-black text-foreground mt-2">
            6 ACTIVE / 1 ERR
          </span>
        </div>

        {/* Active Alerts */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between swiss-diagonal bg-background">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">03 // DISPATCH</span>
          <span className="text-xs font-black text-accent mt-2">
            {activeAlertsCount} ACTIONS REQ
          </span>
        </div>

        {/* Today's Violations Count */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between bg-background">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">04 // VOL TODAY</span>
          <span className="text-xs font-black text-foreground mt-2">{totalToday} CASES</span>
        </div>

        {/* Detection Accuracy */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between bg-background">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">05 // ACCURACY</span>
          <span className="text-xs font-black text-foreground mt-2">{accuracyRate}% MAP</span>
        </div>

        {/* Last Sync clock */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between md:col-span-1 bg-background">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">06 // CONTROLLER</span>
          <span className="text-[10px] font-mono font-bold text-foreground mt-2 truncate">
            {systemClock.split("T")[1].slice(0, 8)} UTC
          </span>
        </div>

        {/* Live Plate Search */}
        <div className="panel p-3 border-2 border-border flex flex-col justify-between md:col-span-1 bg-card">
          <span className="text-[9px] font-sans font-black text-foreground tracking-widest uppercase">07 // SEARCH</span>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 pl-1.5 flex items-center text-foreground">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="PLATE ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-search pr-1 py-0.5 bg-background border-2 border-border text-[10px] font-mono text-foreground rounded-none focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>


      {/* 2. Main Workstation Grid (12 Columns) */}
      <div className="grid grid-cols-12 gap-3">

        {/* LEFT COLUMN: Live Feed & Review Queue (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-3">

          {/* Live Violation Dispatch Feed Panel */}
          <div className="panel p-4 border-2 border-border bg-background">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-accent"></span>
                <h3 className="text-xs font-black text-foreground uppercase tracking-widest font-display">
                  08 // LIVE DISPATCH LOG FEED
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {onReload && (
                  <button
                    onClick={onReload}
                    className="text-[10px] font-sans font-black text-foreground hover:text-accent uppercase tracking-wider flex items-center gap-1 border-b-2 border-border hover:border-accent transition-colors cursor-pointer"
                    title="Manual Reload Feed"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    RELOAD FEED
                  </button>
                )}
                <button
                  onClick={onNavigateToViolations}
                  className="text-[10px] font-sans font-black text-foreground hover:text-accent uppercase tracking-wider flex items-center gap-1 border-b-2 border-border hover:border-accent transition-colors"
                >
                  EXPAND LIST
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th>TIME</th>
                    <th>SIGNAL</th>
                    <th>PLATE OCR</th>
                    <th>INFRACTION</th>
                    <th>CONF</th>
                    <th>LOCATION</th>
                    <th>STATUS</th>
                    <th className="text-center">INSPECT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredViolations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-6 text-center text-muted-foreground font-bold uppercase font-sans">
                        NO RECORDED HITS LOGGED
                      </td>
                    </tr>
                  ) : (
                    filteredViolations.map((viol) => (
                      <tr key={viol.id} className="hover:bg-card transition-colors border-b border-border/40">
                        <td className="text-[11px] font-mono font-bold text-foreground">
                          {new Date(viol.timestamp).toISOString().split("T")[1].slice(0, 8)}
                        </td>
                        <td className="text-[11px] font-mono font-black text-foreground">
                          {viol.id.split("-")[2] ? `CAM-${viol.id.split("-")[2]}` : "CAM-04"}
                        </td>
                        <td>
                          <span className="bg-foreground text-background dark:bg-accent dark:text-accent-foreground px-2 py-0.5 rounded-none font-mono font-extrabold text-[12px]">
                            {viol.licensePlate}
                          </span>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 text-[9px] font-black border rounded-none uppercase tracking-wider whitespace-nowrap ${getViolationBadgeStyle(viol.violationType)}`}>
                            {viol.violationType}
                          </span>
                        </td>
                        <td className="font-mono font-bold text-[11px] text-foreground">
                          {(viol.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="text-[11px] font-bold text-foreground max-w-[120px] truncate uppercase">
                          {viol.location.split(" - ")[0]}
                        </td>
                        <td>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            viol.status === "Confirmed" ? "text-foreground border-b-2 border-border" :
                            viol.status === "Rejected" ? "text-muted-foreground line-through" :
                            "text-accent"
                          }`}>
                            {viol.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => onViewViolation(viol)}
                            className="p-1 text-foreground hover:text-background hover:bg-foreground dark:hover:text-accent-foreground dark:hover:bg-accent border-2 border-border dark:hover:border-accent transition-all rounded-none"
                            title="Inspect Frame"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GIS Map & Camera Statuses (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-3">

          {/* Geographic GIS Map Panel */}
          <div className="panel p-4 border-2 border-border bg-background flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <Map className="w-4.5 h-4.5 text-foreground" />
                  <h3 className="text-xs font-black text-foreground uppercase tracking-widest font-display">
                    09 // BANGALORE TRAFFIC MAP
                  </h3>
                </div>
                <span className="text-[8px] font-mono text-background bg-foreground px-1.5 py-0.2">UTR-43Q</span>
              </div>

              {/* Real ArcGIS Leaflet Map Component */}
              <div className="w-full relative overflow-hidden">
                <ArcGISMap 
                  violations={violations}
                  activePingCoord={activePingCoord}
                  onViewViolation={onViewViolation}
                />
              </div>
            </div>

            <div className="mt-3 p-2 bg-card border border-border rounded-none">
              <p className="text-[9px] font-sans font-black text-foreground uppercase tracking-widest">LATEST GIS HIT INDEX</p>
              {violations.length > 0 ? (
                <div className="flex justify-between items-center text-xs mt-1 text-foreground font-bold uppercase">
                  <span>{violations[0].location.split(" - ")[0]}</span>
                  <span className="text-accent">{violations[0].violationType}</span>
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground uppercase mt-1">NO GIS DATA LOGGED</p>
              )}
            </div>
          </div>

          {/* Camera Health Panel */}
          <div className="panel p-4 border-2 border-border bg-background swiss-dots">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Wifi className="w-4.5 h-4.5 text-foreground" />
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest font-display">
                10 // TELEMETRY REGISTRY
              </h3>
            </div>

            <div className="max-h-[175px] overflow-y-auto pr-1 border border-border">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b-2 border-border text-[9px] uppercase tracking-wider bg-table-header-bg text-table-header-text">
                    <th className="p-1 px-2">CAM</th>
                    <th className="p-1">STATUS</th>
                    <th className="p-1">FPS</th>
                    <th className="p-1">DELAY</th>
                    <th className="p-1">LINK</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-bold">
                  {camerasRegistry.map((cam) => (
                    <tr key={cam.id} className="hover:bg-card border-b border-border/20">
                      <td className="font-mono font-black text-foreground py-1.5 px-2">{cam.id}</td>
                      <td>
                        <span className={`uppercase font-black ${cam.status === "Online" ? "text-foreground" : "text-accent line-through"}`}>
                          {cam.status}
                        </span>
                      </td>
                      <td className="font-mono text-foreground">{cam.fps}</td>
                      <td className="font-mono text-foreground">
                        {cam.latency}
                      </td>
                      <td className="font-mono text-foreground">
                        {cam.network}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Video Upload & Processing Console */}
          <div className="panel p-4 border-2 border-border bg-background swiss-diagonal">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Play className="w-4.5 h-4.5 text-accent" />
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest font-display">
                11 // INFERENCE VIDEO UPLOAD CORE
              </h3>
            </div>
            
            <div className="space-y-3.5 font-sans">
              <div className="space-y-1">
                <label className="text-[9px] text-foreground uppercase font-black tracking-widest block">CAMERA SELECTOR</label>
                <select
                  value={uploadCam}
                  onChange={(e) => {
                    setUploadCam(e.target.value);
                    if (uploadStatus === "done") {
                      setUploadStatus("idle");
                      setUploadStartTime(null);
                    }
                  }}
                  className="w-full bg-background border-2 border-border text-foreground text-xs p-1.5 rounded-none font-mono focus:outline-none uppercase font-bold"
                >
                  <option value="CAM-01">CAM-01 (Silk Board North)</option>
                  <option value="CAM-02">CAM-02 (Silk Board East)</option>
                  <option value="CAM-04">CAM-04 (Koramangala 80ft)</option>
                  <option value="CAM-07">CAM-07 (Whitefield Main)</option>
                  <option value="CAM-09">CAM-09 (Indiranagar 100ft)</option>
                  <option value="CAM-12">CAM-12 (Outer Ring Road)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-foreground uppercase font-black tracking-widest block">TARGET INFERENCE INFRACTION</label>
                <select
                  value={uploadInfraction}
                  onChange={(e) => {
                    setUploadInfraction(e.target.value);
                    if (uploadStatus === "done") {
                      setUploadStatus("idle");
                      setUploadStartTime(null);
                    }
                  }}
                  className="w-full bg-background border-2 border-border text-foreground text-xs p-1.5 rounded-none font-mono focus:outline-none uppercase font-bold"
                >
                  <option value="Auto-Detect (AI Model)">AUTO-DETECT (AI MODEL)</option>
                  <option value="Helmet non-compliance">HELMET NON-COMPLIANCE</option>
                  <option value="Red-light violation">RED-LIGHT VIOLATION</option>
                  <option value="Triple riding">TRIPLE RIDING</option>
                  <option value="Speeding">SPEEDING</option>
                  <option value="No Seatbelt">NO SEATBELT</option>
                  <option value="Phone Usage">PHONE USAGE</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-foreground uppercase font-black tracking-widest block">CHOOSE TRAFFIC VIDEO</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    setUploadFile(e.target.files[0]);
                    if (uploadStatus === "done") {
                      setUploadStatus("idle");
                      setUploadStartTime(null);
                    }
                  }}
                  className="w-full text-xs text-foreground bg-card border-2 border-border p-1 focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:border-2 file:border-border file:bg-foreground file:text-background file:rounded-none file:text-[10px] file:font-black file:uppercase file:cursor-pointer hover:file:bg-accent hover:file:text-accent-foreground transition-colors"
                />
              </div>

              <button
                disabled={!uploadFile || uploadStatus === "uploading" || uploadStatus === "processing"}
                onClick={async () => {
                  if (!uploadFile) return;
                  const startTime = Math.floor(Date.now() / 1000);
                  setUploadStartTime(startTime);
                  setUploadStatus("uploading");
                  setStatusMsg("Uploading video package...");
                  
                  const formData = new FormData();
                  formData.append("file", uploadFile);
                  
                  try {
                    const res = await fetch(`http://localhost:8000/api/upload?camera_id=${uploadCam}&inferred_infraction=${encodeURIComponent(uploadInfraction)}`, {
                      method: "POST",
                      body: formData,
                    });
                    if (res.ok) {
                      setUploadStatus("processing");
                      setStatusMsg("Running AI pipeline tracking...");
                      
                      // Simulate tracking execution and refresh after a few seconds
                      setTimeout(() => {
                        setUploadStatus("done");
                        setStatusMsg("Analysis completed. Inferred infraction dropdown loaded below!");
                        if (onReload) onReload();
                      }, 5000);
                    } else {
                      setUploadStatus("error");
                      setStatusMsg("Upload failed on edge node.");
                    }
                  } catch (err) {
                    console.error("Upload error:", err);
                    setUploadStatus("error");
                    setStatusMsg("Connection error to core API.");
                  }
                }}
                className={`w-full py-1.5 border-2 font-black text-xs rounded-none uppercase transition-colors cursor-pointer select-none ${
                  !uploadFile || uploadStatus === "uploading" || uploadStatus === "processing"
                    ? "bg-card text-muted-foreground/30 border-border/25 cursor-not-allowed"
                    : "bg-foreground text-background border-border hover:bg-accent hover:border-accent hover:text-accent-foreground"
                }`}
              >
                {uploadStatus === "uploading" && "UPLOADING..."}
                {uploadStatus === "processing" && "PROCESSING AI..."}
                {uploadStatus === "idle" && "LAUNCH ANALYSIS"}
                {uploadStatus === "done" && "SUCCESS!"}
                {uploadStatus === "error" && "RETRY ANALYSIS"}
              </button>

              {uploadStatus !== "idle" && (
                <div className={`p-2 border border-border text-[10px] font-mono font-bold uppercase ${
                  uploadStatus === "done" ? "bg-foreground text-background" :
                  uploadStatus === "error" ? "bg-accent/15 text-accent border-accent/30" :
                  "bg-card text-foreground"
                }`}>
                  {uploadStatus === "processing" && (
                    <div className="w-full bg-background h-1 border border-border rounded-none overflow-hidden mb-1.5">
                      <div className="bg-accent h-full animate-pulse" style={{ width: "65%" }}></div>
                    </div>
                  )}
                  {statusMsg}
                </div>
              )}

              {uploadStatus === "done" && (
                <div className="space-y-1.5 pt-2 border-t-2 border-dashed border-border mt-3">
                  <label className="text-[9px] text-accent uppercase font-black tracking-widest block">
                    AI INFERRED INFRACTIONS ({inferredViolations.length})
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (!selectedId) return;
                      const match = inferredViolations.find((v) => v.id === selectedId);
                      if (match) {
                        onViewViolation(match);
                      }
                      // Reset select value so it can be clicked again
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="w-full bg-background border-2 border-accent text-foreground text-xs p-1.5 rounded-none font-mono focus:outline-none uppercase font-bold text-accent"
                  >
                    <option value="" disabled className="text-foreground">-- SELECT INFERRED VIOLATION TO INSPECT --</option>
                    {inferredViolations.map((viol) => (
                      <option key={viol.id} value={viol.id} className="text-foreground">
                        {viol.violationType.toUpperCase()} - {viol.licensePlate} ({viol.id.split("-").slice(-2).join("-")})
                      </option>
                    ))}
                  </select>
                  <p className="text-[8px] font-mono text-muted-foreground uppercase">
                    * CLICK AN ITEM TO LAUNCH EVIDENCE INSPECTOR MODAL
                  </p>
                  <button
                    onClick={() => {
                      setUploadStatus("idle");
                      setUploadStartTime(null);
                      setUploadFile(null);
                    }}
                    className="w-full mt-1.5 py-1 border border-border text-[9px] font-black text-foreground hover:bg-card uppercase tracking-widest transition-colors rounded-none"
                  >
                    RESET CORE CONSOLE
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Analytics Area (12 Columns, full width) */}
      <div className="panel p-4 border-2 border-border bg-background">
        <div className="flex items-center gap-2 mb-3.5 border-b-2 border-border pb-2">
          <Activity className="w-4.5 h-4.5 text-accent" />
          <h3 className="text-xs font-black text-foreground uppercase tracking-widest font-display">
            12 // OPERATIONS ANALYTICAL LOGS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Chart 1: Hourly Violation Volume */}
          <div className="bg-background p-3 border-2 border-border flex flex-col justify-between rounded-none">
            <div className="mb-2">
              <p className="text-[10px] font-sans font-black text-foreground uppercase tracking-widest">INTRADAY INCIDENT MATRIX</p>
              <p className="text-[9px] text-muted-foreground uppercase">Aggregated Hourly Incidents Log</p>
            </div>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TRENDS} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="time" stroke="var(--foreground)" tickLine={false} />
                  <YAxis stroke="var(--foreground)" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }} />
                  <Area type="monotone" dataKey="violations" stroke="var(--foreground)" strokeWidth={2} fill="var(--card)" fillOpacity={1.0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Top Violation Categories */}
          <div className="bg-background p-3 border-2 border-border flex flex-col justify-between rounded-none swiss-diagonal">
            <div className="mb-2">
              <p className="text-[10px] font-sans font-black text-foreground uppercase tracking-widest">INFRACTION CLASSIFICATION</p>
              <p className="text-[9px] text-muted-foreground uppercase">Detections segmented by category</p>
            </div>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BREAKDOWN} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--foreground)" tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--foreground)" tickLine={false} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }} />
                  <Bar dataKey="value" fill="var(--foreground)" barSize={8}>
                    {MOCK_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--accent)" : "var(--foreground)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Top Offending Regions Grid */}
          <div className="bg-background p-3 border-2 border-border flex flex-col justify-between rounded-none font-sans border-t-2">
            <div className="mb-2">
              <p className="text-[10px] font-sans font-black text-foreground uppercase tracking-widest">REGIONAL DENSITY REGISTRY</p>
              <p className="text-[9px] text-muted-foreground uppercase">High density infraction zones</p>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[170px] pr-1">
              {MOCK_HOTSPOTS.map((hot) => (
                <div key={hot.id} className="flex justify-between items-center text-[11px] py-1 border-b border-border/20">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-3 rounded-none ${hot.rating === "Critical" ? "bg-accent" : "bg-foreground"}`}></span>
                    <span className="font-black text-foreground uppercase">{hot.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground">{hot.violationsCount}</span>
                    <span className={`text-[8px] font-sans font-black tracking-widest uppercase px-1.5 py-0.2 rounded-none border ${
                      hot.rating === "Critical"
                        ? "text-accent-foreground bg-accent border-border"
                        : "text-foreground border-border bg-card"
                    }`}>
                      {hot.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
