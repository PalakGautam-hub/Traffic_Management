# Smart Traffic Enforcement and Management Platform

A computer vision-based traffic monitoring system with vehicle detection, density classification, red-light violation detection, and a web-based analytics dashboard.

## Architecture

```
Camera Feed → ML Service (Python/YOLOv8) → Backend API (Node.js/Express) → Supabase DB → Frontend (Next.js/Tailwind)
```

## Project Structure

```
├── backend/          # Node.js Express REST API
├── frontend/         # Next.js TypeScript dashboard
├── ml-service/       # Python ML processing (YOLOv8 + Scikit-learn)
├── database/         # Supabase PostgreSQL schema
└── README.md
```

## Setup

### 1. Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `database/schema.sql` in the Supabase SQL editor
3. Copy your project URL and anon key

### 2. Backend

```bash
cd backend
cp .env.example .env        # Edit with your Supabase credentials
npm install
npm run dev                  # Starts on port 5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local   # Edit API URL if needed
npm install
npm run dev                  # Starts on port 3000
```

### 4. ML Service

```bash
cd ml-service
pip install -r requirements.txt
cp .env.example .env         # Set JUNCTION_ID from your Supabase junctions table
python main.py               # Processes video and sends data to backend
```

## Features

- **Vehicle Detection**: YOLOv8-based detection of cars, bikes, buses, trucks
- **Density Classification**: Decision Tree classifier (Low/Medium/High)
- **Adaptive Signal Timing**: Green time suggestions based on density
- **Violation Detection**: Red-light crossing detection with snapshots
- **Dashboard**: Real-time monitoring with charts and analytics
- **JWT Authentication**: Secure admin access

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| ML       | Python, YOLOv8, OpenCV, Scikit-learn|
| Backend  | Node.js, Express.js, JWT, bcrypt    |
| Frontend | Next.js, TypeScript, Tailwind, Recharts |
| Database | Supabase (PostgreSQL)               |

## API Endpoints

| Method | Endpoint                        | Auth | Description                    |
|--------|---------------------------------|------|--------------------------------|
| POST   | /api/auth/register              | No   | Register admin user            |
| POST   | /api/auth/login                 | No   | Login and get JWT token        |
| POST   | /api/traffic                    | No   | Submit traffic data (ML)       |
| GET    | /api/traffic                    | Yes  | Get all traffic logs           |
| GET    | /api/traffic/:junctionId        | Yes  | Get logs by junction           |
| POST   | /api/violations                 | No   | Submit violation (ML)          |
| GET    | /api/violations                 | Yes  | Get all violations             |
| GET    | /api/analytics/summary          | Yes  | Dashboard summary stats        |
| GET    | /api/analytics/trends           | Yes  | Traffic trend data             |
| GET    | /api/analytics/vehicle-distribution | Yes | Vehicle type distribution  |
| GET    | /api/analytics/junctions        | Yes  | Per-junction statistics        |
| GET    | /api/junctions                  | Yes  | List all junctions             |
