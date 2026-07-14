/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, PromoteurOffer, PromotionRequest, Transaction, PlatformConfig } from './types';

export const CITIES_BENIN = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
  'Ouidah',
  'Abomey',
  'Bohicon',
  'Djougou',
  'Natitingou',
  'Allada'
];

export const MUSIC_GENRES = [
  'Afropop / Afrobeat',
  'Rap / Hip-Hop Béninois',
  'Gospel / Cantique',
  'Zinli / Tchinkoumey (Traditionnel)',
  'Gangan / Highlife',
  'Coupé-Décalé / Zouglou',
  'R&B / Soul'
];

export const CHANNELS_PRESETS = [
  'Antenne Radio (Passage Direct)',
  'Interview Live (Studio)',
  'Publication Page Facebook (Premium)',
  'Story & Vidéo TikTok',
  'Intégration Playlist Spotify/Audiomack',
  'Article de Blog & Partage WhatsApp'
];

export const INITIAL_CONFIG: PlatformConfig = {
  commissionRate: 10, // 10%
  autoRefundHours: 48,
  enabledChannels: CHANNELS_PRESETS,
  
  // Visibility default values
  hideHeroArtiste: false,
  hideHeroPromoteur: false,
  hideHeroAdmin: false,
  
  // Hero Section Default Configs
  heroBadge: "BENIN MUSIC PROMO",
  heroImage: "/src/assets/images/futuristic_benin_musician_cyberpunk_1783899360091.jpg",
  heroImageBadgeLeft: "VIBES CYBER BÉNIN",
  heroImageBadgeRight: "SÉQUESTRE SÉCURISÉ",
  heroBoxCategory: "RÉVOLUTION AUDIO BÉNIN",
  heroBoxTitle: "À PROPOS DU REGISTRE",
  heroBoxDesc: "Sécurité financière et transparence de diffusion totale.",
  
  // Artiste
  heroTitleArtisteRegular: "La Nouvelle Ère de la",
  heroTitleArtisteHighlight: "Promo Digitale",
  heroDescArtiste: "Propulsez vos singles vers le sommet des charts béninois. Sélectionnez les radios et diffuseurs leaders, transmettez vos morceaux en toute sécurité et profitez d'une garantie de diffusion séquestre absolue : preuve authentifiée ou remboursement immédiat.",
  heroBtnArtiste: "Lancer une Campagne",

  // Promoteur
  heroTitlePromoteurRegular: "Monétisez Vos",
  heroTitlePromoteurHighlight: "Ondes en Direct",
  heroDescPromoteur: "Mettez vos ondes à profit. Validez l'écoute de morceaux de talentueux artistes béninois, diffusez-les sur vos canaux officiels, uploadez vos rapports médias et touchez instantanément vos fonds.",
  heroBtnPromoteur: "Gérer mes Forfaits",

  // Admin
  heroTitleAdminRegular: "Registre Média",
  heroTitleAdminHighlight: "Décentralisé",
  heroDescAdmin: "Régulez le marché de la diffusion musicale au Bénin. Examinez les transactions, certifiez le KYC des diffuseurs, résolvez les litiges et analysez les commissions en temps réel.",
  heroBtnAdmin: "Vérifier le Réseau",

  // Mobile Money API Config Defaults
  mtnMerchantId: "MTN-BJ-7762",
  mtnSecretKey: "momo_sec_live_bj_88291a823fbc0",
  mtnSandbox: true,

  moovMerchantId: "MOOV-BJ-4412",
  moovSecretKey: "moov_sec_live_bj_33829dc771ea0",
  moovSandbox: true,

  celtiisMerchantId: "CELTIIS-BJ-1002",
  celtiisSecretKey: "celtiis_sec_live_bj_11209eb998df2",
  celtiisSandbox: true
};

