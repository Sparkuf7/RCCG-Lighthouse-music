import React, { useState, useEffect, useRef } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemberQRScannerProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const MemberQRScanner: React.FC<MemberQRScannerProps> = ({ onClose, onSuccess }) => {
  const { events, currentMember, scanQrCheckin } = useMinistry();
  const [tokenInput, setTokenInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'idle';
    text: string;
    details?: string;
  }>({
    type: 'idle',
    text: '',
  });

  const [isScanning, setIsScanning] = useState(true);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Active open events
  const openEvents = events.filter((e) => e.is_attendance_open);
  const nextEvent = openEvents[0] || events[0];

  useEffect(() => {
    // Attempt camera access
    let isMounted = true;

    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (isMounted) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          }
        } else {
          setCameraPermissionError(true);
        }
      } catch (err) {
        console.warn('Camera access not available or blocked in iframe:', err);
        if (isMounted) {
          setCameraPermissionError(true);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3D21A', '#4F9D69', '#FFFFFF'],
      });
    } catch {
      // Ignore if canvas confetti not supported
    }
  };

  const handleProcessToken = (tokenToProcess: string) => {
    if (!tokenToProcess.trim()) return;

    const result = scanQrCheckin(tokenToProcess.trim(), currentMember.id);
    if (result.success) {
      triggerConfetti();
      setStatusMessage({
        type: 'success',
        text: 'Attendance Recorded Successfully!',
        details: `${currentMember.full_name} is marked as ${result.record?.status.toUpperCase()} for ${
          result.event?.title || 'the event'
        }. God bless your faithfulness!`,
      });
      setIsScanning(false);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Check-in Notice',
        details: result.message,
      });
    }
  };

  const handleQuickCheckinToOpenEvent = (eventToken: string) => {
    setTokenInput(eventToken);
    handleProcessToken(eventToken);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#AAB8B2] hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#173B2D] border border-[#D4AF37]/30 text-xs font-semibold text-[#F3D21A] mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>Lighthouse QR Check-In</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Mark Your Attendance</h2>
        <p className="text-xs text-[#AAB8B2] mb-5">
          Checking in as <span className="text-[#F3D21A] font-semibold">{currentMember.full_name}</span> ({currentMember.section})
        </p>

        {/* Success Modal View */}
        {statusMessage.type === 'success' ? (
          <div className="w-full p-6 bg-[#173B2D]/70 border border-emerald-500/50 rounded-2xl flex flex-col items-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{statusMessage.text}</h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed mb-4">
              {statusMessage.details}
            </p>
            <button
              onClick={() => {
                if (onClose) onClose();
                else setIsScanning(true);
              }}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs rounded-xl shadow uppercase tracking-wider transition"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Camera Viewfinder */}
            <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-black/70 border-2 border-[#D4AF37]/50 shadow-inner flex items-center justify-center mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraPermissionError ? 'hidden' : 'block'}`}
              />

              {/* Viewfinder Target Laser Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-48 h-48 border-2 border-[#F3D21A]/70 rounded-xl relative shadow-[0_0_15px_rgba(243,210,26,0.3)]">
                  {/* Corner accents */}
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#F3D21A]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#F3D21A]" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#F3D21A]" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#F3D21A]" />

                  {/* Scanning beam line */}
                  <div className="w-full h-0.5 bg-[#F3D21A] absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_#F3D21A]" />
                </div>
              </div>

              {cameraPermissionError && (
                <div className="p-4 text-center z-10">
                  <Camera className="w-8 h-8 text-[#AAB8B2] mx-auto mb-2 opacity-50" />
                  <p className="text-[11px] text-[#AAB8B2] leading-tight">
                    Camera preview inactive in current browser window.
                  </p>
                  <p className="text-[10px] text-[#F3D21A] mt-1 font-semibold">
                    Use 1-Tap Check-In button below!
                  </p>
                </div>
              )}
            </div>

            {/* Error Message if any */}
            {statusMessage.type === 'error' && (
              <div className="w-full p-3 mb-4 rounded-xl bg-red-950/70 border border-red-500/40 text-left flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-200">{statusMessage.text}</p>
                  <p className="text-[11px] text-red-300/90 leading-tight mt-0.5">
                    {statusMessage.details}
                  </p>
                </div>
              </div>
            )}

            {/* Instant 1-Tap Check-in to Current Open Session */}
            {nextEvent && (
              <div className="w-full bg-[#173B2D]/50 border border-white/5 p-3 rounded-2xl mb-4 text-left">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#AAB8B2] font-medium">Current Session:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      nextEvent.is_attendance_open
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {nextEvent.is_attendance_open ? 'Open' : 'Check-in Paused'}
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">{nextEvent.title}</p>
                <p className="text-[11px] text-[#AAB8B2]">{nextEvent.date} • {nextEvent.start_time}</p>

                <button
                  onClick={() => handleQuickCheckinToOpenEvent(nextEvent.qr_token)}
                  className="mt-2.5 w-full py-2 bg-[#24513B] hover:bg-[#173B2D] border border-[#D4AF37]/50 text-xs font-bold text-[#F3D21A] rounded-xl flex items-center justify-center gap-2 transition active:scale-98 shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tap to Confirm Check-In ({currentMember.preferred_name})</span>
                </button>
              </div>
            )}

            {/* Manual Token Code Entry Fallback */}
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Or enter event token code..."
                className="flex-1 bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={() => handleProcessToken(tokenInput)}
                className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs rounded-xl shadow transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
