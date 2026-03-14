"""
Red-Light Violation Detection Module.
Detects vehicles crossing a predefined stop line during red signal.
"""

import cv2
import os
from datetime import datetime


class ViolationDetector:
    def __init__(self, stop_line_y, frame_width, snapshot_dir="snapshots"):
        """
        Initialize violation detector.

        Args:
            stop_line_y: Y-coordinate of the stop line in the frame
            frame_width: Width of the video frame
            snapshot_dir: Directory to save violation snapshots
        """
        self.stop_line_y = stop_line_y
        self.frame_width = frame_width
        self.snapshot_dir = snapshot_dir
        self.is_red_signal = False
        self.tracked_violations = set()

        os.makedirs(snapshot_dir, exist_ok=True)

    def set_signal_state(self, is_red):
        """Set current traffic signal state."""
        self.is_red_signal = is_red

    def check_violations(self, frame, detections):
        """
        Check if any detected vehicle has crossed the stop line during red signal.

        Returns: list of violations with {vehicle_type, snapshot_path, timestamp}
        """
        violations = []

        if not self.is_red_signal:
            return violations

        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            vehicle_bottom = y2
            vehicle_center_x = (x1 + x2) // 2

            # Check if vehicle bottom has crossed the stop line
            if vehicle_bottom > self.stop_line_y:
                # Create a unique key to avoid duplicate violations
                violation_key = f"{det['label']}_{vehicle_center_x // 50}"

                if violation_key not in self.tracked_violations:
                    self.tracked_violations.add(violation_key)

                    # Capture snapshot
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                    snapshot_path = os.path.join(
                        self.snapshot_dir,
                        f"violation_{det['label']}_{timestamp}.jpg"
                    )
                    cv2.imwrite(snapshot_path, frame)

                    violations.append({
                        "vehicle_type": det["label"],
                        "snapshot_path": snapshot_path,
                        "timestamp": datetime.now().isoformat(),
                    })

        return violations

    def draw_stop_line(self, frame):
        """Draw the stop line on the frame."""
        color = (0, 0, 255) if self.is_red_signal else (0, 255, 0)
        cv2.line(frame, (0, self.stop_line_y),
                 (self.frame_width, self.stop_line_y), color, 3)

        label = "RED" if self.is_red_signal else "GREEN"
        cv2.putText(frame, f"Signal: {label}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

        return frame

    def reset_tracked(self):
        """Reset tracked violations for a new signal cycle."""
        self.tracked_violations.clear()
