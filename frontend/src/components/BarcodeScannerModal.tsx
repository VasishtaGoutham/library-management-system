'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X, Keyboard, ScanLine, CheckCircle2 } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barcode: string) => void;
  title?: string;
}

export default function BarcodeScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Scan Physical Book Barcode',
}: BarcodeScannerModalProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') return;

    let scanner: Html5QrcodeScanner | null = null;

    const timer = setTimeout(() => {
      scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          if (scanner) {
            scanner.clear().catch(() => {});
          }
          onClose();
        },
        (errorMessage) => {
          // ignore scan frame errors
        }
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [isOpen, activeTab, onScanSuccess, onClose]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-slate-800 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20">
              <ScanLine className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">Position barcode inside camera viewport</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'camera'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'manual'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Manual Input</span>
          </button>
        </div>

        {/* Camera Scanner Tab */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[220px] flex items-center justify-center">
              <div id="reader" className="w-full"></div>
              <div className="laser-line"></div>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Hold the physical book barcode steadily in front of your device camera.
            </p>
          </div>
        )}

        {/* Manual Input Tab */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Physical Barcode Tag
              </label>
              <input
                type="text"
                placeholder="e.g. LIB-0884-001"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Quick Barcode Examples:</p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono">
                <button
                  type="button"
                  onClick={() => setManualBarcode('LIB-0884-001')}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:bg-slate-800"
                >
                  LIB-0884-001
                </button>
                <button
                  type="button"
                  onClick={() => setManualBarcode('LIB-0884-002')}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:bg-slate-800"
                >
                  LIB-0884-002
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Barcode</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