export const INITIAL_USERS: User[] = [
  // ARTISTES
  {
    id: 'art-1',
    email: 'artiste@gmail.com',
    name: 'Sessimè Officiel',
    role: 'artiste',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Artiste chanteuse compositrice béninoise, reine de la musique Afro-pop & Traditionnelle au Bénin. Fière de mes racines ! 🇧🇯✨',
    phoneNumber: '+229 97 00 11 22',
    walletBalance: 75000, // 75,000 FCFA
    mtnNumber: '97001122',
    moovNumber: '95001122',
    verified: true,
    spotifyUrl: 'https://open.spotify.com/artist/5661Z26mU8X8xR8B7O9fS6',
    audiomackUrl: 'https://audiomack.com/sessime-officiel',
    youtubeUrl: 'https://youtube.com/c/Sessim%C3%A8Officiel',
    appleMusicUrl: 'https://music.apple.com/bj/artist/sessim%C3%A8/893645842',
    deezerUrl: 'https://www.deezer.com/artist/6249580'
  },
  {
    id: 'art-2',
    email: 'fanicko@gmail.com',
    name: 'Fanicko de Jésus',
    role: 'artiste',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Artiste béninois engagé. "Le feu au corps", promotion de la culture béninoise à l\'international. Dieu est au contrôle.',
    phoneNumber: '+229 96 44 55 66',
    walletBalance: 120000,
    mtnNumber: '96445566',
    verified: true,
    spotifyUrl: 'https://open.spotify.com/artist/23o9aM8aX7S6Y8b7O9fS6',
    audiomackUrl: 'https://audiomack.com/fanicko',
    youtubeUrl: 'https://youtube.com/c/FanickodeJesus',
    appleMusicUrl: 'https://music.apple.com/bj/artist/fanicko/103945842',
    deezerUrl: 'https://www.deezer.com/artist/8949580'
  },

  // PROMOTEURS
  {
    id: 'promo-1',
    email: 'frisson@gmail.com',
    name: 'Frisson Radio 95.1 FM',
    role: 'promoteur',
    avatar: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=150&h=150&fit=crop',
    bio: 'La radio la plus branchée de Cotonou. Nous diffusons le meilleur de la musique béninoise et africaine. Grande audience de jeunes et d\'adultes actifs.',
    phoneNumber: '+229 97 10 20 30',
    walletBalance: 135000,
    mtnNumber: '97102030',
    organizationName: 'Frisson Radio Bénin',
    promoteurCategory: 'radio',
    audienceSize: '350K auditeurs journaliers',
    audienceLocation: 'Cotonou, Abomey-Calavi & Porto-Novo',
    verified: true,
    createdAt: '2025-10-15T08:00:00-07:00'
  },
  {
    id: 'promo-2',
    email: 'beninbuzz@gmail.com',
    name: 'Bénin Buzz (Média & Influence)',
    role: 'promoteur',
    avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&h=150&fit=crop',
    bio: 'Média digital leader au Bénin. Plus de 250 000 abonnés sur Facebook et TikTok. Nous rendons vos morceaux viraux en un temps record.',
    phoneNumber: '+229 95 80 80 80',
    walletBalance: 45000,
    moovNumber: '95808080',
    organizationName: 'Bénin Buzz Agency',
    promoteurCategory: 'influencer',
    audienceSize: '250K+ abonnés cumulés',
    audienceLocation: 'Tout le Bénin et Diaspora',
    verified: true,
    createdAt: '2026-01-01T08:00:00-07:00'
  },
  {
    id: 'promo-3',
    email: 'cappfm@gmail.com',
    name: 'Capp FM 99.6 - La Voix des Jeunes',
    role: 'promoteur',
    avatar: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=150&h=150&fit=crop',
    bio: 'Radio communautaire pionnière basée à Cotonou. Promotion de la culture, de la jeunesse et de la musique traditionnelle béninoise (Tchinkoumey, Zinli).',
    phoneNumber: '+229 61 22 33 44',
    walletBalance: 0,
    celtiisNumber: '61223344',
    organizationName: 'Capp FM S.A.',
    promoteurCategory: 'radio',
    audienceSize: '150K auditeurs',
    audienceLocation: 'Cotonou, Porto-Novo, Ouidah',
    verified: true,
    createdAt: '2026-06-20T08:00:00-07:00'
  },
  {
    id: 'promo-4',
    email: 'curateur@gmail.com',
    name: 'DJ Kiff - Curateur Audiomack & Spotify',
    role: 'promoteur',
    avatar: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=150&h=150&fit=crop',
    bio: 'Créateur de la playlist officielle "Bénin Vibes" sur Spotify et Audiomack. Plus de 35 000 écoutes mensuelles.',
    phoneNumber: '+229 97 88 99 00',
    walletBalance: 18000,
    mtnNumber: '97889900',
    organizationName: 'Bénin Playlists Hub',
    promoteurCategory: 'playlist',
    audienceSize: '40K abonnés actifs',
    audienceLocation: 'Bénin et Afrique de l\'Ouest',
    verified: false, // En attente d'approbation administrative
    createdAt: '2026-07-05T08:00:00-07:00'
  },

  // ADMINISTRATEUR
  {
    id: 'admin-1',
    email: 'admin@gmail.com',
    name: 'Direction Bénin Music Promo',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    walletBalance: 42000, // Plateforme commission vault (10% slice)
    phoneNumber: '+229 21 30 40 50',
    verified: true
  }
];

