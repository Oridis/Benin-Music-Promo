/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, PromoteurOffer, PromotionRequest, Transaction } from '../types';
import { MUSIC_GENRES, CHANNELS_PRESETS } from '../data';
import { getAudioFileUrl } from '../lib/audioStorage';
import ChatWindow from './ChatWindow';
import ProfileCameraCapture from './ProfileCameraCapture';
import {
  Radio,
  Plus,
  Coins,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  Volume2,
  Check,
  X,
  FileText,
  AlertTriangle,
  TrendingUp,
  Award,
  PlusCircle,
  Trash,
  Settings,
  Save,
  Info,
  Calendar,
  ExternalLink,
  MessageSquare,
  Download,
  ChevronLeft,
  Search
} from 'lucide-react';

interface PromoteurDashboardProps {
  currentUser: User;
  users: User[];
  offers: PromoteurOffer[];
  requests: PromotionRequest[];
  transactions: Transaction[];
  onUpdateCurrentUser: (user: User) => void;
  onUpdateRequests: (requests: PromotionRequest[]) => void;
  onUpdateRequestChats: (requestId: string, chats: any[]) => void;
  onUpdateOffers: (offers: PromoteurOffer[]) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
  onAddTransaction: (tx: Transaction) => void;
  onOpenWithdrawalModal: () => void;
}

