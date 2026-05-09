# Local Vision Service

This FastAPI service runs local YOLO detection and pose estimation for the Next.js `/api/vision` route.

## Install

Install PyTorch for your CUDA version first from the official PyTorch selector, then install service dependencies:

```powershell
cd D:\wenxvn\CARIC\anicare-ai
python -m pip install -r vision_service\requirements.txt
```

## Run

```powershell
cd D:\wenxvn\CARIC\anicare-ai
python -m uvicorn vision_service.main:app --host 127.0.0.1 --port 8001
```

Set the Next.js env:

```env
AI_MODE=real
YOLO_ENDPOINT=http://127.0.0.1:8001
```

The first run downloads `yolo11n.pt` and `yolo11n-pose.pt` if they are not already cached.

## Test

```powershell
Invoke-RestMethod -Method Post http://127.0.0.1:8001/detect `
  -ContentType "application/json" `
  -Body '{"imageUrl":"/pictures/6.jpg","cameraId":"CAM-A3-01","zone":"A栋3层走廊"}'
```
