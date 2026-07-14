/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, PromoteurOffer, PromotionRequest, Transaction, RoleType } from '../types';
import { CITIES_BENIN, MUSIC_GENRES } from '../data';
import { saveAudioFile } from '../lib/audioStorage';
import PromoteurCard from './PromoteurCard';
import ChatWindow from './ChatWindow';
import ProfileCameraCapture from './ProfileCameraCapture';
import AudioWaveformAnalyzer from './AudioWaveformAnalyzer';
import {
  Search,
  Filter,
  ShoppingCart,
  Music,
  UploadCloud,
  FileAudio,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  MessageSquare,
  FileText,
  User as UserIcon,
  Save,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  Sliders,
  Calendar,
  Star,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface ReviewFormProps {
  request: PromotionRequest;
  onSaveReview: (reqId: string, rating: number, comment: string) => void;
}

function ReviewForm({ request, onSaveReview }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (request.review) {
    return (
      <div className="bg-amber-50/10 border border-amber-100 rounded-xl p-4 mt-3">
        <h5 className="font-display text-xs font-bold text-gray-900 flex items-center gap-1.5">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          Votre évaluation de la prestation
        </h5>
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= request.review!.rating
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-gray-200'
              }`}
            />
          ))}
          <span className="ml-1.5 text-[11px] font-bold text-gray-700">
            {request.review.rating}/5
          </span>
          <span className="text-[10px] text-gray-400 font-medium ml-auto">
            Publié le {new Date(request.review.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2.5 bg-white p-3 rounded-lg border border-gray-100 leading-relaxed italic">
          "{request.review.comment}"
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Veuillez rédiger un commentaire avant de soumettre.');
      return;
    }
    setError('');
    onSaveReview(request.id, rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-4 mt-3 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
        <div>
          <h5 className="font-display text-xs font-bold text-gray-900">Évaluez le promoteur : {request.promoteurName}</h5>
          <p className="text-[10px] text-gray-400">Une fois la prestation terminée, donnez votre avis pour guider la communauté.</p>
        </div>
        <Star className="h-4 w-4 text-amber-400" />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Votre note (Étoiles)</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 -ml-1 transition-transform hover:scale-110 cursor-pointer"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= (hoverRating !== null ? hoverRating : rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 font-display text-xs font-black text-amber-600">
            {rating === 5 && 'Excellent ! ⭐⭐⭐⭐⭐'}
            {rating === 4 && 'Très bon ⭐⭐⭐⭐'}
            {rating === 3 && 'Correct ⭐⭐⭐'}
            {rating === 2 && 'Moyen ⭐整'}
            {rating === 1 && 'Décevant ⭐'}
          </span>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Votre avis textuel</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Décrivez comment s'est déroulée la promotion. La programmation a-t-elle été respectée ? La communication était-elle fluide ?"
          className="w-full rounded-xl border border-gray-100 p-3 text-xs bg-gray-50/30 focus:border-amber-500 focus:bg-white focus:outline-hidden"
        />
      </div>

      {error && (
        <p className="text-[10px] font-bold text-rose-600">{error}</p>
      )}

      <button
        type="submit"
        className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors shadow-sm cursor-pointer animate-in fade-in duration-200"
      >
        Soumettre mon avis
      </button>
    </form>
  );
}

interface ArtistDashboardProps {
  currentUser: User;
  users: User[];
  offers: PromoteurOffer[];
  requests: PromotionRequest[];
  transactions: Transaction[];
  onUpdateCurrentUser: (user: User) => void;
  onAddRequest: (req: PromotionRequest) => void;
  onUpdateRequestChats: (requestId: string, chats: any[]) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
  onAddTransaction: (tx: Transaction) => void;
  onOpenDepositModal: () => void;
  onUpdateRequests: (reqs: PromotionRequest[]) => void;
  isOnline?: boolean;
  isSimulatingOffline?: boolean;
  onToggleSimulateOffline?: () => void;
  lastSyncTime?: string;
  onManualSync?: () => void;
}

const artistFaqs = [
  {
    id: 1,
    question: "Comment fonctionne le dépôt pour lancer une promotion ?",
    answer: "Lorsque vous choisissez un promoteur et son forfait sur le catalogue, vous remplissez les détails de votre œuvre (titre, genre, lien) et validez la commande. Le montant de la promotion est alors débité de votre portefeuille et placé sur notre compte séquestre sécurisé. Le promoteur dispose de 48 heures pour accepter ou refuser votre demande."
  },
  {
    id: 2,
    question: "Quelle est la garantie de remboursement en cas de refus ou d'absence de réponse ?",
    answer: "Bénin Music Promo garantit la sécurité absolue de vos fonds. Si un promoteur refuse votre demande (ex: style musical non adapté) ou s'il ne valide pas la demande dans les 48 heures imparties, l'annulation est automatique. Votre portefeuille est alors recrédité à 100% du montant engagé, instantanément et sans aucun frais de dossier."
  },
  {
    id: 3,
    question: "Comment puis-je suivre l'avancement de ma promotion ?",
    answer: "Dans votre onglet \"Suivi des demandes\", vous pouvez suivre l'état en temps réel de chaque campagne. Une fois la promotion acceptée, le promoteur a l'obligation de télécharger des preuves matérielles de diffusion (photos, captures d'écran de la console, liens d'écoute, etc.) avant de pouvoir récupérer le paiement."
  },
  {
    id: 4,
    question: "Comment puis-je recharger mon portefeuille Bénin Music Promo ?",
    answer: "Vous pouvez recharger votre solde à tout moment en cliquant sur l'icône de portefeuille dans l'en-tête de l'application. Les dépôts se font de manière instantanée et sécurisée via Mobile Money béninois (MTN MoMo, Moov Money, Celtiis Cash)."
  },
  {
    id: 5,
    question: "Que se passe-t-il si un promoteur ne fournit pas les preuves attendues ?",
    answer: "Le promoteur s'engage à respecter les canaux définis dans son forfait (radio, club, playlist, etc.). S'il ne fournit pas les preuves requises dans les délais impartis ou si la promotion n'est pas conforme, vous pouvez initier un litige auprès de notre support technique. Les fonds restent bloqués en séquestre jusqu'à la résolution du litige."
  },
  {
    id: 6,
    question: "Y a-t-il des frais cachés lors des transactions ?",
    answer: "Aucun frais caché. Les tarifs indiqués par les promoteurs sur leurs forfaits sont nets de taxes et correspondent exactement au montant débité de votre solde. Bénin Music Promo ne prélève aucun frais supplémentaire sur les dépôts des artistes ou sur les remboursements en cas de refus."
  }
];

export default function ArtistDashboard({
  currentUser,
  users,
  offers,
  requests,
  transactions,
  onUpdateCurrentUser,
  onAddRequest,
  onUpdateRequestChats,
  onUpdateUserBalance,
  onAddTransaction,
  onOpenDepositModal,
  onUpdateRequests,
  isOnline = true,
  isSimulatingOffline = false,
  onToggleSimulateOffline = () => {},
  lastSyncTime = '',
  onManualSync = () => {}
}: ArtistDashboardProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'campaigns' | 'profile' | 'faq'>('catalog');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // Onboarding Guided Tour State
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  const tourSteps = [
    {
      title: "Bienvenue sur Bénin Music Promo ! 🇧🇯✨",
      text: "Ce guide interactif rapide va vous accompagner pas-à-pas pour soumettre votre premier morceau national aux promoteurs en toute sécurité grâce à notre système de compte séquestre.",
      id: null,
      tab: "catalog" as const
    },
    {
      title: "1. Statut Réseau & Résilience 📶",
      text: "La connexion internet est instable au Bénin ? Pas de soucis ! Notre widget vous indique en temps réel votre statut de connexion. En cas de coupure temporaire, vos demandes de promotion sont mémorisées localement dans votre cache et transmises automatiquement dès que vous êtes reconnecté.",
      id: "step-cache",
      tab: "catalog" as const
    },
    {
      title: "2. Les Filtres du Catalogue 🎯",
      text: "Trouvez le promoteur idéal en filtrant notre catalogue d'un clic par type de média (Radios FM béninoises, Playlists, Pages culturelles), par zone d'audience (Cotonou, Parakou...) et selon votre budget.",
      id: "step-filters",
      tab: "catalog" as const
    },
    {
      title: "3. Le Panier de Commande & Dépôt 🎵",
      text: "C'est ici que vous préparez votre campagne. Glissez-déposez votre chanson originale au format MP3, déterminez le titre officiel de l'œuvre et le style musical. Votre dépôt d'argent reste bloqué de manière 100% sécurisée en compte séquestre.",
      id: "step-cart",
      tab: "catalog" as const
    },
    {
      title: "4. Le Catalogue des Forfaits 📻",
      text: "Explorez la liste des promoteurs disponibles au Bénin. Choisissez l'offre qui vous convient (passage radio, story, post influenceur), ajoutez-la à votre panier et soumettez-la en toute simplicité.",
      id: "step-promoters",
      tab: "catalog" as const
    },
    {
      title: "5. Le Suivi des Demandes en Direct 📋",
      text: "Une fois la commande payée, suivez son avancement en temps réel ici. Vous pourrez échanger avec le promoteur via le chat intégré, et valider la prestation uniquement après réception de preuves concrètes de diffusion (reçu de console radio, lien d'écoute, capture d'écran, etc.).",
      id: "step-campaigns-btn",
      tab: "catalog" as const
    }
  ];

  // Auto-start onboarding guide for new artists
  React.useEffect(() => {
    const hasSeenTour = localStorage.getItem('bmp_onboarding_seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setOnboardingStep(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Smooth scroll to the target element on step change
  React.useEffect(() => {
    if (onboardingStep !== null) {
      const currentStep = tourSteps[onboardingStep];
      if (currentStep) {
        // Change tab if needed to make sure element exists
        if (currentStep.tab !== activeSubTab) {
          setActiveSubTab(currentStep.tab);
        }
        
        const stepId = currentStep.id;
        if (stepId) {
          // Add a tiny timeout to let React switch tab before scrolling
          setTimeout(() => {
            const element = document.getElementById(stepId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    }
  }, [onboardingStep]);

  // Helper class for high-contrast pulsing highlight of target elements
  const getHighlightClass = (id: string) => {
    if (onboardingStep !== null && tourSteps[onboardingStep]?.id === id) {
      return "ring-4 ring-amber-500 ring-offset-4 ring-offset-[#0d0a19] scale-[1.01] transition-all duration-300 z-50 shadow-2xl shadow-amber-500/20";
    }
    return "";
  };

  // Offline requests queue
  const [offlineQueue, setOfflineQueue] = useState<PromotionRequest[]>(() => {
    try {
      const saved = localStorage.getItem('bmp_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    if (!isOnline) {
      alert("Impossible de synchroniser la file d'attente hors-ligne tant que vous êtes hors-connexion.");
      return;
    }

    const queueTotal = offlineQueue.reduce((acc, req) => acc + req.price, 0);
    if (currentUser.walletBalance < queueTotal) {
      alert(`Solde insuffisant pour synchroniser vos commandes hors-ligne. Rechargement requis de ${formatFCFA(queueTotal - currentUser.walletBalance)}.`);
      return;
    }

    let currentBalance = currentUser.walletBalance;

    offlineQueue.forEach((req) => {
      currentBalance -= req.price;
      
      const realId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      const realReq: PromotionRequest = {
        ...req,
        id: realId,
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };
      
      onAddRequest(realReq);

      const newTx: Transaction = {
        id: `TX-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: 'artiste',
        type: 'payment',
        amount: req.price,
        paymentMethod: 'wallet',
        status: 'success',
        description: `Paiement prestation "${req.offerTitle}" à ${req.promoteurName} (Synchronisé depuis le cache local)`,
        createdAt: new Date().toISOString()
      };
      onAddTransaction(newTx);
    });

    onUpdateUserBalance(currentUser.id, currentBalance);
    setOfflineQueue([]);
    localStorage.removeItem('bmp_offline_queue');

    alert(`Félicitations ! Vos ${offlineQueue.length} demandes de promotion sauvegardées hors-ligne ont été synchronisées et transmises avec succès.`);
  };

  // Profile Settings States
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [phoneInput, setPhoneInput] = useState(currentUser.phoneNumber || '');
  const [mtnInput, setMtnInput] = useState(currentUser.mtnNumber || '');
  const [moovInput, setMoovInput] = useState(currentUser.moovNumber || '');
  const [celtiisInput, setCeltiisInput] = useState(currentUser.celtiisNumber || '');
  const [avatarInput, setAvatarInput] = useState(currentUser.avatar);
  const [spotifyInput, setSpotifyInput] = useState(currentUser.spotifyUrl || '');
  const [audiomackInput, setAudiomackInput] = useState(currentUser.audiomackUrl || '');
  const [appleMusicInput, setAppleMusicInput] = useState(currentUser.appleMusicUrl || '');
  const [youtubeInput, setYoutubeInput] = useState(currentUser.youtubeUrl || '');
  const [deezerInput, setDeezerInput] = useState(currentUser.deezerUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize profile states when current user changes
  React.useEffect(() => {
    setNameInput(currentUser.name);
    setBioInput(currentUser.bio || '');
    setPhoneInput(currentUser.phoneNumber || '');
    setMtnInput(currentUser.mtnNumber || '');
    setMoovInput(currentUser.moovNumber || '');
    setCeltiisInput(currentUser.celtiisNumber || '');
    setAvatarInput(currentUser.avatar);
    setSpotifyInput(currentUser.spotifyUrl || '');
    setAudiomackInput(currentUser.audiomackUrl || '');
    setAppleMusicInput(currentUser.appleMusicUrl || '');
    setYoutubeInput(currentUser.youtubeUrl || '');
    setDeezerInput(currentUser.deezerUrl || '');
  }, [currentUser]);

  // Directory Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(120000);

  // Cart / Prestation Selection States
  const [selectedCartOffers, setSelectedCartOffers] = useState<{ offer: PromoteurOffer; promoteur: User }[]>([]);
  
  // Song Submission States
  const [songTitle, setSongTitle] = useState('');
  const [songGenre, setSongGenre] = useState(MUSIC_GENRES[0]);
  const [audioFile, setAudioFile] = useState<{ name: string; size: string; url: string } | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Campaign Detail expanded state
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Toggle checkout payment warning
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Retrieve promoters only
  const promoteurs = users.filter((u) => u.role === 'promoteur');

  // Filter Promoteurs based on Search, Category, City, Price
  const filteredPromoteurs = promoteurs.filter((promo) => {
    // Search query matches name or organization
    const matchesSearch =
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Matches category
    const matchesCategory = selectedCategory === 'all' || promo.promoteurCategory === selectedCategory;

    // Matches location city
    const matchesCity = selectedCity === 'all' || (promo.audienceLocation || '').includes(selectedCity);

    // Offers within price range
    const promoOffers = offers.filter((o) => o.promoteurId === promo.id);
    const hasOfferInBudget = promoOffers.length === 0 || promoOffers.some((o) => o.price <= maxPrice);

    return matchesSearch && matchesCategory && matchesCity && hasOfferInBudget;
  });

  // Calculate cart total
  const cartTotal = selectedCartOffers.reduce((sum, item) => sum + item.offer.price, 0);

  // Handle offer selection toggle
  const handleSelectOffer = (offer: PromoteurOffer, promoteur: User) => {
    const isAlreadySelected = selectedCartOffers.some((item) => item.offer.id === offer.id);
    if (isAlreadySelected) {
      setSelectedCartOffers(selectedCartOffers.filter((item) => item.offer.id !== offer.id));
    } else {
      setSelectedCartOffers([...selectedCartOffers, { offer, promoteur }]);
    }
  };

  // Simulate audio upload
  const handleAudioDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRawFile(file);
      const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' Mo';
      const fakeUrl = URL.createObjectURL(file);
      setAudioFile({
        name: file.name,
        size: fileSize,
        url: fakeUrl
      });
      // Auto-set title if empty
      if (!songTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setSongTitle(cleanName);
      }
    }
  };

  // Play/Pause Preview
  const togglePlayPreview = () => {
    if (!audioRef.current && audioFile?.url) {
      audioRef.current = new Audio(audioFile.url);
      audioRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (audioRef.current) {
      if (isPlayingPreview) {
        audioRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        audioRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  // Handle Checkout / Payment
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (selectedCartOffers.length === 0) {
      setCheckoutError('Votre panier est vide. Veuillez sélectionner au moins une prestation.');
      return;
    }

    if (!audioFile) {
      setCheckoutError('Veuillez téléverser votre fichier audio musical à promouvoir.');
      return;
    }

    if (!songTitle.trim()) {
      setCheckoutError('Veuillez spécifier le titre de l\'œuvre musicale.');
      return;
    }

    // If offline, save to local queue
    if (!isOnline) {
      const queuedRequests: PromotionRequest[] = selectedCartOffers.map((item) => {
        const simulatedReqId = `REQ-OFF-${Math.floor(100000 + Math.random() * 900000)}`;
        if (rawFile) {
          saveAudioFile(simulatedReqId, rawFile).catch((err) => {
            console.error("Failed to save offline audio file to IndexedDB:", err);
          });
        }
        return {
          id: simulatedReqId,
          artistId: currentUser.id,
          artistName: currentUser.name,
          artistAvatar: currentUser.avatar,
          songTitle: songTitle,
          songGenre: songGenre,
          audioName: audioFile.name,
          audioSize: audioFile.size,
          audioUrl: audioFile.url,
          promoteurId: item.promoteur.id,
          promoteurName: item.promoteur.name,
          promoteurOrganization: item.promoteur.organizationName,
          offerId: item.offer.id,
          offerTitle: item.offer.title,
          price: item.offer.price,
          status: 'pending',
          createdAt: new Date().toISOString(),
          chats: [],
          lastUpdate: new Date().toISOString()
        };
      });

      const updatedQueue = [...offlineQueue, ...queuedRequests];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('bmp_offline_queue', JSON.stringify(updatedQueue));

      setSelectedCartOffers([]);
      setSongTitle('');
      setAudioFile(null);
      setRawFile(null);

      alert(`📶 Mode Hors-ligne : Vos ${queuedRequests.length} demandes de promotion ont été mémorisées localement. Elles apparaîtront dans votre file d'attente hors-ligne ci-contre et pourront être transmises dès le rétablissement de votre connexion.`);
      return;
    }

    if (currentUser.walletBalance < cartTotal) {
      setCheckoutError(`Solde insuffisant dans votre portefeuille. Rechargement requis : ${formatFCFA(cartTotal - currentUser.walletBalance)}.`);
      return;
    }

    // Process Purchase
    const newBalance = currentUser.walletBalance - cartTotal;
    
    // 1. Deduct Artist Wallet Balance
    onUpdateUserBalance(currentUser.id, newBalance);

    // 2. Log Artist Payment Transactions for each offer
    selectedCartOffers.forEach((item) => {
      const simulatedReqId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      
      if (rawFile) {
        saveAudioFile(simulatedReqId, rawFile).catch((err) => {
          console.error("Failed to save audio file to IndexedDB:", err);
        });
      }

      const newRequest: PromotionRequest = {
        id: simulatedReqId,
        artistId: currentUser.id,
        artistName: currentUser.name,
        artistAvatar: currentUser.avatar,
        songTitle: songTitle,
        songGenre: songGenre,
        audioName: audioFile.name,
        audioSize: audioFile.size,
        audioUrl: audioFile.url,
        promoteurId: item.promoteur.id,
        promoteurName: item.promoteur.name,
        promoteurOrganization: item.promoteur.organizationName,
        offerId: item.offer.id,
        offerTitle: item.offer.title,
        price: item.offer.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
        chats: [],
        lastUpdate: new Date().toISOString()
      };

      // Create Request
      onAddRequest(newRequest);

      // Log Transaction for Artist
      const newTx: Transaction = {
        id: `TX-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: 'artiste',
        type: 'payment',
        amount: item.offer.price,
        paymentMethod: 'wallet',
        status: 'success',
        description: `Paiement prestation "${item.offer.title}" à ${item.promoteur.name}`,
        createdAt: new Date().toISOString()
      };
      onAddTransaction(newTx);
    });

    // Clear state
    setSelectedCartOffers([]);
    setSongTitle('');
    setAudioFile(null);
    setRawFile(null);
    setIsPlayingPreview(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Success redirect
    setActiveSubTab('campaigns');
    alert('Félicitations ! Vos demandes de promotion ont été soumises avec succès aux promoteurs.');
  };

  // Save profile settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name: nameInput,
      bio: bioInput,
      phoneNumber: phoneInput,
      mtnNumber: mtnInput,
      moovNumber: moovInput,
      celtiisNumber: celtiisInput,
      avatar: avatarInput,
      spotifyUrl: spotifyInput,
      audiomackUrl: audiomackInput,
      appleMusicUrl: appleMusicInput,
      youtubeUrl: youtubeInput,
      deezerUrl: deezerInput
    };
    onUpdateCurrentUser(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Send message simulation inside campaign
  const handleSendChatMessage = (reqId: string, text: string) => {
    const request = requests.find((r) => r.id === reqId);
    if (!request) return;

    // Create current user message
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'artiste' as RoleType,
      text: text,
      timestamp: new Date().toISOString()
    };

    const updatedChats = [...request.chats, newMsg];
    onUpdateRequestChats(reqId, updatedChats);

    // Simulate Promoteur Interactive response after 1.5 seconds!
    setTimeout(() => {
      const triggerPhrase = text.toLowerCase();
      let responseText = "Merci pour votre message ! Notre équipe de programmation l'analyse et vous répond très prochainement.";

      if (triggerPhrase.includes('bonjour') || triggerPhrase.includes('salut')) {
        responseText = `Bonjour ${currentUser.name} ! C'est un réel plaisir d'échanger avec toi. Ton titre "${request.songTitle}" est une pure pépite !`;
      } else if (triggerPhrase.includes('diffusion') || triggerPhrase.includes('heure') || triggerPhrase.includes('passage')) {
        responseText = "Nous préparons la grille de diffusion de cette semaine. Le calendrier complet sera bientôt publié sur ton espace.";
      } else if (triggerPhrase.includes('merci') || triggerPhrase.includes('génial')) {
        responseText = "C'est nous qui te remercions de faire confiance à nos canaux de promotion. Force à toi ! 🇧🇯✊";
      }

      const promoterMsg = {
        id: `msg-sim-${Date.now()}`,
        senderId: request.promoteurId,
        senderName: request.promoteurName,
        senderRole: 'promoteur' as RoleType,
        text: responseText,
        timestamp: new Date().toISOString()
      };

      onUpdateRequestChats(reqId, [...updatedChats, promoterMsg]);
    }, 1500);
  };

  const handleSaveReview = (reqId: string, rating: number, comment: string) => {
    const updatedList = requests.map((req) => {
      if (req.id === reqId) {
        return {
          ...req,
          review: {
            rating,
            comment,
            createdAt: new Date().toISOString()
          },
          lastUpdate: new Date().toISOString()
        };
      }
      return req;
    });
    onUpdateRequests(updatedList);
  };

  // Format currency helper
  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(val).replace('XOF', 'F CFA');
  };

  // Filter specific requests
  const myRequests = requests.filter((r) => r.artistId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-gray-100 bg-white p-1.5 sm:p-2 rounded-2xl shadow-xs overflow-x-auto scrollbar-none flex-nowrap justify-start gap-1.5 sm:gap-2 max-w-full">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'catalog'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'catalog' && (
            <motion.div
              layoutId="activeArtistSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Catalogue Promoteurs</span>
          <span className="inline sm:hidden">Catalogue</span>
        </button>

        <button
          id="step-campaigns-btn"
          onClick={() => setActiveSubTab('campaigns')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${getHighlightClass('step-campaigns-btn')} ${
            activeSubTab === 'campaigns'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'campaigns' && (
            <motion.div
              layoutId="activeArtistSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Music className="h-4 w-4 shrink-0" />
          <div className="relative flex items-center">
            <span className="hidden sm:inline">Suivi des demandes</span>
            <span className="inline sm:hidden">Suivi</span>
            {myRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="absolute -top-2.5 -right-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-1 ring-white/10 shadow-xs">
                {myRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </div>
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
              layoutId="activeArtistSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <UserIcon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Mon Profil Artiste</span>
          <span className="inline sm:hidden">Profil</span>
        </button>

        <button
          onClick={() => setActiveSubTab('faq')}
          className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'faq'
              ? 'text-white z-10'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {activeSubTab === 'faq' && (
            <motion.div
              layoutId="activeArtistSubTab"
              className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/15 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Questions Fréquentes</span>
          <span className="inline sm:hidden">FAQ</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* CATALOG / DIRECTORY TAB */}
        {activeSubTab === 'catalog' && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 w-full max-w-full overflow-x-hidden"
          >
            {/* Full-width Search Bar */}
            <div className="rounded-2xl border border-gray-100 bg-white p-3 sm:p-4.5 shadow-xs flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Rechercher une radio FM béninoise, un influenceur, un promoteur média ou un style musical..."
                  className="w-full rounded-xl border border-gray-100 bg-gray-50/30 p-3 pl-11 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:outline-hidden transition-all duration-200 font-medium shadow-xs"
                />
                <Search className="absolute top-3.5 left-4 h-4.5 w-4.5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Filters & Cart (Left Side) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Connection Status & Caching Widget */}
            <div id="step-cache" className={`rounded-2xl border border-purple-950/20 bg-[#130f22]/50 p-4 shadow-md backdrop-blur-xs text-white transition-all duration-300 ${getHighlightClass('step-cache')}`}>
              <div className="flex items-center justify-between border-b border-purple-950/20 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5 animate-pulse" />}
                  </div>
                  <span className="text-xs font-bold text-gray-200">
                    {isOnline ? 'Connexion en ligne' : 'Perte temporaire de connexion'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleSimulateOffline}
                  className={`rounded-lg px-2 py-1 text-[9px] font-bold border transition-colors cursor-pointer ${
                    isSimulatingOffline 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isSimulatingOffline ? 'Rétablir En Ligne' : 'Simuler Panne'}
                </button>
              </div>

              <div className="space-y-2 text-[10px] text-gray-400">
                <p className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Mise en cache locale :</span>
                  </span>
                  <span className="font-bold text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded-md">Actif ({offers.length} offres)</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Dernière synchro :</span>
                  </span>
                  <span className="font-bold text-gray-300">{lastSyncTime || "Récemment"}</span>
                </p>
              </div>

              {isOnline && (
                <button
                  type="button"
                  onClick={onManualSync}
                  className="mt-3.5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Actualiser la cache locale
                </button>
              )}
            </div>

            {/* Offline Queue Card */}
            {offlineQueue.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-white shadow-md">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      File d'attente hors-ligne ({offlineQueue.length})
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded-md uppercase">En attente</span>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto pr-1 mb-3.5">
                  {offlineQueue.map((item) => (
                    <div key={item.id} className="flex justify-between items-center rounded-xl bg-white/5 p-2 text-[10px]">
                      <div className="truncate pr-2">
                        <p className="font-bold text-gray-200 truncate">{item.songTitle}</p>
                        <p className="text-[9px] text-gray-400 truncate">{item.offerTitle} • {item.promoteurName}</p>
                      </div>
                      <span className="font-mono text-amber-400 shrink-0 font-bold">{formatFCFA(item.price)}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSyncOfflineQueue}
                  disabled={!isOnline}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isOnline 
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/15 cursor-pointer' 
                      : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed opacity-50'
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isOnline ? 'animate-pulse' : ''}`} />
                  {isOnline ? 'Transmettre les commandes' : 'Reconnexion requise pour envoyer'}
                </button>
              </div>
            )}

            {/* Filters Box */}
            <div id="step-filters" className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-300 ${getHighlightClass('step-filters')}`}>
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h4 className="font-display text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-500" />
                  Filtrer le catalogue
                </h4>
                {(selectedCategory !== 'all' || selectedCity !== 'all' || searchQuery || maxPrice < 120000) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedCity('all');
                      setSearchQuery('');
                      setMaxPrice(120000);
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:underline"
                  >
                    Effacer
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-4">
                {/* Categories */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type de promoteur</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-100 p-2.5 text-xs bg-white focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="all">Tous les types (Radios, Influenceurs, Playlists...)</option>
                    <option value="radio">📻 Radios FM béninoises</option>
                    <option value="influencer">📱 Influenceurs & Médias Sociaux</option>
                    <option value="playlist">🎧 Playlists Spotify / Audiomack</option>
                    <option value="blogger">💻 Blogueurs & Pages culturelles</option>
                  </select>
                </div>

                {/* Cities */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zone de diffusion / Audience</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-100 p-2.5 text-xs bg-white focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="all">Tout le Bénin 🇧🇯</option>
                    {CITIES_BENIN.map((c) => (
                      <option key={c} value={c}>📍 {c}</option>
                    ))}
                  </select>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                    <span>Budget Maximum</span>
                    <span className="font-mono text-amber-600">{formatFCFA(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={120000}
                    step={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="mt-2 w-full accent-amber-500 h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Shopping Cart & Song Submission Block */}
            <div id="step-cart" className={`rounded-2xl border border-purple-950/20 bg-[#130f22]/50 p-5 shadow-md backdrop-blur-xs text-white transition-all duration-300 ${getHighlightClass('step-cart')}`}>
              <h4 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-purple-950/20 pb-3">
                <ShoppingCart className="h-4.5 w-4.5 text-amber-500" />
                Commande de promotion ({selectedCartOffers.length})
              </h4>

              <form onSubmit={handleCheckoutSubmit} className="mt-4 space-y-4">
                
                {/* Prestation selection feedback */}
                {selectedCartOffers.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-purple-950/30 bg-[#0d0a19]/50 p-4 text-center">
                    <p className="text-xs text-gray-400 font-medium">Sélectionnez une ou plusieurs offres de promoteurs dans le catalogue à droite.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedCartOffers.map((item) => {
                      const isCartPromoVerified = (() => {
                        const getSeniorityMonths = (createdAtStr?: string) => {
                          if (!createdAtStr) return 0;
                          const createdDate = new Date(createdAtStr);
                          const currentDate = new Date();
                          const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
                          const diffDays = diffTime / (1000 * 60 * 60 * 24);
                          return diffDays / 30.41;
                        };
                        const seniorityMonths = getSeniorityMonths(item.promoteur.createdAt);
                        const completedPrestations = requests.filter(
                          (r) => r.promoteurId === item.promoteur.id && r.status === 'completed'
                        ).length;
                        return seniorityMonths > 3 || completedPrestations >= 10;
                      })();
                      return (
                        <div key={item.offer.id} className="flex justify-between items-center rounded-xl border border-purple-950/20 bg-[#0d0a19] p-2.5 text-xs">
                          <div className="overflow-hidden pr-2">
                            <p className="font-bold text-white line-clamp-1">{item.offer.title}</p>
                            <p className="text-[10px] text-gray-400 truncate flex items-center gap-1.5">
                              <span>{item.promoteur.name}</span>
                              {isCartPromoVerified && (
                                <span className="text-[8px] bg-blue-500/10 px-1 rounded-full text-blue-400 font-bold border border-blue-500/10" title="Vérifié">Vérifié</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono font-bold text-amber-400">{formatFCFA(item.offer.price)}</span>
                            <button
                              type="button"
                              onClick={() => handleSelectOffer(item.offer, item.promoteur)}
                              className="text-gray-400 hover:text-rose-500 font-extrabold px-1 text-base cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Submited Content Inputs */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Dépôt du titre audio</label>
                  {audioFile ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileAudio className="h-7 w-7 text-emerald-400 shrink-0" />
                          <div className="overflow-hidden">
                            <p className="font-bold text-white truncate leading-snug">{audioFile.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium">{audioFile.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioFile(null);
                            setIsPlayingPreview(false);
                            if (audioRef.current) {
                              audioRef.current.pause();
                              audioRef.current = null;
                            }
                          }}
                          className="rounded-lg p-1 hover:bg-white/5 text-rose-400 font-bold text-[11px]"
                        >
                          Retirer
                        </button>
                      </div>

                      {/* Preview Player */}
                      <div className="flex items-center gap-2 bg-[#0d0a19] rounded-lg p-1.5 border border-purple-950/20">
                        <button
                          type="button"
                          onClick={togglePlayPreview}
                          className="h-7 w-7 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          {isPlayingPreview ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                        </button>
                        <span className="text-[9px] font-mono font-bold text-emerald-400">Écouter la maquette (Simulateur)</span>
                      </div>

                      {/* D3 Audio Frequency & Waveform Analyzer */}
                      <AudioWaveformAnalyzer
                        audioRef={audioRef}
                        isPlaying={isPlayingPreview}
                        audioFileUrl={audioFile.url}
                        songTitle={songTitle}
                      />
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-purple-950/30 rounded-xl hover:border-amber-500/50 transition-colors p-4 text-center cursor-pointer bg-[#0d0a19]/50">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioDrop}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="mx-auto h-7 w-7 text-gray-400" />
                      <p className="text-xs font-bold text-gray-200 mt-1.5">Glissez-déposez votre MP3</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Fichier audio sécurisé (Max 50 Mo)</p>
                    </div>
                  )}
                </div>

                {/* Song Title details */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Titre Officiel du morceau</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    required
                    placeholder="Ex: Gbakoti Remix, Le Feu au Corps"
                    className="w-full rounded-xl border border-purple-950/40 bg-[#0d0a19] text-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Genre Selector */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Rythme / Genre musical</label>
                  <select
                    value={songGenre}
                    onChange={(e) => setSongGenre(e.target.value)}
                    className="w-full rounded-xl border border-purple-950/40 bg-[#0d0a19] text-white p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                  >
                    {MUSIC_GENRES.map((g) => (
                      <option key={g} value={g} className="bg-[#130f22] text-white">{g}</option>
                    ))}
                  </select>
                </div>

                {/* Cost Calculation row */}
                <div className="border-t border-purple-950/20 pt-3 space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-gray-400">
                    <span>Total Prestations :</span>
                    <span className="font-mono text-white">{formatFCFA(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Frais de dossier :</span>
                    <span className="font-mono text-emerald-400">Gratuit (0 FCFA)</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-950/20 pt-2 font-display text-sm font-extrabold text-white">
                    <span>Montant Net à Payer :</span>
                    <span className="font-mono text-amber-400">{formatFCFA(cartTotal)}</span>
                  </div>
                </div>

                {/* Error/Notice Display */}
                {checkoutError && (
                  <div className="rounded-xl bg-rose-500/10 p-3 border border-rose-500/20 text-[10px] text-rose-300 font-bold flex gap-1.5 items-start">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <div>
                      <p>{checkoutError}</p>
                      {currentUser.walletBalance < cartTotal && (
                        <button
                          type="button"
                          onClick={onOpenDepositModal}
                          className="mt-1 text-amber-400 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                        >
                          Recharger via Mobile Money maintenant ➔
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Pay */}
                <button
                  type="submit"
                  disabled={selectedCartOffers.length === 0}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 py-3 text-xs font-bold text-white hover:from-amber-600 hover:to-rose-600 transition-all disabled:bg-white/5 disabled:from-none disabled:to-none disabled:text-gray-500 disabled:border disabled:border-white/5 disabled:cursor-not-allowed shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Valider & Payer la promotion ({formatFCFA(cartTotal)})
                </button>
              </form>
            </div>

          </div>

          {/* Promoters Directory Feed (Middle & Right) */}
          <div id="step-promoters" className={`lg:col-span-2 space-y-4 transition-all duration-300 ${getHighlightClass('step-promoters')}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-gray-900">
                Promoteurs musicaux disponibles au Bénin ({filteredPromoteurs.length})
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">Prix d'appel de 10 000 F CFA</span>
            </div>

            {filteredPromoteurs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center space-y-3">
                <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 animate-pulse" />
                <h5 className="font-display text-sm font-bold text-gray-800">Aucun promoteur ne correspond</h5>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">Essayez d'élargir votre recherche, de modifier votre zone d'audience ou d'ajuster votre budget maximum.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPromoteurs.map((promo) => {
                  const promoOffers = offers.filter((o) => o.promoteurId === promo.id);
                  return (
                    <PromoteurCard
                      key={promo.id}
                      promoteur={promo}
                      offers={promoOffers}
                      requests={requests}
                      onSelectOffer={handleSelectOffer}
                      selectedOfferIds={selectedCartOffers.map((item) => item.offer.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          </div>
        </motion.div>
      )}

      {/* CAMPAIGNS TRACKER TAB */}
      {activeSubTab === 'campaigns' && (
        <motion.div
          key="campaigns"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 w-full max-w-full overflow-x-hidden"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-gray-900">Suivi en direct de vos campagnes de promotion ({myRequests.length})</h3>
            <div className="flex gap-2 text-[10px] font-semibold">
              <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-700 ring-1 ring-amber-600/10">
                ⏳ {myRequests.filter((r) => r.status === 'pending').length} En attente
              </span>
              <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-indigo-700 ring-1 ring-indigo-600/10">
                ✅ {myRequests.filter((r) => r.status === 'accepted' || r.status === 'completed').length} Validées
              </span>
            </div>
          </div>

          {myRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center max-w-xl mx-auto space-y-4">
              <Music className="mx-auto h-12 w-12 text-gray-300 animate-bounce" />
              <h5 className="font-display text-sm font-bold text-gray-800">Aucun projet musical soumis</h5>
              <p className="text-xs text-gray-400 max-w-md mx-auto">Parcourez le catalogue des promoteurs, ajoutez des forfaits à votre panier, déposez votre chanson et initiez la diffusion sur les radios nationales.</p>
              <button
                onClick={() => setActiveSubTab('catalog')}
                className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors shadow-md"
              >
                Explorer le catalogue maintenant
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Campaigns list */}
              <div className="lg:col-span-2 space-y-3">
                {myRequests
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((req) => {
                    const isExpanded = expandedRequestId === req.id;
                    return (
                      <div
                        key={req.id}
                        className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                          isExpanded ? 'border-amber-400 shadow-md' : 'border-gray-100 shadow-xs hover:border-gray-200'
                        }`}
                      >
                        {/* Summary Header bar */}
                        <div
                          onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                          className="flex flex-wrap items-center justify-between p-4 gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                              <Music className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-display text-sm font-bold text-gray-900 leading-snug">{req.songTitle}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                                <span>Promoteur:</span>
                                <strong className="text-gray-700">{req.promoteurName}</strong>
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
                                <span>• {req.offerTitle}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-auto sm:ml-0">
                            <span className="font-mono text-xs font-bold text-gray-500">{formatFCFA(req.price)}</span>
                            
                            {/* Badges for status */}
                            {req.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/10">
                                <Clock className="h-3 w-3 shrink-0" />
                                ⏳ En attente
                              </span>
                            )}
                            {req.status === 'accepted' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                                <CheckCircle className="h-3 w-3 shrink-0" />
                                ✅ Acceptée
                              </span>
                            )}
                            {req.status === 'refused' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700 ring-1 ring-rose-600/10">
                                <XCircle className="h-3 w-3 shrink-0" />
                                ❌ Refusée & Remboursée
                              </span>
                            )}
                            {req.status === 'completed' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/10 animate-pulse">
                                <CheckCircle className="h-3 w-3 shrink-0" />
                                🎉 Terminée (Justifié)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expanded details panel */}
                        {isExpanded && (
                          <div className="border-t border-gray-50 bg-gray-50/20 p-4 space-y-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Left Panel: Request Info */}
                              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Détails de l'œuvre</p>
                                <div className="space-y-1.5 font-medium">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Titre :</span>
                                    <span className="text-gray-800 font-bold">{req.songTitle}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Genre :</span>
                                    <span className="text-gray-700">{req.songGenre}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Fichier :</span>
                                    <span className="text-gray-600 font-mono truncate">{req.audioName} ({req.audioSize})</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Date d'envoi :</span>
                                    <span className="text-gray-600">{new Date(req.createdAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Panel: Preuve de diffusion ou Motif */}
                              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                                {req.status === 'refused' && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                                      <XCircle className="h-4 w-4" />
                                      Motif du Refus de promotion
                                    </div>
                                    <p className="text-xs text-rose-800 leading-relaxed bg-rose-50/50 p-3 rounded-lg border border-rose-100/30">
                                      {req.refusalReason || 'Le promoteur n\'a pas spécifié de motif particulier.'}
                                    </p>
                                    <div className="text-[10px] font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                                      <Check className="h-3.5 w-3.5" />
                                      Remboursement automatique : {formatFCFA(req.price)} crédité sur votre portefeuille.
                                    </div>
                                  </div>
                                )}

                                {req.status === 'pending' && (
                                  <div className="space-y-2 py-2 text-center text-gray-500">
                                    <Clock className="mx-auto h-6 w-6 text-amber-500 animate-spin" />
                                    <p className="font-bold text-gray-700 text-xs mt-1">En attente de traitement</p>
                                    <p className="text-[10px] leading-relaxed px-4">Le promoteur dispose d'un délai maximal de 48h pour accepter ou refuser votre prestation. Passé ce délai, vous serez intégralement remboursé.</p>
                                  </div>
                                )}

                                {req.status === 'accepted' && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                                      <CheckCircle className="h-4 w-4" />
                                      Demande acceptée !
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                      Le promoteur a validé votre morceau et planifie actuellement sa promotion. Vous pouvez discuter en privé avec lui via l'onglet à droite.
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 p-2.5 rounded-lg">
                                      <Info className="h-4.5 w-4.5 shrink-0" />
                                      Prestation en cours de réalisation. Les justificatifs seront fournis ici.
                                    </div>
                                  </div>
                                )}

                                {req.status === 'completed' && (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                                      <CheckCircle className="h-4 w-4" />
                                      Justificatifs de diffusion
                                    </div>
                                    
                                    <div className="space-y-2">
                                      {req.scheduleText && (
                                        <div className="flex gap-2 bg-gray-50 p-2.5 rounded-lg">
                                          <Calendar className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Calendrier de passage</p>
                                            <p className="text-[11px] font-semibold text-gray-700 mt-0.5">{req.scheduleText}</p>
                                          </div>
                                        </div>
                                      )}

                                      {req.proofLink && (
                                        <div className="flex gap-2 bg-gray-50 p-2.5 rounded-lg">
                                          <FileText className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                          <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Preuve de passage</p>
                                            <p className="text-[11px] text-gray-700 mt-0.5 truncate">{req.proofLabel || 'Lien d\'écoute ou d\'enregistrement'}</p>
                                            <a
                                              href={req.proofLink}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[10px] text-amber-600 hover:underline inline-flex items-center gap-1 font-bold mt-1.5"
                                            >
                                              Consulter la preuve <ExternalLink className="h-3 w-3" />
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Évaluation de la prestation (Avis & Notes) */}
                            {req.status === 'completed' && (
                              <ReviewForm request={req} onSaveReview={handleSaveReview} />
                            )}

                            {/* Chat direct et privé (accepted or completed only) */}
                            {(req.status === 'accepted' || req.status === 'completed') && (
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Espace de discussion avec le promoteur</p>
                                <ChatWindow
                                  currentUser={currentUser}
                                  recipientName={req.promoteurName}
                                  recipientAvatar="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&h=150&fit=crop"
                                  chats={req.chats}
                                  onSendMessage={(txt) => handleSendChatMessage(req.id, txt)}
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

              {/* Informative Side Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
                  <h4 className="font-display text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <Info className="h-4.5 w-4.5 text-amber-500" />
                    Règles d'or de promotion
                  </h4>
                  <ul className="space-y-3 text-[11px] text-gray-500 font-medium leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                      <span><strong>Remboursement garanti :</strong> Si le promoteur refuse votre morceau (ex: inadéquation avec son style), votre portefeuille est re-crédité instantanément de 100% de la somme sans aucun frais.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                      <span><strong>Délai maximal de réponse :</strong> Le promoteur dispose de <strong>48 heures</strong> pour traiter votre œuvre musicale. Sans réponse, l'annulation est automatique.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                      <span><strong>Suivi rigoureux :</strong> Les promoteurs ont l'obligation de fournir des preuves matérielles de diffusion (photos, liens audio, calendriers de passage précis).</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/10 p-5 shadow-xs space-y-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h5 className="font-display text-xs font-bold text-emerald-950">Fonds sécurisés (Tiers de confiance)</h5>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">Bénin Music Promo agit comme un séquestre. Le paiement ne sera versé au promoteur qu'après réalisation complète de la promotion musicale et validation de ses justificatifs.</p>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      )}

      {/* PROFILE SETTINGS TAB */}
      {activeSubTab === 'profile' && (
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-purple-900/30 bg-[#130f22] p-4 sm:p-6 shadow-xs max-w-3xl mx-auto w-full max-w-full overflow-x-hidden"
        >
          <div className="flex items-center gap-3 border-b border-purple-950/40 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Mon profil artistique</h3>
              <p className="text-xs text-gray-400">Gérez vos informations publiques et vos contacts Mobile Money au Bénin</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
            {/* Interactive Profile Photo Camera Capture */}
            <ProfileCameraCapture
              currentAvatar={avatarInput}
              onPhotoCaptured={(dataUrl) => setAvatarInput(dataUrl)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Profile Name */}
              <div>
                <label className="text-xs font-bold text-gray-300">Nom d'Artiste / Groupe</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="text-xs font-bold text-gray-300">Lien Photo de Profil (Avatar)</label>
                <input
                  type="url"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Bio description */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-300">Présentation Artistique (Biographie)</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={3}
                  placeholder="Décrivez votre univers musical, vos influences, vos projets récents..."
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="text-xs font-bold text-gray-300">Téléphone de Contact Principal</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Ex: +229 97 00 11 22"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* MTN MoMo */}
              <div>
                <label className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span> Numéro MTN Mobile Money
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={mtnInput}
                  onChange={(e) => setMtnInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 97001122 (8 chiffres)"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Moov Money */}
              <div>
                <label className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Numéro Moov Money
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={moovInput}
                  onChange={(e) => setMoovInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 95001122 (8 chiffres)"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Celtiis Cash */}
              <div>
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Numéro Celtiis Cash
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={celtiisInput}
                  onChange={(e) => setCeltiisInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 61001122 (8 chiffres)"
                  className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs font-mono bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

            </div>

            {/* Section Discographie */}
            <div className="border-t border-purple-950/40 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Music className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white font-sans">Discographie & Plateformes de Streaming</h4>
                  <p className="text-[11px] text-gray-400">Ajoutez les liens vers vos morceaux ou profils sur les plateformes pour que les promoteurs puissent vous écouter.</p>
                </div>
              </div>

              {/* Aperçu des liens de streaming configurés */}
              <div className="flex flex-wrap gap-2.5 py-1">
                {spotifyInput && (
                  <a
                    href={spotifyInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Spotify
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {audiomackInput && (
                  <a
                    href={audiomackInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[11px] font-bold text-amber-400 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Audiomack
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {appleMusicInput && (
                  <a
                    href={appleMusicInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-[11px] font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    Apple Music
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {youtubeInput && (
                  <a
                    href={youtubeInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[11px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    YouTube
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {deezerInput && (
                  <a
                    href={deezerInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 text-[11px] font-bold text-sky-400 hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                    Deezer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {!spotifyInput && !audiomackInput && !appleMusicInput && !youtubeInput && !deezerInput && (
                  <p className="text-[10px] text-gray-500 italic">Aucun lien de streaming configuré pour le moment.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spotify */}
                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    🟢 Lien Profil / Titre Spotify
                  </label>
                  <input
                    type="url"
                    value={spotifyInput}
                    onChange={(e) => setSpotifyInput(e.target.value)}
                    placeholder="https://open.spotify.com/artist/..."
                    className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden font-mono"
                  />
                </div>

                {/* Audiomack */}
                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    🟠 Lien Profil / Titre Audiomack
                  </label>
                  <input
                    type="url"
                    value={audiomackInput}
                    onChange={(e) => setAudiomackInput(e.target.value)}
                    placeholder="https://audiomack.com/..."
                    className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden font-mono"
                  />
                </div>

                {/* Apple Music */}
                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    🔴 Lien Profil / Titre Apple Music
                  </label>
                  <input
                    type="url"
                    value={appleMusicInput}
                    onChange={(e) => setAppleMusicInput(e.target.value)}
                    placeholder="https://music.apple.com/..."
                    className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden font-mono"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    🔺 Lien Chaîne / Clip YouTube
                  </label>
                  <input
                    type="url"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden font-mono"
                  />
                </div>

                {/* Deezer */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    🔷 Lien Profil / Titre Deezer
                  </label>
                  <input
                    type="url"
                    value={deezerInput}
                    onChange={(e) => setDeezerInput(e.target.value)}
                    placeholder="https://www.deezer.com/..."
                    className="mt-1.5 w-full rounded-xl border border-purple-950/40 p-3 text-xs bg-[#0d0a19] text-white focus:border-rose-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Save success message */}
            {saveSuccess && (
              <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-2">
                <Check className="h-4 w-4" />
                Vos modifications de profil artistique ont été enregistrées avec succès.
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Enregistrer mes modifications de profil
            </button>
          </form>
        </motion.div>
      )}

      {activeSubTab === 'faq' && (
        <motion.div
          key="faq"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="space-y-6 w-full max-w-full overflow-x-hidden"
        >
          {/* Hero Banner for FAQ */}
          <div className="rounded-3xl border border-purple-900/30 bg-gradient-to-r from-[#110c26] to-[#181236] p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-rose-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-500/20">
                  <ShieldCheck className="h-3 w-3" /> Garantie de Confiance
                </span>
                <h3 className="font-display text-xl font-black text-white">Centre d'Aide & Foire Aux Questions</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Chez Bénin Music Promo, la sécurité de vos investissements artistiques est notre priorité absolue. Découvrez comment fonctionne le compte séquestre, le processus d'annulation automatique sous 48h, et l'accompagnement de nos équipes.
                </p>
              </div>
              
              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onOpenDepositModal}
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-4 py-2.5 text-xs font-bold text-white hover:from-rose-600 hover:to-fuchsia-700 transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" /> Recharger mon compte
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex gap-3.5 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-xs text-gray-900">100% Séquestre Sécurisé</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  Vos fonds restent bloqués en séquestre et ne sont transférés au promoteur qu'après confirmation des preuves de diffusion.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex gap-3.5 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                <RefreshCw className="h-5 w-5 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-xs text-gray-900">Remboursement Automatique</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  En cas de refus du promoteur ou de non-réponse sous 48h, vous êtes instantanément recrédité sans aucun frais.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex gap-3.5 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-xs text-gray-900">Preuves Matérielles de Diffusion</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  Le promoteur doit soumettre des photos, captures ou liens audio/vidéo validant le travail avant d'être payé.
                </p>
              </div>
            </div>
          </div>

          {/* Main FAQ Accordion */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              <h3 className="font-display text-base font-bold text-gray-900">Foire Aux Questions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artistFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-white hover:border-gray-200 hover:shadow-xs transition-all cursor-pointer select-none"
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-sans font-bold text-xs text-gray-900 leading-snug">
                        {faq.question}
                      </h4>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                        aria-label={isExpanded ? "Réduire" : "Développer"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4.5 w-4.5 text-amber-500" />
                        ) : (
                          <ChevronDown className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium border-t border-gray-200/60 pt-3">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Call to action or Support Contact info */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-sans font-bold text-xs text-gray-900">Besoin d'une assistance personnalisée ?</h4>
                <p className="text-[10px] text-gray-500 font-medium">Notre service client béninois répond à toutes vos questions par WhatsApp ou téléphone.</p>
              </div>
            </div>
            <a 
              href="https://wa.me/22997000000" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 transition-colors cursor-pointer text-center w-full sm:w-auto"
            >
              Contacter le Support
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* SECTION QUESTIONS FRÉQUENTES */}
    <div id="faq-section-artist" className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-gray-900">Questions Fréquentes (FAQ Artistes)</h3>
          <p className="text-xs text-gray-500">Tout savoir sur le processus de dépôt, la sécurité de vos fonds et les garanties de remboursement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artistFaqs.map((faq) => {
          const isExpanded = expandedFaqId === faq.id;
          return (
            <div 
              key={faq.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer select-none"
              onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-sans font-semibold text-xs text-gray-900 leading-snug">
                  {faq.question}
                </h4>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                  aria-label={isExpanded ? "Réduire" : "Développer"}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4.5 w-4.5 text-amber-500" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden rounded-xl p-3.5 mt-3 border border-white/5"
                    style={{ backgroundColor: '#000000' }}
                  >
                    <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>

    {/* Floating help / restart onboarding button */}
    {onboardingStep === null && (
      <button
        onClick={() => setOnboardingStep(0)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#130f22]/90 hover:bg-amber-500 hover:text-white text-amber-400 font-bold text-xs px-4 py-3 rounded-xl border border-amber-500/30 shadow-lg shadow-black/20 hover:scale-105 transition-all cursor-pointer group"
        title="Besoin d'aide ? Recommencer la visite guidée"
      >
        <span className="flex h-2 w-2 rounded-full bg-amber-500 group-hover:bg-white animate-pulse"></span>
        💡 Guide Onboarding
      </button>
    )}

    {/* Onboarding tour overlay */}
    <AnimatePresence>
      {onboardingStep !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md rounded-2xl border border-purple-950/40 bg-[#130f22] text-white p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Top ambient lights */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

            <div className="space-y-4">
              {/* Header with step indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                  💡 Guide Artiste • Étape {onboardingStep + 1} / {tourSteps.length}
                </span>
                <button
                  onClick={() => {
                    setOnboardingStep(null);
                    localStorage.setItem('bmp_onboarding_seen', 'true');
                  }}
                  className="text-gray-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Passer ✕
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h4 className="font-display text-base font-bold text-white leading-snug font-sans">
                  {tourSteps[onboardingStep].title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {tourSteps[onboardingStep].text}
                </p>
              </div>

              {/* Step indicators dots */}
              <div className="flex items-center gap-1 py-1">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setOnboardingStep(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === onboardingStep ? 'w-5 bg-amber-500' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation actions */}
              <div className="flex items-center justify-between pt-2 border-t border-purple-950/40">
                <button
                  disabled={onboardingStep === 0}
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Précédent
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOnboardingStep(null);
                      localStorage.setItem('bmp_onboarding_seen', 'true');
                    }}
                    className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    Quitter
                  </button>
                  
                  <button
                    onClick={() => {
                      if (onboardingStep < tourSteps.length - 1) {
                        setOnboardingStep(onboardingStep + 1);
                      } else {
                        setOnboardingStep(null);
                        localStorage.setItem('bmp_onboarding_seen', 'true');
                      }
                    }}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2 text-xs font-bold text-white hover:from-amber-600 hover:to-rose-600 transition-all shadow-md shadow-amber-500/10"
                  >
                    {onboardingStep === tourSteps.length - 1 ? "Terminer 🚀" : "Suivant"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    </div>
  );
}
