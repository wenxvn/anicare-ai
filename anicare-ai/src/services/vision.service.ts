import type { VisionDetectInput, VisionDetectOutput, DetectionResult } from '@/types';

export interface VisionAdapter {
  detect(input: VisionDetectInput): Promise<VisionDetectOutput>;
}

class MockVisionAdapter implements VisionAdapter {
  async detect(input: VisionDetectInput): Promise<VisionDetectOutput> {
    await new Promise((r) => setTimeout(r, 800));

    const detections: DetectionResult[] = [
      { label: '人员摔倒', confidence: 0.94, category: 'fall', bbox: { x: 280, y: 180, w: 220, h: 300 } },
      { label: '长时间静止', confidence: 0.88, category: 'still' },
      { label: '周围无人响应', confidence: 0.81, category: 'no_response' },
    ];

    return {
      detections,
      processingTimeMs: 820,
      modelVersion: 'mock-yolo-v1.0',
    };
  }
}

class YoloVisionAdapter implements VisionAdapter {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async detect(input: VisionDetectInput): Promise<VisionDetectOutput> {
    const start = Date.now();
    const res = await fetch(`${this.endpoint}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error(`YOLO service error: ${res.status}`);
    }

    const result = await res.json();
    return {
      detections: result.detections,
      processingTimeMs: Date.now() - start,
      modelVersion: result.modelVersion || 'yolo-v8',
      rawModelOutput: result,
    };
  }
}

let _adapter: VisionAdapter | null = null;

function getAdapter(): VisionAdapter {
  if (_adapter) return _adapter;

  const mode = process.env.AI_MODE || 'mock';
  if (mode === 'real' && process.env.YOLO_ENDPOINT) {
    _adapter = new YoloVisionAdapter(process.env.YOLO_ENDPOINT);
  } else {
    _adapter = new MockVisionAdapter();
  }
  return _adapter;
}

export const VisionService = {
  async detect(input: VisionDetectInput): Promise<VisionDetectOutput> {
    return getAdapter().detect(input);
  },

  getMode(): string {
    return process.env.AI_MODE || 'mock';
  },
};
