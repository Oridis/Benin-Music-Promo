/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoleType = 'artiste' | 'promoteur' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  avatar: string;
  bio?: string;
  phoneNumber?: string;
  walletBalance: number; // In FCFA
  mtnNumber?: string;
  moovNumber?: string;
  celtiisNumber?: string;
  organizationName?: string; // e.g., "Cotonou FM", "Tokpa Radio", "Bénin Buzz"
  promoteurCategory?: 'radio' | 'tv' | 'blogger' | 'influencer' | 'playlist';
  audienceSize?: string; // e.g., "50K auditeurs", "120K abonnés"
  audienceLocation?: string; // e.g., "Cotonou", "Porto-Novo", "Tout le Bénin"
  verified: boolean; // Pending admin validation
  createdAt?: string; // ISO string of registration date
  spotifyUrl?: string;
  audiomackUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  deezerUrl?: string;
  certified?: boolean; // Admin-activated certification for high completion rate
}

export interface PromoteurOffer {
  id: string;
  promoteurId: string;
  title: string;
  price: number; // In FCFA
  description: string;
  channels: string[]; // e.g., ["Antenne Radio", "Page Facebook", "Story TikTok"]
  duration: string; // e.g., "3 passages / jour pendant 1 semaine"
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: RoleType;
  text: string;
  timestamp: string; // ISO string
}

export interface Review {
  rating: number; // 1 to 5 stars
  comment: string;
  createdAt: string; // ISO string
}

export interface PromotionRequest {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  songTitle: string;
  songGenre: string;
  audioName: string;
  audioSize?: string;
  audioDuration?: string;
  audioUrl?: string; // Local object URL or mock path
  promoteurId: string;
  promoteurName: string;
  promoteurOrganization?: string;
  offerId: string;
  offerTitle: string;
  price: number; // original price paid
  status: 'pending' | 'accepted' | 'refused' | 'completed';
  createdAt: string; // ISO string
  replyDate?: string; // ISO string
  refusalReason?: string;
  scheduleText?: string; // e.g., "Du Lundi au Vendredi à 15h10 et 19h45"
  proofLink?: string; // e.g., "https://facebook.com/watch/beninmusic..."
  proofType?: 'audio' | 'link' | 'image' | 'text';
  proofLabel?: string; // e.g., "Enregistrement du passage antenne"
  chats: ChatMessage[];
  lastUpdate: string; // ISO string
  review?: Review;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userRole: RoleType;
  type: 'deposit' | 'payment' | 'refund' | 'withdrawal' | 'commission';
  amount: number; // FCFA
  fee?: number; // FCFA
  paymentMethod: 'mtn' | 'moov' | 'celtiis' | 'wallet';
  status: 'pending' | 'success' | 'failed';
  description: string;
  createdAt: string; // ISO string
}

export interface Notification {
  id: string;
  userId: string; // recipient ID (artist ID or promoter ID)
  title: string;
  message: string;
  type: 'status_change' | 'new_message' | 'kyc_update' | 'system';
  requestId?: string; // ID of the associated request
  read: boolean;
  createdAt: string; // ISO timestamp
}

export interface PlatformConfig {
  commissionRate: number; // e.g. 10 for 10%
  autoRefundHours: number; // e.g. 48 hours timeout
  enabledChannels: string[];
  
  // Visibility of Hero per role
  hideHeroArtiste?: boolean;
  hideHeroPromoteur?: boolean;
  hideHeroAdmin?: boolean;
  
  // Hero Section Editable Fields
  heroBadge?: string;
  heroImage?: string;
  heroImageBadgeLeft?: string;
  heroImageBadgeRight?: string;
  heroBoxCategory?: string;
  heroBoxTitle?: string;
  heroBoxDesc?: string;
  
  // Artiste
  heroTitleArtisteRegular?: string;
  heroTitleArtisteHighlight?: string;
  heroDescArtiste?: string;
  heroBtnArtiste?: string;

  // Promoteur
  heroTitlePromoteurRegular?: string;
  heroTitlePromoteurHighlight?: string;
  heroDescPromoteur?: string;
  heroBtnPromoteur?: string;

  // Admin
  heroTitleAdminRegular?: string;
  heroTitleAdminHighlight?: string;
  heroDescAdmin?: string;
  heroBtnAdmin?: string;

  // Mobile Money Payment Gateway Configs
  mtnMerchantId?: string;
  mtnSecretKey?: string;
  mtnSandbox?: boolean;

  moovMerchantId?: string;
  moovSecretKey?: string;
  moovSandbox?: boolean;

  celtiisMerchantId?: string;
  celtiisSecretKey?: string;
  celtiisSandbox?: boolean;
}
