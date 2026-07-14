/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Music, Wallet, User as UserIcon, Shield, Radio, Plus, RefreshCw, Bell, BellOff, Check, CheckCheck, Trash2, MessageSquare, Download, Volume2, VolumeX, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, RoleType, Notification } from '../types';
import { playNotificationSound, SOUND_THEMES, SoundConfig } from '../lib/sounds';

interface HeaderProps {
  currentUser: User;
  users: User[];
  activeRole: RoleType;
  onChangeRole: (role: RoleType) => void;
  onChangeUser: (userId: string) => void;
  onOpenDepositModal: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: (userId: string) => void;
  onClearNotifications: (userId: string) => void;
  onOpenInstallModal?: () => void;
  soundConfig: SoundConfig;
  onUpdateSoundConfig: (cfg: SoundConfig) => void;
}

export default function Header({
  currentUser,
  users,
  activeRole,
  onChangeRole,
  onChangeUser,
  onOpenDepositModal,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
  onOpenInstallModal = () => {},
  soundConfig,
  onUpdateSoundConfig
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Filter users by role for quick switching
  const filteredUsers = users.filter((u) => u.role === activeRole);

  // Filter notifications belonging to the current user
  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      
      if (diffMins < 1) return "À l'instant";
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      return date.toLocaleDateString('fr-BJ', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  };

  // Format currency in FCFA beautifully
  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('XOF', 'F CFA');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-950/40 bg-[#020104]/90 shadow-lg shadow-purple-950/15 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-fuchsia-600 text-white shadow-md shadow-rose-500/20 shrink-0">
            <Music className="h-4.5 w-4.5 sm:h-5 sm:w-5 animate-pulse" />
          </div>
        </div>

        {/* Middle Navigation - Role Selection Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-[#130f22]/80 border border-purple-950/40 p-1">
          <button
            id="role-btn-artiste"
            onClick={() => onChangeRole('artiste')}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'artiste'
                ? 'bg-gradient-to-r from-rose-500/20 to-fuchsia-500/20 text-rose-300 ring-1 ring-rose-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserIcon className="h-3.5 w-3.5 text-rose-400" />
            Espace Artiste
          </button>
          <button
            id="role-btn-promoteur"
            onClick={() => onChangeRole('promoteur')}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'promoteur'
                ? 'bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 ring-1 ring-fuchsia-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-fuchsia-400" />
            Espace Promoteur
          </button>
          <button
            id="role-btn-admin"
            onClick={() => onChangeRole('admin')}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            Administration
          </button>
        </nav>

        {/* Right Section - Wallet, Profile Switcher & Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Wallet Balance (not shown for admin unless admin wallet is relevant) */}
          <div className="flex items-center gap-1 sm:gap-2 rounded-xl border border-purple-950/40 bg-[#130f22]/50 p-1 sm:p-1.5 pr-1.5 sm:pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="text-right min-w-0">
              <p className="text-[8px] sm:text-[9px] font-medium text-gray-500 hidden sm:block truncate">
                {activeRole === 'admin' ? 'Commission (10%)' : 'Portefeuille'}
              </p>
              <p className="font-mono text-[10px] sm:text-xs font-bold text-gray-200 whitespace-nowrap">
                {formatFCFA(currentUser.walletBalance)}
              </p>
            </div>
            {activeRole === 'artiste' && (
              <button
                onClick={onOpenDepositModal}
                className="ml-1 sm:ml-2 flex h-5.5 w-5.5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-sm shrink-0 cursor-pointer"
                title="Recharger mon portefeuille"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            )}
          </div>

          {/* PWA Install Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white hover:scale-105 transition-all shadow-md shadow-rose-500/5 cursor-pointer shrink-0"
            title="Installer l'application (PWA) pour accès hors-ligne"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setDropdownOpen(false); // close user profile dropdown
              }}
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-purple-950/40 bg-[#130f22]/50 text-gray-400 hover:bg-[#1c1630] hover:text-white transition-colors cursor-pointer shrink-0"
              title="Notifications"
            >
              <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-rose-500 text-[8px] sm:text-[10px] font-bold text-white ring-2 ring-[#020104] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-[-60px] xs:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl border border-purple-900/30 bg-[#0d0a19] p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                <div className="flex items-center justify-between border-b border-purple-950/40 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs font-black text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-400">
                        {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => onMarkAllAsRead(currentUser.id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Tout marquer comme lu"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Tout lu
                      </button>
                    )}
                    {myNotifications.length > 0 && (
                      <button
                        onClick={() => onClearNotifications(currentUser.id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Effacer l'historique"
                      >
                        <Trash2 className="h-3 w-3" />
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification Sound Settings Panel */}
                <div className="mb-2 rounded-xl border border-purple-950/40 bg-[#130f22]/50 p-2 sm:p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      {soundConfig.enabled ? (
                        <Volume2 className="h-3.5 w-3.5 text-rose-400" />
                      ) : (
                        <VolumeX className="h-3.5 w-3.5 text-gray-500" />
                      )}
                      Sons des notifications
                    </span>
                    <button
                      onClick={() => onUpdateSoundConfig({ ...soundConfig, enabled: !soundConfig.enabled })}
                      className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                        soundConfig.enabled
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {soundConfig.enabled ? 'Actif' : 'Muet'}
                    </button>
                  </div>

                  {soundConfig.enabled && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <select
                        value={soundConfig.theme}
                        onChange={(e) => {
                          const newTheme = e.target.value as any;
                          onUpdateSoundConfig({ ...soundConfig, theme: newTheme });
                          // Play the preview
                          playNotificationSound(newTheme, soundConfig.volume);
                        }}
                        className="flex-1 rounded-lg border border-purple-950/40 bg-[#0d0a19] px-2 py-1 text-[10px] sm:text-xs text-gray-200 focus:border-rose-500 focus:outline-hidden cursor-pointer"
                      >
                        {SOUND_THEMES.map((theme) => (
                          <option key={theme.value} value={theme.value}>
                            {theme.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => playNotificationSound(soundConfig.theme, soundConfig.volume)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Tester le son"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1 py-1 divide-y divide-purple-950/20">
                  <AnimatePresence initial={false}>
                    {myNotifications.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-8 text-center"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-950/20 text-purple-400 mb-2">
                          <BellOff className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-gray-400">Aucune notification pour le moment</p>
                        <p className="text-[10px] text-gray-500 mt-1 leading-snug">Vous serez alerté ici des changements de statut et nouveaux messages.</p>
                      </motion.div>
                    ) : (
                      myNotifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, y: -15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                            mass: 0.8
                          }}
                          onClick={() => {
                            onMarkAsRead(notif.id);
                            setNotifDropdownOpen(false);
                          }}
                          className={`group relative flex gap-3 rounded-xl p-2.5 text-left transition-colors cursor-pointer ${
                            notif.read ? 'hover:bg-[#130f22]/50' : 'bg-rose-500/5 hover:bg-rose-500/10'
                          }`}
                        >
                          {/* Icon based on notification type */}
                          <div className="shrink-0">
                            {notif.type === 'new_message' ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                <MessageSquare className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                                <Music className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-start justify-between gap-1">
                              <p className={`text-xs font-bold leading-tight ${notif.read ? 'text-gray-300' : 'text-white'}`}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 self-center" />
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-gray-500 font-medium mt-1 block">
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                          </div>

                          {/* Mark single as read button */}
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notif.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-md bg-[#130f22] border border-purple-950/40 shadow-xs text-rose-400 hover:bg-[#1c1630] transition-all cursor-pointer"
                              title="Marquer comme lu"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifDropdownOpen(false); // close notifications dropdown
              }}
              className="flex items-center gap-1 sm:gap-2 rounded-xl border border-purple-950/40 bg-[#130f22]/50 p-1 sm:p-1.5 sm:pr-2.5 text-left hover:bg-[#1c1630] transition-colors cursor-pointer shrink-0"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-cover ring-2 ring-rose-500/20"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block">
                <p className="text-[11px] font-bold text-gray-200 line-clamp-1">{currentUser.name}</p>
                <p className="text-[9px] text-rose-400 font-medium capitalize">{activeRole}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-purple-900/30 bg-[#0d0a19] p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                <div className="px-3 py-2 border-b border-purple-950/40">
                  <p className="text-[10px] font-medium text-gray-400">Simuler un compte :</p>
                  <p className="text-xs font-bold text-gray-200 capitalize">Rôle: {activeRole}</p>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onChangeUser(u.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentUser.id === u.id
                          ? 'bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20'
                          : 'text-gray-300 hover:bg-[#130f22]'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-6 w-6 rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate">{u.name}</p>
                        {u.organizationName && (
                          <p className="text-[9px] text-gray-500 truncate">{u.organizationName}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile role selection bar */}
      <div className="md:hidden flex border-t border-purple-950/40 bg-[#020104] p-1">
        <button
          onClick={() => onChangeRole('artiste')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
            activeRole === 'artiste' ? 'bg-[#130f22] text-rose-400 ring-1 ring-rose-500/20' : 'text-gray-400'
          }`}
        >
          <UserIcon className="h-3 w-3" />
          Artiste
        </button>
        <button
          onClick={() => onChangeRole('promoteur')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
            activeRole === 'promoteur' ? 'bg-[#130f22] text-fuchsia-400 ring-1 ring-fuchsia-500/20' : 'text-gray-400'
          }`}
        >
          <Radio className="h-3 w-3" />
          Promoteur
        </button>
        <button
          onClick={() => onChangeRole('admin')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
            activeRole === 'admin' ? 'bg-[#130f22] text-emerald-400 ring-1 ring-emerald-500/20' : 'text-gray-400'
          }`}
        >
          <Shield className="h-3 w-3" />
          Admin
        </button>
      </div>
    </header>
  );
}
