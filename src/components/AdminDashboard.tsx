/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, PromoteurOffer, PromotionRequest, Transaction, PlatformConfig, Notification } from '../types';
import {
  Shield,
  Users,
  Coins,
  Radio,
  FileText,
  Settings,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Info,
  Calendar,
  Trash2,
  LockKeyhole,
  Check,
  Percent,
  Clock,
  Briefcase,
  Award,
  Mail
} from 'lucide-react';
import { PaymentGatewayConfig } from './PaymentGatewayConfig';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  offers: PromoteurOffer[];
  requests: PromotionRequest[];
  transactions: Transaction[];
  config: PlatformConfig;
  onUpdateUsers: (users: User[]) => void;
  onUpdateRequests: (requests: PromotionRequest[]) => void;
  onUpdateConfig: (config: PlatformConfig) => void;
  onAddTransaction: (tx: Transaction) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
  onAddNotification?: (notif: Notification) => void;
}

export default function AdminDashboard({
  currentUser,
  users,
  offers,
  requests,
  transactions,
  config,
  onUpdateUsers,
  onUpdateRequests,
  onUpdateConfig,
  onAddTransaction,
  onUpdateUserBalance,
  onAddNotification
}: AdminDashboardProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'stats' | 'comptes' | 'moderation' | 'finances' | 'config'>('stats');

  // Congratulatory email simulation modal state
  const [congratsEmail, setCongratsEmail] = useState<{
    toEmail: string;
    toName: string;
    organization: string;
    completionRate: number;
    date: string;
  } | null>(null);

  // Config Inputs
  const [commissionInput, setCommissionInput] = useState<number>(config.commissionRate);
  const [timeoutInput, setTimeoutInput] = useState<number>(config.autoRefundHours);
  const [channelInputs, setChannelInputs] = useState<string[]>(config.enabledChannels);

  // Hero Visibility States
  const [hideHeroArtiste, setHideHeroArtiste] = useState<boolean>(config.hideHeroArtiste || false);
  const [hideHeroPromoteur, setHideHeroPromoteur] = useState<boolean>(config.hideHeroPromoteur || false);
  const [hideHeroAdmin, setHideHeroAdmin] = useState<boolean>(config.hideHeroAdmin || false);

  // Hero Section Inputs
  const [heroBadge, setHeroBadge] = useState<string>(config.heroBadge || "BENIN MUSIC PROMO");
  const [heroImage, setHeroImage] = useState<string>(config.heroImage || "/src/assets/images/futuristic_benin_musician_cyberpunk_1783899360091.jpg");
  const [heroImageBadgeLeft, setHeroImageBadgeLeft] = useState<string>(config.heroImageBadgeLeft || "VIBES CYBER BÉNIN");
  const [heroImageBadgeRight, setHeroImageBadgeRight] = useState<string>(config.heroImageBadgeRight || "SÉQUESTRE SÉCURISÉ");
  const [heroBoxCategory, setHeroBoxCategory] = useState<string>(config.heroBoxCategory || "RÉVOLUTION AUDIO BÉNIN");
  const [heroBoxTitle, setHeroBoxTitle] = useState<string>(config.heroBoxTitle || "À PROPOS DU REGISTRE");
  const [heroBoxDesc, setHeroBoxDesc] = useState<string>(config.heroBoxDesc || "Sécurité financière et transparence de diffusion totale.");

  // Artiste Hero
  const [heroTitleArtisteRegular, setHeroTitleArtisteRegular] = useState<string>(config.heroTitleArtisteRegular || "La Nouvelle Ère de la");
  const [heroTitleArtisteHighlight, setHeroTitleArtisteHighlight] = useState<string>(config.heroTitleArtisteHighlight || "Promo Digitale");
  const [heroDescArtiste, setHeroDescArtiste] = useState<string>(config.heroDescArtiste || "Propulsez vos singles vers le sommet des charts béninois. Sélectionnez les radios et diffuseurs leaders, transmettez vos morceaux en toute sécurité et profitez d'une garantie de diffusion séquestre absolue : preuve authentifiée ou remboursement immédiat.");
  const [heroBtnArtiste, setHeroBtnArtiste] = useState<string>(config.heroBtnArtiste || "Lancer une Campagne");

  // Promoteur Hero
  const [heroTitlePromoteurRegular, setHeroTitlePromoteurRegular] = useState<string>(config.heroTitlePromoteurRegular || "Monétisez Vos");
  const [heroTitlePromoteurHighlight, setHeroTitlePromoteurHighlight] = useState<string>(config.heroTitlePromoteurHighlight || "Ondes en Direct");
  const [heroDescPromoteur, setHeroDescPromoteur] = useState<string>(config.heroDescPromoteur || "Mettez vos ondes à profit. Validez l'écoute de morceaux de talentueux artistes béninois, diffusez-les sur vos canaux officiels, uploadez vos rapports médias et touchez instantanément vos fonds.");
  const [heroBtnPromoteur, setHeroBtnPromoteur] = useState<string>(config.heroBtnPromoteur || "Gérer mes Forfaits");

  // Admin Hero
  const [heroTitleAdminRegular, setHeroTitleAdminRegular] = useState<string>(config.heroTitleAdminRegular || "Registre Média");
  const [heroTitleAdminHighlight, setHeroTitleAdminHighlight] = useState<string>(config.heroTitleAdminHighlight || "Décentralisé");
  const [heroDescAdmin, setHeroDescAdmin] = useState<string>(config.heroDescAdmin || "Régulez le marché de la diffusion musicale au Bénin. Examinez les transactions, certifiez le KYC des diffuseurs, résolvez les litiges et analysez les commissions en temps réel.");
  const [heroBtnAdmin, setHeroBtnAdmin] = useState<string>(config.heroBtnAdmin || "Vérifier le Réseau");

  // Mobile Money API configurations
  const [mtnMerchantId, setMtnMerchantId] = useState<string>(config.mtnMerchantId || "MTN-BJ-7762");
  const [mtnSecretKey, setMtnSecretKey] = useState<string>(config.mtnSecretKey || "momo_sec_live_bj_88291a823fbc0");
  const [mtnSandbox, setMtnSandbox] = useState<boolean>(config.mtnSandbox !== undefined ? config.mtnSandbox : true);

  const [moovMerchantId, setMoovMerchantId] = useState<string>(config.moovMerchantId || "MOOV-BJ-4412");
  const [moovSecretKey, setMoovSecretKey] = useState<string>(config.moovSecretKey || "moov_sec_live_bj_33829dc771ea0");
  const [moovSandbox, setMoovSandbox] = useState<boolean>(config.moovSandbox !== undefined ? config.moovSandbox : true);

  const [celtiisMerchantId, setCeltiisMerchantId] = useState<string>(config.celtiisMerchantId || "CELTIIS-BJ-1002");
  const [celtiisSecretKey, setCeltiisSecretKey] = useState<string>(config.celtiisSecretKey || "celtiis_sec_live_bj_11209eb998df2");
  const [celtiisSandbox, setCeltiisSandbox] = useState<boolean>(config.celtiisSandbox !== undefined ? config.celtiisSandbox : true);

  // Toast notifications for hero visibility toggles
  const [heroNotification, setHeroNotification] = useState<{
    role: string;
    visible: boolean;
    timestamp: number;
  } | null>(null);

  // Sync state with incoming config updates
  useEffect(() => {
    setHideHeroArtiste(config.hideHeroArtiste || false);
    setHideHeroPromoteur(config.hideHeroPromoteur || false);
    setHideHeroAdmin(config.hideHeroAdmin || false);
  }, [config.hideHeroArtiste, config.hideHeroPromoteur, config.hideHeroAdmin]);

  // Clear notification after timeout
  useEffect(() => {
    if (!heroNotification) return;
    const timer = setTimeout(() => {
      setHeroNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [heroNotification]);

  const handleToggleHeroVisibility = (role: 'artiste' | 'promoteur' | 'admin', currentVal: boolean) => {
    const newVal = !currentVal;
    
    if (role === 'artiste') setHideHeroArtiste(newVal);
    else if (role === 'promoteur') setHideHeroPromoteur(newVal);
    else if (role === 'admin') setHideHeroAdmin(newVal);
    
    // Save/update parent state immediately for a fluid, real-time experience!
    const updatedConfig: PlatformConfig = {
      commissionRate: commissionInput,
      autoRefundHours: timeoutInput,
      enabledChannels: channelInputs,
      hideHeroArtiste: role === 'artiste' ? newVal : hideHeroArtiste,
      hideHeroPromoteur: role === 'promoteur' ? newVal : hideHeroPromoteur,
      hideHeroAdmin: role === 'admin' ? newVal : hideHeroAdmin,
      heroBadge,
      heroImage,
      heroImageBadgeLeft,
      heroImageBadgeRight,
      heroBoxCategory,
      heroBoxTitle,
      heroBoxDesc,
      heroTitleArtisteRegular,
      heroTitleArtisteHighlight,
      heroDescArtiste,
      heroBtnArtiste,
      heroTitlePromoteurRegular,
      heroTitlePromoteurHighlight,
      heroDescPromoteur,
      heroBtnPromoteur,
      heroTitleAdminRegular,
      heroTitleAdminHighlight,
      heroDescAdmin,
      heroBtnAdmin,
      mtnMerchantId,
      mtnSecretKey,
      mtnSandbox,
      moovMerchantId,
      moovSecretKey,
      moovSandbox,
      celtiisMerchantId,
      celtiisSecretKey,
      celtiisSandbox
    };

    onUpdateConfig(updatedConfig);
    
    setHeroNotification({
      role: role === 'artiste' ? 'Artistes' : role === 'promoteur' ? 'Promoteurs' : 'Admins',
      visible: !newVal,
      timestamp: Date.now()
    });
  };

  // Search Filters
  const [userSearch, setUserSearch] = useState('');
  const [moderationSearch, setModerationSearch] = useState('');
  const [financeTypeFilter, setFinanceTypeFilter] = useState<string>('all');

  // Detailed Auditing request modal
  const [auditRequestId, setAuditRequestId] = useState<string | null>(null);

  // Format currency
  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(val).replace('XOF', 'F CFA');
  };

  // Lifetime platform volume
  const totalVolumeTransacted = transactions
    .filter((tx) => tx.type === 'payment' && tx.status === 'success')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const accumulatedCommissions = users.find((u) => u.role === 'admin')?.walletBalance || 0;

  // VERIFY/APPROVE PROMOTEUR KYC
  const handleApprovePromoteur = (userId: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, verified: true };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
    
    // Log system notification
    alert('Le profil du promoteur a été vérifié et activé avec succès. Ses offres de promotion sont désormais disponibles dans le catalogue des artistes.');
  };

  // SUSPEND / ACTIVATE ACCOUNT
  const handleToggleSuspendUser = (userId: string, currentStatus: boolean) => {
    const actionLabel = currentStatus ? 'suspendre' : 'réactiver';
    if (confirm(`Voulez-vous vraiment ${actionLabel} ce compte utilisateur ?`)) {
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          // Simulate status toggle using custom verified or custom state
          // For simplicity we will toggle the verified flag for promoters, or custom flag.
          // Let's toggle a suspended mock state by changing verified for promoter, or alert.
          return { ...u, verified: !currentStatus };
        }
        return u;
      });
      onUpdateUsers(updatedUsers);
      alert(`Le compte a été ${currentStatus ? 'suspendu' : 'réactivé'} avec succès.`);
    }
  };

  // TOGGLE CERTIFICATION BADGE AND SEND CONGRATS EMAIL / NOTIFICATION
  const handleToggleCertification = (userId: string, isCurrentlyCertified: boolean) => {
    const newVal = !isCurrentlyCertified;
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, certified: newVal };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);

    if (newVal) {
      const targetUser = users.find((u) => u.id === userId);
      if (targetUser) {
        const uRequests = requests.filter((r) => r.promoteurId === userId);
        const uCompleted = uRequests.filter((r) => r.status === 'completed').length;
        const uHandled = uRequests.filter((r) => r.status === 'completed' || r.status === 'refused').length;
        const uCompletionRate = uHandled > 0 ? Math.round((uCompleted / uHandled) * 100) : 100;

        // Trigger gorgeous congratulations email simulation modal
        setCongratsEmail({
          toEmail: targetUser.email,
          toName: targetUser.name,
          organization: targetUser.organizationName || 'Bénin Media Partner',
          completionRate: uCompletionRate,
          date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });

        // Add platform-wide notification
        if (onAddNotification) {
          onAddNotification({
            id: `notif-cert-${Date.now()}`,
            userId: userId,
            title: "🏆 Statut Certifié Accordé !",
            message: `Félicitations ! En raison de votre excellent taux de complétion de mission (${uCompletionRate}%), l'administration vous a accordé le badge officiel "Certifié" ! Un email de félicitations vous a été envoyé.`,
            type: 'system',
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    } else {
      alert('La certification du promoteur a été désactivée et son badge "Certifié" a été retiré.');
    }
  };

  // CANCEL CAMPAIGN & ADMIN MANUALLY REFUND
  const handleForceRefund = (reqId: string) => {
    if (confirm("Voulez-vous forcer l'annulation et le remboursement intégral de cette prestation de promotion ?")) {
      const reqIndex = requests.findIndex((r) => r.id === reqId);
      if (reqIndex === -1) return;

      const updatedRequests = [...requests];
      const target = updatedRequests[reqIndex];
      const originalStatus = target.status;
      
      // If already completed, we can still force refund, but let's deduct from promoter if needed
      // To keep simple, we credit the artist
      target.status = 'refused';
      target.refusalReason = "Annulation et remboursement forcés par l'administration de la plateforme.";
      target.lastUpdate = new Date().toISOString();

      // Refund artist
      const artist = users.find((u) => u.id === target.artistId);
      if (artist) {
        onUpdateUserBalance(target.artistId, artist.walletBalance + target.price);
      }

      onUpdateRequests(updatedRequests);

      // Log Transaction
      const refundTx: Transaction = {
        id: `TX-FORCE-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: target.artistId,
        userName: target.artistName,
        userRole: 'artiste',
        type: 'refund',
        amount: target.price,
        paymentMethod: 'wallet',
        status: 'success',
        description: `Remboursement forcé par l'administrateur pour l'œuvre "${target.songTitle}"`,
        createdAt: new Date().toISOString()
      };
      onAddTransaction(refundTx);

      alert('La promotion a été annulée et l\'artiste a été intégralement remboursé.');
      setAuditRequestId(null);
    }
  };

  // SAVE APP CONFIG PARAMETERS
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: PlatformConfig = {
      commissionRate: commissionInput,
      autoRefundHours: timeoutInput,
      enabledChannels: channelInputs,
      
      hideHeroArtiste,
      hideHeroPromoteur,
      hideHeroAdmin,
      
      // Hero section editable states
      heroBadge,
      heroImage,
      heroImageBadgeLeft,
      heroImageBadgeRight,
      heroBoxCategory,
      heroBoxTitle,
      heroBoxDesc,
      
      heroTitleArtisteRegular,
      heroTitleArtisteHighlight,
      heroDescArtiste,
      heroBtnArtiste,

      heroTitlePromoteurRegular,
      heroTitlePromoteurHighlight,
      heroDescPromoteur,
      heroBtnPromoteur,

      heroTitleAdminRegular,
      heroTitleAdminHighlight,
      heroDescAdmin,
      heroBtnAdmin,

      // Mobile Money API keys
      mtnMerchantId,
      mtnSecretKey,
      mtnSandbox,
      moovMerchantId,
      moovSecretKey,
      moovSandbox,
      celtiisMerchantId,
      celtiisSecretKey,
      celtiisSandbox
    };
    onUpdateConfig(updatedConfig);
    alert('Les configurations de la plateforme, de l\'accueil et des passerelles de paiement ont été mises à jour avec succès.');
  };

  // Toggle active payment channels
  const handleToggleChannel = (chan: string) => {
    if (channelInputs.includes(chan)) {
      setChannelInputs(channelInputs.filter((c) => c !== chan));
    } else {
      setChannelInputs([...channelInputs, chan]);
    }
  };

  // Filtering users
  const filteredUsers = users.filter((u) => {
    if (u.role === 'admin') return false; // Hide admin from list
    return (
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phoneNumber || '').includes(userSearch)
    );
  });

  // Filtering requests/moderation
  const filteredRequests = requests.filter((r) => {
    return (
      r.songTitle.toLowerCase().includes(moderationSearch.toLowerCase()) ||
      r.artistName.toLowerCase().includes(moderationSearch.toLowerCase()) ||
      r.promoteurName.toLowerCase().includes(moderationSearch.toLowerCase())
    );
  });

  // Filtering finances
  const filteredTransactions = transactions.filter((tx) => {
    if (financeTypeFilter === 'all') return true;
    return tx.type === financeTypeFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Admin general summary badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* total transacted */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Volume Échangé (CFA)</p>
            <p className="font-mono text-xl font-black text-gray-800 mt-1">{formatFCFA(totalVolumeTransacted)}</p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-1">Garantie séquestre active</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 shrink-0">
            <Coins className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Plattform earnings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Cagnotte Commissions (10%)</p>
            <p className="font-mono text-xl font-black text-emerald-600 mt-1">{formatFCFA(accumulatedCommissions)}</p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-1">Revenu net plateforme</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <TrendingUp className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* registered artists */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Artistes Indépendants</p>
            <p className="font-mono text-xl font-black text-gray-800 mt-1">
              {users.filter((u) => u.role === 'artiste').length}
            </p>
            <p className="text-[9px] text-gray-400 font-semibold mt-1">Bénin et Diaspora active</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 shrink-0">
            <Users className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* registered promoters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Promoteurs de diffusion</p>
            <p className="font-mono text-xl font-black text-gray-800 mt-1">
              {users.filter((u) => u.role === 'promoteur').length}
            </p>
            <p className="text-[9px] text-amber-600 font-semibold mt-1">
              {users.filter((u) => u.role === 'promoteur' && !u.verified).length} en attente de KYC
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Radio className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-gray-100 bg-white p-1.5 sm:p-2 rounded-2xl shadow-xs overflow-x-auto scrollbar-none flex-nowrap justify-start gap-1.5 sm:gap-2 max-w-full">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'stats'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Rapports & Graphiques</span>
          <span className="inline sm:hidden">Rapports</span>
        </button>

        <button
          onClick={() => setActiveTab('comptes')}
          className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'comptes'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <div className="relative flex items-center">
            <span className="hidden sm:inline">Comptes & Validation</span>
            <span className="inline sm:hidden">Validation</span>
            {users.filter((u) => u.role === 'promoteur' && !u.verified).length > 0 && (
              <span className="absolute -top-2.5 -right-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-1 ring-white/10 shadow-xs">
                {users.filter((u) => u.role === 'promoteur' && !u.verified).length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'moderation'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Modération des titres</span>
          <span className="inline sm:hidden">Modération</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'finances'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Coins className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Flux financier</span>
          <span className="inline sm:hidden">Finances</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'config'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Paramètres</span>
          <span className="inline sm:hidden">Paramètres</span>
        </button>
      </div>

      {/* STATS & REPORTS TAB WITH HIGH-FIDELITY CUSTOM SVG CHART */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Card (2 columns) */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-gray-900">Courbe de Volume Transactionnel (FCFA)</h3>
                <p className="text-[11px] text-gray-400 font-medium">Flux mensuel cumulé des commandes validées au Bénin</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                En croissance (2026)
              </span>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="relative h-64 w-full">
              {/* Simple grid values overlay */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-mono font-bold text-gray-400 pr-2 pt-2 pb-6 border-r border-gray-100/50 w-20">
                <span>350 000 F</span>
                <span>250 000 F</span>
                <span>150 000 F</span>
                <span>50 000 F</span>
                <span>0 F</span>
              </div>

              {/* Chart Stage */}
              <div className="h-full pl-20 pb-6">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="200" x2="500" y2="200" stroke="#e5e7eb" strokeWidth="1.5" />

                  {/* Gradient Area Fill (Jan to Jul points) */}
                  <path
                    d="M 0,200 L 0,160 L 83,145 L 166,130 L 250,90 L 333,70 L 416,50 L 500,30 L 500,200 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Line Path */}
                  <path
                    d="M 0,160 L 83,145 L 166,130 L 250,90 L 333,70 L 416,50 L 500,30"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Key Interactive Nodes */}
                  <circle cx="0" cy="160" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="166" cy="130" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="333" cy="70" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="500" cy="30" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-2 font-mono">
                  <span>Janvier</span>
                  <span>Février</span>
                  <span>Mars</span>
                  <span>Avril</span>
                  <span>Mai</span>
                  <span>Juin</span>
                  <span>Juillet (Actuel)</span>
                </div>
              </div>
            </div>

            {/* Additional charts metrics */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50 text-xs">
              <div className="text-center bg-gray-50/50 p-2.5 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold">Taux de validation</p>
                <p className="text-base font-extrabold text-emerald-600 mt-0.5">85%</p>
              </div>
              <div className="text-center bg-gray-50/50 p-2.5 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold">Moyenne Panier</p>
                <p className="text-base font-extrabold text-indigo-600 mt-0.5">42 500 F</p>
              </div>
              <div className="text-center bg-gray-50/50 p-2.5 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold">Délai Réponse Médian</p>
                <p className="text-base font-extrabold text-amber-600 mt-0.5">4.8 Heures</p>
              </div>
            </div>
          </div>

          {/* Platform Performance metrics (1 column) */}
          <div className="lg:col-span-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-emerald-600" />
              État de Sécurité réseau
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Autorisations frame :</span>
                <span className="text-emerald-600 flex items-center gap-1">✓ Sécurisé (iFrame OK)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Passerelles Mobile Money :</span>
                <span className="text-emerald-600 flex items-center gap-1">✓ MTN / Moov / Celtiis (BJ)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Moteur de séquestre (Escrow) :</span>
                <span className="text-indigo-600">Actif (Dépôt garanti)</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <span className="text-gray-500">Taux Commission Actuel :</span>
                <span className="text-gray-800 font-mono font-bold">{config.commissionRate} %</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Annulation auto :</span>
                <span className="text-gray-800 font-mono font-bold">{config.autoRefundHours} Heures</span>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3.5 border border-indigo-100/30 text-[10.5px] text-indigo-900 font-medium leading-relaxed">
              <p className="font-bold mb-1 flex items-center gap-1"><Info className="h-4 w-4 text-indigo-500" /> Note de direction :</p>
              Les paiements par Mobile Money opèrent sous un strict protocole cryptographique de sécurité en lien avec les banques locales béninoises.
            </div>
          </div>
        </div>
      )}

      {/* COMPTES & KYC APPROVALS TAB */}
      {activeTab === 'comptes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-base font-bold text-gray-900">
              Gestion de comptes & validation d'audience ({filteredUsers.length})
            </h3>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Rechercher par nom, email..."
                className="rounded-xl border border-gray-100 bg-white p-2 pl-8 text-xs focus:border-emerald-500 focus:outline-hidden"
              />
              <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Rôle</th>
                    <th className="p-4">Audience / Couverture</th>
                    <th className="p-4">Contact Bénin</th>
                    <th className="p-4">Statut / KYC</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {filteredUsers.map((u) => {
                    // Calculate promoter completion rate
                    const uRequests = requests.filter((r) => r.promoteurId === u.id);
                    const uCompleted = uRequests.filter((r) => r.status === 'completed').length;
                    const uHandled = uRequests.filter((r) => r.status === 'completed' || r.status === 'refused').length;
                    const uCompletionRate = uHandled > 0 ? Math.round((uCompleted / uHandled) * 100) : 100;

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-9 w-9 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-gray-900 leading-snug">{u.name}</p>
                            <p className="text-[10px] text-gray-400">{u.email}</p>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <span className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                            u.role === 'artiste'
                              ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/10'
                              : 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-600/10'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="p-4">
                          {u.role === 'promoteur' ? (
                            <div className="space-y-1">
                              <p className="font-bold text-gray-800">{u.audienceSize || '10K abonnés'}</p>
                              <p className="text-[9px] text-gray-400 font-semibold">{u.audienceLocation || 'Bénin'}</p>
                              <div className="mt-1 flex items-center gap-1">
                                <span className="text-[9.5px] text-gray-400">Complétion :</span>
                                <span className={`px-1.5 py-0.5 rounded-sm font-mono text-[9px] font-black ${
                                  uCompletionRate >= 90
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : uCompletionRate >= 50
                                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  {uCompletionRate}%
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="p-4 font-mono text-[11px] text-gray-500">
                          {u.phoneNumber || '+229 -- -- -- --'}
                        </td>

                        <td className="p-4">
                          {u.verified ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                                <CheckCircle className="h-3 w-3 shrink-0" />
                                Actif / Agréé
                              </span>
                              {u.role === 'promoteur' && (
                                u.certified && uCompletionRate >= 90 ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[9px] font-black text-white border border-amber-400 shadow-xs animate-pulse">
                                    <Award className="h-2.5 w-2.5 shrink-0" />
                                    Certifié
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-1.5 py-0.5 text-[9px] font-bold text-gray-400 border border-gray-100">
                                    Non certifié
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/10 animate-pulse">
                              <Clock className="h-3 w-3 shrink-0" />
                              Attente agrément
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex flex-col sm:flex-row gap-1.5 justify-end">
                            {u.role === 'promoteur' && u.verified && (
                              u.certified ? (
                                <button
                                  onClick={() => handleToggleCertification(u.id, true)}
                                  className="rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/20 px-2.5 py-1.5 text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                                >
                                  <Award className="h-3 w-3 shrink-0" />
                                  Retirer Badge
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleCertification(u.id, false)}
                                  disabled={uCompletionRate < 90}
                                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-colors flex items-center justify-center gap-1 shrink-0 ${
                                    uCompletionRate >= 90
                                      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs'
                                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                  }`}
                                  title={uCompletionRate < 90 ? 'Taux de complétion requis supérieur à 90%' : 'Activer le badge Certifié de ce promoteur'}
                                >
                                  <Award className="h-3 w-3 shrink-0" />
                                  Certifier
                                </button>
                              )
                            )}

                            {u.role === 'promoteur' && !u.verified ? (
                              <button
                                onClick={() => handleApprovePromoteur(u.id)}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
                              >
                                Valider le KYC & Activer
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleSuspendUser(u.id, u.verified)}
                                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                                  u.verified
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100/20'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100/20'
                                }`}
                              >
                                {u.verified ? 'Suspendre' : 'Réactiver'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODERATION TAB (ALL PROMOTION FILES) */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-base font-bold text-gray-900">
              Modération des contenus déposés & Audit des discussions ({filteredRequests.length})
            </h3>

            <div className="relative">
              <input
                type="text"
                value={moderationSearch}
                onChange={(e) => setModerationSearch(e.target.value)}
                placeholder="Rechercher chanson, artiste..."
                className="rounded-xl border border-gray-100 bg-white p-2 pl-8 text-xs focus:border-emerald-500 focus:outline-hidden"
              />
              <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold text-gray-900">{req.songTitle}</h4>
                      <p className="text-[10px] text-gray-400">Par: <strong className="text-gray-700">{req.artistName}</strong> • {req.songGenre}</p>
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-600/10">
                      ⏳ En attente
                    </span>
                  )}
                  {req.status === 'accepted' && (
                    <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                      ⚙️ En cours
                    </span>
                  )}
                  {req.status === 'completed' && (
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                      ✓ Terminée
                    </span>
                  )}
                  {req.status === 'refused' && (
                    <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 ring-1 ring-rose-600/10">
                      ❌ Refusée
                    </span>
                  )}
                </div>

                <div className="bg-gray-50/50 rounded-xl p-3 text-[11px] font-medium text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Prestation :</span>
                    <span className="text-gray-800 font-bold">{req.offerTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Diffuseur :</span>
                    <span className="text-gray-800 flex items-center gap-1">
                      {req.promoteurName}
                      {(() => {
                        const pObj = users.find((u) => u.id === req.promoteurId);
                        if (!pObj) return null;
                        const getSeniorityMonths = (createdAtStr?: string) => {
                          if (!createdAtStr) return 0;
                          const createdDate = new Date(createdAtStr);
                          const currentDate = new Date();
                          const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
                          const diffDays = diffTime / (1000 * 60 * 60 * 24);
                          return diffDays / 30.41;
                        };
                        const sMonths = getSeniorityMonths(pObj.createdAt);
                        const cPres = requests.filter(
                          (r) => r.promoteurId === pObj.id && r.status === 'completed'
                        ).length;
                        if (sMonths > 3 || cPres >= 10) {
                          return (
                            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-1.5 py-0.2 text-[8px] font-bold text-blue-500 border border-blue-500/10 shrink-0" title="Diffuseur Vérifié (Ancienneté > 3 mois ou > 10 prestations finalisées)">
                              Vérifié
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montant :</span>
                    <span className="font-mono text-gray-800">{formatFCFA(req.price)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-3 flex justify-between gap-2">
                  <button
                    onClick={() => {
                      setAuditRequestId(req.id);
                    }}
                    className="flex-1 rounded-lg bg-gray-100 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-200 text-center cursor-pointer"
                  >
                    Auditer & Inspecter les discussions ({req.chats.length})
                  </button>

                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleForceRefund(req.id)}
                      className="rounded-lg bg-rose-50 border border-rose-100 px-2.5 py-1.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      Forcer le remboursement
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* FINANCES & TRANSACTIONS TABLE */}
      {activeTab === 'finances' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-base font-bold text-gray-900">
              Registre financier général (Ledger)
            </h3>

            {/* Type selector */}
            <div className="flex gap-2">
              <select
                value={financeTypeFilter}
                onChange={(e) => setFinanceTypeFilter(e.target.value)}
                className="rounded-xl border border-gray-100 p-2 text-xs bg-white focus:outline-hidden"
              >
                <option value="all">Tous les flux financiers</option>
                <option value="deposit">📥 Dépôts Mobile Money</option>
                <option value="payment">🛒 Paiements de promotion</option>
                <option value="refund">↩ Remboursements artistiques</option>
                <option value="commission">🏛 Commission plateforme (10%)</option>
                <option value="withdrawal">📤 Retraits de promoteurs</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Réf / Date</th>
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Mouvement</th>
                    <th className="p-4">Canal</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700 font-mono text-[11px]">
                  {filteredTransactions
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">
                          <p>{tx.id}</p>
                          <p className="text-[8.5px] text-gray-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString('fr-FR')} {new Date(tx.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>

                        <td className="p-4 font-sans text-xs">
                          <p className="font-bold text-gray-900">{tx.userName}</p>
                          <p className="text-[9px] text-gray-400 capitalize">{tx.userRole}</p>
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                            tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10'
                          }`}>
                            {tx.type === 'deposit' && '📥 Dépôt'}
                            {tx.type === 'payment' && '🛒 Achat'}
                            {tx.type === 'refund' && '↩ Rembours.'}
                            {tx.type === 'commission' && '🏛 Commis.'}
                            {tx.type === 'withdrawal' && '📤 Retrait'}
                          </span>
                        </td>

                        <td className="p-4 uppercase font-bold text-gray-800">
                          {tx.paymentMethod}
                        </td>

                        <td className="p-4 font-sans text-xs text-gray-500 max-w-xs truncate">
                          {tx.description}
                        </td>

                        <td className={`p-4 text-right font-black text-xs ${
                          tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission'
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission' ? '+' : '-'} {tx.amount.toLocaleString()} F
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PARAMETRES DE LA PLATEFORME */}
      {activeTab === 'config' && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-gray-900">Paramètres système de la plateforme</h3>
              <p className="text-xs text-gray-400">Configurez les taux de commission, les délais d'arbitrage et les canaux de communication</p>
            </div>
          </div>

          <form onSubmit={handleSaveConfig} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              
              {/* Commission rates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-bold flex items-center gap-1"><Percent className="h-4 w-4 text-emerald-600" /> Taux de Commission Plateforme (%)</label>
                  <span className="font-mono text-emerald-600 text-sm font-black">{commissionInput} %</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-[10px] text-gray-400 font-medium">Pourcentage prélevé sur chaque prestation de promotion finalisée (retenu séquestre).</p>
              </div>

              {/* Timeout rates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-bold flex items-center gap-1"><Clock className="h-4 w-4 text-emerald-600" /> Délai de réponse maximal (Heures)</label>
                  <span className="font-mono text-emerald-600 text-sm font-black">{timeoutInput} h</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={72}
                  step={12}
                  value={timeoutInput}
                  onChange={(e) => setTimeoutInput(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-[10px] text-gray-400 font-medium">Délai accordé aux promoteurs pour valider un morceau avant remboursement automatique de l'artiste.</p>
              </div>

              {/* Channels toggler */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-gray-700 font-bold block mb-1">Canaux de promotion actifs autorisés :</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-100 p-4 rounded-xl bg-gray-50/20">
                  {(config.enabledChannels || []).map((ch) => {
                    const isChecked = channelInputs.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleToggleChannel(ch)}
                        className={`flex items-center gap-2 rounded-lg p-2.5 text-left transition-colors ${
                          isChecked ? 'bg-emerald-50 text-emerald-950 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
                        }`}
                      >
                        <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 bg-white'}`}>
                          {isChecked && <Check className="h-3 w-3" />}
                        </span>
                        <span className="truncate text-[10.5px]">{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION HERO EDITABLE */}
              <div className="md:col-span-2 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">
                    ✨
                  </span>
                  <span className="text-[11.5px] uppercase tracking-wider text-gray-950 font-black">Personnalisation de la Section d'Accueil (Hero)</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Modifiez l'intégralité du contenu visuel, des badges et des slogans affichés en haut de la plateforme selon le rôle de l'utilisateur connecté.
                </p>

                {/* Options pour masquer la section hero */}
                <div className="rounded-xl border border-amber-100 p-4 bg-amber-50/5 space-y-3 text-xs font-semibold">
                  <h4 className="text-amber-800 font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> Visibilité de la section d'accueil (Hero) par Rôle
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    Cochez un rôle ci-dessous pour masquer complètement la section de présentation (Hero) en haut de l'écran lorsqu'un utilisateur avec ce rôle est connecté.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleHeroVisibility('artiste', hideHeroArtiste)}
                      className={`flex items-center gap-2 rounded-lg p-2.5 text-left transition-colors border ${
                        hideHeroArtiste ? 'bg-rose-50 text-rose-950 border-rose-200 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-100'
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${hideHeroArtiste ? 'bg-rose-600 border-rose-600 text-white' : 'border-gray-200 bg-white'}`}>
                        {hideHeroArtiste && <Check className="h-3 w-3" />}
                      </span>
                      <span className="text-[10.5px]">Masquer pour <strong>Artistes</strong></span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleHeroVisibility('promoteur', hideHeroPromoteur)}
                      className={`flex items-center gap-2 rounded-lg p-2.5 text-left transition-colors border ${
                        hideHeroPromoteur ? 'bg-rose-50 text-rose-950 border-rose-200 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-100'
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${hideHeroPromoteur ? 'bg-rose-600 border-rose-600 text-white' : 'border-gray-200 bg-white'}`}>
                        {hideHeroPromoteur && <Check className="h-3 w-3" />}
                      </span>
                      <span className="text-[10.5px]">Masquer pour <strong>Promoteurs</strong></span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleHeroVisibility('admin', hideHeroAdmin)}
                      className={`flex items-center gap-2 rounded-lg p-2.5 text-left transition-colors border ${
                        hideHeroAdmin ? 'bg-rose-50 text-rose-950 border-rose-200 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-100'
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${hideHeroAdmin ? 'bg-rose-600 border-rose-600 text-white' : 'border-gray-200 bg-white'}`}>
                        {hideHeroAdmin && <Check className="h-3 w-3" />}
                      </span>
                      <span className="text-[10.5px]">Masquer pour <strong>Admins</strong></span>
                    </button>
                  </div>
                </div>

                {/* Partie 1 : Design global & Image */}
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/20 space-y-4">
                  <h4 className="text-gray-700 font-black text-[10.5px] uppercase tracking-wider">1. Identité visuelle & Badges globaux</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Badge supérieur global</label>
                      <input
                        type="text"
                        value={heroBadge}
                        onChange={(e) => setHeroBadge(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Image du Hero (URL ou chemin)</label>
                      <input
                        type="text"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Preset images preview and selectors */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] text-gray-400 font-bold">Presets d'images recommandés :</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "Cyberpunk Béninois", url: "/src/assets/images/futuristic_benin_musician_cyberpunk_1783899360091.jpg" },
                        { name: "Studio de Production", url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&fit=crop" },
                        { name: "Micro d'Or", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop" },
                        { name: "Vinyle de Collection", url: "https://images.unsplash.com/photo-1539628390159-a041f8259839?w=800&fit=crop" }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setHeroImage(preset.url)}
                          className={`text-[9px] px-2 py-1 rounded-md border transition-all cursor-pointer ${
                            heroImage === preset.url
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                    {heroImage && (
                      <div className="mt-2 flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 w-fit">
                        <img src={heroImage} className="h-10 w-16 object-cover rounded-md border border-gray-100" alt="Preview" />
                        <span className="text-[10px] font-mono text-gray-400">Aperçu en direct de l'illustration</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100/60">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Badge gauche sur image (ex: Vibes)</label>
                      <input
                        type="text"
                        value={heroImageBadgeLeft}
                        onChange={(e) => setHeroImageBadgeLeft(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Badge droit sur image (ex: Séquestre)</label>
                      <input
                        type="text"
                        value={heroImageBadgeRight}
                        onChange={(e) => setHeroImageBadgeRight(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100/60">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Encadré : Catégorie (rose)</label>
                      <input
                        type="text"
                        value={heroBoxCategory}
                        onChange={(e) => setHeroBoxCategory(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Encadré : Titre (blanc)</label>
                      <input
                        type="text"
                        value={heroBoxTitle}
                        onChange={(e) => setHeroBoxTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Encadré : Description</label>
                      <input
                        type="text"
                        value={heroBoxDesc}
                        onChange={(e) => setHeroBoxDesc(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Partie 2 : Espace Artiste */}
                <div className="rounded-xl border border-rose-100 p-4 bg-rose-50/5 space-y-4">
                  <h4 className="text-rose-700 font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> 2. Espace Artiste
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Titre principal (Standard)</label>
                      <input
                        type="text"
                        value={heroTitleArtisteRegular}
                        onChange={(e) => setHeroTitleArtisteRegular(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Titre principal (Dégradé Surligné)</label>
                      <input
                        type="text"
                        value={heroTitleArtisteHighlight}
                        onChange={(e) => setHeroTitleArtisteHighlight(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-gray-600 font-bold block">Description de l'action Artiste</label>
                      <textarea
                        value={heroDescArtiste}
                        onChange={(e) => setHeroDescArtiste(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Texte d'action du bouton principal</label>
                      <input
                        type="text"
                        value={heroBtnArtiste}
                        onChange={(e) => setHeroBtnArtiste(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Partie 3 : Espace Promoteur */}
                <div className="rounded-xl border border-fuchsia-100 p-4 bg-fuchsia-50/5 space-y-4">
                  <h4 className="text-fuchsia-700 font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-fuchsia-500" /> 3. Espace Promoteur / Diffuseur
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Titre principal (Standard)</label>
                      <input
                        type="text"
                        value={heroTitlePromoteurRegular}
                        onChange={(e) => setHeroTitlePromoteurRegular(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Titre principal (Dégradé Surligné)</label>
                      <input
                        type="text"
                        value={heroTitlePromoteurHighlight}
                        onChange={(e) => setHeroTitlePromoteurHighlight(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-gray-600 font-bold block">Description de l'action Promoteur</label>
                      <textarea
                        value={heroDescPromoteur}
                        onChange={(e) => setHeroDescPromoteur(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Texte d'action du bouton principal</label>
                      <input
                        type="text"
                        value={heroBtnPromoteur}
                        onChange={(e) => setHeroBtnPromoteur(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Partie 4 : Espace Administrateur */}
                <div className="rounded-xl border border-emerald-100 p-4 bg-emerald-50/5 space-y-4">
                  <h4 className="text-emerald-700 font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> 4. Espace Administrateur
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Titre principal (Standard)</label>
                      <input
                        type="text"
                        value={heroTitleAdminRegular}
                        onChange={(e) => setHeroTitleAdminRegular(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Titre principal (Dégradé Surligné)</label>
                      <input
                        type="text"
                        value={heroTitleAdminHighlight}
                        onChange={(e) => setHeroTitleAdminHighlight(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-gray-600 font-bold block">Description de l'action Administrateur</label>
                      <textarea
                        value={heroDescAdmin}
                        onChange={(e) => setHeroDescAdmin(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-bold block">Texte d'action du bouton principal</label>
                      <input
                        type="text"
                        value={heroBtnAdmin}
                        onChange={(e) => setHeroBtnAdmin(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION PASSERELLES DE PAIEMENT MOBILE MONEY */}
              <PaymentGatewayConfig
                mtnMerchantId={mtnMerchantId}
                setMtnMerchantId={setMtnMerchantId}
                mtnSecretKey={mtnSecretKey}
                setMtnSecretKey={setMtnSecretKey}
                mtnSandbox={mtnSandbox}
                setMtnSandbox={setMtnSandbox}
                moovMerchantId={moovMerchantId}
                setMoovMerchantId={setMoovMerchantId}
                moovSecretKey={moovSecretKey}
                setMoovSecretKey={setMoovSecretKey}
                moovSandbox={moovSandbox}
                setMoovSandbox={setMoovSandbox}
                celtiisMerchantId={celtiisMerchantId}
                setCeltiisMerchantId={setCeltiisMerchantId}
                celtiisSecretKey={celtiisSecretKey}
                setCeltiisSecretKey={setCeltiisSecretKey}
                celtiisSandbox={celtiisSandbox}
                setCeltiisSandbox={setCeltiisSandbox}
              />

            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold text-white hover:bg-black transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer animate-pulse hover:animate-none"
            >
              <Check className="h-4 w-4" /> Sauvegarder toutes les configurations système & Hero
            </button>
          </form>
        </div>
      )}

      {/* AUDIT INSPECT MODAL (DETAILED AUDITING WITH CHAT & AUDIO PLAYBACK) */}
      {auditRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-display text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Shield className="h-5 w-5 text-emerald-600" /> Dossier d'Audit Administratif
              </h4>
              <button
                onClick={() => setAuditRequestId(null)}
                className="rounded-lg p-1 hover:bg-gray-100 font-bold text-gray-400 hover:text-gray-700"
              >
                Fermer
              </button>
            </div>

            {(() => {
              const req = requests.find((r) => r.id === auditRequestId);
              if (!req) return null;
              return (
                <div className="mt-4 space-y-4 text-xs">
                  
                  {/* General Info */}
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Artiste</p>
                      <p className="font-bold text-gray-800 text-[11px] mt-0.5">{req.artistName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Promoteur</p>
                      <p className="font-bold text-gray-800 text-[11px] mt-0.5 flex items-center gap-1">
                        {req.promoteurName}
                        {(() => {
                          const pObj = users.find((u) => u.id === req.promoteurId);
                          if (!pObj) return null;
                          const getSeniorityMonths = (createdAtStr?: string) => {
                            if (!createdAtStr) return 0;
                            const createdDate = new Date(createdAtStr);
                            const currentDate = new Date();
                            const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
                            const diffDays = diffTime / (1000 * 60 * 60 * 24);
                            return diffDays / 30.41;
                          };
                          const sMonths = getSeniorityMonths(pObj.createdAt);
                          const cPres = requests.filter(
                            (r) => r.promoteurId === pObj.id && r.status === 'completed'
                          ).length;
                          if (sMonths > 3 || cPres >= 10) {
                            return (
                              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-1.5 py-0.2 text-[8px] font-bold text-blue-500 border border-blue-500/10 shrink-0" title="Diffuseur Vérifié (Ancienneté > 3 mois ou > 10 prestations finalisées)">
                                Vérifié
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Titre</p>
                      <p className="font-bold text-amber-600 text-[11px] mt-0.5">"{req.songTitle}"</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Statut</p>
                      <span className="inline-block mt-1 uppercase font-bold text-[9px] rounded-md bg-gray-200 px-1.5 py-0.5">
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Chat logs Audit */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mains courantes & Historique d'Échanges</p>
                    {req.chats.length === 0 ? (
                      <p className="text-xs text-gray-400 italic bg-gray-50/50 p-4 rounded-xl text-center">Aucune discussion enregistrée pour cette commande de promotion.</p>
                    ) : (
                      <div className="border border-gray-100 rounded-xl bg-gray-50/10 max-h-48 overflow-y-auto p-3 space-y-2.5">
                        {req.chats.map((msg) => (
                          <div key={msg.id} className="text-xs">
                            <span className={`font-bold uppercase text-[9px] ${msg.senderRole === 'artiste' ? 'text-amber-600' : 'text-indigo-600'}`}>
                              [{msg.senderRole}] {msg.senderName} :
                            </span>
                            <span className="text-gray-700 ml-1.5 font-medium">{msg.text}</span>
                            <p className="text-[8px] text-gray-400 font-mono text-right mt-0.5">
                              {new Date(msg.timestamp).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Completed Justificatifs */}
                  {req.status === 'completed' && (
                    <div className="bg-emerald-50/20 rounded-xl border border-emerald-100 p-4 space-y-2">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase">Justificatifs soumis par le diffuseur</p>
                      <p className="text-[11px] font-semibold text-gray-700">📌 Calendrier : {req.scheduleText}</p>
                      <p className="text-[11px] text-gray-600">📎 Justificatif : <a href={req.proofLink} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-extrabold underline">{req.proofLabel}</a></p>
                    </div>
                  )}

                  {/* Refusal details */}
                  {req.status === 'refused' && (
                    <div className="bg-rose-50/20 rounded-xl border border-rose-100 p-4 space-y-2">
                      <p className="text-[10px] font-bold text-rose-800 uppercase">Motif de refus transmis par le diffuseur</p>
                      <p className="text-[11px] text-rose-900 leading-relaxed font-semibold">"{req.refusalReason}"</p>
                    </div>
                  )}

                  {/* Audit action triggers */}
                  <div className="flex gap-2 pt-2 border-t border-gray-50 font-bold">
                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleForceRefund(req.id)}
                        className="flex-1 rounded-xl bg-rose-600 py-3 text-white hover:bg-rose-700 text-center cursor-pointer"
                      >
                        Forcer l'annulation & rembourser intégralement
                      </button>
                    )}
                    <button
                      onClick={() => setAuditRequestId(null)}
                      className="flex-1 rounded-xl bg-gray-100 py-3 text-gray-500 hover:bg-gray-200 text-center cursor-pointer"
                    >
                      Fermer le dossier d'audit
                    </button>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Dynamic Floating Toast notification for Hero visibility updates */}
      {heroNotification && (
        <>
          <style>{`
            @keyframes shrink-width-timer {
              from { width: 100%; }
              to { width: 0%; }
            }
            .animate-shrink-timer {
              animation: shrink-width-timer 3.5s linear forwards;
            }
            @keyframes slide-in-toast {
              from { transform: translateY(20px) scale(0.95); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-slide-toast {
              animation: slide-in-toast 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          
          <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-80 rounded-2xl border border-purple-500/30 bg-[#0d0a1c]/95 backdrop-blur-xl p-4 text-white shadow-2xl shadow-rose-950/30 animate-slide-toast">
            <div className="flex gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                heroNotification.visible 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {heroNotification.visible ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </div>
              
              <div className="space-y-1">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-amber-400 font-mono">Bannière d'Accueil</h4>
                <p className="text-[11px] text-gray-200 leading-normal font-sans font-medium">
                  Section d'accueil <strong className={heroNotification.visible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {heroNotification.visible ? 'ACTIVÉE' : 'DESACTIVÉE'}
                  </strong> pour le rôle <strong>{heroNotification.role}</strong>.
                </p>
                <p className="text-[9.5px] text-gray-400">Le changement est appliqué immédiatement sur la plateforme.</p>
              </div>
            </div>
            
            {/* Dynamic visual timer bar */}
            <div className="mt-3.5 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full animate-shrink-timer" />
            </div>
          </div>
        </>
      )}

      {/* Simulation d'Envoi d'Email de Félicitations */}
      {congratsEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white text-gray-800 shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider">Email de Notification Automatique</h3>
                  <p className="text-[10px] text-amber-100">Simulateur d'envoi de mail système — Statut Actif</p>
                </div>
              </div>
              <button 
                onClick={() => setCongratsEmail(null)}
                className="text-white hover:text-amber-100 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated Email Client Envelope */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 text-[11px] font-medium space-y-1.5 text-gray-500">
              <div className="flex">
                <span className="w-20 font-bold">De :</span>
                <span className="text-gray-800">Bénin Music Promo &lt;relations-publiques@beninmusicpromo.bj&gt;</span>
              </div>
              <div className="flex">
                <span className="w-20 font-bold">À :</span>
                <span className="text-gray-800 font-semibold">{congratsEmail.toName} &lt;{congratsEmail.toEmail}&gt; ({congratsEmail.organization})</span>
              </div>
              <div className="flex">
                <span className="w-20 font-bold">Date :</span>
                <span className="text-gray-800">{congratsEmail.date}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-bold">Objet :</span>
                <span className="text-amber-700 font-bold">🏆 Félicitations ! Votre profil est désormais "Diffuseur Certifié" sur Bénin Music Promo</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-gray-50/30">
              <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4 text-xs leading-relaxed text-gray-700 font-sans">
                
                {/* Email Header Banner */}
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mb-2">
                    <Award className="h-6 w-6 animate-bounce" />
                  </div>
                  <h1 className="font-display text-base font-extrabold text-gray-900 tracking-tight">Statut de Certification Activé</h1>
                  <p className="text-[10px] text-gray-400 mt-0.5">Bénin Music Promo • Label de Confiance National</p>
                </div>

                {/* Email Body Text */}
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 text-xs">Bonjour {congratsEmail.toName},</p>
                  
                  <p>
                    Nous avons le grand plaisir de vous informer que l'équipe d'administration de la plateforme nationale <strong>Bénin Music Promo</strong> a officiellement approuvé votre statut de <strong>Diffuseur Certifié</strong> !
                  </p>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Votre performance</p>
                      <p className="text-xs font-semibold text-gray-800">Taux de complétion des prestations de promotion :</p>
                    </div>
                    <span className="text-2xl font-black text-amber-600 shrink-0 font-mono bg-white px-3 py-1.5 rounded-lg border border-amber-200">
                      {congratsEmail.completionRate}%
                    </span>
                  </div>

                  <p>
                    Ce badge de certification est accordé de manière exclusive aux promoteurs partenaires démontrant un taux d'excellence exceptionnel supérieur à <strong>90%</strong> dans le traitement, la validation et la soumission de justificatifs pour les campagnes de nos artistes.
                  </p>

                  <p className="font-semibold text-gray-900">Quels sont vos nouveaux avantages ?</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li><strong>Badge "Certifié" doré</strong> visible par tous les artistes sur votre profil et vos offres.</li>
                    <li><strong>Meilleur positionnement</strong> dans les résultats de recherche et d'affichage du catalogue d'offres.</li>
                    <li><strong>Confiance accrue</strong> de la part de l'État et des artistes nationaux, favorisant une hausse estimée de 35% de vos commandes.</li>
                  </ul>

                  <p className="pt-2">
                    Nous vous remercions chaleureusement pour votre rigueur professionnelle et votre engagement continu en faveur de l'essor et de la promotion de la musique béninoise.
                  </p>
                </div>

                {/* Email Footer Banner */}
                <div className="pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400">
                  <p className="font-semibold text-gray-500">L'équipe des Relations Partenaires</p>
                  <p className="mt-0.5">Bénin Music Promo — Cotonou, République du Bénin</p>
                  <p className="text-[9px] text-gray-300 mt-2">© 2026 Bénin Music Promo. Tous droits réservés.</p>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Email envoyé avec succès au diffuseur ({congratsEmail.toEmail})
              </span>
              <button
                onClick={() => setCongratsEmail(null)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Fermer l'aperçu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
