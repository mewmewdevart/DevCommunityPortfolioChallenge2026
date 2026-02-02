import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WinButton } from '@atoms/WinButton/WinButton';
import iconPower from 'pixelarticons/svg/power.svg';
import iconCamera from 'pixelarticons/svg/camera.svg';
import iconPalette from 'pixelarticons/svg/colors-swatch.svg';
import iconReload from 'pixelarticons/svg/reload.svg';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import { useTranslation } from '@context/LanguageContext';

import './Camera.css';

const GB_WIDTH = 160;
const GB_HEIGHT = 144;

type GBVariant = 'blue' | 'green' | 'warm';
type FacingMode = 'user' | 'environment';

const GB_PALETTES: Record<GBVariant, number[][]> = {
  blue: [
    [18, 11, 25],     // dark-800
    [60, 72, 110],    // blue-900
    [108, 132, 168],  // blue-700
    [165, 186, 206],  // blue-300
  ],
  green: [
    [15, 38, 15],     // verde
    [48, 98, 48],     // verde
    [139, 172, 15],   // oliva
    [155, 188, 15],   // oliva
  ],
  warm: [
    [20, 16, 12],     // marrom
    [120, 98, 72],    // bege
    [170, 145, 110],  // bege
    [205, 185, 145],  // bege
  ],
};

export const CameraApp = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { t } = useTranslation();

  const [isActive, setIsActive] = useState(false);
  const [gbVariant, setGbVariant] = useState<GBVariant>('blue');
  const [facingMode, setFacingMode] = useState<FacingMode>('user');
  const [, setLastPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState(t('camera_ready'));

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = useCallback(async () => {
    stopTracks();

    setStatus(t('camera_init'));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
          setIsActive(true);
          setStatus(t('camera_active'));
        } catch (playError) {
          if ((playError as Error).name !== 'AbortError') {
            console.error("Play error:", playError);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setStatus(t('camera_error'));
      setIsActive(false);
    }
  }, [facingMode, t]);

  const stopCamera = useCallback(() => {
    stopTracks();
    setIsActive(false);
    setStatus(t('camera_stopped'));
  }, [t]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    }

    return () => {
      stopTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => stopTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let animationId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    const video = videoRef.current;

    const palette = GB_PALETTES[gbVariant];

    const renderFrame = () => {
      if (!canvas || !ctx || !video) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = GB_WIDTH;
        canvas.height = GB_HEIGHT;

        ctx.save();
        if (facingMode === 'user') {
          ctx.scale(-1, 1);
          ctx.drawImage(video, -GB_WIDTH, 0, GB_WIDTH, GB_HEIGHT);
        } else {
          ctx.drawImage(video, 0, 0, GB_WIDTH, GB_HEIGHT);
        }
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, GB_WIDTH, GB_HEIGHT);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg =
            0.299 * data[i] +
            0.587 * data[i + 1] +
            0.114 * data[i + 2];

          let colorIndex = 0;
          if (avg > 180) colorIndex = 3;
          else if (avg > 120) colorIndex = 2;
          else if (avg > 70) colorIndex = 1;

          const [r, g, b] = palette[colorIndex];
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      animationId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, gbVariant, facingMode]);

  const cycleVariant = () => {
    setGbVariant(prev =>
      prev === 'blue' ? 'green' : prev === 'green' ? 'warm' : 'blue'
    );
    setStatus(`${t('camera_palette')}: ${t(`camera_palette_${gbVariant}` as any).toUpperCase()}`);
  };

  const takePhoto = () => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL('image/png');
    setLastPhoto(dataUrl);

    const link = document.createElement('a');
    link.download = `MewDows-Cam-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    setStatus(t('camera_saved'));
    setTimeout(() => setStatus(t('camera_ready')), 2000);
  };

  return (
    <div className="camera-container">
      <div className="camera-display">
        <video ref={videoRef} autoPlay playsInline muted className="camera-video--hidden" />

        <canvas
          ref={canvasRef}
          className="camera-canvas"
          style={{
            imageRendering: 'pixelated',
          }}
        />

        {!isActive && (
          <div className="camera-overlay-text">
            {t('camera_off')}
          </div>
        )}
      </div>

      <div className="camera-controls">
        <div className="camera-controls-group">
          <WinButton onClick={isActive ? stopCamera : startCamera} title={isActive ? t('camera_turn_off') : t('camera_turn_on')}>
            <IconRenderer icon={iconPower} size={16} className={isActive ? "camera-icon-on" : "camera-icon-off"} />
          </WinButton>

          <WinButton onClick={toggleCamera} disabled={!isActive} title={t('camera_flip')}>
            <IconRenderer icon={iconReload} size={16} />
          </WinButton>

          <WinButton onClick={cycleVariant} title={t('camera_change_palette')}>
            <IconRenderer icon={iconPalette} size={16} />
          </WinButton>
        </div>

        <WinButton onClick={takePhoto} disabled={!isActive} className="camera-btn-snap">
          <IconRenderer icon={iconCamera} size={16} className="camera-icon--snap" /> {t('camera_snap')}
        </WinButton>
      </div>

      <div className="camera-status-bar">
        {status}
      </div>
    </div>
  );
};