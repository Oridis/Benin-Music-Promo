/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_OFFERS,
  INITIAL_REQUESTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CONFIG
} from './data';
import { User, PromoteurOffer, PromotionRequest, Transaction, PlatformConfig, RoleType, Notification } from './types';
import Header from './components/Header';
import { playNotificationSound, SoundConfig, SoundType } from './lib/sounds';
import WalletModal from './components/WalletModal';
import ArtistDashboard from './components/ArtistDashboard';
import PromoteurDashboard from './components/PromoteurDashboard';
import AdminDashboard from './components/AdminDashboard';
import PWAInstallModal from './components/PWAInstallModal';
import { ShieldCheck, Music, Radio, Heart, Bell, X, Check, MessageSquare, Sparkles, Play, Award, Zap, ArrowRight, CheckCircle2, Facebook, Twitter, Instagram, Youtube, Globe, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global Persisted States
  const [users, setUsers] = useState<User[]>([]);
  const [offers, setOffers] = useState<PromoteurOffer[]>([]);
  const [requests, setRequests] = useState<PromotionRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [config, setConfig] = useState<PlatformConfig>(INITIAL_CONFIG);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<{ id: string; title: string; message: string }[]>([]);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Notification Sound State
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(() => {
    try {
      const saved = localStorage.getItem('bmp_sound_config');
      return saved ? JSON.parse(saved) : { enabled: true, theme: 'chime', volume: 0.1 };
    } catch {
      return { enabled: true, theme: 'chime', volume: 0.1 };
    }
  });

  const handleUpdateSoundConfig = (newCfg: SoundConfig) => {
    setSoundConfig(newCfg);
    localStorage.setItem('bmp_sound_config', JSON.stringify(newCfg));
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setToast = (t: { id: string; title: string; message: string } | null) => {
    if (t) {
      setToasts((prev) => {
        if (prev.some((item) => item.id === t.id)) return prev;
        return [...prev, t];
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== t.id));
      }, 5000);
    }
  };

  // Connection & Offline Cache Strategy States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setToast({
        id: 'online-toast-' + Date.now(),
        title: '📶 Connexion Internet rétablie !',
        message: 'Bénin Music Promo est de retour en ligne. Votre cache local de catalogue d\'offres est synchronisé.'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToast({
        id: 'offline-toast-' + Date.now(),
        title: '📴 Mode Hors-ligne activé',
        message: 'Vous avez perdu votre connexion internet. Le catalogue d\'offres reste consultable en mode sécurisé grâce au cache local.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for last cached offers sync timestamp
    let savedLastSync = localStorage.getItem('bmp_last_offers_sync');
    if (!savedLastSync) {
      const now = new Date().toISOString();
      localStorage.setItem('bmp_last_offers_sync', now);
      savedLastSync = now;
    }
    setLastSyncTime(
      new Date(savedLastSync).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) +
      ' le ' +
      new Date(savedLastSync).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    if (!isOnline || isSimulatingOffline) {
      setToast({
        id: 'sync-error-' + Date.now(),
        title: '⚠️ Erreur de synchronisation',
        message: 'Impossible de synchroniser le catalogue lorsque vous êtes hors-ligne.'
      });
      return;
    }
    
    setToast({
      id: 'sync-start-' + Date.now(),
      title: '🔄 Synchronisation du catalogue...',
      message: 'Récupération des dernières offres de promotion en direct depuis le serveur...'
    });

    setTimeout(() => {
      const now = new Date().toISOString();
      localStorage.setItem('bmp_last_offers_sync', now);
      setLastSyncTime(
        new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) +
        ' le ' +
        new Date(now).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      );
      setToast({
        id: 'sync-success-' + Date.now(),
        title: '✨ Catalogue mis à jour !',
        message: `La mise en cache locale a été actualisée avec succès (${offers.length} offres mémorisées).`
      });
    }, 1200);
  };

  const handleToggleSimulateOffline = () => {
    setIsSimulatingOffline((prev) => {
      const newVal = !prev;
      setToast({
        id: 'sim-toggle-' + Date.now(),
        title: newVal ? '📴 Simulation Hors-ligne' : '📶 Fin de la simulation',
        message: newVal
          ? 'Mode Hors-ligne activé. L\'application simule une perte de réseau et charge le catalogue depuis le cache local.'
          : 'Vous êtes à nouveau considéré en ligne. Les requêtes réseau en direct sont restaurées.'
      });
      return newVal;
    });
  };

  const effectiveOnline = isOnline && !isSimulatingOffline;

  const prevRequestsRef = React.useRef<PromotionRequest[]>([]);

  // Active navigation states
  const [activeRole, setActiveRole] = useState<RoleType>('artiste');
  const [currentUserId, setCurrentUserId] = useState<string>('art-1');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('bmp_users');
      const savedOffers = localStorage.getItem('bmp_offers');
      const savedRequests = localStorage.getItem('bmp_requests');
      const savedTransactions = localStorage.getItem('bmp_transactions');
      const savedConfig = localStorage.getItem('bmp_config');
      const savedRole = localStorage.getItem('bmp_active_role');
      const savedUserId = localStorage.getItem('bmp_current_user_id');

      if (savedUsers) setUsers(JSON.parse(savedUsers));
      else {
        setUsers(INITIAL_USERS);
        localStorage.setItem('bmp_users', JSON.stringify(INITIAL_USERS));
      }

      if (savedOffers) setOffers(JSON.parse(savedOffers));
      else {
        setOffers(INITIAL_OFFERS);
        localStorage.setItem('bmp_offers', JSON.stringify(INITIAL_OFFERS));
      }

      if (savedRequests) setRequests(JSON.parse(savedRequests));
      else {
        setRequests(INITIAL_REQUESTS);
        localStorage.setItem('bmp_requests', JSON.stringify(INITIAL_REQUESTS));
      }

      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      else {
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem('bmp_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
      }

      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig({ ...INITIAL_CONFIG, ...parsed });
        } catch {
          setConfig(INITIAL_CONFIG);
        }
      } else {
        setConfig(INITIAL_CONFIG);
        localStorage.setItem('bmp_config', JSON.stringify(INITIAL_CONFIG));
      }

      if (savedRole) setActiveRole(savedRole as RoleType);
      if (savedUserId) setCurrentUserId(savedUserId);
      else setCurrentUserId('art-1'); // default to art-1

      // Load or seed notifications
      const savedNotifications = localStorage.getItem('bmp_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        const initialNotifications: Notification[] = [
          {
            id: 'notif-seed-1',
            userId: 'art-1',
            title: '🎉 Demande acceptée !',
            message: "Frisson Radio 95.1 FM a accepté votre titre 'Sékéléké'. Les diffusions antenne commencent bientôt.",
            type: 'status_change',
            requestId: 'req-1',
            read: false,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
          },
          {
            id: 'notif-seed-2',
            userId: 'art-1',
            title: '💬 Nouveau message',
            message: "Frisson Radio 95.1 FM : 'Bonjour Sessimè ! C'est un réel plaisir de collaborer avec toi sur ce projet.'",
            type: 'new_message',
            requestId: 'req-1',
            read: false,
            createdAt: new Date(Date.now() - 1800000).toISOString() // 30 mins ago
          }
        ];
        setNotifications(initialNotifications);
        localStorage.setItem('bmp_notifications', JSON.stringify(initialNotifications));
      }

    } catch (e) {
      console.error('Error loading localStorage, using fallback seed.', e);
      // Fallback
      setUsers(INITIAL_USERS);
      setOffers(INITIAL_OFFERS);
      setRequests(INITIAL_REQUESTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setConfig(INITIAL_CONFIG);
    }
  }, []);

  // Sync state helpers that update state and localStorage
  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('bmp_users', JSON.stringify(newUsers));
  };

  const saveOffers = (newOffers: PromoteurOffer[]) => {
    setOffers(newOffers);
    localStorage.setItem('bmp_offers', JSON.stringify(newOffers));
  };

  const saveRequests = (newRequests: PromotionRequest[]) => {
    setRequests(newRequests);
    localStorage.setItem('bmp_requests', JSON.stringify(newRequests));
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('bmp_transactions', JSON.stringify(newTransactions));
  };

  const saveConfig = (newConfig: PlatformConfig) => {
    setConfig(newConfig);
    localStorage.setItem('bmp_config', JSON.stringify(newConfig));
  };

  // Find active logged-in user
  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  // Role switching also updates active user context for smooth demoing
  const handleChangeRole = (role: RoleType) => {
    setActiveRole(role);
    localStorage.setItem('bmp_active_role', role);

    // Auto switch to the first user corresponding to that role for fluid simulation
    let defaultUserId = 'art-1';
    if (role === 'promoteur') defaultUserId = 'promo-1';
    else if (role === 'admin') defaultUserId = 'admin-1';

    setCurrentUserId(defaultUserId);
    localStorage.setItem('bmp_current_user_id', defaultUserId);
  };

  // User dropdown context switching
  const handleChangeUser = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('bmp_current_user_id', userId);
  };

  // Update current user profile details
  const handleUpdateCurrentUser = (updatedUser: User) => {
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    saveUsers(updatedList);
  };

  // Update whole users array (Admin controls)
  const handleUpdateUsers = (updatedUsers: User[]) => {
    saveUsers(updatedUsers);
  };

  // Update wallet balance of any user & log
  const handleUpdateUserBalance = (userId: string, newBalance: number) => {
    const updatedList = users.map((u) => {
      if (u.id === userId) {
        return { ...u, walletBalance: newBalance };
      }
      return u;
    });
    saveUsers(updatedList);
  };

  // Add Request
  const handleAddRequest = (newRequest: PromotionRequest) => {
    const updatedList = [newRequest, ...requests];
    saveRequests(updatedList);
  };

  // Update Requests
  const handleUpdateRequests = (updatedRequests: PromotionRequest[]) => {
    saveRequests(updatedRequests);
  };

  // Add Transaction
  const handleAddTransaction = (newTx: Transaction) => {
    const updatedList = [newTx, ...transactions];
    saveTransactions(updatedList);
  };

  // Add Notification
  const handleAddNotification = (newNotif: Notification) => {
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('bmp_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  // Update single chat thread inside request
  const handleUpdateRequestChats = (requestId: string, chats: any[]) => {
    const updatedList = requests.map((req) => {
      if (req.id === requestId) {
        return { ...req, chats, lastUpdate: new Date().toISOString() };
      }
      return req;
    });
    saveRequests(updatedList);
  };

  // Monitor requests for changes to generate notifications and real-time toasts
  useEffect(() => {
    if (requests.length === 0) return;

    // On first load, initialize the ref and do not trigger notifications for historical records
    if (prevRequestsRef.current.length === 0) {
      prevRequestsRef.current = requests;
      return;
    }

    const prevRequests = prevRequestsRef.current;
    const newNotifications: Notification[] = [];
    let latestToast: { title: string; message: string } | null = null;

    // Compare new requests list with previous
    requests.forEach((newReq) => {
      const prevReq = prevRequests.find((r) => r.id === newReq.id);

      if (!prevReq) {
        // 1. This is a NEW request created by an artist.
        // Notify the promoter!
        newNotifications.push({
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId: newReq.promoteurId,
          title: '📥 Nouvelle demande de promotion',
          message: `${newReq.artistName} vous propose le titre "${newReq.songTitle}" (${newReq.songGenre}) pour ${newReq.price.toLocaleString()} F CFA.`,
          type: 'status_change',
          requestId: newReq.id,
          read: false,
          createdAt: new Date().toISOString()
        });
        
        latestToast = {
          title: '📥 Nouvelle demande de promotion',
          message: `${newReq.artistName} a soumis "${newReq.songTitle}" à ${newReq.promoteurName}`
        };
      } else {
        // 2. STATUS CHANGED
        if (prevReq.status !== newReq.status) {
          if (newReq.status === 'accepted') {
            newNotifications.push({
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userId: newReq.artistId,
              title: '🎉 Demande acceptée !',
              message: `${newReq.promoteurName} a accepté votre morceau "${newReq.songTitle}". Les diffusions commencent bientôt !`,
              type: 'status_change',
              requestId: newReq.id,
              read: false,
              createdAt: new Date().toISOString()
            });

            latestToast = {
              title: '🎉 Demande acceptée !',
              message: `${newReq.promoteurName} a accepté "${newReq.songTitle}"`
            };
          } else if (newReq.status === 'refused') {
            newNotifications.push({
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userId: newReq.artistId,
              title: '❌ Demande refusée',
              message: `${newReq.promoteurName} a refusé de diffuser "${newReq.songTitle}". Motif: "${newReq.refusalReason || 'Non spécifié'}". Vous avez été intégralement remboursé.`,
              type: 'status_change',
              requestId: newReq.id,
              read: false,
              createdAt: new Date().toISOString()
            });

            latestToast = {
              title: '❌ Demande refusée',
              message: `Morceau "${newReq.songTitle}" refusé par ${newReq.promoteurName}. Portefeuille remboursé.`
            };
          } else if (newReq.status === 'completed') {
            newNotifications.push({
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userId: newReq.artistId,
              title: '✅ Promotion finalisée !',
              message: `${newReq.promoteurName} a validé la diffusion de "${newReq.songTitle}" et a soumis les justificatifs.`,
              type: 'status_change',
              requestId: newReq.id,
              read: false,
              createdAt: new Date().toISOString()
            });

            latestToast = {
              title: '✅ Promotion finalisée',
              message: `Justificatifs de diffusion soumis pour "${newReq.songTitle}" par ${newReq.promoteurName}`
            };
          }
        }

        // 3. NEW CHAT MESSAGES
        if (newReq.chats.length > prevReq.chats.length) {
          const newChats = newReq.chats.slice(prevReq.chats.length);
          newChats.forEach((chat) => {
            // Determine recipient (the user who did not send the message)
            const recipientId = chat.senderRole === 'artiste' ? newReq.promoteurId : newReq.artistId;
            const senderName = chat.senderName;
            
            // Only notify if recipient is different from the message sender
            if (recipientId !== chat.senderId) {
              newNotifications.push({
                id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                userId: recipientId,
                title: '💬 Nouveau message',
                message: `${senderName} : "${chat.text}"`,
                type: 'new_message',
                requestId: newReq.id,
                read: false,
                createdAt: new Date().toISOString()
              });

              latestToast = {
                title: `💬 Message de ${senderName}`,
                message: chat.text
              };
            }
          });
        }
      }
    });

    // Save current requests as previous requests for the next cycle
    prevRequestsRef.current = requests;

    if (newNotifications.length > 0) {
      setNotifications((prevNotifs) => {
        const mergedNotifications = [...newNotifications, ...prevNotifs];
        localStorage.setItem('bmp_notifications', JSON.stringify(mergedNotifications));
        return mergedNotifications;
      });

      // Trigger user's selected notification sound
      if (soundConfig.enabled) {
        // Play the chosen theme
        playNotificationSound(soundConfig.theme, soundConfig.volume);
      }
    }

    if (latestToast) {
      setToast({
        id: `toast-${Date.now()}`,
        title: (latestToast as any).title,
        message: (latestToast as any).message
      });
    }

  }, [requests]);

  const handleMarkAsRead = (notifId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => n.id === notifId ? { ...n, read: true } : n);
      localStorage.setItem('bmp_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAllAsRead = (userId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => n.userId === userId ? { ...n, read: true } : n);
      localStorage.setItem('bmp_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearNotifications = (userId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.userId !== userId);
      localStorage.setItem('bmp_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  if (users.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-xs font-semibold text-gray-500">
        Chargement de l'environnement Bénin Music Promo...
      </div>
    );
  }

  const shouldHideHero = 
    (activeRole === 'artiste' && config.hideHeroArtiste) ||
    (activeRole === 'promoteur' && config.hideHeroPromoteur) ||
    (activeRole === 'admin' && config.hideHeroAdmin);

  return (
    <div className="min-h-screen bg-[#020104] text-white flex flex-col justify-between selection:bg-rose-500/30 selection:text-white overflow-x-hidden max-w-full">
      <div>
        {/* Main Header navigation */}
        <Header
          currentUser={currentUser}
          users={users}
          activeRole={activeRole}
          onChangeRole={handleChangeRole}
          onChangeUser={handleChangeUser}
          onOpenDepositModal={() => setIsWalletModalOpen(true)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearNotifications={handleClearNotifications}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          soundConfig={soundConfig}
          onUpdateSoundConfig={handleUpdateSoundConfig}
        />

        {/* Hero Context banner */}
        {!shouldHideHero && (
          <div className="relative overflow-hidden bg-[#020104] text-white border-b border-purple-950/40">
            {/* Intense Neon Magenta and Pink Glowing Background Accents */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-5 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                
                {/* Text content (7 cols on lg) */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full ring-1 ring-fuchsia-500/20">
                      {config.heroBadge || "BENIN MUSIC PROMO"}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRole}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                        {activeRole === 'artiste' && (
                          <>
                            {config.heroTitleArtisteRegular || "La Nouvelle Ère de la"} <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-500 drop-shadow-[0_2px_10px_rgba(244,63,94,0.3)]">
                              {config.heroTitleArtisteHighlight || "Promo Digitale"}
                            </span>
                          </>
                        )}
                        {activeRole === 'promoteur' && (
                          <>
                            {config.heroTitlePromoteurRegular || "Monétisez Vos"} <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-500 drop-shadow-[0_2px_10px_rgba(244,63,94,0.3)]">
                              {config.heroTitlePromoteurHighlight || "Ondes en Direct"}
                            </span>
                          </>
                        )}
                        {activeRole === 'admin' && (
                          <>
                            {config.heroTitleAdminRegular || "Registre Média"} <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]">
                              {config.heroTitleAdminHighlight || "Décentralisé"}
                            </span>
                          </>
                        )}
                      </h1>

                      <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed font-sans">
                        {activeRole === 'artiste' && (config.heroDescArtiste || "Propulsez vos singles vers le sommet des charts béninois. Sélectionnez les radios et diffuseurs leaders, transmettez vos morceaux en toute sécurité et profitez d'une garantie de diffusion séquestre absolue : preuve authentifiée ou remboursement immédiat.")}
                        {activeRole === 'promoteur' && (config.heroDescPromoteur || "Mettez vos ondes à profit. Validez l'écoute de morceaux de talentueux artistes béninois, diffusez-les sur vos canaux officiels, uploadez vos rapports médias et touchez instantanément vos fonds.")}
                        {activeRole === 'admin' && (config.heroDescAdmin || "Régulez le marché de la diffusion musicale au Bénin. Examinez les transactions, certifiez le KYC des diffuseurs, résolvez les litiges et analysez les commissions en temps réel.")}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Cyberpunk Action pill Button */}
                  <div className="pt-2 flex flex-wrap gap-4 items-center">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const element = document.getElementById('dashboard-content');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="relative group overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-600 to-purple-600 px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_25px_rgba(244,63,94,0.45)] hover:shadow-[0_4px_35px_rgba(244,63,94,0.65)] transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center gap-2">
                        {activeRole === 'artiste' && (config.heroBtnArtiste || "Lancer une Campagne")}
                        {activeRole === 'promoteur' && (config.heroBtnPromoteur || "Gérer mes Forfaits")}
                        {activeRole === 'admin' && (config.heroBtnAdmin || "Vérifier le Réseau")}
                        <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>

                    <div className="text-[11px] text-gray-500 font-mono">
                      Rôle système : <span className="text-amber-500 font-bold uppercase">{activeRole}</span>
                    </div>
                  </div>


                </div>

                {/* Animated visual section with mock-up styled portrait & translucent info box (5 cols on lg) */}
                <div className="lg:col-span-5 relative flex justify-center items-center">
                  <div className="relative w-full max-w-md lg:max-w-none">
                    
                    {/* Beautiful glowing backdrop frame */}
                    <div className="absolute -inset-2.5 rounded-[2.5rem] bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-amber-500 opacity-25 blur-xl animate-pulse" />
                    
                    {/* Main image container */}
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07050d] shadow-2xl p-2.5"
                    >
                      <img 
                        src={config.heroImage || "/src/assets/images/futuristic_benin_musician_cyberpunk_1783899360091.jpg"} 
                        alt="Futuristic Benin Musician Promo" 
                        className="w-full h-80 sm:h-96 object-cover rounded-[1.7rem] brightness-110 contrast-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Glowing gradient overlay inside image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020104] via-transparent to-transparent opacity-80 pointer-events-none" />
                      
                      {/* Live status indicators inside the visual */}
                      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-full px-3.5 py-1.5 text-[9px] font-black tracking-widest text-rose-400 border border-rose-500/20 uppercase">
                          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                          <span>{config.heroImageBadgeLeft || "VIBES CYBER BÉNIN"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full px-3.5 py-1.5 text-[9px] font-black tracking-widest text-amber-400 border border-amber-500/20 uppercase">
                          <Zap className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{config.heroImageBadgeRight || "SÉQUESTRE SÉCURISÉ"}</span>
                        </div>
                      </div>

                      {/* Translucent "ABOUT THE COLLECTION" Style Box (Exactly from the mock design) */}
                      <div className="absolute bottom-6 left-6 right-6 bg-black/45 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-wider text-rose-400">{config.heroBoxCategory || "RÉVOLUTION AUDIO BÉNIN"}</p>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide">{config.heroBoxTitle || "À PROPOS DU REGISTRE"}</h4>
                          <p className="text-[10px] text-gray-300 leading-snug">{config.heroBoxDesc || "Sécurité financière et transparence de diffusion totale."}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Tiny floating micro stats from mockup vibe */}
                    <motion.div 
                      animate={{ 
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-6 -right-3 bg-[#0d0a19]/95 backdrop-blur-md border border-purple-500/30 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 shrink-0"
                    >
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                        <Play className="h-4 w-4 fill-white" />
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Radios Partenaires</p>
                        <p className="text-xs font-black text-white">45+ Diffuseurs</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      animate={{ 
                        y: [0, 8, 0],
                      }}
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8
                      }}
                      className="absolute -bottom-6 -left-3 bg-[#0d0a19]/95 backdrop-blur-md border border-purple-500/30 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 shrink-0"
                    >
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                        <Award className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Garantie de Succès</p>
                        <p className="text-xs font-black text-white">100% Sécurisé</p>
                      </div>
                    </motion.div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Dashboard Panels */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {activeRole === 'artiste' && (
            <ArtistDashboard
              currentUser={currentUser}
              users={users}
              offers={offers}
              requests={requests}
              transactions={transactions}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onAddRequest={handleAddRequest}
              onUpdateRequestChats={handleUpdateRequestChats}
              onUpdateUserBalance={handleUpdateUserBalance}
              onAddTransaction={handleAddTransaction}
              onOpenDepositModal={() => setIsWalletModalOpen(true)}
              onUpdateRequests={handleUpdateRequests}
              isOnline={effectiveOnline}
              isSimulatingOffline={isSimulatingOffline}
              onToggleSimulateOffline={handleToggleSimulateOffline}
              lastSyncTime={lastSyncTime}
              onManualSync={handleManualSync}
            />
          )}

          {activeRole === 'promoteur' && (
            <PromoteurDashboard
              currentUser={currentUser}
              users={users}
              offers={offers}
              requests={requests}
              transactions={transactions}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onUpdateRequests={handleUpdateRequests}
              onUpdateRequestChats={handleUpdateRequestChats}
              onUpdateOffers={saveOffers}
              onUpdateUserBalance={handleUpdateUserBalance}
              onAddTransaction={handleAddTransaction}
              onOpenWithdrawalModal={() => setIsWalletModalOpen(true)}
            />
          )}

          {activeRole === 'admin' && (
            <AdminDashboard
              currentUser={currentUser}
              users={users}
              offers={offers}
              requests={requests}
              transactions={transactions}
              config={config}
              onUpdateUsers={handleUpdateUsers}
              onUpdateRequests={handleUpdateRequests}
              onUpdateConfig={saveConfig}
              onAddTransaction={handleAddTransaction}
              onUpdateUserBalance={handleUpdateUserBalance}
              onAddNotification={handleAddNotification}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-950/40 bg-gradient-to-b from-[#0a0715] via-[#0d0a19] to-[#0b0817] pt-12 pb-8 mt-16 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-purple-950/20">
            {/* Brand Logo & Ministry Support */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-rose-500" />
                <span className="font-display text-white text-base font-extrabold tracking-wide">
                  Bénin Music <span className="text-rose-500">Promo</span>
                </span>
                <span className="text-base">🇧🇯</span>
              </div>
              <p className="text-xs text-gray-400 font-medium max-w-sm">
                Soutenu officiellement par le <span className="text-gray-200">Ministère du Tourisme, de la Culture et des Arts du Bénin</span> pour le rayonnement culturel.
              </p>
            </div>

            {/* Quick Navigation Links with generous spacing */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-semibold text-gray-300">
              <a href="#about" className="hover:text-rose-500 transition-colors duration-200">À propos</a>
              <a href="#conditions" className="hover:text-rose-500 transition-colors duration-200">Conditions</a>
              <a href="#privacy" className="hover:text-rose-500 transition-colors duration-200">Confidentialité</a>
              <a href="#support" className="hover:text-rose-500 transition-colors duration-200">Aide & Support</a>
            </div>

            {/* Social Network Icons with sleek hover transformations */}
            <div className="flex items-center gap-4.5">
              {[
                { icon: Facebook, href: '#facebook', color: 'hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-blue-500/20' },
                { icon: Twitter, href: '#twitter', color: 'hover:text-sky-400 hover:bg-sky-400/10 hover:border-sky-400/30 hover:shadow-sky-400/20' },
                { icon: Instagram, href: '#instagram', color: 'hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/30 hover:shadow-pink-500/20' },
                { icon: Youtube, href: '#youtube', color: 'hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 hover:shadow-red-500/20' },
                { icon: Globe, href: '#website', color: 'hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30 hover:shadow-emerald-400/20' },
                { icon: Mail, href: '#mail', color: 'hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/30 hover:shadow-amber-400/20' }
              ].map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className={`group flex h-9 w-9 items-center justify-center rounded-xl border border-purple-950/50 bg-[#120e25]/60 text-gray-400 transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-115 active:scale-95 hover:shadow-lg ${social.color}`}
                  >
                    <IconComponent className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-medium">
            <p className="text-center md:text-left leading-relaxed max-w-xl">
              Garantie de tiers de confiance pour les droits d'auteurs et la diffusion de campagnes musicales sur les radios FM & médias à Cotonou, Porto-Novo, Parakou, Abomey-Calavi et Ouidah.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-mono text-[10px]">
              <span>Plateforme de Confiance 2026</span>
              <span className="hidden sm:inline text-purple-950/40">•</span>
              <span className="flex items-center gap-1 bg-[#120e25]/60 px-2.5 py-1 rounded-lg border border-purple-950/30">
                Fait avec <Heart className="h-3 w-3 text-rose-500 fill-current animate-pulse" /> pour la culture béninoise
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* Global Wallet Management Modal Overlay */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        currentUser={currentUser}
        transactions={transactions}
        onAddTransaction={handleAddTransaction}
        onUpdateUserBalance={handleUpdateUserBalance}
      />

      {/* PWA Installation Guidance Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Real-time Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 80, scale: 0.4, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 20, transition: { duration: 0.25 } }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 14,
                mass: 0.8
              }}
              className="pointer-events-auto w-full rounded-2xl bg-slate-900 border border-slate-800 text-white p-4 shadow-2xl flex gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 shadow-md shadow-amber-500/20">
                <Bell className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-xs font-bold text-amber-400">{t.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-semibold">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors self-start shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
