'use client';

import { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [zoom, setZoom] = useState(1);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const barcodeDetectorRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (!videoRef.current || !canvasRef.current) return;
        
        setError('');
        setIsLoading(true);
        setIsScanning(false);

        // Check if browser supports BarcodeDetector
        if ('BarcodeDetector' in window) {
          barcodeDetectorRef.current = new (window as any).BarcodeDetector({
            formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e']
          });
        }

        // Request camera access with basic constraints
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
          // Fallback to any available camera
          streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          
          // Wait for video to be ready
          await new Promise<void>((resolve, reject) => {
            const video = videoRef.current!;
            
            const handleLoad = () => {
              video.removeEventListener('loadedmetadata', handleLoad);
              video.removeEventListener('error', handleError);
              resolve();
            };
            
            const handleError = () => {
              video.removeEventListener('loadedmetadata', handleLoad);
              video.removeEventListener('error', handleError);
              reject(new Error('Video failed to load'));
            };
            
            video.addEventListener('loadedmetadata', handleLoad);
            video.addEventListener('error', handleError);
            
            video.play().catch(reject);
          });

          if (mounted) {
            setIsLoading(false);
            setIsScanning(true);
            startBarcodeDetection();
          }
        }
        
      } catch (err: any) {
        if (mounted) {
          console.error('Camera error:', err);
          let errorMessage = 'Failed to access camera.';
          
          if (err.name === 'NotAllowedError') {
            errorMessage = 'Camera access denied. Please allow camera permissions and refresh.';
          } else if (err.name === 'NotFoundError') {
            errorMessage = 'No camera found. Please ensure your device has a camera.';
          } else if (err.name === 'NotReadableError') {
            errorMessage = 'Camera is already in use by another application.';
          }
          
          setError(errorMessage);
          setIsLoading(false);
          setIsScanning(false);
        }
      }
    };

    const startBarcodeDetection = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      const detectBarcode = async () => {
        if (!mounted || !video || !canvas || !ctx) return;
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
          // Try native BarcodeDetector first
          if (barcodeDetectorRef.current) {
            const barcodes = await barcodeDetectorRef.current.detect(canvas);
            if (barcodes.length > 0 && mounted) {
              onDetected(barcodes[0].rawValue);
              setIsScanning(false);
              return;
            }
          } else {
            // Fallback: Use ZXing library
            const { BrowserMultiFormatReader } = await import('@zxing/library');
            const codeReader = new BrowserMultiFormatReader();
            
            try {
              const result = await codeReader.decodeFromImageElement(canvas as any);
              if (result && mounted) {
                onDetected(result.getText());
                setIsScanning(false);
                return;
              }
            } catch (zxingError) {
              // Ignore "NotFoundException" - just means no barcode found
              if ((zxingError as any).name !== 'NotFoundException') {
                console.warn('ZXing decode error:', zxingError);
              }
            }
          }
        } catch (error) {
          console.warn('Barcode detection error:', error);
        }
        
        // Continue scanning
        if (mounted) {
          animationRef.current = requestAnimationFrame(detectBarcode);
        }
      };
      
      detectBarcode();
    };

    startCamera();

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onDetected]);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border border-red-300 bg-red-50 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-3">📷</div>
          <h3 className="text-red-800 font-medium mb-2">Camera Access Issue</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <div className="text-xs text-red-600 space-y-1">
            <p>• Allow camera permissions when prompted</p>
            <p>• Refresh the page and try again</p>
            <p>• Check if camera is being used by another app</p>
            <p>• Try using a different browser (Chrome/Safari)</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-sm">
        <video 
          ref={videoRef} 
          className="w-full h-80 object-cover rounded border bg-black transition-transform duration-200"
          playsInline
          muted
          autoPlay
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        />
        
        {/* Hidden canvas for barcode detection */}
        <canvas 
          ref={canvasRef} 
          className="hidden"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 rounded">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">Initializing camera...</p>
              <p className="text-xs mt-1 opacity-75">Please allow camera access</p>
            </div>
          </div>
        )}
        
        {isScanning && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded">
            {/* Enhanced scanning overlay for small barcodes */}
            <div className="relative">
              <div className="border-2 border-red-400 w-60 h-20 rounded animate-pulse"></div>
              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-pulse"></div>
              {/* Active scanning indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>SCANNING</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Zoom Controls */}
      <div className="w-full max-w-sm mt-4 px-4">
        <label className="block text-xs text-gray-600 mb-2">
          Zoom: {zoom.toFixed(1)}x {zoom > 1 && "(for small barcodes)"}
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1x</span>
          <span>2x</span>
          <span>3x</span>
        </div>
      </div>
      
      <div className="text-center mt-3">
        <p className="text-sm text-gray-600 font-medium">
          {isLoading ? 'Starting camera...' : isScanning ? 'Scanning for barcode...' : 'Position barcode in the red frame'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isLoading ? 'Please allow camera permissions' : 'Use zoom for small barcodes • Keep barcode horizontal'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Make sure the barcode is well-lit and in focus
        </p>
      </div>
    </div>
  );
}
