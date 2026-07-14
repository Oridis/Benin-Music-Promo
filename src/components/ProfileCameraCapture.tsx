import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileCameraCaptureProps {
  currentAvatar: string;
  onPhotoCaptured: (dataUrl: string) => void;
}

export default function ProfileCameraCapture({ currentAvatar, onPhotoCaptured }: ProfileCameraCaptureProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("L'accès à la caméra a été refusé. Veuillez autoriser la caméra dans votre navigateur.");
      } else {
        setCameraError("Impossible d'accéder à la caméra de votre appareil. Assurez-vous qu'elle n'est pas déjà utilisée.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Connect stream to video element when stream or videoRef changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Handle open modal
  const handleOpen = () => {
    setIsModalOpen(true);
    startCamera();
  };

  // Handle close modal
  const handleClose = () => {
    stopCamera();
    setIsModalOpen(false);
    setCameraError(null);
    setCapturedImage(null);
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas to square matching the video height/width
        const size = Math.min(video.videoWidth, video.videoHeight) || 400;
        canvas.width = size;
        canvas.height = size;

        // Draw centered square crop of the video onto the canvas
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;

        context.drawImage(
          video,
          sx,
          sy,
          size,
          size, // source rectangle
          0,
          0,
          size,
          size // destination rectangle
        );

        // Convert canvas to base64 Data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Apply captured photo
  const handleApply = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage);
      handleClose();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d0a19]/40 p-4 rounded-xl border border-purple-950/20">
      {/* Current Photo Preview */}
      <div className="relative shrink-0">
        <img
          src={capturedImage || currentAvatar}
          alt="Aperçu Profil"
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover ring-2 ring-rose-500/30 bg-purple-950/40"
          onError={(e) => {
            // Fallback for broken links
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop';
          }}
        />
        <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-md">
          <Camera className="h-3 w-3" />
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h4 className="text-xs font-bold text-gray-200">Photo de Profil</h4>
        <p className="text-[10px] text-gray-400 mt-0.5">Prenez une photo en direct avec votre appareil ou continuez à utiliser un lien Unsplash/Web.</p>
        
        <div className="flex flex-wrap gap-2 mt-2.5 justify-center sm:justify-start">
          <button
            type="button"
            onClick={handleOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-[11px] font-bold text-rose-300 transition-all cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5" />
            Prendre une photo
          </button>
        </div>
      </div>

      {/* Hidden canvas for taking the snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Capture Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-950/40 bg-[#130f22] p-5 shadow-2xl text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-950/20 pb-3 mb-4">
                <h3 className="font-display text-sm font-bold flex items-center gap-2">
                  <Camera className="h-4.5 w-4.5 text-rose-500" />
                  Prendre une photo de profil
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg p-1.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Camera Stream / captured photo viewport */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-purple-950/30 flex items-center justify-center mb-5">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                    <RefreshCw className="h-8 w-8 text-rose-500 animate-spin" />
                    <p className="text-xs text-gray-400 font-semibold">Démarrage de la caméra...</p>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-rose-300 leading-snug">{cameraError}</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mt-2 flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-xs font-bold text-gray-200 transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" /> Réessayer
                    </button>
                  </div>
                )}

                {/* Live Camera View */}
                {!cameraError && !capturedImage && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover scale-x-[-1]" // mirror view for user-facing camera
                  />
                )}

                {/* Photo Captured Preview */}
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured preview"
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Overlaid capturing instructions */}
                {!cameraError && !isLoading && !capturedImage && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/5">
                    <p className="text-[10px] text-gray-300 font-medium whitespace-nowrap">Centrez votre visage dans le cadre</p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 justify-end border-t border-purple-950/20 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl border border-white/10 text-gray-300 transition-colors cursor-pointer"
                >
                  Annuler
                </button>

                {!capturedImage ? (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isLoading || !!cameraError || !stream}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/20 disabled:text-rose-300/40 disabled:cursor-not-allowed text-xs font-bold rounded-xl text-white shadow-md shadow-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    Capturer la photo
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl border border-white/10 text-gray-200 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Recommencer
                    </button>
                    <button
                      type="button"
                      onClick={handleApply}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs font-bold rounded-xl text-white shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      Utiliser cette photo
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
