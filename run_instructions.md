# Installation & Execution Guide: TRAQ (TrafficVision AI)

Follow these steps to set up and run the TRAQ traffic enforcement dashboard.

---

## 📋 1. System Requirements & Prerequisites
Ensure you have the following installed on your machine:
* **Python**: Version `3.9` or higher
* **Node.js**: Version `18.x` or higher

---

## 🐍 2. Backend Server Installation

1. Open your terminal at the project root directory (`TRAQ/`).
2. *(Optional)* Create and activate a Python virtual environment:
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate on Windows (Command Prompt/PowerShell)
   venv\Scripts\activate

   # Activate on macOS/Linux
   source venv/bin/activate
   ```
3. Install backend packages:
   * **Option A: Simulated Fallback (Fastest Setup)**: Recommended for reviewers testing the dashboard without downloading heavy ML libraries:
     ```bash
     pip install fastapi uvicorn sqlalchemy
     ```
   * **Option B: Full ML Suite (YOLOv8 + OCR Engine)**: Compiles the live computer vision pipeline (requires local GPU acceleration or CPU libraries):
     ```bash
     pip install -r work_engine/requirements.txt
     pip install fastapi uvicorn sqlalchemy
     ```
4. Run the FastAPI backend server:
   ```bash
   python -m uvicorn backend.main:app --port 8000
   ```
   *The backend server will run on http://localhost:8000.*

---

## ⚛️ 3. Frontend Client Installation

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend npm packages:
   ```bash
   npm install
   ```
3. Launch the local Vite development server:
   ```bash
   npm run dev
   ```
   *The React client will run on http://localhost:5173.*

---

## 🎯 4. Step-by-Step Reviewer Test Guide

Open http://localhost:5173 in your browser and verify the following:

### A. Video Upload & Inference
1. Scroll down to panel **"11 // INFERENCE VIDEO UPLOAD CORE"**.
2. Select camera node `CAM-04`.
3. Click **Choose File** and select the sample traffic video `Generate_an_second_photoreal.mp4` (located in the root directory).
4. Click **Start Upload & AI Inference**. 
5. Once complete, an **AI INFERRED INFRACTIONS** dropdown will appear.
6. Select an infraction from the dropdown to open the Evidence Inspection Modal.

### B. Bangalore Traffic Map & GIS Layers
1. Locate panel **"09 // BANGALORE TRAFFIC MAP"** in the right column.
2. Click **Layers** (top-right) and toggle proposed landuse or roads overlays.
3. Click **Enlarge** to view the map in fullscreen.
4. Enter `Ba` or `Ca` in the bottom-left search bar and press Enter to query and zoom to a plan zone.

### C. Live Auditing & Plate Correction
1. In panel **"08 // LIVE DISPATCH LOG FEED"**, click the **Inspect** button for any case.
2. In the modal, click the plate value to edit it (e.g. modify `MH12GP7731` to `MH12GP7700`) and press Enter to save.
3. Click **Confirm** or **Reject** and verify that the table row status updates.

### D. Settings Persistence
1. Navigate to the **Settings** tab.
2. Drag the slider values, and click **Sync Edge Parameters**.
3. Refresh the page to verify that the settings persist.