export const INITIAL_OFFERS: PromoteurOffer[] = [
  // Offres de Frisson Radio
  {
    id: 'off-1',
    promoteurId: 'promo-1',
    title: 'Pack Découverte Antenne',
    price: 25000, // 25,000 FCFA
    description: 'Diffusion de votre morceau 2 fois par jour pendant 5 jours (principalement dans l\'émission du soir). Mention spéciale de l\'animateur.',
    channels: ['Antenne Radio (Passage Direct)'],
    duration: '2 passages / jour pendant 5 jours'
  },
  {
    id: 'off-2',
    promoteurId: 'promo-1',
    title: 'Pack Rotation Heavy',
    price: 60000, // 60,000 FCFA
    description: 'Votre morceau entre dans notre "Playlist A". Diffusion garantie 4 fois par jour pendant 10 jours, incluant les tranches de grande écoute (matinale et fin d\'après-midi).',
    channels: ['Antenne Radio (Passage Direct)'],
    duration: '4 passages / jour pendant 10 jours'
  },
  {
    id: 'off-3',
    promoteurId: 'promo-1',
    title: 'Pack Interview & Live Studio',
    price: 100000, // 100,000 FCFA
    description: 'Une interview de 20 minutes en direct dans notre émission phare de promotion culturelle, diffusion du morceau en live et séance photo avec l\'équipe partagée sur nos réseaux sociaux.',
    channels: ['Antenne Radio (Passage Direct)', 'Interview Live (Studio)', 'Publication Page Facebook (Premium)'],
    duration: 'Session unique de 20 min'
  },

  // Offres de Bénin Buzz
  {
    id: 'off-4',
    promoteurId: 'promo-2',
    title: 'Relais Réseaux Sociaux standard',
    price: 15000,
    description: 'Une publication de présentation de votre clip ou morceau sur notre page Facebook (200k+ abonnés) avec un lien direct d\'écoute.',
    channels: ['Publication Page Facebook (Premium)'],
    duration: 'Publication permanente'
  },
  {
    id: 'off-5',
    promoteurId: 'promo-2',
    title: 'Challenge Viral TikTok & Réels',
    price: 45000,
    description: 'Mise en avant de votre morceau par 2 créateurs de contenu partenaires béninois dans des vidéos courtes et amusantes de 15 secondes pour lancer une tendance.',
    channels: ['Story & Vidéo TikTok', 'Publication Page Facebook (Premium)'],
    duration: 'Campagne de 7 jours'
  },

  // Offres de Capp FM
  {
    id: 'off-6',
    promoteurId: 'promo-3',
    title: 'Promotion Spéciale Rythmes du Terroir',
    price: 20000,
    description: 'Idéal pour la musique traditionnelle ou d\'inspiration traditionnelle béninoise. Diffusion 3 fois par jour pendant 1 semaine dans nos créneaux dédiés aux rythmes locaux.',
    channels: ['Antenne Radio (Passage Direct)'],
    duration: '3 passages / jour pendant 7 jours'
  },

  // Offres de DJ Kiff
  {
    id: 'off-7',
    promoteurId: 'promo-4',
    title: 'Playlist Placement Premium',
    price: 10000,
    description: 'Placement en top 5 de notre playlist Audiomack "Bénin Vibes" pendant 14 jours. Partage de la playlist dans nos groupes WhatsApp de fans de musique.',
    channels: ['Intégration Playlist Spotify/Audiomack', 'Article de Blog & Partage WhatsApp'],
    duration: '14 jours garantis'
  }
];

