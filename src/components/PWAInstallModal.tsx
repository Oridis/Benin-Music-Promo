import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Laptop, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Sparkles, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PWAInstallModal({ isOpen, onClose }: PWAInstallModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('desktop');
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) {
      setPlatform('android');
    } else if (/iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window)) {
      setPlatform('ios');
    } else {
      setPlatform('desktop');
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen to beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen to appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no native prompt is available (like on iOS Safari or some browsers), we just let the user read the step-by-step
      return;
    }
    
    // Show the browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07050f]/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-2xl border border-purple-900/30 bg-[#130f22] p-6 shadow-2xl text-white ring-1 ring-white/5 animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between border-b border-purple-950/40 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-400" />
            <h3 className="font-display text-base font-bold text-white">Installer l'application</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mt-5 pr-1.5 space-y-4 scrollbar-thin scrollbar-thumb-purple-950 scrollbar-track-transparent">
          
          {installSuccess || isInstalled ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-white">Installation Complétée !</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Bénin Music Promo est maintenant installée sur votre appareil. Vous pouvez y accéder directement depuis votre écran d'accueil avec un temps de chargement ultra-rapide et l'accès hors-ligne.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 py-3 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-md cursor-pointer"
              >
                Super, merci !
              </button>
            </div>
          ) : (
            <>
              {/* App Presentation Banner */}
              <div className="flex gap-4 items-center rounded-xl bg-[#0d0a19] border border-purple-950/40 p-3.5">
                <img 
                  src="/pwa_icon.jpg" 
                  alt="App Icon" 
                  className="h-14 w-14 rounded-xl shadow-lg border border-purple-900/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-display text-sm font-bold text-white">Bénin Music Promo PWA</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    Installez l'application pour profiter du catalogue en direct, de la mise en cache hors-ligne et d'une fluidité exceptionnelle.
                  </p>
                </div>
              </div>

              {/* Dynamic Platform Guides */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-purple-300">
                  {platform === 'ios' ? '📱 Instructions pour iPhone / iPad' : platform === 'android' ? '📱 Instructions pour Android' : '💻 Instructions pour Ordinateur'}
                </div>

                {platform === 'ios' && (
                  <div className="rounded-xl bg-[#0d0a19]/50 border border-purple-950/20 p-4 space-y-3 text-xs text-gray-300">
                    <p className="leading-relaxed">
                      Safari sur iOS ne supporte pas l'installation directe en un clic. Suivez ces étapes simples pour l'installer :
                    </p>
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-900/30 font-bold text-[10px] text-rose-300">1</span>
                        <p className="leading-tight">
                          Appuyez sur le bouton de partage de Safari <Share className="inline h-3.5 w-3.5 text-sky-400 mx-0.5" /> en bas de l'écran.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-900/30 font-bold text-[10px] text-rose-300">2</span>
                        <p className="leading-tight">
                          Faites défiler le menu de partage vers le bas et appuyez sur <strong className="text-white font-semibold">"Sur l'écran d'accueil"</strong> <PlusSquare className="inline h-3.5 w-3.5 text-rose-400 mx-0.5" />.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-900/30 font-bold text-[10px] text-rose-300">3</span>
                        <p className="leading-tight">
                          Appuyez sur <strong className="text-white font-semibold">"Ajouter"</strong> en haut à droite pour finaliser l'installation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {platform === 'android' && (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#0d0a19]/50 border border-purple-950/20 p-4 text-xs text-gray-300 space-y-2">
                      <p className="leading-relaxed">
                        Sur Android, installez l'application instantanément pour un accès direct depuis votre lanceur mobile.
                      </p>
                      <div className="flex items-start gap-2 text-[10px] text-gray-400 mt-1">
                        <Info className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <p>Si le bouton d'installation ne réagit pas, vous pouvez aussi cliquer sur les 3 points du navigateur <strong className="text-white font-semibold">"..."</strong> puis sélectionner <strong className="text-white font-semibold">"Installer l'application"</strong>.</p>
                      </div>
                    </div>

                    {deferredPrompt ? (
                      <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 py-3 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
                      >
                        <Download className="h-4 w-4 animate-bounce" />
                        Installer maintenant sur Android
                      </button>
                    ) : (
                      <div className="rounded-xl border border-purple-950/40 bg-[#0d0a19] p-3 text-center text-[11px] text-gray-400 font-medium">
                        L'application est prête ! Si elle n'est pas encore sur votre écran d'accueil, cliquez sur l'icône de téléchargement dans votre barre de navigation ou via le menu Chrome.
                      </div>
                    )}
                  </div>
                )}

                {platform === 'desktop' && (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#0d0a19]/50 border border-purple-950/20 p-4 text-xs text-gray-300 space-y-2">
                      <p className="leading-relaxed">
                        Installez l'application sur votre ordinateur pour l'ouvrir dans une fenêtre indépendante et l'intégrer au dock ou au menu démarrer de votre système d'exploitation.
                      </p>
                      <div className="flex items-start gap-2 text-[10px] text-gray-400 mt-1">
                        <Info className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <p>Vous pouvez aussi installer en cliquant sur l'icône d'installation <Download className="inline h-3.5 w-3.5 text-rose-400" /> située à l'extrême droite de la barre d'adresse de votre navigateur.</p>
                      </div>
                    </div>

                    {deferredPrompt ? (
                      <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 py-3 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
                      >
                        <Download className="h-4 w-4 animate-bounce" />
                        Installer sur mon Ordinateur
                      </button>
                    ) : (
                      <div className="rounded-xl border border-purple-950/40 bg-[#0d0a19] p-3 text-center text-[11px] text-gray-400 font-medium">
                        Le raccourci d'installation est disponible dans la barre d'adresse de votre navigateur ou dans le menu de votre navigateur Chrome/Edge.
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-purple-950/40 border border-purple-900/30 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-900/30 transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
