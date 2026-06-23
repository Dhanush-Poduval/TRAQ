# TRAQ: TrafficVision AI / Smart Traffic Enforcement & GIS Analytics Platform

## 💡 1. Inspiration
Bengaluru's traffic ecosystem is one of the most complex in the world. Enforcing traffic rules across thousands of intersections is traditionally done via physical checkpoints or manual CCTV video auditing. Physical checkpoints slow traffic, while manual reviews are slow, prone to oversight, and impossible to scale. 

Furthermore, existing automated speed camera systems fail to detect other high-frequency safety hazards. These include helmet non-compliance, seatbelt neglect, triple riding on two-wheelers, red-light violations, and distracted driving (phone usage). 

We created **TRAQ (TrafficVision AI)** to bridge the gap between Edge Computer Vision and Urban GIS Mapping. TRAQ analyzes traffic video streams, automatically segments vehicles and identifies multiple concurrent safety violations, extracts license plates, and visualizes the results on the official Bangalore GIS Masterplan layers.

---

## 🚀 2. Core Platform Features

### A. Live Dispatch Log Feed (Panel 08)
* **Real-time Queue**: Organizes active infractions in a clean chronological log (newest first) fetched via a background sync process.
* **Plate Uniqueness Filter**: Groups multiple consecutive detections of the same vehicle and retains only the latest record to avoid cluttering operator views.
* **Audit Controls**: Operators can verify vehicle data, edit parsed license plates inline, and confirm/reject cases.

### B. Bangalore Traffic Map (Panel 09)
* **Official GIS Layers**: Leverages Esri Leaflet to pull Bangalore Masterplan MapServer sublayers (Proposed Land Use, Proposed Roads, BMA Boundary), toggled via an interactive layers menu.
* **Search & Zoom**: Supports survey zone code searching. Entering zone codes queries the REST MapServer, highlights the polygon boundaries in blue, and centers the viewport.
* **Identify Tool**: Clicking any point on the map queries MapServer spatial attributes, displaying detailed zoning data and proposed road widths in clean HUD popups.
* **Live Alerts**: Displays pulsing alert markers for camera nodes with pending reviews and maps recent infractions as warning pins with tooltip metadata.

### C. Inference Video Upload Core (Panel 11)
* **Video Pipeline**: Allows users to select specific camera nodes, upload traffic footage, and run the backend YOLOv8 detection and OCR pipeline.
* **Inferred Dropdown**: After analysis, detected infractions populate a drop-down list. Clicking an infraction opens the Evidence Modal, displaying bounding boxes around the vehicle, plate, or helmet.

### D. Telemetry & Settings Sync
* **Node Telemetry (Panel 10)**: Monitors connected cameras' latency, active stream FPS, network signal strength, and online status.
* **Settings & Config Sync**: Synchronizes parameters (classifier confidence, safety gear configs, OCR filters) with the FastAPI backend, persisting updates to `edge_config.json`.

---

## 🛠️ 3. Tech Stack & Architecture

TRAQ is built on a modular, decoupled architecture:
* **Frontend**: React client with a brutalist dark-mode theme, utilizing Leaflet, Esri Leaflet, Recharts, and TailwindCSS.
* **Backend**: FastAPI web framework, SQLAlchemy ORM, and SQLite database for structured violation records.
* **Work Engine**: Python script using YOLOv8 (for vehicle and violation segmentation), EasyOCR (for plate extraction), and OpenCV for frame parsing.
* **Simulation Fallback**: A background simulation thread is automatically triggered if GPU or native Pytorch dependencies are unavailable on the host system.

---

## 🚧 4. Technical Challenges & Solutions

### A. GIS Canvas Z-Index Collisions
* **Problem**: Leaflet's map elements overlayed the Evidence Inspection modal, blocking modal visibility.
* **Solution**: Raised the `EvidenceModal` overlay wrapper to `z-[9999]` and adjusted modal backdrop masks to render on top of map containers.

### B. Map Widget Placement & Search Alignment
* **Problem**: The map search input conflicted with Leaflet's layers menu in the top-right corner.
* **Solution**: Relocated the search bar to the bottom-left corner and set error notifications to display at `bottom-12`, keeping them visible without overlap.

### C. Redundant License Plate Clutter
* **Problem**: Repeated uploads of the same traffic video caused duplicate plate entries to stack up in the active logs.
* **Solution**: Implemented a client-side uniqueness filter in the React state engine, filtering out duplicate plates and retaining only the newest record.

---

## 🏆 5. Key Accomplishments & Learnings

* **MapServer REST Integration**: Successfully bound the Karnataka GIS (`kgis.ksrsac.in`) MapServer REST query API to local Leaflet search bars, returning geometry coordinate points mapped directly to client-side overlays.
* **Zero-Flicker Polling**: Set up a background `useEffect` poll loop that updates the dashboard every 5 seconds without resetting client-side inputs or modal positions.
* **Threshold Config Synchronization**: Persisted edge parameters dynamically to `edge_config.json`. Slider values are synchronized with the backend database upon hitting the sync buttons.

---

## 🔮 6. Future Roadmap

1. **Automated Challan Dispatch**: Integrate government SMS and Email gateways to automatically dispatch challans once verified.
2. **Edge Hardware Optimization**: Compile YOLOv8 and EasyOCR using TensorRT to run on low-power NVIDIA Jetson Orin boards directly on traffic poles.
3. **Multi-Camera Re-Identification (Re-ID)**: Track traffic violators across multiple intersections to flag repeat offenders.