export const INITIAL_REQUESTS: PromotionRequest[] = [
  {
    id: 'req-1',
    artistId: 'art-1',
    artistName: 'Sessimè Officiel',
    artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    songTitle: 'Gbakoti (Remix)',
    songGenre: 'Afropop / Afrobeat',
    audioName: 'sessime_gbakoti_remix_master.mp3',
    audioSize: '8.4 Mo',
    audioDuration: '3:42',
    promoteurId: 'promo-1',
    promoteurName: 'Frisson Radio 95.1 FM',
    promoteurOrganization: 'Frisson Radio Bénin',
    offerId: 'off-2',
    offerTitle: 'Pack Rotation Heavy',
    price: 60000,
    status: 'completed',
    createdAt: '2026-07-08T09:15:00-07:00',
    replyDate: '2026-07-09T11:00:00-07:00',
    scheduleText: 'Diffusé 4 fois par jour sur 95.1 FM (Cotonou). Principalement à 08h20, 12h15, 16h40 et 20h15.',
    proofLink: 'https://www.frissonradio.bj/diffusions/sessime-gbakoti-july',
    proofType: 'link',
    proofLabel: 'Fiche de diffusion Frisson FM',
    review: {
      rating: 5,
      comment: "Superbe promotion ! Le calendrier de diffusion a été respecté au pied de la lettre. Frisson FM est au top pour lancer un hit au Bénin. 🇧🇯📻",
      createdAt: '2026-07-10T15:00:00-07:00'
    },
    chats: [
      {
        id: 'msg-1',
        senderId: 'art-1',
        senderName: 'Sessimè Officiel',
        senderRole: 'artiste',
        text: 'Bonjour l\'équipe de Frisson FM ! J\'ai soumis mon tout nouveau remix. J\'espère qu\'il plaira à vos auditeurs.',
        timestamp: '2026-07-08T09:20:00-07:00'
      },
      {
        id: 'msg-2',
        senderId: 'promo-1',
        senderName: 'Frisson Radio 95.1 FM',
        senderRole: 'promoteur',
        text: 'Bonjour Sessimè ! C\'est validé avec grand plaisir. Le titre est ultra lourd et correspond parfaitement à notre programmation. La rotation démarre dès demain matin.',
        timestamp: '2026-07-09T11:05:00-07:00'
      },
      {
        id: 'msg-3',
        senderId: 'art-1',
        senderName: 'Sessimè Officiel',
        senderRole: 'artiste',
        text: 'Génial ! Merci infiniment pour votre efficacité ! Que du bonheur.',
        timestamp: '2026-07-09T11:30:00-07:00'
      }
    ],
    lastUpdate: '2026-07-11T18:00:00-07:00'
  },
  {
    id: 'req-2',
    artistId: 'art-1',
    artistName: 'Sessimè Officiel',
    artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    songTitle: 'Gbakoti (Remix)',
    songGenre: 'Afropop / Afrobeat',
    audioName: 'sessime_gbakoti_remix_master.mp3',
    audioSize: '8.4 Mo',
    audioDuration: '3:42',
    promoteurId: 'promo-2',
    promoteurName: 'Bénin Buzz (Média & Influence)',
    promoteurOrganization: 'Bénin Buzz Agency',
    offerId: 'off-5',
    offerTitle: 'Challenge Viral TikTok & Réels',
    price: 45000,
    status: 'accepted',
    createdAt: '2026-07-10T14:30:00-07:00',
    replyDate: '2026-07-11T09:00:00-07:00',
    chats: [
      {
        id: 'msg-4',
        senderId: 'promo-2',
        senderName: 'Bénin Buzz (Média & Influence)',
        senderRole: 'promoteur',
        text: 'Bonjour Sessimè. Demande acceptée ! Nous avons sélectionné deux de nos meilleurs influenceurs TikTok béninois pour créer les vidéos avec ton son. Elles seront publiées ce soir.',
        timestamp: '2026-07-11T09:05:00-07:00'
      }
    ],
    lastUpdate: '2026-07-11T09:05:00-07:00'
  },
  {
    id: 'req-3',
    artistId: 'art-2',
    artistName: 'Fanicko de Jésus',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    songTitle: 'Je t\'aime encore',
    songGenre: 'R&B / Soul',
    audioName: 'fanicko_je_taime_encore.wav',
    audioSize: '32.1 Mo',
    audioDuration: '3:15',
    promoteurId: 'promo-1',
    promoteurName: 'Frisson Radio 95.1 FM',
    promoteurOrganization: 'Frisson Radio Bénin',
    offerId: 'off-3',
    offerTitle: 'Pack Interview & Live Studio',
    price: 100000,
    status: 'pending',
    createdAt: '2026-07-11T20:10:00-07:00',
    chats: [],
    lastUpdate: '2026-07-11T20:10:00-07:00'
  },
  {
    id: 'req-4',
    artistId: 'art-2',
    artistName: 'Fanicko de Jésus',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    songTitle: 'Ambiance Béninoise',
    songGenre: 'Coupé-Décalé / Zouglou',
    audioName: 'fanicko_ambiance_benin.mp3',
    audioSize: '7.8 Mo',
    audioDuration: '3:05',
    promoteurId: 'promo-3',
    promoteurName: 'Capp FM 99.6 - La Voix des Jeunes',
    promoteurOrganization: 'Capp FM S.A.',
    offerId: 'off-6',
    offerTitle: 'Promotion Spéciale Rythmes du Terroir',
    price: 20000,
    status: 'refused',
    createdAt: '2026-07-10T11:00:00-07:00',
    replyDate: '2026-07-10T16:45:00-07:00',
    refusalReason: 'Ce morceau est du genre Coupé-Décalé moderne, alors que ce forfait promotionnel est exclusivement réservé à la musique d\'inspiration traditionnelle béninoise (Zinli, Tchinkoumey, etc.). Veuillez postuler avec un morceau traditionnel ou choisir un autre forfait.',
    chats: [],
    lastUpdate: '2026-07-10T16:45:00-07:00'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'art-1',
    userName: 'Sessimè Officiel',
    userRole: 'artiste',
    type: 'deposit',
    amount: 150000,
    paymentMethod: 'mtn',
    status: 'success',
    description: 'Dépôt de fonds via MTN Mobile Money (+229 97 00 11 22)',
    createdAt: '2026-07-07T10:00:00-07:00'
  },
  {
    id: 'tx-2',
    userId: 'art-1',
    userName: 'Sessimè Officiel',
    userRole: 'artiste',
    type: 'payment',
    amount: 60000,
    paymentMethod: 'wallet',
    status: 'success',
    description: 'Paiement de la prestation "Pack Rotation Heavy" à Frisson Radio 95.1 FM',
    createdAt: '2026-07-08T09:15:00-07:00'
  },
  {
    id: 'tx-3',
    userId: 'promo-1',
    userName: 'Frisson Radio 95.1 FM',
    userRole: 'promoteur',
    type: 'commission',
    amount: 6000,
    paymentMethod: 'wallet',
    status: 'success',
    description: 'Commission de la plateforme (10%) déduite du paiement req-1',
    createdAt: '2026-07-08T09:15:00-07:00'
  },
  {
    id: 'tx-4',
    userId: 'art-1',
    userName: 'Sessimè Officiel',
    userRole: 'artiste',
    type: 'payment',
    amount: 45000,
    paymentMethod: 'wallet',
    status: 'success',
    description: 'Paiement de la prestation "Challenge Viral TikTok & Réels" à Bénin Buzz',
    createdAt: '2026-07-10T14:30:00-07:00'
  },
  {
    id: 'tx-5',
    userId: 'art-2',
    userName: 'Fanicko de Jésus',
    userRole: 'artiste',
    type: 'deposit',
    amount: 240000,
    paymentMethod: 'moov',
    status: 'success',
    description: 'Dépôt de fonds via Moov Money (+229 96 44 55 66)',
    createdAt: '2026-07-09T14:00:00-07:00'
  },
  {
    id: 'tx-6',
    userId: 'art-2',
    userName: 'Fanicko de Jésus',
    userRole: 'artiste',
    type: 'payment',
    amount: 20000,
    paymentMethod: 'wallet',
    status: 'success',
    description: 'Paiement de la prestation "Promotion Spéciale Rythmes du Terroir" à Capp FM',
    createdAt: '2026-07-10T11:00:00-07:00'
  },
  {
    id: 'tx-7',
    userId: 'art-2',
    userName: 'Fanicko de Jésus',
    userRole: 'artiste',
    type: 'refund',
    amount: 20000,
    paymentMethod: 'wallet',
    status: 'success',
    description: 'Remboursement automatique suite au refus de Capp FM pour la demande req-4',
    createdAt: '2026-07-10T16:45:00-07:00'
  },
  {
    id: 'tx-8',
    userId: 'art-2',
    userName: 'Fanicko de Jésus',
    userRole: 'artiste',
    type: 'payment',
    amount: 100000,
    paymentMethod: 'wallet',
    status: 'success',
    description: 'Paiement de la prestation "Pack Interview & Live Studio" à Frisson Radio 95.1 FM',
    createdAt: '2026-07-11T20:10:00-07:00'
  }
];
