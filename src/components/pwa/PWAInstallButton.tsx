import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3500);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 rounded-xl bg-[#24513B] hover:bg-[#173B2D] border border-[#D4AF37]/50 px-3.5 py-1.5 text-xs font-semibold text-[#F3D21A] shadow-md transition-all active:scale-95 ${className}`}
          title="Install app to your home screen"
        >
          {installSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Installed!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#F3D21A]" />
              <span>Install App</span>
            </>
          )}
        </button>
      </>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 rounded-xl bg-[#24513B]/80 hover:bg-[#173B2D] border border-[#D4AF37]/40 px-3 py-1.5 text-xs font-medium text-[#F7F7F2] shadow-sm transition active:scale-95 ${className}`}
        >
          <Smartphone className="w-4 h-4 text-[#D4AF37]" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0B1F1C] border border-[#D4AF37]/40 p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#173B2D]">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#F3D21A]" />
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#AAB8B2] hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-[#AAB8B2]">
                <div className="flex items-start gap-3 bg-[#173B2D]/60 p-3 rounded-xl border border-white/5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-[#0B1F1C]">
                    1
                  </span>
                  <p>
                    Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari browser (box with an upward arrow).
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-[#173B2D]/60 p-3 rounded-xl border border-white/5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-[#0B1F1C]">
                    2
                  </span>
                  <p>
                    Scroll down and select <strong className="text-white">Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-[#173B2D]/60 p-3 rounded-xl border border-white/5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-[#0B1F1C]">
                    3
                  </span>
                  <p>
                    Tap <strong className="text-white">Add</strong> in the top right corner. The app icon will appear directly on your home screen!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#D4AF37] hover:bg-[#e0bc43] py-2.5 text-xs font-bold text-[#0B1F1C] tracking-wide uppercase transition shadow"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback direct button for browsers that support install prompt or manual guide
  return (
    <button
      onClick={() => {
        alert("To install this app on Android or Desktop:\n• Chrome/Edge: Tap '⋮' or 'Install' in your address bar.\n• iPhone: Tap Share > Add to Home Screen.");
      }}
      className={`hidden sm:flex items-center gap-1.5 rounded-xl bg-[#173B2D] hover:bg-[#24513B] border border-white/10 px-3 py-1.5 text-xs font-medium text-[#AAB8B2] hover:text-white transition ${className}`}
      title="Add to Home Screen"
    >
      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
      <span>Install PWA</span>
    </button>
  );
};
