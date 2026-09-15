/**
 * Browser image compression via Canvas.
 * Resizes long edge and encodes as WebP (fallback JPEG) for gallery uploads.
 *
 * Defaults tuned for private galleries:
 * - Long edge ≤ 1920px (sharp on phones + desktop fullscreen)
 * - WebP ~0.78 quality (strong size cut, still photo-grade)
 * - Adaptive second pass if file still too large
 */

export type CompressOptions = {
  /** Max long-edge in pixels (default 1920) */
  maxEdge?: number;
  /** 0–1 encode quality (default 0.78) */
  quality?: number;
  /** Prefer webp when supported (default true) */
  preferWebp?: boolean;
  /** Soft target max bytes after compress; triggers lower quality pass (default 1.2MB) */
  maxBytes?: number;
};

export type CompressResult = {
  blob: Blob;
  width: number;
  height: number;
  mime: string;
  originalBytes: number;
  compressedBytes: number;
  fileName: string;
};

/** Gallery upload defaults — balanced quality vs mobile bandwidth */
export const GALLERY_COMPRESS_DEFAULTS: Required<
  Pick<CompressOptions, "maxEdge" | "quality" | "preferWebp" | "maxBytes">
> = {
  maxEdge: 1920,
  quality: 0.78,
  preferWebp: true,
  maxBytes: 1_200_000, // ~1.2 MB soft cap
};

function supportsWebp(): boolean {
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    return c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read image: ${file.name}`));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
      type,
      quality
    );
  });
}

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "") || "photo";
}

/**
 * Compress a single image file in the browser.
 * GIFs are returned as-is (no canvas re-encode) to preserve animation.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const maxEdge = options.maxEdge ?? GALLERY_COMPRESS_DEFAULTS.maxEdge;
  let quality = options.quality ?? GALLERY_COMPRESS_DEFAULTS.quality;
  const preferWebp = options.preferWebp !== false;
  const maxBytes = options.maxBytes ?? GALLERY_COMPRESS_DEFAULTS.maxBytes;
  const originalBytes = file.size;

  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not an image`);
  }

  // Keep animated GIFs untouched
  if (file.type === "image/gif") {
    return {
      blob: file,
      width: 0,
      height: 0,
      mime: file.type,
      originalBytes,
      compressedBytes: file.size,
      fileName: file.name,
    };
  }

  // Already small enough and under max edge — skip heavy work when possible
  if (originalBytes < 180_000) {
    // still may need resize if huge dimensions; load and check
  }

  const img = await loadImage(file);
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  const long = Math.max(srcW, srcH);
  const scale = long > maxEdge ? maxEdge / long : 1;
  const width = Math.max(1, Math.round(srcW * scale));
  const height = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas not available");

  // White underlay so transparent PNGs don't turn black in JPEG/WebP
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const useWebp = preferWebp && supportsWebp();
  const mime = useWebp ? "image/webp" : "image/jpeg";
  const ext = useWebp ? "webp" : "jpg";

  let blob = await canvasToBlob(canvas, mime, quality);

  // Adaptive pass: still large → drop quality, optionally shrink edge further
  if (blob.size > maxBytes && quality > 0.55) {
    quality = Math.max(0.55, quality - 0.12);
    blob = await canvasToBlob(canvas, mime, quality);
  }
  if (blob.size > maxBytes * 1.35 && long > 1280) {
    const edge2 = Math.min(maxEdge, 1440);
    const scale2 = Math.max(srcW, srcH) > edge2 ? edge2 / Math.max(srcW, srcH) : 1;
    const w2 = Math.max(1, Math.round(srcW * scale2));
    const h2 = Math.max(1, Math.round(srcH * scale2));
    if (w2 < width || h2 < height) {
      canvas.width = w2;
      canvas.height = h2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w2, h2);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w2, h2);
      blob = await canvasToBlob(canvas, mime, Math.max(0.55, quality - 0.05));
      return {
        blob,
        width: w2,
        height: h2,
        mime,
        originalBytes,
        compressedBytes: blob.size,
        fileName: `${baseName(file.name)}.${ext}`,
      };
    }
  }

  // If compressed is larger (rare for small PNGs), keep original when not resized
  if (blob.size >= originalBytes * 0.95 && scale === 1) {
    return {
      blob: file,
      width: srcW,
      height: srcH,
      mime: file.type || mime,
      originalBytes,
      compressedBytes: file.size,
      fileName: file.name,
    };
  }

  return {
    blob,
    width,
    height,
    mime,
    originalBytes,
    compressedBytes: blob.size,
    fileName: `${baseName(file.name)}.${ext}`,
  };
}

export async function compressImages(
  files: File[],
  options?: CompressOptions,
  onProgress?: (done: number, total: number, name: string) => void
): Promise<CompressResult[]> {
  const out: CompressResult[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i]!;
    onProgress?.(i, files.length, f.name);
    out.push(await compressImage(f, options));
  }
  onProgress?.(files.length, files.length, "");
  return out;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
