import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const BLUE = '#0E63B3';
const YELLOW = '#FFC20E';

const POSITION_STYLES = [
  { bg: RED,  text: '#ffffff' },
  { bg: BLUE, text: '#ffffff' },
  { bg: YELLOW, text: INK },
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
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          padding: '24px 16px 16px',
          borderBottom: `3px solid ${INK}`,
          background: INK,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
        }}
      >
        <Globe style={{ width: 24, height: 24, color: YELLOW, flexShrink: 0, marginBottom: 2 }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: CONCRETE, lineHeight: 1 }}>
            Ranking Global
          </h1>
          <p style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>
            Puntos totales · todos los grupos
          </p>
        </div>
      </div>

      <div style={{ padding: '16px 16px 96px' }}>
        {isLoading ? (
          <div style={{ border: `2px solid ${INK}` }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 52,
                  borderBottom: i < 7 ? `2px solid ${INK}` : 'none',
                  background: i % 2 === 0 ? CONCRETE : '#d8d5cc',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <div
            style={{
              border: `2px dashed ${INK}`,
              padding: 32,
              textAlign: 'center',
              background: CONCRETE,
            }}
          >
            <p style={{ fontSize: 12, color: '#9b968a' }}>Aún no hay puntos registrados.</p>
          </div>
        ) : (
          <div style={{ border: `2px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}>
            {ranking.map((entry, idx) => {
              const isMe = entry.user_id === user?.id;
              const pos = POSITION_STYLES[idx];

              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.5) }}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    borderBottom: idx < ranking.length - 1 ? `2px solid ${INK}` : 'none',
                    background: isMe ? INK : CONCRETE,
                  }}
                >
                  {/* Position block */}
                  <div
                    style={{
                      width: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: pos ? pos.bg : (isMe ? '#2a2926' : '#c7c3b8'),
                      borderRight: `2px solid ${INK}`,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{
                      fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em',
                      color: pos ? pos.text : (isMe ? '#9b968a' : INK),
                    }}>
                      {idx + 1}
                    </span>
                  </div>

                  {/* Name + groups */}
                  <div style={{ flex: 1, padding: '10px 12px', minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      color: isMe ? CONCRETE : INK,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {entry.user_nombre || entry.user_email || 'Jugador'}
                      {isMe && (
                        <span style={{ fontSize: 9, fontWeight: 400, color: '#9b968a', marginLeft: 6, letterSpacing: '0.1em' }}>TÚ</span>
                      )}
                    </p>
                    <p style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.08em', marginTop: 1 }}>
                      {entry.grupos} {entry.grupos === 1 ? 'grupo' : 'grupos'}
                    </p>
                  </div>

                  {/* Points */}
                  <div
                    style={{
                      padding: '10px 14px',
                      textAlign: 'right',
                      borderLeft: `2px solid ${INK}`,
                      flexShrink: 0,
                    }}
                  >
                    <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.04em', color: isMe ? YELLOW : INK, lineHeight: 1 }}>
                      {entry.puntos_totales}
                    </p>
                    <p style={{ fontSize: 8, color: '#9b968a', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1 }}>
                      pts
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
