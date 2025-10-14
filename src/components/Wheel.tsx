import { useEffect, useRef, useState } from "react";

type WheelItem = {
  entry: string;
  index: number;
};

type WheelProps = {
  items: WheelItem[];
  addResult: (result: string, index: number) => void;
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
  handleDisplayModal: () => void;
};

export default function Wheel({
  items = [],
  addResult,
  isSpinning,
  setIsSpinning,
  handleDisplayModal,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  const size = 900;
  const TAU = Math.PI * 2;

  // filter out empty entries
  const labels = items.filter((s) => s.entry.trim() !== "");
  const safeLabels = labels.length ? labels : [{ entry: "", index: -1 }];

  const calcFontSize = (
    listSize: number,
    max: number,
    min: number,
    maxItems = 35,
  ) => {
    const slope = (max - min) / (maxItems - 1);
    return Math.max(min, max - slope * (listSize - 1));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.clearRect(0, 0, size, size);

    const angleStep = TAU / safeLabels.length;
    const offset = -Math.PI + rotationRef.current;

    const drawText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number,
    ) => {
      let measured = text;
      while (
        ctx.measureText(measured).width > maxWidth &&
        measured.length > 0
      ) {
        measured = measured.slice(0, -1);
      }
      if (measured !== text) measured = measured.slice(0, -1) + "…";
      return measured;
    };

    // draw slices
    safeLabels.forEach((item, i) => {
      const startAngle = i * angleStep + offset;
      const endAngle = startAngle + angleStep;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(i * 360) / safeLabels.length}, 100%, 60%)`;
      ctx.fill();

      const textAngle = startAngle + angleStep / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(textAngle);

      // draw slice text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1B1F22";
      ctx.font = `${calcFontSize(safeLabels.length, 3.5, 1)}rem sans-serif`;

      const maxTextWidth = radius / 1.5;
      const displayText = drawText(ctx, item.entry, maxTextWidth);
      ctx.fillText(displayText, radius / 2, 0);

      ctx.restore();
    });

    // sphere gradient
    const sphereGradient = ctx.createRadialGradient(
      centerX - (radius / 14) * 0.3,
      centerY - (radius / 14) * 0.3,
      (radius / 14) * 0.3,
      centerX,
      centerY,
      radius / 7,
    );
    sphereGradient.addColorStop(0, "#F1F2EE");
    sphereGradient.addColorStop(1, "#6C7B89");

    // Draw sphere
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 14, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = sphereGradient;
    ctx.shadowColor = "#2D3339";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.shadowOffsetX = 1;
    ctx.fill();

    // Draw arrow
    const pointerGradient = ctx.createLinearGradient(
      size - 25,
      centerY + 38,
      size + 40,
      centerY + 28,
    );
    pointerGradient.addColorStop(0, "#F1F2EE");
    pointerGradient.addColorStop(1, "#6C7B89");

    ctx.beginPath();
    ctx.moveTo(size - 55, centerY);
    ctx.lineTo(size + 10, centerY + 25);
    ctx.lineTo(size + 10, centerY - 25);
    ctx.closePath();
    ctx.shadowColor = "#2D3339";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.shadowOffsetX = 1;
    ctx.fillStyle = pointerGradient;
    ctx.fill();
  }, [items, rotation]);

  const normalize = (a: number) => ((a % TAU) + TAU) % TAU;

  const getCurrentIndex = (angle: number, labels: WheelItem[]) => {
    const n = labels.length;
    const angleStep = TAU / n;

    const EPS = 1e-9;
    const rel = normalize(Math.PI - angle - EPS);

    return Math.floor(rel / angleStep) % n;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const start = rotationRef.current;
    const spins = 20;
    const extra = TAU * spins + Math.random() * TAU;
    const duration = 10000;
    const t0 = performance.now();

    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const easeOut = 1 - Math.pow(1 - p, 3);
      const now = normalize(start + extra * easeOut);

      rotationRef.current = now;
      setRotation(now);

      const index = getCurrentIndex(now, safeLabels);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setIsSpinning(false);

        const winner = safeLabels[index];
        addResult(winner.entry, winner.index); // ✅ now uses new type
        console.log("Winner:", winner.entry);
        handleDisplayModal();
      }
    };

    requestAnimationFrame(tick);
  };

  return (
    <div className="flex items-center justify-center p-8">
      <canvas
        ref={canvasRef}
        onClick={handleSpin}
        className="cursor-pointer rounded-full max-lg:w-full"
      />
    </div>
  );
}
