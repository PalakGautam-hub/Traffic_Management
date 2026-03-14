"""
Main ML Processing Service.
Processes video feed, detects vehicles, classifies density,
detects violations, and sends data to backend API.
"""

import cv2
import time
import json
import requests
import os
from dotenv import load_dotenv

from detector import VehicleDetector
from density_classifier import DensityClassifier
from violation_detector import ViolationDetector

load_dotenv()

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000/api")
JUNCTION_ID = os.getenv("JUNCTION_ID", "")
VIDEO_SOURCE = os.getenv("VIDEO_SOURCE", "sample_traffic.mp4")
SEND_INTERVAL = int(os.getenv("SEND_INTERVAL", "10"))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))

# Red signal simulation: toggles every SIGNAL_CYCLE seconds
SIGNAL_CYCLE = 30


def send_traffic_data(counts, density, green_time):
    """Send traffic data to backend API."""
    payload = {
        "junction_id": JUNCTION_ID,
        "cars": counts["car"],
        "bikes": counts["bike"],
        "buses": counts["bus"],
        "trucks": counts["truck"],
        "total": counts["total"],
        "density": density,
        "green_time": green_time,
    }

    try:
        response = requests.post(
            f"{BACKEND_URL}/traffic",
            json=payload,
            timeout=5
        )
        if response.status_code == 201:
            print(f"[OK] Traffic data sent: {density} density, {counts['total']} vehicles")
        else:
            print(f"[ERR] Failed to send traffic data: {response.status_code}")
    except requests.RequestException as e:
        print(f"[ERR] Connection error: {e}")


def send_violation(violation):
    """Send violation record to backend API."""
    payload = {
        "junction_id": JUNCTION_ID,
        "vehicle_type": violation["vehicle_type"],
    }

    try:
        response = requests.post(
            f"{BACKEND_URL}/violations",
            json=payload,
            timeout=5
        )
        if response.status_code == 201:
            print(f"[VIOLATION] {violation['vehicle_type']} crossed stop line!")
        else:
            print(f"[ERR] Failed to send violation: {response.status_code}")
    except requests.RequestException as e:
        print(f"[ERR] Connection error: {e}")


def main():
    print("=" * 60)
    print("Smart Traffic Enforcement - ML Processing Service")
    print("=" * 60)

    # Initialize components
    detector = VehicleDetector(confidence=CONFIDENCE_THRESHOLD)
    classifier = DensityClassifier()

    # Open video source
    cap = cv2.VideoCapture(VIDEO_SOURCE)
    if not cap.isOpened():
        print(f"[ERR] Cannot open video source: {VIDEO_SOURCE}")
        print("[INFO] Using webcam (index 0) as fallback...")
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("[ERR] No video source available. Exiting.")
            return

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Stop line at 70% of frame height
    stop_line_y = int(frame_height * 0.7)
    violation_detector = ViolationDetector(stop_line_y, frame_width)

    print(f"[INFO] Video: {frame_width}x{frame_height}")
    print(f"[INFO] Stop line Y: {stop_line_y}")
    print(f"[INFO] Backend: {BACKEND_URL}")
    print(f"[INFO] Junction: {JUNCTION_ID}")
    print(f"[INFO] Send interval: {SEND_INTERVAL}s")
    print("-" * 60)

    last_send_time = time.time()
    frame_count = 0
    start_time = time.time()

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                # Loop video
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            frame_count += 1
            elapsed = time.time() - start_time

            # Simulate red/green signal
            signal_phase = int(elapsed // SIGNAL_CYCLE) % 2
            is_red = signal_phase == 0
            violation_detector.set_signal_state(is_red)

            # Reset tracked violations on signal change
            if int((elapsed - 1) // SIGNAL_CYCLE) % 2 != signal_phase:
                violation_detector.reset_tracked()

            # Detect vehicles
            detections = detector.detect(frame)
            counts = detector.count_vehicles(detections)

            # Classify density
            density = classifier.classify(
                counts["car"], counts["bike"],
                counts["bus"], counts["truck"]
            )
            green_time = classifier.suggest_green_time(density)

            # Check for violations
            violations = violation_detector.check_violations(frame, detections)
            for v in violations:
                send_violation(v)

            # Send traffic data at intervals
            current_time = time.time()
            if current_time - last_send_time >= SEND_INTERVAL:
                if JUNCTION_ID:
                    send_traffic_data(counts, density, green_time)
                else:
                    print(f"[LOCAL] {density} density | Vehicles: {counts} | Green: {green_time}s")
                last_send_time = current_time

            # Draw visualization
            annotated = detector.draw_detections(frame.copy(), detections)
            annotated = violation_detector.draw_stop_line(annotated)

            # HUD overlay
            cv2.putText(annotated, f"Cars: {counts['car']}  Bikes: {counts['bike']}  "
                        f"Buses: {counts['bus']}  Trucks: {counts['truck']}",
                        (10, frame_height - 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(annotated, f"Total: {counts['total']}  Density: {density}  "
                        f"Green Time: {green_time}s",
                        (10, frame_height - 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

            cv2.imshow("Smart Traffic Monitor", annotated)

            # Press 'q' to quit, 'r' to toggle signal
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break
            elif key == ord("r"):
                violation_detector.set_signal_state(
                    not violation_detector.is_red_signal
                )

    except KeyboardInterrupt:
        print("\n[INFO] Stopping...")

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print(f"[INFO] Processed {frame_count} frames. Exiting.")


if __name__ == "__main__":
    main()
