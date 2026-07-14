/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, ArrowDownLeft, ArrowUpRight, ShieldCheck, CreditCard, Smartphone, Info } from 'lucide-react';
import { User, Transaction, RoleType } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
}

export default function WalletModal({
  isOpen,
  onClose,
  currentUser,
  transactions,
  onAddTransaction,
  onUpdateUserBalance
}: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [operator, setOperator] = useState<'mtn' | 'moov' | 'celtiis'>('mtn');
  const [amount, setAmount] = useState<string>('15000');
  const [phoneNumber, setPhoneNumber] = useState<string>(
    currentUser.mtnNumber || currentUser.moovNumber || currentUser.celtiisNumber || '97001122'
  );
  
  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'form' | 'otp' | 'success' | 'error'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedTxId, setSimulatedTxId] = useState('');

  if (!isOpen) return null;

  // Filter transactions for current user
  const userTransactions = transactions
    .filter((tx) => tx.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Format currency
  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(val).replace('XOF', 'F CFA');
  };

  const handleStartTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount < 1000) {
      alert('Le montant minimum est de 1 000 F CFA.');
      return;
    }

    if (activeTab === 'withdraw' && numAmount > currentUser.walletBalance) {
      alert('Solde insuffisant pour effectuer ce retrait.');
      return;
    }

    // Start Simulation
    setIsSimulating(true);
    setSimulationStep('otp');
    setSimulatedTxId(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      alert('Veuillez entrer le code de validation à 4 chiffres (ex: 1234).');
      return;
    }

    // Simulate Network lag
    setSimulationStep('otp'); // Keep spinner
    setTimeout(() => {
      const numAmount = parseInt(amount, 10);
      
      if (activeTab === 'deposit') {
        const newBalance = currentUser.walletBalance + numAmount;
        // 1. Update user balance
        onUpdateUserBalance(currentUser.id, newBalance);
        
        // 2. Add Transaction
        const newTx: Transaction = {
          id: simulatedTxId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          type: 'deposit',
          amount: numAmount,
          paymentMethod: operator,
          status: 'success',
          description: `Rechargement de portefeuille via ${operator.toUpperCase()} Money (${phoneNumber})`,
          createdAt: new Date().toISOString()
        };
        onAddTransaction(newTx);
      } else if (activeTab === 'withdraw') {
        const newBalance = currentUser.walletBalance - numAmount;
        onUpdateUserBalance(currentUser.id, newBalance);

        // Add Transaction
        const newTx: Transaction = {
          id: simulatedTxId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          type: 'withdrawal',
          amount: numAmount,
          paymentMethod: operator,
          status: 'success',
          description: `Retrait Mobile Money vers ${operator.toUpperCase()} (${phoneNumber})`,
          createdAt: new Date().toISOString()
        };
        onAddTransaction(newTx);
      }

      setSimulationStep('success');
    }, 1500);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep('form');
    setOtpCode('');
    setAmount('15000');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07050f]/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-2xl border border-purple-900/30 bg-[#130f22] p-5 shadow-2xl text-white ring-1 ring-white/5 animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex-none flex items-center justify-between border-b border-purple-950/40 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-rose-400" />
            <h3 className="font-display text-base font-bold text-white">Portefeuille Électronique</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title="Fermer la fenêtre"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4 scrollbar-thin scrollbar-thumb-purple-950 scrollbar-track-transparent">
          
          {/* Balance Panel */}
          <div className="rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 p-4 text-white shadow-lg shadow-rose-500/10">
            <p className="text-[10px] font-bold text-rose-100 uppercase tracking-wider">Solde Actuel</p>
            <p className="font-mono text-3xl font-black mt-0.5">{formatFCFA(currentUser.walletBalance)}</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-rose-100/90 font-medium bg-black/20 rounded-lg px-2 py-1 w-fit border border-white/5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Transactions 100% sécurisées via Mobile Money Bénin
            </div>
          </div>

          {/* Tabs switcher */}
          {!isSimulating && (
            <div className="flex rounded-xl bg-[#0d0a19] border border-purple-950/40 p-1">
              {currentUser.role === 'artiste' && (
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'deposit' 
                      ? 'bg-[#1a152e] text-rose-400 border border-rose-500/20 shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Recharger (Dépôt)
                </button>
              )}
              {currentUser.role === 'promoteur' && (
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'withdraw' 
                      ? 'bg-[#1a152e] text-rose-400 border border-rose-500/20 shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Retirer mes gains
                </button>
              )}
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'history' 
                    ? 'bg-[#1a152e] text-rose-400 border border-rose-500/20 shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Historique
              </button>
            </div>
          )}

          {/* Content Tabs */}
          <div>
            {/* HISTORY TAB */}
            {activeTab === 'history' && !isSimulating && (
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                  {userTransactions.length === 0 ? (
                    <div className="py-12 text-center">
                      <Smartphone className="mx-auto h-10 w-10 text-gray-500" />
                      <p className="mt-2 text-xs text-gray-400 font-medium">Aucune transaction enregistrée.</p>
                    </div>
                  ) : (
                    userTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between rounded-xl border border-purple-950/40 bg-[#0d0a19]/50 p-3 hover:bg-[#0d0a19] transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${
                            tx.type === 'deposit' || tx.type === 'refund' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'refund' ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-200 truncate">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-gray-400 font-medium">{tx.id}</span>
                              <span className="text-[10px] text-gray-500">•</span>
                              <span className="text-[10px] text-gray-400">{new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <span className={`font-mono text-xs font-extrabold ${
                            tx.type === 'deposit' || tx.type === 'refund' 
                              ? 'text-emerald-400' 
                              : 'text-rose-400'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'} {tx.amount.toLocaleString()} F
                          </span>
                          <div className="mt-0.5">
                            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                              Réussi
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl bg-purple-950/40 border border-purple-900/30 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-900/30 transition-all cursor-pointer"
                >
                  Fermer l'historique
                </button>
              </div>
            )}

            {/* DEPOSIT OR WITHDRAW FORM */}
            {(activeTab === 'deposit' || activeTab === 'withdraw') && !isSimulating && (
              <form onSubmit={handleStartTransaction} className="space-y-4">
                
                {/* Operator Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-300">1. Choisissez un opérateur Mobile Money</label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setOperator('mtn')}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border-2 transition-all cursor-pointer ${
                        operator === 'mtn'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold'
                          : 'border-purple-950/40 bg-[#0d0a19] text-gray-400 hover:border-purple-900/30 hover:text-white'
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black flex items-center justify-center shadow-xs">MTN</div>
                      <span className="text-[10px] mt-1.5">MTN MoMo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOperator('moov')}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border-2 transition-all cursor-pointer ${
                        operator === 'moov'
                          ? 'border-sky-500 bg-sky-50/10 text-sky-300 font-bold'
                          : 'border-purple-950/40 bg-[#0d0a19] text-gray-400 hover:border-purple-900/30 hover:text-white'
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-sky-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">Moov</div>
                      <span className="text-[10px] mt-1.5">Moov Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOperator('celtiis')}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border-2 transition-all cursor-pointer ${
                        operator === 'celtiis'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'border-purple-950/40 bg-[#0d0a19] text-gray-400 hover:border-purple-900/30 hover:text-white'
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">Celtiis</div>
                      <span className="text-[10px] mt-1.5">Celtiis Cash</span>
                    </button>
                  </div>
                </div>

                {/* Amount Inputs */}
                <div>
                  <label className="text-xs font-bold text-gray-300">2. Montant de l'opération (F CFA)</label>
                  <div className="relative mt-1.5 rounded-xl shadow-xs">
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full rounded-xl border border-purple-950/40 p-3 pr-16 font-mono text-base font-bold bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                      placeholder="Ex: 25000"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="font-display text-xs font-bold text-gray-500">FCFA</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['5000', '10000', '25000', '50000', '100000'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAmount(p)}
                        className="rounded-lg bg-[#1a152e] border border-purple-950/40 px-2.5 py-1 text-[10px] font-bold text-gray-300 hover:bg-purple-900/30 hover:text-white transition-all cursor-pointer"
                      >
                        +{parseInt(p).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone number */}
                <div>
                  <label className="text-xs font-bold text-gray-300">3. Numéro de téléphone Mobile Money Bénin</label>
                  <div className="relative mt-1.5 flex rounded-xl shadow-xs">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-purple-950/40 bg-[#1a152e] px-3 font-mono text-xs font-bold text-gray-400">
                      +229
                    </span>
                    <input
                      type="tel"
                      pattern="[0-9]{8}"
                      title="Le numéro béninois doit comporter 8 chiffres après l'indicatif."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full rounded-r-xl border border-purple-950/40 p-3 font-mono text-sm font-bold bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                      placeholder="Ex: 97001122"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Saisissez les 8 chiffres de votre numéro de téléphone mobile béninois.</p>
                </div>

                {/* Notice */}
                <div className="rounded-xl bg-purple-950/20 border border-purple-900/20 p-3 text-[10px] text-gray-300 font-medium flex gap-2">
                  <Info className="h-4 w-4 shrink-0 text-rose-400" />
                  <p>
                    {activeTab === 'deposit' 
                      ? "Cette action simulera la réception d'un push SMS sur votre téléphone pour valider l'autorisation de débit."
                      : "Les gains retirés seront transférés sur votre compte sous un délai de traitement de quelques secondes après approbation."}
                  </p>
                </div>

                {/* Action Buttons row */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl bg-purple-950/40 border border-purple-900/30 py-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-purple-900/30 transition-all cursor-pointer"
                  >
                    Annuler & Fermer
                  </button>
                  <button
                    type="submit"
                    className="flex-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 py-3 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
                  >
                    {activeTab === 'deposit' ? 'Lancer la simulation' : 'Initier le retrait'}
                  </button>
                </div>
              </form>
            )}

            {/* SIMULATOR OTP SCREEN */}
            {isSimulating && simulationStep === 'otp' && (
              <div className="py-4 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 animate-bounce">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">Validation Mobile Money</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Un SMS de validation a été envoyé au numéro <strong className="font-mono text-white">+229 {phoneNumber}</strong> via l'opérateur <strong className="uppercase text-white">{operator}</strong>.
                  </p>
                  <p className="text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg mt-3 inline-block">
                    Simulateur : Saisissez le code de sécurité pour autoriser le débit.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-4">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Code OTP (ex: 1234)"
                    required
                    className="w-full text-center tracking-widest font-mono text-xl font-bold p-3 rounded-xl border-2 border-purple-950/40 bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                  />
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={resetSimulation}
                      className="flex-1 rounded-xl bg-[#1a152e] hover:bg-purple-900/30 border border-purple-950/40 py-2.5 text-xs font-bold text-gray-300 transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 py-2.5 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-md cursor-pointer"
                    >
                      Valider le code
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SIMULATOR SUCCESS SCREEN */}
            {isSimulating && simulationStep === 'success' && (
              <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shadow-xs border border-emerald-500/20">
                  <Check className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">Opération réussie !</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Votre transaction de <strong className="font-mono text-white">{formatFCFA(parseInt(amount))}</strong> a été complétée avec succès.
                  </p>
                  <div className="mt-3 rounded-xl bg-[#0d0a19] border border-purple-950/40 p-3 text-[10px] text-gray-400 font-mono text-left max-w-sm mx-auto space-y-1">
                    <div>Réf : <span className="text-gray-200 font-bold">{simulatedTxId}</span></div>
                    <div>Opérateur : <span className="text-gray-200 font-bold uppercase">{operator}</span></div>
                    <div>Téléphone : <span className="text-gray-200 font-bold">+229 {phoneNumber}</span></div>
                    <div>Heure : <span className="text-gray-200 font-bold">{new Date().toLocaleString('fr-FR')}</span></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    resetSimulation();
                    onClose();
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 py-2.5 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-md cursor-pointer"
                >
                  Fermer la fenêtre
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
