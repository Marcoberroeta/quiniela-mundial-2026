import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

const positionStyles = [
  { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: Trophy },
  { bg: 'bg-gray-50 border-gray-200',   text: 'text-gray-600',   icon: Medal },
  { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: Award },
];

export default function GlobalLeaderboard() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allMembers = [], isLoading } = useQuery({
    queryKey: ['global-leaderboard'],
    queryFn: () => base44.entities.GroupMember.list('-puntos_totales', 500),
  });

  // Aggregate points per user across all groups
  const ranking = useMemo(() => {
    const map = {};
    allMembers.forEach(m => {
      if (!map[m.user_id]) {
        map[m.user_id] = {
          user_id: m.user_id,
          user_nombre: m.user_nombre,
          user_email: m.user_email,
          puntos_totales: 0,
          grupos: 0,
        };
      }
      map[m.user_id].puntos_totales += m.puntos_totales || 0;
      map[m.user_id].grupos++;
    });
    return Object.values(map).sort((a, b) => b.puntos_totales - a.puntos_totales);
  }, [allMembers]);

  return (
    <div className="p-4 pb-24">
      <div className="pt-4 mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Ranking Global</h1>
          <p className="text-xs text-muted-foreground">Puntos totales de todos los grupos</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <Card className="p-10 text-center border-dashed">
          <Trophy className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">Aún no hay puntos registrados.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {ranking.map((entry, idx) => {
            const isMe = entry.user_id === user?.id;
            const style = positionStyles[idx];
            const Icon = style?.icon;

            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.5) }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                    : style?.bg || 'bg-card border-border/60'
                }`}
              >
                {/* Position */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                  idx < 3 ? style.bg : 'bg-muted'
                }`}>
                  {idx < 3 && Icon ? (
                    <Icon className={`w-4 h-4 ${style.text}`} />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                  )}
                </div>

                {/* Name + groups */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isMe ? 'text-primary' : ''}`}>
                    {entry.user_nombre || entry.user_email || 'Jugador'}
                    {isMe && <span className="text-xs font-normal text-muted-foreground ml-1">(tú)</span>}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {entry.grupos} {entry.grupos === 1 ? 'grupo' : 'grupos'}
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-lg font-bold">{entry.puntos_totales}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">pts</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}