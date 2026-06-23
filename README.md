# 🚦 TRAQ — Traffic Risk Analysis & Queue Management

> An AI-powered traffic monitoring system that detects violations, analyzes risk, and visualizes live traffic data on an interactive Bangalore GIS map.

---

## 📌 Overview

TRAQ is an end-to-end traffic intelligence platform built to detect traffic violations (seatbelt, signal jumps, etc.), assess risk levels in real time, and present insights through a web dashboard overlaid on Bangalore's GIS Masterplan Map.

The system combines computer vision models, a Python backend, and a React/JS frontend to deliver actionable traffic safety data.

---

## ✨ Features

- 🎥 **Video-based violation detection** — detects seatbelt violations and other infractions from traffic camera footage
- 🗺️ **Bangalore GIS Map integration** — live risk zones overlaid on an interactive city masterplan map
- 📊 **Risk analysis dashboard** — real-time and historical traffic risk scoring
- 🗄️ **Local SQLite database** — stores violation records in `traffic_data.db`
- ⚙️ **Modular architecture** — separate `backend`, `frontend`, and `work_engine` components
- 🧪 **Iterative ML notebooks** — multiple notebook versions (`v2` → `v7`) tracking model improvements

---

## 🗂️ Project Structure

```
TRAQ/
├── backend/                  # Python/Flask API server
├── frontend/                 # React/JS web dashboard
├── work_engine/              # Core AI/CV processing engine
├── videos/                   # Sample traffic footage for testing
├── notebook_v2.ipynb         # Early model iterations
├── notebook_v5.ipynb
├── notebook_v7.ipynb         # Latest notebook
├── traffic_violation_detection.ipynb  # Violation detection pipeline
├── traffic_data.db           # SQLite database for violation records
├── run_instructions.md       # Setup and run guide
└── project_submission_description.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Computer Vision | Python, OpenCV, YOLO / custom model |
| Backend | Python, Flask / FastAPI |
| Frontend | JavaScript, React, CSS |
| Database | SQLite (`traffic_data.db`) |
| Maps | Bangalore GIS Masterplan (interactive overlay) |
| Notebooks | Jupyter Notebook |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- pip & npm

### 1. Clone the repository

```bash
git clone https://github.com/Dhanush-Poduval/TRAQ.git
cd TRAQ
```

### 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm start
```

### 4. Run the work engine

```bash
cd work_engine
pip install -r requirements.txt
python main.py
```

> Refer to [`run_instructions.md`](./run_instructions.md) for detailed setup steps and environment configuration.

---

## 📷 Demo

> *(Add screenshots or a GIF of the dashboard here)*

---

## 👥 Contributors

| Name | GitHub |
|---|---|
| Dhanush Poduval | [@Dhanush-Poduval](https://github.com/Dhanush-Poduval) |
| Atinder | [@frostic-burn](https://github.com/frostic-burn) |
| 71percentbanana | [@71percentbanana](https://github.com/71percentbanana) |
| Blason Raj | [@blason2108](https://github.com/blason2108) |

---

## 📄 License

This project is currently unlicensed. Contact the contributors for usage permissions.

---

## 🙏 Acknowledgements

- Bangalore GIS Masterplan for map data
- OpenCV & YOLO communities for computer vision tooling
