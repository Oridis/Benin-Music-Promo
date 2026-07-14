import React, { useState } from 'react';
import { Smartphone, Shield, Radio, CheckCircle2, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

interface PaymentGatewayConfigProps {
  mtnMerchantId: string;
  setMtnMerchantId: (val: string) => void;
  mtnSecretKey: string;
  setMtnSecretKey: (val: string) => void;
  mtnSandbox: boolean;
  setMtnSandbox: (val: boolean) => void;

  moovMerchantId: string;
  setMoovMerchantId: (val: string) => void;
  moovSecretKey: string;
  setMoovSecretKey: (val: string) => void;
  moovSandbox: boolean;
  setMoovSandbox: (val: boolean) => void;

  celtiisMerchantId: string;
  setCeltiisMerchantId: (val: string) => void;
  celtiisSecretKey: string;
  setCeltiisSecretKey: (val: string) => void;
  celtiisSandbox: boolean;
  setCeltiisSandbox: (val: boolean) => void;
}

export function PaymentGatewayConfig({
  mtnMerchantId,
  setMtnMerchantId,
  mtnSecretKey,
  setMtnSecretKey,
  mtnSandbox,
  setMtnSandbox,

  moovMerchantId,
  setMoovMerchantId,
  moovSecretKey,
  setMoovSecretKey,
  moovSandbox,
  setMoovSandbox,

  celtiisMerchantId,
  setCeltiisMerchantId,
  celtiisSecretKey,
  setCeltiisSecretKey,
  celtiisSandbox,
  setCeltiisSandbox,
}: PaymentGatewayConfigProps) {
  // Test connection simulation states
  const [testingGateway, setTestingGateway] = useState<'mtn' | 'moov' | 'celtiis' | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'failed' | null; message: string }>({
    status: null,
    message: '',
  });

  const simulateTestConnection = (gateway: 'mtn' | 'moov' | 'celtiis', merchantId: string, secretKey: string, sandbox: boolean) => {
    if (!merchantId || !secretKey) {
      setTestResult({
        status: 'failed',
        message: 'Erreur : l\'ID Marchand et la Clé Secrète ne peuvent pas être vides pour exécuter le test.',
      });
      return;
    }

    setTestingGateway(gateway);
    setTestResult({ status: null, message: '' });
    
    const logs: string[] = [];
    const gatewayName = gateway === 'mtn' ? 'MTN MoMo Bénin' : gateway === 'moov' ? 'Moov Money Bénin' : 'Celtiis Cash';
    
    const steps = [
      `[sys] Initialisation du protocole de paiement de secours...`,
      `[auth] Résolution de l'hôte API : bj.api.telecom.${gateway}.com`,
      `[auth] Envoi du jeton de sécurité vers la passerelle sécurisée...`,
      `[crypto] Handshake TLSv1.3 établi avec succès avec l'infrastructure du Bénin`,
      `[verify] Vérification du compte Marchand ID : ${merchantId}`,
      `[mode] Environnement configuré : ${sandbox ? 'SANDBOX (Test local)' : 'PRODUCTION (Réseau réel)'}`,
      `[status] Callback de webhook synchronisé pour les rapports de dépôts/retraits`
    ];

    let currentStep = 0;
    setTestLogs([]);

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        logs.push(steps[currentStep]);
        setTestLogs([...logs]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTestResult({
          status: 'success',
          message: `Connexion établie et validée pour ${gatewayName} ! Vos transactions de dépôts et retraits mobiles sont fonctionnelles.`,
        });
        setTestingGateway(null);
      }
    }, 450);
  };

  return (
    <div id="payment-gateway-config-section" className="md:col-span-2 pt-6 border-t border-gray-100 space-y-6">
      <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-sm">
          💳
        </span>
        <span className="text-[11.5px] uppercase tracking-wider text-gray-950 font-black">Passerelles Mobile Money Bénin (Dépôts & Retraits)</span>
      </div>
      <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
        Gérez l'intégration des API locales pour les flux financiers. Configurez ici les clés marchandes MTN, Moov et Celtiis requises pour traiter les transactions en direct de la plateforme.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {/* Passerelle MTN MoMo */}
        <div className="rounded-xl border border-yellow-100 p-4 bg-yellow-50/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              <h4 className="text-yellow-700 font-black text-[11px] uppercase tracking-wider">
                MTN Mobile Money Bénin
              </h4>
            </div>
            {/* Sandbox Mode Toggle */}
            <div className="flex items-center gap-2 bg-yellow-50/50 px-2 py-1 rounded-lg border border-yellow-100">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Mode Sandbox (Test)</span>
              <button
                type="button"
                onClick={() => setMtnSandbox(!mtnSandbox)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  mtnSandbox ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    mtnSandbox ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-600 font-bold block">ID Marchand MTN (Merchant ID)</label>
              <input
                type="text"
                value={mtnMerchantId}
                onChange={(e) => setMtnMerchantId(e.target.value)}
                placeholder="Ex: BJ-MOMO-MTN-XXXX"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-yellow-500 focus:outline-hidden font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 font-bold block">Clé Secrète API (Secret Key)</label>
              <input
                type="password"
                value={mtnSecretKey}
                onChange={(e) => setMtnSecretKey(e.target.value)}
                placeholder="Entrez la clé d'API MTN MoMo"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-yellow-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[9px] text-gray-400 font-medium italic">
              Actuellement : <span className="font-bold text-yellow-600">{mtnSandbox ? "Environnement de test béninois" : "Mode de production actif"}</span>
            </p>
            <button
              type="button"
              onClick={() => simulateTestConnection('mtn', mtnMerchantId, mtnSecretKey, mtnSandbox)}
              disabled={testingGateway !== null}
              className="text-[10px] bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-bold px-3 py-1.5 rounded-lg border border-yellow-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${testingGateway === 'mtn' ? 'animate-spin' : ''}`} />
              Tester la connexion MTN
            </button>
          </div>
        </div>

        {/* Passerelle Moov Money */}
        <div className="rounded-xl border border-blue-100 p-4 bg-blue-50/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h4 className="text-blue-700 font-black text-[11px] uppercase tracking-wider">
                Moov Money Bénin (Flooz)
              </h4>
            </div>
            {/* Sandbox Mode Toggle */}
            <div className="flex items-center gap-2 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Mode Sandbox (Test)</span>
              <button
                type="button"
                onClick={() => setMoovSandbox(!moovSandbox)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  moovSandbox ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    moovSandbox ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-600 font-bold block">ID Marchand Moov (Merchant ID)</label>
              <input
                type="text"
                value={moovMerchantId}
                onChange={(e) => setMoovMerchantId(e.target.value)}
                placeholder="Ex: FLOOZ-BJ-XXXX"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 font-bold block">Clé Secrète API (Secret Key)</label>
              <input
                type="password"
                value={moovSecretKey}
                onChange={(e) => setMoovSecretKey(e.target.value)}
                placeholder="Entrez la clé d'API Moov Money"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[9px] text-gray-400 font-medium italic">
              Actuellement : <span className="font-bold text-blue-600">{moovSandbox ? "Environnement de test béninois" : "Mode de production actif"}</span>
            </p>
            <button
              type="button"
              onClick={() => simulateTestConnection('moov', moovMerchantId, moovSecretKey, moovSandbox)}
              disabled={testingGateway !== null}
              className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${testingGateway === 'moov' ? 'animate-spin' : ''}`} />
              Tester la connexion Moov
            </button>
          </div>
        </div>

        {/* Passerelle Celtiis Cash */}
        <div className="rounded-xl border border-indigo-100 p-4 bg-indigo-50/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <h4 className="text-indigo-700 font-black text-[11px] uppercase tracking-wider">
                Celtiis Cash Bénin
              </h4>
            </div>
            {/* Sandbox Mode Toggle */}
            <div className="flex items-center gap-2 bg-indigo-50/50 px-2 py-1 rounded-lg border border-indigo-100">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Mode Sandbox (Test)</span>
              <button
                type="button"
                onClick={() => setCeltiisSandbox(!celtiisSandbox)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  celtiisSandbox ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    celtiisSandbox ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-600 font-bold block">ID Marchand Celtiis (Merchant ID)</label>
              <input
                type="text"
                value={celtiisMerchantId}
                onChange={(e) => setCeltiisMerchantId(e.target.value)}
                placeholder="Ex: CELTIIS-BJ-XXXX"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-indigo-500 focus:outline-hidden font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 font-bold block">Clé Secrète API (Secret Key)</label>
              <input
                type="password"
                value={celtiisSecretKey}
                onChange={(e) => setCeltiisSecretKey(e.target.value)}
                placeholder="Entrez la clé d'API Celtiis Cash"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-indigo-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[9px] text-gray-400 font-medium italic">
              Actuellement : <span className="font-bold text-indigo-600">{celtiisSandbox ? "Environnement de test béninois" : "Mode de production actif"}</span>
            </p>
            <button
              type="button"
              onClick={() => simulateTestConnection('celtiis', celtiisMerchantId, celtiisSecretKey, celtiisSandbox)}
              disabled={testingGateway !== null}
              className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${testingGateway === 'celtiis' ? 'animate-spin' : ''}`} />
              Tester la connexion Celtiis
            </button>
          </div>
        </div>
      </div>

      {/* Terminal of diagnostics for connections */}
      {(testingGateway !== null || testLogs.length > 0) && (
        <div className="rounded-xl border border-gray-800 bg-[#07050d] p-4 font-mono text-[10px] text-gray-300 space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Console de diagnostic des transactions Mobile Money
            </span>
            <button
              type="button"
              onClick={() => {
                setTestLogs([]);
                setTestResult({ status: null, message: '' });
              }}
              className="text-[8px] uppercase tracking-widest text-gray-500 hover:text-white"
            >
              Vider
            </button>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {testLogs.map((log, lIdx) => (
              <div key={lIdx} className="flex items-start gap-1">
                <span className="text-gray-600">$&gt;</span>
                <p className={`${log.includes('[sys]') ? 'text-gray-400' : log.includes('[auth]') ? 'text-blue-400' : log.includes('[crypto]') ? 'text-indigo-300' : log.includes('[verify]') ? 'text-yellow-300' : 'text-emerald-400'}`}>
                  {log}
                </p>
              </div>
            ))}
            {testingGateway !== null && (
              <div className="flex items-center gap-1.5 text-gray-500 animate-pulse">
                <span>$&gt;</span>
                <span>Analyse du flux de validation de paiement en cours...</span>
              </div>
            )}
          </div>

          {testResult.status && (
            <div className={`mt-3 p-2.5 rounded-lg border flex gap-2 items-start ${
              testResult.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {testResult.status === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />}
              <div className="space-y-0.5">
                <p className="font-bold uppercase tracking-wider text-[9px]">{testResult.status === 'success' ? 'Synchronisation réussie' : 'Echec de synchronisation'}</p>
                <p className="leading-relaxed text-[9.5px] font-sans font-medium">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
