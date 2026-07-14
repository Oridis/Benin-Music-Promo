/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { ChatMessage, User, RoleType } from '../types';

interface ChatWindowProps {
  currentUser: User;
  recipientName: string;
  recipientAvatar: string;
  chats: ChatMessage[];
  onSendMessage: (text: string) => void;
  promotionStatus: 'pending' | 'accepted' | 'refused' | 'completed';
}

export default function ChatWindow({
  currentUser,
  recipientName,
  recipientAvatar,
  chats,
  onSendMessage,
  promotionStatus
}: ChatWindowProps) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  // If promotion is not yet accepted, chat is locked according to specifications
  // "Chat direct et privé avec les promoteurs ayant ACCEPTÉ la demande."
  const isLocked = promotionStatus === 'pending' || promotionStatus === 'refused';

  return (
    <div className="flex flex-col h-[400px] border border-gray-100 rounded-xl bg-white overflow-hidden shadow-xs">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 bg-gray-50/70 p-3 border-b border-gray-100">
        <img
          src={recipientAvatar}
          alt={recipientName}
          className="h-8 w-8 rounded-lg object-cover ring-2 ring-amber-500/10"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 overflow-hidden">
          <h5 className="text-xs font-bold text-gray-800 truncate">{recipientName}</h5>
          <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            En ligne • Discussion privée
          </p>
        </div>
      </div>

      {/* Messages body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20">
        {isLocked ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h6 className="text-xs font-bold text-gray-700">Messagerie restreinte</h6>
            <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">
              Conformément aux règles de la plateforme, la discussion privée n'est activée que lorsque le promoteur a <strong>accepté</strong> votre demande.
            </p>
          </div>
        ) : chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="h-10 w-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h6 className="text-xs font-bold text-gray-500">Aucun message</h6>
            <p className="text-[10px] text-gray-400 max-w-xs">
              Posez vos questions au promoteur concernant le passage de votre titre ou transmettez-lui des requêtes particulières.
            </p>
          </div>
        ) : (
          chats.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isMe && (
                  <img
                    src={recipientAvatar}
                    alt={recipientName}
                    className="h-6 w-6 rounded-md object-cover mt-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="space-y-0.5">
                  <div
                    className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-amber-500 text-white rounded-tr-xs'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1.5 text-[8px] text-gray-400 font-medium ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isMe && <CheckCheck className="h-3 w-3 text-amber-500" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="border-t border-gray-100 p-2 bg-white flex gap-1.5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLocked}
          placeholder={isLocked ? "Messagerie bloquée" : "Saisissez votre message..."}
          className="flex-1 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-hidden disabled:bg-gray-100 disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={isLocked || !text.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

    </div>
  );
}
