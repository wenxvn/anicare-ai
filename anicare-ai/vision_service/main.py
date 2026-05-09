from __future__ import annotations

import os
import time
from pathlib import Path
from typing import Any
from urllib.request import urlopen

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

PROJECT_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = PROJECT_ROOT / "public"
YOLO_CONFIG_DIR = PROJECT_ROOT
os.environ.setdefault("YOLO_CONFIG_DIR", str(YOLO_CONFIG_DIR))

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None


DETECT_MODEL_NAME = "yolo11n.pt"
POSE_MODEL_NAME = "yolo11n-pose.pt"

app = FastAPI(title="AniCare Local Vision Service")

_detect_model: Any | None = None
_pose_model: Any | None = None


class DetectRequest(BaseModel):
    imageUrl: str | None = None
    imageBase64: str | None = None
    cameraId: str | None = None
    zone: str | None = None


def get_detect_model() -> Any:
    global _detect_model
    if YOLO is None:
        raise HTTPException(status_code=500, detail="ultralytics is not installed")
    if _detect_model is None:
        _detect_model = YOLO(DETECT_MODEL_NAME)
    return _detect_model


def get_pose_model() -> Any:
    global _pose_model
    if YOLO is None:
        raise HTTPException(status_code=500, detail="ultralytics is not installed")
    if _pose_model is None:
        _pose_model = YOLO(POSE_MODEL_NAME)
    return _pose_model


def resolve_image_path(image_url: str) -> Path | str:
    if image_url.startswith(("http://", "https://")):
        return image_url
    if image_url.startswith("/"):
        candidate = PUBLIC_DIR / image_url.lstrip("/")
    else:
        candidate = (PROJECT_ROOT / image_url).resolve()
    if not candidate.exists():
        raise HTTPException(status_code=404, detail=f"image not found: {image_url}")
    return candidate


def load_image(image_ref: Path | str) -> np.ndarray:
    if isinstance(image_ref, str) and image_ref.startswith(("http://", "https://")):
        with urlopen(image_ref, timeout=10) as response:
            array = np.frombuffer(response.read(), dtype=np.uint8)
        image = cv2.imdecode(array, cv2.IMREAD_COLOR)
    else:
        image = cv2.imread(str(image_ref))
    if image is None:
        raise HTTPException(status_code=400, detail="failed to read image")
    return image


def bbox_from_xyxy(xyxy: np.ndarray) -> dict[str, int]:
    x1, y1, x2, y2 = [int(round(float(v))) for v in xyxy[:4]]
    return {"x": max(0, x1), "y": max(0, y1), "w": max(0, x2 - x1), "h": max(0, y2 - y1)}


def to_detection_label(name: str) -> tuple[str, str]:
    labels = {
        "person": ("人员", "person"),
        "bed": ("床位", "bed"),
        "chair": ("椅子", "furniture"),
        "couch": ("沙发", "furniture"),
        "bench": ("长椅", "furniture"),
        "dining table": ("桌面", "furniture"),
    }
    return labels.get(name, (name, name))


def run_detection(image: np.ndarray) -> list[dict[str, Any]]:
    result = get_detect_model().predict(image, imgsz=960, conf=0.25, verbose=False)[0]
    detections: list[dict[str, Any]] = []
    if result.boxes is None:
        return detections

    for box in result.boxes:
        cls_id = int(box.cls[0].item())
        name = str(result.names.get(cls_id, cls_id))
        if name not in {"person", "bed", "chair", "couch", "bench", "dining table"}:
            continue
        label, category = to_detection_label(name)
        detections.append(
            {
                "label": label,
                "confidence": round(float(box.conf[0].item()), 4),
                "category": category,
                "source": DETECT_MODEL_NAME,
                "bbox": bbox_from_xyxy(box.xyxy[0].cpu().numpy()),
            }
        )
    return detections


