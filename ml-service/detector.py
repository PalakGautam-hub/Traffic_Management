"""
Vehicle Detection Module using YOLOv8
Detects cars, bikes, buses, and trucks from video frames.
"""

from ultralytics import YOLO
import cv2
import numpy as np


# COCO class IDs for vehicles
VEHICLE_CLASSES = {
    2: "car",
    3: "motorcycle",   # mapped to "bike"
    5: "bus",
    7: "truck",
}

VEHICLE_LABEL_MAP = {
    "car": "car",
    "motorcycle": "bike",
    "bus": "bus",
    "truck": "truck",
}


class VehicleDetector:
    def __init__(self, model_path="yolov8n.pt", confidence=0.5):
        """Initialize YOLOv8 detector."""
        self.model = YOLO(model_path)
        self.confidence = confidence

    def detect(self, frame):
        """
        Detect vehicles in a frame.
        Returns: list of detections with {class, label, confidence, bbox}
        """
        results = self.model(frame, conf=self.confidence, verbose=False)
        detections = []

        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                if cls_id in VEHICLE_CLASSES:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    coco_label = VEHICLE_CLASSES[cls_id]
                    detections.append({
                        "class_id": cls_id,
                        "label": VEHICLE_LABEL_MAP[coco_label],
                        "confidence": float(box.conf[0]),
                        "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    })

        return detections

    def count_vehicles(self, detections):
        """Count vehicles by type."""
        counts = {"car": 0, "bike": 0, "bus": 0, "truck": 0}
        for det in detections:
            label = det["label"]
            if label in counts:
                counts[label] += 1
        counts["total"] = sum(counts.values())
        return counts

    def draw_detections(self, frame, detections):
        """Draw bounding boxes on frame for visualization."""
        colors = {
            "car": (0, 255, 0),
            "bike": (255, 165, 0),
            "bus": (255, 0, 0),
            "truck": (0, 0, 255),
        }

        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            label = det["label"]
            conf = det["confidence"]
            color = colors.get(label, (255, 255, 255))

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            text = f"{label} {conf:.2f}"
            cv2.putText(frame, text, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        return frame
