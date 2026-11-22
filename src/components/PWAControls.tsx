import React, { useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import type { Language } from '../types/cosp';

export const PWAInstallButton: React.FC<{ lang: Language }> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const t = TRANSLATIONS[lang];

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-xl bg-palm-green text-cream-paper text-xs font-semibold hover:bg-palm-green-dark transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{t.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-xl border border-palm-green/30 bg-warm-sand text-palm-green text-xs font-semibold hover:bg-warm-sand-dark transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>{t.installIos}</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-2xl bg-cream-paper p-6 shadow-xl border border-warm-sand-dark">
              <div className="flex items-start justify-between gap-3">
                <h3 id="ios-install-title" className="text-lg font-bold text-estate-ink">
                  {t.installIosTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t.close}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-estate-muted hover:bg-warm-sand cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm text-estate-muted leading-relaxed">
                <p>{t.installIosStep1}</p>
                <p>{t.installIosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[48px] rounded-xl bg-palm-green text-cream-paper font-semibold text-sm hover:bg-palm-green-dark transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC<{ lang: Language }> = ({ lang }) => {
  const isOnline = useOnlineStatus();
  const t = TRANSLATIONS[lang];

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="no-print bg-gold-soft border-b border-gold-accent/30 text-estate-ink px-4 py-2 text-xs font-medium flex items-center justify-center gap-2"
    >
      <WifiOff className="w-4 h-4 text-gold-accent shrink-0" />
      <span>{t.offlineBanner}</span>
    </div>
  );
};