def run_pose(image: np.ndarray) -> list[dict[str, Any]]:
    result = get_pose_model().predict(image, imgsz=960, conf=0.25, verbose=False)[0]
    poses: list[dict[str, Any]] = []
    if result.boxes is None or result.keypoints is None:
        return poses

    keypoints_xy = result.keypoints.xy.cpu().numpy()
    keypoints_conf = result.keypoints.conf.cpu().numpy() if result.keypoints.conf is not None else None
    for index, box in enumerate(result.boxes):
        points = []
        for point_index, xy in enumerate(keypoints_xy[index]):
            point_conf = float(keypoints_conf[index][point_index]) if keypoints_conf is not None else 1.0
            points.append({"x": int(round(float(xy[0]))), "y": int(round(float(xy[1]))), "confidence": round(point_conf, 4)})
        poses.append(
            {
                "label": "人体姿态",
                "confidence": round(float(box.conf[0].item()), 4),
                "bbox": bbox_from_xyxy(box.xyxy[0].cpu().numpy()),
                "keypoints": points,
            }
        )
    return poses


def overlap(a: dict[str, int], b: dict[str, int]) -> float:
    ax1, ay1, ax2, ay2 = a["x"], a["y"], a["x"] + a["w"], a["y"] + a["h"]
    bx1, by1, bx2, by2 = b["x"], b["y"], b["x"] + b["w"], b["y"] + b["h"]
    ix1, iy1 = max(ax1, bx1), max(ay1, by1)
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    return inter / max(1, a["w"] * a["h"])


def infer_risk_signals(detections: list[dict[str, Any]], poses: list[dict[str, Any]]) -> list[dict[str, Any]]:
    signals: list[dict[str, Any]] = []
    persons = [d for d in detections if d.get("category") == "person"]
    beds = [d for d in detections if d.get("category") == "bed"]

    if persons:
        signals.append({"code": "person_detected", "label": "检测到人员", "severity": "low", "confidence": max(float(p["confidence"]) for p in persons), "reason": "YOLO 检测到画面中存在人员目标。"})

    for person in persons:
        box = person["bbox"]
        aspect = box["w"] / max(1, box["h"])
        if aspect > 1.35 and float(person["confidence"]) >= 0.65:
            signals.append({"code": "fall_suspected", "label": "疑似跌倒姿态", "severity": "critical", "confidence": min(0.95, float(person["confidence"]) * 0.92), "reason": "人体检测框呈横向展开，符合跌倒或卧倒姿态特征。"})
        if any(overlap(box, bed["bbox"]) > 0.25 for bed in beds):
            signals.append({"code": "lying_on_bed", "label": "床位有人", "severity": "medium", "confidence": min(0.9, float(person["confidence"])), "reason": "人员检测框与床位区域重叠，可结合床压判断久卧风险。"})

    if poses and not any(signal["code"] == "fall_suspected" for signal in signals):
        for pose in poses:
            box = pose.get("bbox") or {}
            if box and box.get("w", 0) / max(1, box.get("h", 1)) > 1.45 and float(pose["confidence"]) >= 0.65:
                signals.append({"code": "pose_abnormal", "label": "姿态异常", "severity": "high", "confidence": min(0.9, float(pose["confidence"])), "reason": "姿态模型检测到人体关键点分布异常。"})

    if not signals:
        signals.append({"code": "no_high_risk_target", "label": "未检测到高风险目标", "severity": "low", "confidence": 0.72, "reason": "当前画面未检测到人员高风险姿态，复杂事件需结合传感器和时序数据判断。"})
    return signals


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "modelVersion": f"{DETECT_MODEL_NAME}+{POSE_MODEL_NAME}"}


@app.post("/detect")
def detect(req: DetectRequest) -> dict[str, Any]:
    if not req.imageUrl:
        raise HTTPException(status_code=400, detail="imageUrl is required")
    started = time.perf_counter()
    image = load_image(resolve_image_path(req.imageUrl))
    height, width = image.shape[:2]
    detections = run_detection(image)
    poses = run_pose(image)
    return {
        "detections": detections,
        "poses": poses,
        "riskSignals": infer_risk_signals(detections, poses),
        "processingTimeMs": int(round((time.perf_counter() - started) * 1000)),
        "modelVersion": f"{DETECT_MODEL_NAME}+{POSE_MODEL_NAME}",
        "imageSize": {"width": width, "height": height},
    }
