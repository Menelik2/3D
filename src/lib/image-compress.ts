/**
 * Browser image compression via Canvas.
 * Resizes long edge and encodes as WebP (fallback JPEG) to cut gallery upload size.
 */

export type CompressOptions = {
  /** Max long-edge in pixels (default 2048) */
  maxEdge?: number;
  /** 0–1 encode quality (default 0.82) */
  quality?: number;
  /** Prefer webp when supported (default true) */
  preferWebp?: boolean;
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
  const maxEdge = options.maxEdge ?? 2048;
  const quality = options.quality ?? 0.82;
  const preferWebp = options.preferWebp !== false;
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
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const useWebp = preferWebp && supportsWebp();
  const mime = useWebp ? "image/webp" : "image/jpeg";
  const ext = useWebp ? "webp" : "jpg";

  let blob = await canvasToBlob(canvas, mime, quality);

  // If compressed is larger (rare for small PNGs), keep original when same-ish size
  if (blob.size >= originalBytes * 0.95 && scale === 1) {
    blob = file;
    return {
      blob,
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
    mime: blob === file ? file.type : mime,
    originalBytes,
    compressedBytes: blob.size,
    fileName: `${baseName(file.name)}.${blob === file ? file.name.split(".").pop() : ext}`,
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
