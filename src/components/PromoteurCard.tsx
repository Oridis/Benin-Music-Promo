/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, PromoteurOffer, RoleType, PromotionRequest } from '../types';
import { Radio, Tv, Globe, Users, MapPin, CheckCircle2, ChevronRight, Plus, HelpCircle, Flame, Star, ShieldCheck, Award } from 'lucide-react';

interface PromoteurCardProps {
  key?: string | number;
  promoteur: User;
  offers: PromoteurOffer[];
  requests: PromotionRequest[];
  onSelectOffer: (offer: PromoteurOffer, promoteur: User) => void;
  selectedOfferIds: string[];
}

export default function PromoteurCard({
  promoteur,
  offers,
  requests,
  onSelectOffer,
  selectedOfferIds
}: PromoteurCardProps) {
  
  const [showReviews, setShowReviews] = useState(false);

  // Calculate mission completion rate (ignoring pending/accepted requests as they are still in progress)
  const promoterRequests = requests.filter((r) => r.promoteurId === promoteur.id);
  const completedCount = promoterRequests.filter((r) => r.status === 'completed').length;
  const nonPendingCount = promoterRequests.filter((r) => r.status === 'completed' || r.status === 'refused').length;
  const completionRate = nonPendingCount > 0 
    ? Math.round((completedCount / nonPendingCount) * 100) 
    : 100; // 100% default for promoters with no completed/refused yet

  // Get matching reviews
  const promoterReviews = requests.filter((r) => r.promoteurId === promoteur.id && r.review);
  const reviewsCount = promoterReviews.length;
  const averageRating = reviewsCount > 0 
    ? (promoterReviews.reduce((acc, curr) => acc + (curr.review?.rating || 0), 0) / reviewsCount).toFixed(1)
    : null;

  // Calculate seniority (ancienneté)
  const getSeniorityMonths = (createdAtStr?: string) => {
    if (!createdAtStr) return 0;
    const createdDate = new Date(createdAtStr);
    const currentDate = new Date(); // current system time
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays / 30.41; // average days in a month
  };

  const seniorityMonths = getSeniorityMonths(promoteur.createdAt);
  const completedPrestations = requests.filter(
    (r) => r.promoteurId === promoteur.id && r.status === 'completed'
  ).length;

  const isVerifiedBadgeEligible = seniorityMonths > 3 || completedPrestations >= 10;
  
  // Format currency
  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(val).replace('XOF', 'F CFA');
  };

  // Get matching category icon
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'radio':
        return <Radio className="h-4.5 w-4.5" />;
      case 'tv':
        return <Tv className="h-4.5 w-4.5" />;
      case 'playlist':
        return <Star className="h-4.5 w-4.5 text-amber-500" />;
      default:
        return <Globe className="h-4.5 w-4.5" />;
    }
  };

  // Get matching category label
  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'radio':
        return 'Radio FM';
      case 'tv':
        return 'Télévision';
      case 'blogger':
        return 'Média & Blog';
      case 'influencer':
        return 'Créateur d\'audience';
      case 'playlist':
        return 'Curateur Playlist';
      default:
        return 'Promoteur';
    }
  };

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-gray-200/60 transition-all duration-300">
      
      {/* Top Profile Header */}
      <div className="flex gap-3.5 sm:gap-4 pb-4 border-b border-gray-50">
        <div className="relative">
          <img
            src={promoteur.avatar}
            alt={promoteur.name}
            className="h-16 w-16 rounded-xl object-cover ring-2 ring-gray-100 group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg shadow-sm text-white ${
            promoteur.verified ? 'bg-emerald-500' : 'bg-amber-500'
          }`} title={promoteur.verified ? 'Vérifié par Bénin Music Promo' : 'Profil en cours de validation par la direction'}>
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              promoteur.promoteurCategory === 'radio'
                ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/10'
                : 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-600/10'
            }`}>
              {getCategoryIcon(promoteur.promoteurCategory)}
              {getCategoryLabel(promoteur.promoteurCategory)}
            </span>
            
            {!promoteur.verified && (
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-600/10 animate-pulse">
                Sponsorisé / En attente
              </span>
            )}
          </div>

          <h4 className="mt-1 font-display text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors flex flex-wrap items-center gap-1.5 leading-tight">
            <span>{promoteur.name}</span>
            {promoteur.certified && completionRate >= 90 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[9.5px] font-black text-white border border-amber-400 shadow-sm animate-pulse" title={`Promoteur Certifié par Bénin Music Promo (${completionRate}% de complétion de mission)`}>
                <Award className="h-3 w-3 text-white fill-white/25 shrink-0" />
                Certifié ({completionRate}%)
              </span>
            )}
            {isVerifiedBadgeEligible && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-500 border border-blue-500/10 shrink-0" title="Diffuseur Vérifié (Ancienneté > 3 mois ou > 10 prestations finalisées)">
                <ShieldCheck className="h-3 w-3 text-blue-500 fill-blue-500/10 shrink-0" />
                Vérifié
              </span>
            )}
          </h4>
          <p className="text-[11px] font-medium text-gray-400 line-clamp-1">
            {promoteur.organizationName || 'Indépendant'}
          </p>

          {/* Système de notation et avis */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {averageRating ? (
              <>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(Number(averageRating))
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-extrabold text-amber-600">{averageRating}/5</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReviews(!showReviews);
                  }}
                  className="text-[10px] text-amber-600 hover:text-amber-700 transition-colors font-bold underline cursor-pointer"
                >
                  {showReviews ? 'Masquer' : `(${reviewsCount} avis)`}
                </button>
              </>
            ) : (
              <span className="text-[10px] text-gray-400 italic">Aucun avis pour le moment</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 py-3 border-b border-gray-50 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
          <Users className="h-4 w-4 text-amber-500 shrink-0" />
          <div className="overflow-hidden">
            <p className="text-[9px] text-gray-400">Audience</p>
            <p className="font-semibold text-gray-800 text-[10px] truncate">{promoteur.audienceSize || '10K+ abonnés'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
          <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
          <div className="overflow-hidden">
            <p className="text-[9px] text-gray-400">Couverture</p>
            <p className="font-semibold text-gray-800 text-[10px] truncate">{promoteur.audienceLocation || 'Bénin'}</p>
          </div>
        </div>
      </div>

      {/* Biography */}
      <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
        {promoteur.bio || 'Aucune description disponible pour ce promoteur.'}
      </p>

      {/* Reviews list expansion */}
      {showReviews && promoterReviews.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-3.5 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avis des artistes béninois ({reviewsCount})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {promoterReviews.map((req) => (
              <div key={req.id} className="rounded-xl border border-gray-100 bg-gray-50/40 p-2.5 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">{req.artistName}</span>
                  <span className="text-[9px] text-gray-400">
                    {new Date(req.review!.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-2.5 w-2.5 ${
                        star <= req.review!.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-[9px] font-semibold text-gray-500 ml-1">({req.review!.rating}/5)</span>
                </div>
                <p className="text-gray-600 leading-relaxed italic">
                  "{req.review!.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offers Subtitle */}
      <div className="mt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prestations / Forfaits promotionnels :</p>
        
        <div className="mt-2 space-y-2.5">
          {offers.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Aucune formule disponible pour le moment.</p>
          ) : (
            offers.map((offer) => {
              const isSelected = selectedOfferIds.includes(offer.id);
              return (
                <div
                  key={offer.id}
                  className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/25 shadow-xs'
                      : 'border-gray-100 bg-gray-50/20 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 leading-tight">{offer.title}</h5>
                      <p className="text-[10px] font-semibold text-gray-400 mt-0.5 font-mono">{offer.duration}</p>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-amber-600 shrink-0">
                      {formatFCFA(offer.price)}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {offer.channels.map((chan, i) => (
                      <span key={i} className="inline-flex rounded-md bg-[#58001e] px-1.5 py-0.5 text-[9px] font-medium text-white">
                        {chan}
                      </span>
                    ))}
                  </div>

                  {promoteur.verified ? (
                    <button
                      type="button"
                      onClick={() => onSelectOffer(offer, promoteur)}
                      className={`mt-2 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-xs'
                          : 'bg-gray-900 text-white hover:bg-black'
                      }`}
                    >
                      {isSelected ? '✓ Sélectionné' : '+ Ajouter au panier'}
                    </button>
                  ) : (
                    <div className="mt-2 text-center rounded-lg bg-amber-50/40 p-1.5 border border-amber-100/20 text-[9px] text-amber-800 font-semibold italic">
                      Indisponible (Profil en cours d'approbation)
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