export default function PromoteurDashboard({
  currentUser,
  users,
  offers,
  requests,
  transactions,
  onUpdateCurrentUser,
  onUpdateRequests,
  onUpdateRequestChats,
  onUpdateOffers,
  onUpdateUserBalance,
  onAddTransaction,
  onOpenWithdrawalModal
}: PromoteurDashboardProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'demandes' | 'messages' | 'offres' | 'profile'>('demandes');
  const [demandeFilter, setDemandeFilter] = useState<'pending' | 'active' | 'completed'>('pending');
  
  // Messaging subtab states
  const [selectedChatRequestId, setSelectedChatRequestId] = useState<string | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');

  // New Offer Form States
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferPrice, setNewOfferPrice] = useState('');
  const [newOfferDuration, setNewOfferDuration] = useState('');
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [newOfferChannels, setNewOfferChannels] = useState<string[]>([]);

  // Offer Deletion Modal states
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  // Refusal Modal states
  const [refusalRequestId, setRefusalRequestId] = useState<string | null>(null);
  const [refusalReasonText, setRefusalReasonText] = useState('');

  // Proof Submission Modal states
  const [proofRequestId, setProofRequestId] = useState<string | null>(null);
  const [proofScheduleText, setProofScheduleText] = useState('');
  const [proofLinkText, setProofLinkText] = useState('');
  const [proofLabelText, setProofLabelText] = useState('');

  // Profile Settings States
  const [orgNameInput, setOrgNameInput] = useState(currentUser.organizationName || '');
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [categoryInput, setCategoryInput] = useState(currentUser.promoteurCategory || 'radio');
  const [audienceSizeInput, setAudienceSizeInput] = useState(currentUser.audienceSize || '');
  const [audienceLocationInput, setAudienceLocationInput] = useState(currentUser.audienceLocation || '');
  const [phoneInput, setPhoneInput] = useState(currentUser.phoneNumber || '');
  const [mtnInput, setMtnInput] = useState(currentUser.mtnNumber || '');
  const [moovInput, setMoovInput] = useState(currentUser.moovNumber || '');
  const [celtiisInput, setCeltiisInput] = useState(currentUser.celtiisNumber || '');
  const [avatarInput, setAvatarInput] = useState(currentUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize profile states when current user changes
  React.useEffect(() => {
    setOrgNameInput(currentUser.organizationName || '');
    setNameInput(currentUser.name);
    setBioInput(currentUser.bio || '');
    setCategoryInput(currentUser.promoteurCategory || 'radio');
    setAudienceSizeInput(currentUser.audienceSize || '');
    setAudienceLocationInput(currentUser.audienceLocation || '');
    setPhoneInput(currentUser.phoneNumber || '');
    setMtnInput(currentUser.mtnNumber || '');
    setMoovInput(currentUser.moovNumber || '');
    setCeltiisInput(currentUser.celtiisNumber || '');
    setAvatarInput(currentUser.avatar);
  }, [currentUser]);

  // Selected Campaign Detail for Chat/Actions
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Audio Player State & Web Audio Synth Failsafe
  const [playingRequestId, setPlayingRequestId] = useState<string | null>(null);
  const [audioIsPlaying, setAudioIsPlaying] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  
  const dashboardAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = React.useRef<any>(null);
  const progressIntervalRef = React.useRef<any>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const isSynthPlayingRef = React.useRef<boolean>(false);

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    isSynthPlayingRef.current = false;
  };

  const startSynthAfrobeat = () => {
    stopSynth();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      isSynthPlayingRef.current = true;
      let step = 0;
      
      synthIntervalRef.current = setInterval(() => {
        if (!isSynthPlayingRef.current) return;
        
        const t = ctx.currentTime;
        
        // Kick Drum
        if (step % 4 === 0) {
          const kick = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kick.connect(kickGain);
          kickGain.connect(ctx.destination);
          
          kick.frequency.setValueAtTime(120, t);
          kick.frequency.exponentialRampToValueAtTime(0.01, t + 0.25);
          
          kickGain.gain.setValueAtTime(0.4, t);
          kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          
          kick.start(t);
          kick.stop(t + 0.25);
        }
        
        // Hihat
        if (step % 2 === 1) {
          const hat = ctx.createOscillator();
          const hatGain = ctx.createGain();
          hat.type = 'triangle';
          hat.connect(hatGain);
          hatGain.connect(ctx.destination);
          hat.frequency.setValueAtTime(8000, t);
          
          hatGain.gain.setValueAtTime(0.05, t);
          hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          
          hat.start(t);
          hat.stop(t + 0.04);
        }

        // African Pentatonic Scale chords/melody notes: C4, D4, E4, G4, A4
        const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        if (step % 4 === 1 || step % 4 === 3) {
          const note = melody[(step * 2) % melody.length];
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.frequency.setValueAtTime(note, t);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          
          osc.start(t);
          osc.stop(t + 0.35);
        }
        
        step = (step + 1) % 16;
      }, 180); // ~130 BPM
    } catch (e) {
      console.error("Web Audio Synth failed", e);
    }
  };

  React.useEffect(() => {
    return () => {
      if (dashboardAudioRef.current) {
        dashboardAudioRef.current.pause();
        dashboardAudioRef.current = null;
      }
      stopSynth();
    };
  }, []);

  const handleTogglePlay = async (reqId: string, url?: string) => {
    if (playingRequestId && playingRequestId !== reqId) {
      if (dashboardAudioRef.current) {
        dashboardAudioRef.current.pause();
      }
      stopSynth();
      setAudioIsPlaying(false);
      setAudioCurrentTime(0);
    }

    if (playingRequestId === reqId && audioIsPlaying) {
      if (dashboardAudioRef.current) {
        dashboardAudioRef.current.pause();
      }
      stopSynth();
      setAudioIsPlaying(false);
    } else {
      setPlayingRequestId(reqId);
      setAudioIsPlaying(true);
      setAudioCurrentTime(0);

      // Try to retrieve the original file from IndexedDB first
      let resolvedUrl = await getAudioFileUrl(reqId);
      
      if (!resolvedUrl) {
        resolvedUrl = url || '';
      }

      const hasUrl = resolvedUrl && (
        resolvedUrl.startsWith('blob:') || 
        resolvedUrl.startsWith('http://') || 
        resolvedUrl.startsWith('https://') || 
        resolvedUrl.endsWith('.mp3') || 
        resolvedUrl.includes('unsplash')
      );
      
      if (hasUrl) {
        try {
          if (!dashboardAudioRef.current || dashboardAudioRef.current.src !== resolvedUrl) {
            dashboardAudioRef.current = new Audio(resolvedUrl);
            
            dashboardAudioRef.current.addEventListener('timeupdate', () => {
              if (dashboardAudioRef.current) {
                setAudioCurrentTime(dashboardAudioRef.current.currentTime);
              }
            });
            
            dashboardAudioRef.current.addEventListener('loadedmetadata', () => {
              if (dashboardAudioRef.current) {
                setAudioDuration(dashboardAudioRef.current.duration || 180);
              }
            });

            dashboardAudioRef.current.addEventListener('ended', () => {
              setAudioIsPlaying(false);
              setAudioCurrentTime(0);
            });
          }
          
          dashboardAudioRef.current.play().catch((err) => {
            console.warn("Direct HTML5 audio failed, fallback to rhythmic synth.", err);
            startSynthAfrobeat();
            setAudioDuration(180); // 3 minutes duration
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = setInterval(() => {
              setAudioCurrentTime((prev) => {
                if (prev >= 180) {
                  stopSynth();
                  setAudioIsPlaying(false);
                  return 0;
                }
                return prev + 1;
              });
            }, 1000);
          });
        } catch (e) {
          console.error("Audio initialization error", e);
          startSynthAfrobeat();
          setAudioDuration(180);
        }
      } else {
        startSynthAfrobeat();
        setAudioDuration(180); // 3 minutes mockup
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
          setAudioCurrentTime((prev) => {
            if (prev >= 180) {
              stopSynth();
              setAudioIsPlaying(false);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
  };

  const handleScrubAudio = (newTime: number) => {
    setAudioCurrentTime(newTime);
    if (dashboardAudioRef.current && playingRequestId && !synthIntervalRef.current) {
      dashboardAudioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownloadAudio = async (req: PromotionRequest) => {
    try {
      // 1. Try IndexedDB
      let resolvedUrl = await getAudioFileUrl(req.id);
      let isMock = false;

      if (!resolvedUrl) {
        if (req.audioUrl && (
          req.audioUrl.startsWith('blob:') || 
          req.audioUrl.startsWith('http://') || 
          req.audioUrl.startsWith('https://')
        )) {
          resolvedUrl = req.audioUrl;
        } else {
          // Fallback to generating a tiny WAV audio demo representing high-quality synthesized audio
          const sampleRate = 11025;
          const numChannels = 1;
          const bitsPerSample = 16;
          const duration = 2.0; // 2 seconds high quality synth chord
          const numSamples = sampleRate * duration;
          const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
          const blockAlign = (numChannels * bitsPerSample) / 8;
          
          const buffer = new ArrayBuffer(44 + numSamples * 2);
          const view = new DataView(buffer);
          
          view.setUint32(0, 0x52494646, false); // "RIFF"
          view.setUint32(4, 36 + numSamples * 2, true);
          view.setUint32(8, 0x57415645, false); // "WAVE"
          view.setUint32(12, 0x666d7420, false); // "fmt "
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, numChannels, true);
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, byteRate, true);
          view.setUint16(32, blockAlign, true);
          view.setUint16(34, bitsPerSample, true);
          view.setUint32(36, 0x64617461, false); // "data"
          view.setUint32(40, numSamples * 2, true);
          
          // Let's make an elegant major chord A4, C#5, E5, A5 fading out
          let offset = 44;
          for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const env = Math.exp(-2.0 * t); // Decay envelope
            const wave = (
              Math.sin(2 * Math.PI * 440.0 * t) + // A4
              Math.sin(2 * Math.PI * 554.37 * t) + // C#5
              Math.sin(2 * Math.PI * 659.25 * t) + // E5
              Math.sin(2 * Math.PI * 880.0 * t)   // A5
            ) / 4.0;
            const sample = wave * env * 0.8 * 32767;
            view.setInt16(offset, sample, true);
            offset += 2;
          }
          
          const blob = new Blob([buffer], { type: 'audio/wav' });
          resolvedUrl = URL.createObjectURL(blob);
          isMock = true;
        }
      }

      // Download trigger
      const link = document.createElement('a');
      link.href = resolvedUrl;
      const cleanName = req.songTitle.replace(/[^a-zA-Z0-9_\s-]/g, '');
      link.download = `${cleanName || 'Chanson'}_HQ.${isMock ? 'wav' : 'mp3'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up temporary blobs
      if (isMock) {
        setTimeout(() => URL.revokeObjectURL(resolvedUrl), 1000);
      }
    } catch (error) {
      console.error("Error during download:", error);
      alert("Une erreur est survenue lors de la tentative de téléchargement du fichier.");
    }
  };

  // Filter requests targeting this specific promoter
  const myRequests = requests.filter((r) => r.promoteurId === currentUser.id);
  const myOffers = offers.filter((o) => o.promoteurId === currentUser.id);

  const chatRequests = myRequests.filter(r => r.status === 'accepted' || r.status === 'completed' || r.status === 'pending');
  const sortedChatRequests = [...chatRequests].sort((a, b) => {
    const aTime = a.chats.length > 0 ? new Date(a.chats[a.chats.length - 1].timestamp).getTime() : new Date(a.createdAt).getTime();
    const bTime = b.chats.length > 0 ? new Date(b.chats[b.chats.length - 1].timestamp).getTime() : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  // Format Currency
  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(val).replace('XOF', 'F CFA');
  };

  // Lifetime Earnings Calculator
  // (All non-refused payments received)
  const nonRefusedRequests = myRequests.filter((r) => r.status !== 'refused');
  const totalGrossEarnings = nonRefusedRequests.reduce((sum, r) => sum + r.price, 0);
  const totalNetEarnings = totalGrossEarnings * 0.9; // Deduct 10% commission
  const totalCommissionDeducted = totalGrossEarnings * 0.1;

  // Simulate Instant Admin Verification (for easy preview testing)
  const handleInstantVerify = () => {
    const updatedUser = { ...currentUser, verified: true };
    onUpdateCurrentUser(updatedUser);
  };

  // ACCEPT PROPOSAL
  const handleAcceptRequest = (reqId: string) => {
    const reqIndex = requests.findIndex((r) => r.id === reqId);
    if (reqIndex === -1) return;

    const updatedRequests = [...requests];
    const target = updatedRequests[reqIndex];
    target.status = 'accepted';
    target.replyDate = new Date().toISOString();
    target.lastUpdate = new Date().toISOString();

    // Push initial chat message greeting
    target.chats = [
      ...target.chats,
      {
        id: `msg-sys-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'promoteur',
        text: `Bonjour ! J'ai bien reçu votre titre "${target.songTitle}" (${target.songGenre}) et j'accepte votre demande de promotion avec grand plaisir ! Je prépare la planification et je reviens vers vous ici.`,
        timestamp: new Date().toISOString()
      }
    ];

    onUpdateRequests(updatedRequests);
    setSelectedRequestId(reqId);
  };

  // INITIATE REFUSAL DIALOG
  const handleOpenRefusalModal = (reqId: string) => {
    setRefusalRequestId(reqId);
    setRefusalReasonText('');
  };

  // SUBMIT REFUSAL & REFUND ARTIST
  const handleConfirmRefusal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refusalRequestId) return;

    const reqIndex = requests.findIndex((r) => r.id === refusalRequestId);
    if (reqIndex === -1) return;

    const updatedRequests = [...requests];
    const target = updatedRequests[reqIndex];
    target.status = 'refused';
    target.refusalReason = refusalReasonText;
    target.replyDate = new Date().toISOString();
    target.lastUpdate = new Date().toISOString();

    // 1. Calculate Refund back to Artist Wallet
    const refundAmount = target.price;
    const artist = users.find((u) => u.id === target.artistId);
    if (artist) {
      const newArtistBalance = artist.walletBalance + refundAmount;
      onUpdateUserBalance(target.artistId, newArtistBalance);
    }

    // 2. Save requests state
    onUpdateRequests(updatedRequests);

    // 3. Log Refund Transaction for Artist
    const newTx: Transaction = {
      id: `TX-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: target.artistId,
      userName: target.artistName,
      userRole: 'artiste',
      type: 'refund',
      amount: refundAmount,
      paymentMethod: 'wallet',
      status: 'success',
      description: `Remboursement suite au refus de promotion de "${target.songTitle}" par ${currentUser.name}`,
      createdAt: new Date().toISOString()
    };
    onAddTransaction(newTx);

    // Reset State
    setRefusalRequestId(null);
    setRefusalReasonText('');
    alert('Demande refusée. L\'artiste a été intégralement remboursé sur son portefeuille.');
  };

  // INITIATE PROOF SUBMISSION FORM
  const handleOpenProofModal = (reqId: string) => {
    setProofRequestId(reqId);
    setProofScheduleText('Passages quotidiens à 11h15, 15h40 et 19h20.');
    setProofLinkText('https://facebook.com/watch/beninmusic/posts');
    setProofLabelText('Preuve d\'enregistrement de diffusion antenne');
  };

  // CONFIRM COMPLETED PROMOTION WITH PROOFS
  const handleConfirmProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofRequestId) return;

    const reqIndex = requests.findIndex((r) => r.id === proofRequestId);
    if (reqIndex === -1) return;

    const updatedRequests = [...requests];
    const target = updatedRequests[reqIndex];
    target.status = 'completed';
    target.scheduleText = proofScheduleText;
    target.proofLink = proofLinkText;
    target.proofLabel = proofLabelText;
    target.lastUpdate = new Date().toISOString();

    // Release Funds to Promoter Wallet! (Deduct 10% platform commission)
    const netPayout = target.price * 0.9;
    const platformCommission = target.price * 0.1;

    // 1. Credit Promoter Wallet Balance
    const newPromoterBalance = currentUser.walletBalance + netPayout;
    onUpdateUserBalance(currentUser.id, newPromoterBalance);

    // 2. Log Payment received (net)
    const promoterTx: Transaction = {
      id: `TX-EARN-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: 'promoteur',
      type: 'deposit', // Earning
      amount: netPayout,
      paymentMethod: 'wallet',
      status: 'success',
      description: `Gains perçus (Commission déduite) pour promotion "${target.songTitle}" par Sessimè`,
      createdAt: new Date().toISOString()
    };
    onAddTransaction(promoterTx);

    // 3. Log Commission cut for platform admin wallet
    const admin = users.find((u) => u.role === 'admin');
    if (admin) {
      const newAdminBalance = admin.walletBalance + platformCommission;
      onUpdateUserBalance(admin.id, newAdminBalance);

      const commissionTx: Transaction = {
        id: `TX-COM-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: admin.id,
        userName: admin.name,
        userRole: 'admin',
        type: 'commission',
        amount: platformCommission,
        paymentMethod: 'wallet',
        status: 'success',
        description: `Commission plateforme 10% perçue sur la promotion req-${target.id}`,
        createdAt: new Date().toISOString()
      };
      onAddTransaction(commissionTx);
    }

    // Save Requests
    onUpdateRequests(updatedRequests);

    // Reset state
    setProofRequestId(null);
    alert('Prestation validée ! Les justificatifs ont été transmis à l\'artiste et vos gains (commission déduite de 10%) ont été versés dans votre portefeuille.');
  };

  // SEND CHAT MESSAGE IN CAMPAIGN
  const handleSendChatMessage = (reqId: string, text: string) => {
    const request = requests.find((r) => r.id === reqId);
    if (!request) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'promoteur' as any,
      text: text,
      timestamp: new Date().toISOString()
    };

    const updatedChats = [...request.chats, newMsg];
    onUpdateRequestChats(reqId, updatedChats);
  };

  // CREATE NEW OFFER FORM
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(newOfferPrice, 10);
    if (isNaN(priceNum) || priceNum < 5000) {
      alert('Le montant minimum d\'un forfait est de 5 000 F CFA.');
      return;
    }

    const newOffer: PromoteurOffer = {
      id: `off-${Date.now()}`,
      promoteurId: currentUser.id,
      title: newOfferTitle,
      price: priceNum,
      duration: newOfferDuration || 'Rotation de 7 jours',
      description: newOfferDesc,
      channels: newOfferChannels.length > 0 ? newOfferChannels : ['Antenne Radio (Passage Direct)']
    };

    onUpdateOffers([...offers, newOffer]);
    
    // Clear states
    setNewOfferTitle('');
    setNewOfferPrice('');
    setNewOfferDuration('');
    setNewOfferDesc('');
    setNewOfferChannels([]);
    setIsAddingOffer(false);
    alert('Votre nouveau forfait promotionnel a été configuré avec succès !');
  };

  // DELETE OFFER
  const handleDeleteOffer = (offerId: string) => {
    onUpdateOffers(offers.filter((o) => o.id !== offerId));
    setOfferToDelete(null);
  };

  // Toggle Offer channel checklist
  const toggleOfferChannel = (chan: string) => {
    if (newOfferChannels.includes(chan)) {
      setNewOfferChannels(newOfferChannels.filter((c) => c !== chan));
    } else {
      setNewOfferChannels([...newOfferChannels, chan]);
    }
  };

  // SAVE PROFILE SETTINGS
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      organizationName: orgNameInput,
      name: nameInput,
      bio: bioInput,
      promoteurCategory: categoryInput as any,
      audienceSize: audienceSizeInput,
      audienceLocation: audienceLocationInput,
      phoneNumber: phoneInput,
      mtnNumber: mtnInput,
      moovNumber: moovInput,
      celtiisNumber: celtiisInput,
      avatar: avatarInput
    };
    onUpdateCurrentUser(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Active requests filters
  const pendingDemandes = myRequests.filter((r) => r.status === 'pending');
  const activeDemandes = myRequests.filter((r) => r.status === 'accepted');
  const completedDemandes = myRequests.filter((r) => r.status === 'completed' || r.status === 'refused');

  const visibleDemandes = 
    demandeFilter === 'pending' ? pendingDemandes :
    demandeFilter === 'active' ? activeDemandes : completedDemandes;

  // If promoter is not yet verified
  if (!currentUser.verified) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-8 text-center max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <AlertTriangle className="mx-auto h-16 w-16 text-amber-500 animate-bounce" />
        <div className="space-y-2">
          <h3 className="font-display text-xl font-extrabold text-gray-900">Compte Promoteur en cours d'approbation</h3>
          <p className="text-xs text-gray-500 leading-relaxed px-6">
            Conformément aux règles de diffusion musicale au Bénin, votre profil, vos audiences, et la légitimité de vos canaux de diffusion (Fréquences FM, Pages médias, Playlists) doivent être validés par la direction de la plateforme avant de pouvoir recevoir les œuvres musicales des artistes béninois.
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 border border-amber-100/30 text-[11px] text-amber-900 font-medium max-w-md mx-auto space-y-1 text-left">
          <p className="font-bold border-b border-amber-50 pb-1.5 flex items-center gap-1.5"><Info className="h-4 w-4 text-amber-500" /> Étape d'évaluation administrative :</p>
          <p className="pt-1">1. Renseignez fidèlement vos statistiques d'audience.</p>
          <p>2. Déposez vos offres promotionnelles types.</p>
          <p>3. Attendez la notification d'agrément par l'administrateur.</p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => setActiveSubTab('profile')}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors"
          >
            Compléter mes infos de profil
          </button>
          
          <button
            onClick={handleInstantVerify}
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="h-4 w-4" />
            Simuler validation immédiate (Aperçu)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Stylish Welcome Banner with rounded corners */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 via-[#0e0a1e] to-gray-950 border border-purple-900/40 p-6 sm:p-8 text-white shadow-xl">
        {/* Decorative glowing background bubbles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 rounded-full bg-rose-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-44 h-44 rounded-full bg-purple-500/10 blur-[70px] pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[9.5px] font-black uppercase tracking-wider text-amber-400">
                <Radio className="h-3 w-3 animate-pulse text-amber-400" />
                Diffuseur Officiel Agréé
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[9.5px] font-black uppercase tracking-wider text-emerald-400">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                Audience Certifiée
              </span>
            </div>
            
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                Ravi de vous revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-300 drop-shadow-sm">{currentUser.organizationName || currentUser.name}</span> !
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                Suivez vos performances en direct, examinez les propositions de morceaux de nos artistes béninois, diffusez sur vos ondes et touchez instantanément vos fonds sécurisés par le registre séquestre.
              </p>
            </div>
            
            {/* Quick stats indicators in banner */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-300 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-rose-400 font-bold">Média :</span>
                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white capitalize">{currentUser.promoteurCategory || 'Radio'}</span>
              </div>
              <div className="h-3 w-px bg-white/10 hidden sm:inline" />
              <div className="flex items-center gap-1.5">
                <span className="text-fuchsia-400 font-bold">Audience :</span>
                <span className="text-white font-bold">{currentUser.audienceSize || 'Non spécifiée'}</span> ({currentUser.audienceLocation || 'Bénin'})
              </div>
            </div>
          </div>
          
          {/* Audio rhythm equalizer mockup on the right */}
          <div className="hidden lg:flex items-end gap-1.5 h-14 shrink-0 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="absolute top-2 left-3 text-[8px] font-black uppercase tracking-widest text-gray-500 font-mono">ON AIR PULSE</div>
            <span className="w-1 bg-gradient-to-t from-rose-500 to-fuchsia-500 rounded-full animate-pulse h-8" style={{ animationDelay: '0.1s' }} />
            <span className="w-1 bg-gradient-to-t from-rose-500 to-fuchsia-500 rounded-full animate-pulse h-10" style={{ animationDelay: '0.4s' }} />
            <span className="w-1 bg-gradient-to-t from-rose-500 to-fuchsia-500 rounded-full animate-pulse h-6" style={{ animationDelay: '0.2s' }} />
            <span className="w-1 bg-gradient-to-t from-rose-500 to-fuchsia-500 rounded-full animate-pulse h-9" style={{ animationDelay: '0.5s' }} />
            <span className="w-1 bg-gradient-to-t from-rose-500 to-fuchsia-500 rounded-full animate-pulse h-7" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>

      {/* Promoter Dashboard Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Earnings Card */}
        <div className="rounded-2xl border border-purple-950/30 bg-[#0d0a19]/90 p-4 shadow-md flex items-center justify-between gap-3 min-w-0 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">Solde encaissé</p>
            <p className="font-mono text-lg sm:text-xl font-black text-rose-400 mt-1 truncate">{formatFCFA(currentUser.walletBalance)}</p>
            <button
              onClick={onOpenWithdrawalModal}
              disabled={currentUser.walletBalance < 5000}
              className="mt-1.5 text-[10px] font-extrabold text-amber-400 hover:underline disabled:text-gray-500 hover:text-amber-300 transition-colors block truncate text-left w-full cursor-pointer"
            >
              Retirer vers Mobile Money ➔
            </button>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
            <Coins className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Lifetime gross earnings */}
        <div className="rounded-2xl border border-purple-950/30 bg-[#0d0a19]/90 p-4 shadow-md flex items-center justify-between gap-3 min-w-0 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">Cumul Brut Généré</p>
            <p className="font-mono text-lg sm:text-xl font-black text-gray-100 mt-1 truncate">{formatFCFA(totalGrossEarnings)}</p>
            <p className="text-[9px] text-emerald-400 font-semibold mt-1 truncate">Prestations acceptées</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <TrendingUp className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Platform commission deduction */}
        <div className="rounded-2xl border border-purple-950/30 bg-[#0d0a19]/90 p-4 shadow-md flex items-center justify-between gap-3 min-w-0 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">Commission (10%)</p>
            <p className="font-mono text-lg sm:text-xl font-black text-fuchsia-400 mt-1 truncate">{formatFCFA(totalCommissionDeducted)}</p>
            <p className="text-[9px] text-gray-400 font-semibold mt-1 truncate">Déduction automatique</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 shrink-0">
            <Trash className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Total Campaigns handled */}
        <div className="rounded-2xl border border-purple-950/30 bg-[#0d0a19]/90 p-4 shadow-md flex items-center justify-between gap-3 min-w-0 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">Campagnes Traitées</p>
            <p className="font-mono text-lg sm:text-xl font-black text-emerald-400 mt-1 truncate">{myRequests.length}</p>
            <p className="text-[9px] text-gray-400 font-semibold mt-1 truncate">Taux acceptation: {myRequests.length > 0 ? Math.round((myRequests.filter(r => r.status !== 'refused').length / myRequests.length) * 100) : 100}%</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Award className="h-5.5 w-5.5" />
          </div>
        </div>

      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-gray-100 bg-white p-1.5 sm:p-2 rounded-2xl shadow-xs overflow-x-auto scrollbar-none flex-nowrap justify-start gap-1.5 sm:gap-2 max-w-full">
        <button
          onClick={() => setActiveSubTab('demandes')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'demandes'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'demandes' && (
            <motion.div
              layoutId="activePromoteurSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Inbox className="h-4 w-4 shrink-0" />
          <div className="relative flex items-center">
            <span className="hidden sm:inline">Traitement des demandes</span>
            <span className="inline sm:hidden">Demandes</span>
            {pendingDemandes.length > 0 && (
              <span className="absolute -top-2.5 -right-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-1 ring-white/10 shadow-xs">
                {pendingDemandes.length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveSubTab('messages')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'messages'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'messages' && (
            <motion.div
              layoutId="activePromoteurSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="relative flex items-center">
            <span className="hidden sm:inline">Messagerie</span>
            <span className="inline sm:hidden">Messages</span>
            {sortedChatRequests.filter(r => r.chats.length > 0).length > 0 && (
              <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-black text-white shrink-0">
                {sortedChatRequests.filter(r => r.chats.length > 0).length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveSubTab('offres')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'offres'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'offres' && (
            <motion.div
              layoutId="activePromoteurSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Radio className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Mes Forfaits & Offres ({myOffers.length})</span>
          <span className="inline sm:hidden">Forfaits ({myOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'profile'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'profile' && (
            <motion.div
              layoutId="activePromoteurSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Settings className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Paramètres Diffuseur</span>
          <span className="inline sm:hidden">Paramètres</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* REQUESTS LIST TAB */}
        {activeSubTab === 'demandes' && (
          <motion.div
            key="demandes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
          
          {/* Requests list panel */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter buttons inside requests tab */}
            <div className="flex rounded-xl bg-gray-100 p-1 w-fit text-[11px] font-bold">
              <button
                onClick={() => setDemandeFilter('pending')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  demandeFilter === 'pending' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-500'
                }`}
              >
                ⏳ Reçues / En attente ({pendingDemandes.length})
              </button>
              <button
                onClick={() => setDemandeFilter('active')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  demandeFilter === 'active' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-500'
                }`}
              >
                ⚙️ En cours de diffusion ({activeDemandes.length})
              </button>
              <button
                onClick={() => setDemandeFilter('completed')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  demandeFilter === 'completed' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-500'
                }`}
              >
                ✓ Terminées / Refusées ({completedDemandes.length})
              </button>
            </div>

            {/* List items */}
            {visibleDemandes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center space-y-3">
                <Inbox className="mx-auto h-8 w-8 text-gray-300" />
                <h5 className="font-display text-xs font-bold text-gray-700">Aucune demande dans cette catégorie</h5>
                <p className="text-[11px] text-gray-400">Les nouvelles candidatures d\'artistes s\'afficheront ici.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleDemandes.map((req) => {
                  const isSelected = selectedRequestId === req.id;
                  const artistObj = users.find((u) => u.id === req.artistId);
                  return (
                    <div
                      key={req.id}
                      className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                        isSelected ? 'border-amber-400 shadow-md' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {/* Summary Header */}
                      <div
                        onClick={() => setSelectedRequestId(isSelected ? null : req.id)}
                        className="flex flex-wrap items-center justify-between p-4 gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={req.artistAvatar}
                            alt={req.artistName}
                            className="h-10 w-10 rounded-xl object-cover ring-2 ring-gray-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-display text-sm font-bold text-gray-900 leading-snug">
                              {req.songTitle}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5" style={{ color: '#f7f7f6' }}>
                              Artiste: <strong className="text-gray-700">{req.artistName}</strong> • Rythme: {req.songGenre}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto sm:ml-0">
                          <div className="text-right">
                            <span className="font-mono text-xs font-extrabold text-gray-900">{formatFCFA(req.price)}</span>
                            <p className="text-[8px] text-gray-400">Commission (10%) incluse</p>
                          </div>

                          {req.status === 'pending' && (
                            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-600/10">
                              ⏳ En attente
                            </span>
                          )}
                          {req.status === 'accepted' && (
                            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                              ⚙️ Planifié / En cours
                            </span>
                          )}
                          {req.status === 'completed' && (
                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                              ✓ Terminée (Justifié)
                            </span>
                          )}
                          {req.status === 'refused' && (
                            <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 ring-1 ring-rose-600/10">
                              ❌ Refusée
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand details for promoteur */}
                      {isSelected && (
                        <div className="border-t border-gray-50 bg-gray-50/20 p-4 space-y-4">
                          
                          {/* Top: Metadata and Action Forms */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            
                            {/* Left panel: Info + Audio player */}
                            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pièces déposées par l'artiste</p>
                              
                              <div className="space-y-1.5 font-medium">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Chanson :</span>
                                  <span className="text-gray-800 font-bold">{req.songTitle} ({req.songGenre})</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Fichier MP3 :</span>
                                  <span className="text-gray-600 font-mono truncate max-w-[150px]">{req.audioName} ({req.audioSize})</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Revenu attendu :</span>
                                  <span className="text-indigo-600 font-bold">{formatFCFA(req.price * 0.9)} <span className="text-[9px] text-gray-400">(Brut: {formatFCFA(req.price)})</span></span>
                                </div>
                              </div>

                              {/* Beautiful Real Interactive Audio Player */}
                              <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white shadow-lg space-y-3 border border-gray-700/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 ${playingRequestId === req.id && audioIsPlaying ? 'animate-pulse' : ''}`} style={{ backgroundColor: '#000000' }}>
                                      <Volume2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lecteur Audio Intégré</p>
                                      <p className="text-[11px] font-extrabold text-white truncate max-w-[150px]">{req.songTitle}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Dynamic Visualizer Waveform */}
                                  {playingRequestId === req.id && audioIsPlaying && (
                                    <div className="flex items-end gap-0.5 h-4 shrink-0 px-2" title="Lecture en cours">
                                      <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_100ms]" style={{ height: '60%' }}></span>
                                      <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_300ms]" style={{ height: '100%' }}></span>
                                      <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_200ms]" style={{ height: '40%' }}></span>
                                      <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_400ms]" style={{ height: '80%' }}></span>
                                      <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_150ms]" style={{ height: '50%' }}></span>
                                    </div>
                                  )}
                                </div>

                                {/* Controls Row */}
                                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/5">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePlay(req.id, req.audioUrl)}
                                    className={`h-9 w-9 rounded-full ${playingRequestId === req.id && audioIsPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-white text-gray-900 hover:bg-gray-100'} flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0`}
                                  >
                                    {playingRequestId === req.id && audioIsPlaying ? (
                                      <Pause className="h-4 w-4 text-white fill-current" />
                                    ) : (
                                      <Play className="h-4 w-4 text-gray-900 fill-current ml-0.5" />
                                    )}
                                  </button>
                                  
                                  <div className="flex-1 min-w-0">
                                    {/* Slider Progress Bar */}
                                    <input
                                      type="range"
                                      min="0"
                                      max={playingRequestId === req.id ? audioDuration || 180 : 180}
                                      value={playingRequestId === req.id ? audioCurrentTime : 0}
                                      onChange={(e) => handleScrubAudio(parseFloat(e.target.value))}
                                      className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg cursor-pointer focus:outline-none"
                                    />
                                    
                                    <div className="flex justify-between text-[9px] font-mono text-gray-400 mt-1">
                                      <span>{playingRequestId === req.id ? formatTime(audioCurrentTime) : "0:00"}</span>
                                      <span>{playingRequestId === req.id ? formatTime(audioDuration) : req.audioDuration || "3:00"}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-gray-400 font-mono">Taille: {req.audioSize || "N/A"}</span>
                                  <button
                                    type="button"
                                    id={`download-hq-${req.id}`}
                                    onClick={() => handleDownloadAudio(req)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 text-[10px] font-extrabold transition-all cursor-pointer shadow-md"
                                    title="Télécharger l'audio original en haute qualité"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Télécharger HQ</span>
                                  </button>
                                </div>
                              </div>

                              {/* Biographie & Discographie de l'artiste */}
                              {artistObj && (
                                <div className="border-t border-gray-100 pt-3 space-y-2">
                                  {artistObj.bio && (
                                    <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bio de l'artiste</p>
                                      <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">{artistObj.bio}</p>
                                    </div>
                                  )}
                                  
                                  {(artistObj.spotifyUrl || artistObj.audiomackUrl || artistObj.appleMusicUrl || artistObj.youtubeUrl || artistObj.deezerUrl) ? (
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Discographie / Liens de streaming</p>
                                      <div className="flex flex-wrap gap-1.5 pt-1">
                                        {artistObj.spotifyUrl && (
                                          <a
                                            href={artistObj.spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50 hover:bg-emerald-600 hover:text-white transition-all"
                                          >
                                            Spotify
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        )}
                                        {artistObj.audiomackUrl && (
                                          <a
                                            href={artistObj.audiomackUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/50 hover:bg-amber-600 hover:text-white transition-all"
                                          >
                                            Audiomack
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        )}
                                        {artistObj.appleMusicUrl && (
                                          <a
                                            href={artistObj.appleMusicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/50 hover:bg-rose-600 hover:text-white transition-all"
                                          >
                                            Apple Music
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        )}
                                        {artistObj.youtubeUrl && (
                                          <a
                                            href={artistObj.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200/50 hover:bg-red-600 hover:text-white transition-all"
                                          >
                                            YouTube
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        )}
                                        {artistObj.deezerUrl && (
                                          <a
                                            href={artistObj.deezerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200/50 hover:bg-sky-600 hover:text-white transition-all"
                                          >
                                            Deezer
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </div>

                            {/* Right panel: Contextual actions */}
                            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
                              {req.status === 'pending' && (
                                <div className="space-y-3 my-auto">
                                  <p className="text-xs text-gray-500 font-semibold text-center">Souhaitez-vous promouvoir cette œuvre ?</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleAcceptRequest(req.id)}
                                      className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <Check className="h-4 w-4" />
                                      Accepter
                                    </button>
                                    <button
                                      onClick={() => handleOpenRefusalModal(req.id)}
                                      className="flex-1 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors border border-rose-100/30 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <X className="h-4 w-4" />
                                      Rejeter
                                    </button>
                                  </div>
                                </div>
                              )}

                              {req.status === 'accepted' && (
                                <div className="space-y-2">
                                  <p className="text-xs font-bold text-gray-800">Prestation acceptée. À réaliser :</p>
                                  <p className="text-[11px] text-gray-500">Une fois la diffusion effectuée sur vos ondes ou vos réseaux, soumettez vos preuves de passage pour libérer vos gains sécurisés.</p>
                                  <button
                                    onClick={() => handleOpenProofModal(req.id)}
                                    className="w-full mt-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <FileText className="h-4 w-4" />
                                    Fournir justificatif & Terminer
                                  </button>
                                </div>
                              )}

                              {req.status === 'completed' && (
                                <div className="space-y-2.5">
                                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" /> Prestation validée & payée !
                                  </div>
                                  <div className="text-[11px] text-gray-500 space-y-1.5 font-medium bg-gray-50 p-2.5 rounded-lg">
                                    <div><strong>Calendrier :</strong> {req.scheduleText}</div>
                                    <div className="truncate"><strong>Preuve :</strong> <a href={req.proofLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 underline font-bold">{req.proofLabel} <ExternalLink className="h-3 w-3 inline-block" /></a></div>
                                  </div>
                                </div>
                              )}

                              {req.status === 'refused' && (
                                <div className="space-y-2 text-rose-800">
                                  <div className="text-xs font-bold flex items-center gap-1">
                                    <XCircle className="h-4 w-4" /> Demande refusée
                                  </div>
                                  <p className="text-[11px] leading-relaxed bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/20">
                                    <strong>Motif transmis :</strong> {req.refusalReason}
                                  </p>
                                </div>
                              )}
                            </div>

                          </div>

                          {/* Private Chat module for accepted active/completed items */}
                          {(req.status === 'accepted' || req.status === 'completed') && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Discussion privée avec l'artiste</p>
                              <ChatWindow
                                currentUser={currentUser}
                                recipientName={req.artistName}
                                recipientAvatar={req.artistAvatar}
                                chats={req.chats}
                                onSendMessage={(text) => handleSendChatMessage(req.id, text)}
                                promotionStatus={req.status}
                              />
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right sidebar: Rules & guidelines */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
              <h4 className="font-display text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
                <Info className="h-4.5 w-4.5 text-amber-500" />
                Vos engagements diffuseur
              </h4>
              <ul className="space-y-3.5 text-[11px] text-gray-500 font-medium leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                  <span><strong>Délai de réactivité :</strong> Répondez sous 48h aux propositions, faute de quoi la commande s'annule, l'artiste est remboursé et votre score de fiabilité baisse.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                  <span><strong>Qualité des justificatifs :</strong> Soumettez un calendrier et un enregistrement audio ou lien valide. Tout justificatif mensonger fera l'objet d'un arbitrage administratif.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                  <span><strong>Espace de dialogue :</strong> Échangez courtoisement. Cet espace sert à accorder les passages et caler les interviews.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/10 p-5 shadow-xs space-y-3">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1"><Coins className="h-4 w-4 text-amber-500" /> Calcul du revenu net</h5>
              <div className="text-[11px] text-amber-800 space-y-1.5 font-medium leading-relaxed">
                <p>La commission de la plateforme est de <strong>10 %</strong>, automatiquement prélevée lors de la validation.</p>
                <div className="border-t border-amber-200/50 pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Pour une prestation de :</span>
                    <span className="font-mono">50 000 F</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Frais Plateforme (10%) :</span>
                    <span className="font-mono">- 5 000 F</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-extrabold border-t border-amber-200/40 pt-1">
                    <span>Gains nets reversés :</span>
                    <span className="font-mono">45 000 F</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      )}

      {/* MESSAGES TAB */}
      {activeSubTab === 'messages' && (
        <motion.div
          key="messages"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden h-[600px] flex flex-col"
        >
          {/* Main layout container */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Column: List of conversations */}
            <div className={`w-full md:w-80 flex flex-col border-r border-gray-100 bg-gray-50/10 shrink-0 ${
              selectedChatRequestId ? 'hidden md:flex' : 'flex'
            }`}>
              {/* Header search */}
              <div className="p-4 border-b border-gray-100 bg-white">
                <h3 className="font-display text-sm font-bold text-gray-900 mb-3">Vos Échanges</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un artiste ou titre..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-100 bg-gray-50 text-xs text-gray-900 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {sortedChatRequests.filter(r => 
                  r.artistName.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                  r.songTitle.toLowerCase().includes(chatSearchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <MessageSquare className="mx-auto h-6 w-6 text-gray-300" />
                    <p className="text-[11px] font-bold text-gray-500">Aucune discussion trouvée</p>
                    <p className="text-[10px] text-gray-400">Les messages échangés avec les artistes apparaîtront ici.</p>
                  </div>
                ) : (
                  sortedChatRequests.filter(r => 
                    r.artistName.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                    r.songTitle.toLowerCase().includes(chatSearchQuery.toLowerCase())
                  ).map((req) => {
                    const isSelected = selectedChatRequestId === req.id || (!selectedChatRequestId && sortedChatRequests[0]?.id === req.id);
                    const lastMsg = req.chats.length > 0 ? req.chats[req.chats.length - 1] : null;
                    
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedChatRequestId(req.id)}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all hover:bg-gray-50/50 ${
                          isSelected ? 'bg-amber-500/5 border-l-4 border-amber-500' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <img
                          src={req.artistAvatar}
                          alt={req.artistName}
                          className="h-9 w-9 rounded-xl object-cover shrink-0 ring-1 ring-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-display text-xs font-bold text-gray-900 truncate">
                              {req.artistName}
                            </span>
                            {lastMsg && (
                              <span className="text-[9px] text-gray-400 font-mono shrink-0">
                                {new Date(lastMsg.timestamp).toLocaleTimeString('fr-BJ', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-amber-600 font-bold truncate mt-0.5">
                            {req.songTitle}
                          </p>
                          {lastMsg ? (
                            <p className="text-[11px] text-gray-400 truncate mt-1">
                              <span className="font-bold text-gray-500">{lastMsg.senderId === currentUser.id ? 'Vous : ' : ''}</span>
                              {lastMsg.text}
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic mt-1">
                              Aucun message échangé
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active discussion */}
            <div className={`flex-1 flex flex-col bg-white overflow-hidden ${
              !selectedChatRequestId ? 'hidden md:flex' : 'flex'
            }`}>
              {(() => {
                const filteredChatReqs = sortedChatRequests.filter(r => 
                  r.artistName.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                  r.songTitle.toLowerCase().includes(chatSearchQuery.toLowerCase())
                );
                const activeChatRequest = selectedChatRequestId 
                  ? filteredChatReqs.find(r => r.id === selectedChatRequestId)
                  : (filteredChatReqs.length > 0 ? filteredChatReqs[0] : null);

                return activeChatRequest ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Active Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50/20 shrink-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => setSelectedChatRequestId(null)}
                          className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <img
                          src={activeChatRequest.artistAvatar}
                          alt={activeChatRequest.artistName}
                          className="h-10 w-10 rounded-xl object-cover shrink-0 ring-2 ring-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display text-xs sm:text-sm font-black text-gray-900 truncate">
                            Discussion avec {activeChatRequest.artistName}
                          </h4>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            Campagne : <strong className="text-amber-600">{activeChatRequest.songTitle}</strong> • Forfait : {activeChatRequest.offerTitle}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      <div className="shrink-0">
                        {activeChatRequest.status === 'accepted' && (
                          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                            ⚙️ Active
                          </span>
                        )}
                        {activeChatRequest.status === 'completed' && (
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                            ✓ Terminée
                          </span>
                        )}
                        {activeChatRequest.status === 'pending' && (
                          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-600/10">
                            ⏳ En attente
                          </span>
                        )}
                        {activeChatRequest.status === 'refused' && (
                          <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 ring-1 ring-rose-600/10">
                            ❌ Refusée
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Chat Window Container */}
                    <div className="flex-1 overflow-hidden p-4 bg-gray-50/20">
                      <ChatWindow
                        currentUser={currentUser}
                        recipientName={activeChatRequest.artistName}
                        recipientAvatar={activeChatRequest.artistAvatar}
                        chats={activeChatRequest.chats}
                        onSendMessage={(text) => handleSendChatMessage(activeChatRequest.id, text)}
                        promotionStatus={activeChatRequest.status}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-gray-700">Sélectionnez une discussion</h4>
                    <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                      Commencez à échanger avec les artistes pour caler les programmations d'émissions, les heures de passage sur vos ondes ou finaliser la promotion.
                    </p>
                  </div>
                );
              })()}
            </div>
            
          </div>
        </motion.div>
      )}

      {/* OFFERS MANAGEMENT TAB */}
      {activeSubTab === 'offres' && (
        <motion.div
          key="offres"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          
          {/* List of current offers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-gray-900">Vos forfaits promotionnels configurés ({myOffers.length})</h3>
              <button
                onClick={() => setIsAddingOffer(!isAddingOffer)}
                className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                {isAddingOffer ? 'Annuler' : 'Créer un forfait'}
              </button>
            </div>

            {myOffers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center space-y-3">
                <Radio className="mx-auto h-8 w-8 text-gray-300" />
                <h5 className="font-display text-xs font-bold text-gray-700">Aucune formule configurée</h5>
                <p className="text-[11px] text-gray-400">Configurez vos formules de passage antenne ou publication pour commencer à recevoir des œuvres.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myOffers.map((offer) => (
                  <div key={offer.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3 relative flex flex-col justify-between">
                    <button
                      onClick={() => setOfferToDelete(offer.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-rose-600 p-1 transition-colors duration-150"
                      title="Supprimer cette formule"
                    >
                      <Trash className="h-4 w-4" />
                    </button>

                    <div className="pr-6">
                      <h4 className="font-display text-sm font-bold text-gray-900">{offer.title}</h4>
                      <p className="text-[10px] font-semibold text-amber-600 font-mono mt-0.5">{offer.duration}</p>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {offer.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {offer.channels.map((ch, i) => (
                        <span key={i} className="inline-flex rounded-md bg-[#58001e] px-1.5 py-0.5 text-[9px] font-medium text-white">
                          {ch}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-semibold">Tarif artiste :</span>
                      <span className="font-mono text-sm font-extrabold text-amber-600">{formatFCFA(offer.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to add a new offer */}
          {isAddingOffer && (
            <div className="lg:col-span-1 rounded-2xl border border-amber-100 bg-amber-50/5 p-5 shadow-xs animate-in slide-in-from-right duration-200">
              <h4 className="font-display text-sm font-bold text-gray-900 border-b border-amber-100 pb-3">Créer un nouveau forfait</h4>
              
              <form onSubmit={handleCreateOffer} className="mt-4 space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-xs text-gray-700">Titre du forfait</label>
                  <input
                    type="text"
                    required
                    value={newOfferTitle}
                    onChange={(e) => setNewOfferTitle(e.target.value)}
                    placeholder="Ex: Rotation Heavy (10 jours)"
                    className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700">Tarif du passage (F CFA)</label>
                  <input
                    type="number"
                    min="5000"
                    step="500"
                    required
                    value={newOfferPrice}
                    onChange={(e) => setNewOfferPrice(e.target.value)}
                    placeholder="Min. 5000 FCFA"
                    className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700">Fréquence / Durée</label>
                  <input
                    type="text"
                    required
                    value={newOfferDuration}
                    onChange={(e) => setNewOfferDuration(e.target.value)}
                    placeholder="Ex: 3 passages / jour pendant 1 semaine"
                    className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700">Description détaillée de la prestation</label>
                  <textarea
                    required
                    rows={4}
                    value={newOfferDesc}
                    onChange={(e) => setNewOfferDesc(e.target.value)}
                    placeholder="Expliquez ce que gagne l'artiste (horaires de grande écoute, mention d'animateur, interview, post réseaux...)"
                    className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-700 block mb-1.5">Canaux inclus dans cette formule :</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto border border-gray-100 bg-white rounded-xl p-2.5">
                    {CHANNELS_PRESETS.map((chan) => {
                      const isChecked = newOfferChannels.includes(chan);
                      return (
                        <button
                          key={chan}
                          type="button"
                          onClick={() => toggleOfferChannel(chan)}
                          className={`flex w-full items-center gap-2 rounded-lg p-1.5 text-left text-[10px] transition-colors ${
                            isChecked ? 'bg-amber-50 text-amber-950 font-bold' : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-md border flex items-center justify-center ${isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200'}`}>
                            {isChecked && <Check className="h-2 w-2" />}
                          </span>
                          <span className="truncate">{chan}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-gray-900 py-3 text-xs font-bold text-white hover:bg-black transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Enregistrer la formule
                </button>
              </form>
            </div>
          )}
        </motion.div>
      )}

      {/* PROFILE TAB FOR DIFFUSEUR */}
      {activeSubTab === 'profile' && (
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-purple-900/30 bg-[#130f22] p-6 shadow-xs max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 border-b border-purple-950/40 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Paramètres de diffusion & audience</h3>
              <p className="text-xs text-gray-400">Gérez votre identité d'audience, couverture, et informations de paiement Mobile Money au Bénin</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
            {/* Interactive Profile Photo Camera Capture */}
            <ProfileCameraCapture
              currentAvatar={avatarInput}
              onPhotoCaptured={(dataUrl) => setAvatarInput(dataUrl)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Media Name */}
              <div>
                <label className="text-xs font-bold text-gray-300">Nom du diffuseur public</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Organization Name */}
              <div>
                <label className="text-xs font-bold text-gray-300">Raison Sociale / Entreprise</label>
                <input
                  type="text"
                  value={orgNameInput}
                  onChange={(e) => setOrgNameInput(e.target.value)}
                  placeholder="Ex: Frisson Radio Bénin, Bénin Buzz Agency"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-gray-300">Catégorie de média</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                >
                  <option value="radio">📻 Radio FM béninoise</option>
                  <option value="tv">📺 Chaîne de Télévision</option>
                  <option value="influencer">📱 Page d'Influenceur / Créateur</option>
                  <option value="playlist">🎧 Curateur Playlist Audiomack/Spotify</option>
                  <option value="blogger">💻 Blog culturel & Artistique</option>
                </select>
              </div>

              {/* Avatar Link */}
              <div>
                <label className="text-xs font-bold text-gray-300">Lien Image Logo / Illustration</label>
                <input
                  type="url"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Audience Size */}
              <div>
                <label className="text-xs font-bold text-gray-300">Taille d'Audience certifiée</label>
                <input
                  type="text"
                  value={audienceSizeInput}
                  onChange={(e) => setAudienceSizeInput(e.target.value)}
                  placeholder="Ex: 350K auditeurs journaliers, 50K followers"
                  required
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Coverage Area */}
              <div>
                <label className="text-xs font-bold text-gray-300">Zone de couverture géographique béninoise</label>
                <input
                  type="text"
                  value={audienceLocationInput}
                  onChange={(e) => setAudienceLocationInput(e.target.value)}
                  placeholder="Ex: Cotonou, Abomey-Calavi & Porto-Novo"
                  required
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-300">Présentation du diffuseur (Biographie d'audience)</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Contact phone */}
              <div>
                <label className="text-xs font-bold text-gray-300">Téléphone de contact direct</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* MTN */}
              <div>
                <label className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span> Retrait MTN Mobile Money
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={mtnInput}
                  onChange={(e) => setMtnInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 chiffres (ex: 97102030)"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Moov */}
              <div>
                <label className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Retrait Moov Money
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={moovInput}
                  onChange={(e) => setMoovInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 chiffres (ex: 95808080)"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Celtiis */}
              <div>
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Retrait Celtiis Cash
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={celtiisInput}
                  onChange={(e) => setCeltiisInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 chiffres"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

            </div>

            {/* Profile save feedback */}
            {saveSuccess && (
              <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-2">
                <Check className="h-4 w-4" />
                Vos paramètres diffuseur et d'audience ont été enregistrés avec succès.
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Enregistrer mes configurations diffuseur
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>

      {/* COMPACT MODALS FOR REFUSAL REASON AND SUBMITTING PROOFS */}
      {/* 1. REFUSAL REASON DIALOG */}
      {refusalRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
            <h4 className="font-display text-base font-bold text-gray-900 flex items-center gap-1 text-rose-600">
              <AlertTriangle className="h-5 w-5" /> Refuser la promotion
            </h4>
            <p className="text-xs text-gray-500 mt-1">Conformément aux directives de la plateforme, veuillez indiquer un motif précis de refus pour informer l'artiste. Son portefeuille sera intégralement remboursé.</p>
            
            <form onSubmit={handleConfirmRefusal} className="mt-4 space-y-4">
              <textarea
                required
                rows={4}
                value={refusalReasonText}
                onChange={(e) => setRefusalReasonText(e.target.value)}
                placeholder="Ex: Le morceau n'est pas du style requis pour cette formule de diffusion / Encombrement de grille / Qualité d'enregistrement insuffisante..."
                className="w-full rounded-xl border border-gray-100 p-3 text-xs bg-white focus:border-amber-500 focus:outline-hidden"
              />
              
              <div className="flex gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRefusalRequestId(null)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-white hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Confirmer le refus & rembourser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PROOF SUBMISSION DIALOG */}
      {proofRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
            <h4 className="font-display text-base font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle className="h-5 w-5" /> Valider la prestation de promotion
            </h4>
            <p className="text-xs text-gray-400 mt-1">Soumettez les preuves matérielles obligatoires pour prouver la réalisation de votre passage antenne ou publication. Vos gains sécurisés seront versés instantanément.</p>
            
            <form onSubmit={handleConfirmProof} className="mt-4 space-y-4 text-xs font-semibold">
              <div>
                <label className="text-gray-700">Calendrier de diffusion effectif (Horaires de passage)</label>
                <input
                  type="text"
                  required
                  value={proofScheduleText}
                  onChange={(e) => setProofScheduleText(e.target.value)}
                  placeholder="Ex: Diffusé du 10 au 15 Juillet à 14h20, 18h15 et 21h05"
                  className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-gray-700">Lien web d'écoute / Preuve matérielle (Audio, Photo, Post)</label>
                <input
                  type="url"
                  required
                  value={proofLinkText}
                  onChange={(e) => setProofLinkText(e.target.value)}
                  placeholder="Ex: https://facebook.com/frissonradio/posts/12345"
                  className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs font-mono focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-gray-700">Libellé descriptif du justificatif</label>
                <input
                  type="text"
                  required
                  value={proofLabelText}
                  onChange={(e) => setProofLabelText(e.target.value)}
                  placeholder="Ex: Enregistrement audio du passage antenne, Grille de diffusion PDF..."
                  className="mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-100 text-[10px] text-amber-950 font-medium flex gap-2">
                <Info className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                <p>Note : Une retenue réglementaire de 10% est appliquée au montant de la prestation comme commission de fonctionnement du site web.</p>
              </div>

              <div className="flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setProofRequestId(null)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Soumettre les justificatifs & encaisser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CUSTOM OFFER DELETION CONFIRMATION DIALOG */}
      {offerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-gray-950">
                  Confirmer la suppression
                </h4>
                <p className="text-[10px] text-gray-400 font-medium">Action irréversible</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-600 leading-relaxed font-medium">
              Êtes-vous sûr de vouloir supprimer la formule promotionnelle{" "}
              <strong className="text-gray-900">
                "{offers.find(o => o.id === offerToDelete)?.title || 'ce forfait'}"
              </strong>{" "}
              ? Cette action effacera définitivement cette offre et les artistes ne pourront plus y souscrire.
            </p>

            {offers.find(o => o.id === offerToDelete) && (() => {
              const selectedOffer = offers.find(o => o.id === offerToDelete)!;
              return (
                <div className="mt-3.5 bg-gray-50 border border-gray-100 rounded-xl p-3 text-[11px] space-y-1 text-gray-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Tarif :</span>
                    <span className="font-mono text-gray-900">{formatFCFA(selectedOffer.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée :</span>
                    <span className="text-gray-900">{selectedOffer.duration}</span>
                  </div>
                </div>
              );
            })()}

            <div className="mt-5 flex gap-2 font-bold text-xs">
              <button
                type="button"
                onClick={() => setOfferToDelete(null)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOffer(offerToDelete)}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
