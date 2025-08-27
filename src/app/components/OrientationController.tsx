"use client"

import { useEffect, useState } from 'react';

export default function OrientationController() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Múltiplas verificações para garantir detecção correta
      const isLandscape = 
        (window.innerWidth > window.innerHeight) || 
        (window.orientation === 90) || 
        (window.orientation === -90) ||
        (screen.orientation?.angle === 90) ||
        (screen.orientation?.angle === 270);
      
      const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Mostrar warning se for mobile E landscape
      setShowWarning(isMobile && isLandscape);
      
      // Forçar bloqueio do scroll e interação
      if (isMobile && isLandscape) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };

    // Verificação inicial
    checkOrientation();

    // Event listeners múltiplos
    const events = ['resize', 'orientationchange', 'load'];
    events.forEach(event => {
      window.addEventListener(event, () => {
        setTimeout(checkOrientation, 100);
      });
    });

    // Screen Orientation API
    if (screen.orientation) {
      screen.orientation.addEventListener('change', () => {
        setTimeout(checkOrientation, 100);
      });
    }

    // Intervalo para verificação contínua (backup)
    const interval = setInterval(checkOrientation, 500);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, checkOrientation);
      });
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', checkOrientation);
      }
      clearInterval(interval);
    };
  }, []);

  // Forçar lock de orientação se disponível
  useEffect(() => {
    const forceLock = async () => {
      try {
        if (screen.orientation && 'lock' in screen.orientation) {
          const orientationAPI = screen.orientation as { lock: (orientation: string) => Promise<void> };
          await orientationAPI.lock('portrait-primary');
        }
      } catch {
        // Falha silenciosa
      }
    };
    
    forceLock();
  }, []);

  if (!showWarning) {
    return null;
  }

  return (
    <>
      {/* Overlay completo */}
      <div 
        className="fixed inset-0 z-[99999] bg-gradient-to-br from-[#00A2AA] to-[#00757B]"
        data-orientation-controller="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          pointerEvents: 'all'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-3 overflow-hidden">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-xs max-h-full overflow-y-auto">
            {/* Header compacto */}
            <div className="px-4 py-3 text-center border-b border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <div className="relative">
                  <div className="w-12 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="w-10 h-14 bg-[#00A2AA] rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-lg animate-pulse">
                    🔄
                  </div>
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-gray-800">
                Gire seu dispositivo
              </h2>
            </div>
            
            {/* Conteúdo principal */}
            <div className="px-4 py-3 space-y-3">
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                O RecicloHub funciona melhor no modo <span className="font-semibold text-[#00A2AA]">vertical</span>
              </p>
              
              {/* Indicador visual minimalista */}
              <div className="flex items-center justify-center space-x-2 py-2">
                <div className="w-6 h-10 border-2 border-gray-300 rounded-sm opacity-40"></div>
                <svg className="w-6 h-6 text-[#00A2AA] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div className="w-6 h-10 border-2 border-[#00A2AA] rounded-sm bg-[#00A2AA]/10"></div>
              </div>
              
              <div className="bg-[#00A2AA]/5 rounded-lg p-3 text-center">
                <p className="text-xs text-[#00A2AA] font-medium">
                  📱 Rotacione para continuar
                </p>
              </div>
            </div>
            
            {/* Footer minimalista */}
            <div className="px-4 py-2 text-center border-t border-gray-100">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Aguardando...
              </p>
            </div>
          </div>
        </div>
        
        {/* Pattern de fundo sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
      </div>
    </>
  );
}
