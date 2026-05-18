import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const positionStyles = [
  { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", icon: Trophy },
  { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", icon: Medal },
  { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", icon: Award },
];

export default function Leaderboard({ members, currentUserId }) {
  const sorted = [...members].sort((a, b) => (b.puntos_totales || 0) - (a.puntos_totales || 0));

  return (
    <div className="space-y-2">
      {sorted.map((member, idx) => {
        const isMe = member.user_id === currentUserId;
        const style = positionStyles[idx];
        const Icon = style?.icon;

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isMe
                ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                : style?.bg || 'bg-card border-border/60'
            }`}
          >
            {/* Position */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              idx < 3 ? style.bg : 'bg-muted'
            }`}>
              {idx < 3 && Icon ? (
                <Icon className={`w-4 h-4 ${style.text}`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${isMe ? 'text-primary' : ''}`}>
                {member.user_nombre || member.user_email || 'Jugador'}
                {isMe && <span className="text-xs font-normal text-muted-foreground ml-1">(tú)</span>}
              </p>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className="text-lg font-bold">{member.puntos_totales || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">pts</p>
            </div>
          </motion.div>
        );
      })}

      {sorted.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay miembros aún</p>
        </div>
      )}
    </div>
  );
}