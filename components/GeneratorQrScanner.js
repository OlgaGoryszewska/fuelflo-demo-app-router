'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function GeneratorQrScanner({
  onScanSuccess,
  onClose,
  onError,
}) {
  const scannerRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const regionId = 'generator-qr-reader';

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(regionId);
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          setCameraError('No camera found on this device.');
          return;
        }

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1,
          },
          async (decodedText) => {
            try {
              const parsed = JSON.parse(decodedText);

              if (!parsed?.generatorId) {
                throw new Error('QR code does not contain generatorId.');
              }

              await html5QrCode.stop();
              await html5QrCode.clear();

              onScanSuccess(parsed.generatorId);
            } catch (err) {
              console.error('Invalid QR code payload:', err);
              if (onError) onError('Invalid QR code format.');
            }
          },
          () => {
            // ignore scan-frame errors
          }
        );
      } catch (err) {
        console.error('Could not start scanner:', err);
        setCameraError(
          'Could not access the camera. Please allow camera permission.'
        );
      }
    };

    startScanner();

    return () => {
      const cleanup = async () => {
        try {
          if (scannerRef.current) {
            const state = scannerRef.current.getState?.();
            if (state === 2) {
              await scannerRef.current.stop();
            }
            await scannerRef.current.clear();
          }
        } catch (err) {
          console.error('Scanner cleanup error:', err);
        }
      };

      cleanup();
    };
  }, [onScanSuccess, onError]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Scan generator QR code</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-3 py-1"
          >
            Close
          </button>
        </div>

        {cameraError ? (
          <p className="text-sm text-red-600">{cameraError}</p>
        ) : (
          <div
            id={regionId}
            className="mx-auto w-full overflow-hidden rounded-lg"
          />
        )}

        <p className="mt-3 text-sm text-gray-500">
          Point the camera at the QR code on the generator.
        </p>
      </div>
    </div>
  );
}
