import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WinButton } from '@atoms/WinButton/WinButton';
import iconPencil from 'pixelarticons/svg/edit.svg';
import iconEraser from 'pixelarticons/svg/trash.svg';
import iconLine from 'pixelarticons/svg/minus.svg';
import iconRect from 'pixelarticons/svg/frame.svg';
import iconCircle from 'pixelarticons/svg/circle.svg';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';

import './Paint.css';

type Tool = 'pencil' | 'line' | 'rect' | 'circle' | 'eraser';

export const Paint = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#120B19');
  const [secondaryColor, setSecondaryColor] = useState('#dde6e0');
  const [tool, setTool] = useState<Tool>('pencil');
  const [lineWidth, setLineWidth] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  const stateRef = useRef({
    color,
    secondaryColor,
    tool,
    lineWidth,
    isDrawing,
    startPos,
    snapshot
  });

  useEffect(() => {
    stateRef.current = { color, secondaryColor, tool, lineWidth, isDrawing, startPos, snapshot };
  }, [color, secondaryColor, tool, lineWidth, isDrawing, startPos, snapshot]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = Math.max(container.clientWidth, 800);
      canvas.height = Math.max(container.clientHeight, 400);

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.fillStyle = '#dde6e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const getPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    const s = stateRef.current;

    if (!canvas || !ctx) return;
    const pos = getPos(clientX, clientY);

    setStartPos(pos);
    setIsDrawing(true);
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = s.lineWidth;
    ctx.strokeStyle = s.tool === 'eraser' ? s.secondaryColor : s.color;

    if (s.tool === 'pencil' || s.tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }, []);

  const moveDraw = useCallback((clientX: number, clientY: number) => {
    const s = stateRef.current;
    if (!s.isDrawing || !s.startPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const currPos = getPos(clientX, clientY);

    if (s.tool === 'pencil' || s.tool === 'eraser') {
      ctx.lineTo(currPos.x, currPos.y);
      ctx.stroke();
    } else {
      if (s.snapshot) ctx.putImageData(s.snapshot, 0, 0);
      ctx.beginPath();
      ctx.lineWidth = s.lineWidth;
      ctx.strokeStyle = s.color;

      if (s.tool === 'line') {
        ctx.moveTo(s.startPos.x, s.startPos.y);
        ctx.lineTo(currPos.x, currPos.y);
        ctx.stroke();
      } else if (s.tool === 'rect') {
        ctx.strokeRect(s.startPos.x, s.startPos.y, currPos.x - s.startPos.x, currPos.y - s.startPos.y);
      } else if (s.tool === 'circle') {
        const radiusX = Math.abs(currPos.x - s.startPos.x) / 2;
        const radiusY = Math.abs(currPos.y - s.startPos.y) / 2;
        const centerX = Math.min(currPos.x, s.startPos.x) + radiusX;
        const centerY = Math.min(currPos.y, s.startPos.y) + radiusY;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, []);

  const stopDraw = useCallback(() => {
    if (stateRef.current.isDrawing) {
      setIsDrawing(false);
      setStartPos(null);
      setSnapshot(null);
      canvasRef.current?.getContext('2d')?.closePath();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      moveDraw(touch.clientX, touch.clientY);
    };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [moveDraw]);

  const handleMouseDown = (e: React.MouseEvent) => startDraw(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => moveDraw(e.clientX, e.clientY);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startDraw(touch.clientX, touch.clientY);
  };

  const Tools = [
    { id: 'pencil', icon: iconPencil },
    { id: 'eraser', icon: iconEraser },
    { id: 'line', icon: iconLine },
    { id: 'rect', icon: iconRect },
    { id: 'circle', icon: iconCircle },
  ];

  const colors = [
    '#120b19', '#421e42', '#4e3161', '#5b5280',
    '#6074ab', '#6b9acf', '#8bbde6', '#aae0f3',
    '#70a18f', '#87c293', '#b2dba0', '#637c8f',
    '#b4bebe', '#dde6e0', '#612447', '#753a6a',
    '#bd7182', '#dfb6ae', '#d18b79', '#dbac8c',
    '#e6cfa1', '#faffe0',
  ];

  return (
    <div className="paint-container">
      <div className="paint-body">
        <div className="paint-toolbar">
          {Tools.map(t => (
            <WinButton
              key={t.id}
              active={tool === t.id}
              onClick={() => setTool(t.id as Tool)}
              className="paint-tool-btn"
            >
              <IconRenderer icon={t.icon} size={16} />
            </WinButton>
          ))}

          <div className="paint-linewidth">
            {[1, 2, 4].map(w => (
              <div
                key={w}
                onClick={() => setLineWidth(w)}
                className={`paint-linewidth-btn ${lineWidth === w ? 'active' : ''}`}
              >
                <div className="paint-linewidth-inner" style={{ height: `${w}px` }}></div>
              </div>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="paint-canvas-container">
          <div className="paint-canvas-wrapper">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={handleTouchStart}
              onTouchEnd={stopDraw}
              className="paint-canvas"
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>
      </div>

      <div className="paint-footer">
        <div className="paint-current-colors">
          <div className="secondary-color" style={{ backgroundColor: secondaryColor }} />
          <div className="primary-color" style={{ backgroundColor: color }} />
        </div>
        <div className="paint-color-grid">
          {colors.map(c => (
            <div
              key={c}
              className="paint-color"
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              onContextMenu={e => { e.preventDefault(); setSecondaryColor(c); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};