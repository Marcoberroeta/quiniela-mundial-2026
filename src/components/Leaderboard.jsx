import React from 'react';
import { motion } from 'framer-motion';

const POSITION_STYLES = [
  { bg: '#E2001A', text: '#ffffff', label: '1' },
  { bg: '#0E63B3', text: '#ffffff', label: '2' },
  { bg: '#FFC20E', text: '#14130f', label: '3' },
];

export default function Leaderboard({ members, currentUserId }) {
  const sorted = [...members].sort((a, b) => (b.puntos_totales || 0) - (a.puntos_totales || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '2px solid #14130f' }}>
      {sorted.map((member, idx) => {
        const isMe = member.user_id === currentUserId;
        const pos = POSITION_STYLES[idx];

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(idx * 0.04, 0.4) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              borderBottom: idx < sorted.length - 1 ? '2px solid #14130f' : 'none',
              background: isMe ? '#14130f' : '#e4e1d8',
            }}
          >
            {/* Position block */}
            <div
              style={{
                width: 40,
                minHeight: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: pos ? pos.bg : (isMe ? '#2a2926' : '#c7c3b8'),
                borderRight: '2px solid #14130f',
                flexShrink: 0,
              }}
            >
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: pos ? pos.text : (isMe ? '#9b968a' : '#14130f'),
                letterSpacing: '-0.02em',
              }}>
                {idx + 1}
              </span>
            </div>

            {/* Name */}
            <div style={{ flex: 1, padding: '10px 12px', minWidth: 0 }}>
              <p style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: isMe ? '#e4e1d8' : '#14130f',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {member.user_nombre || member.user_email || 'Jugador'}
                {isMe && (
                  <span style={{ fontSize: 9, fontWeight: 400, color: '#9b968a', marginLeft: 6, letterSpacing: '0.1em' }}>
                    TÚ
                  </span>
                )}
              </p>
            </div>

            {/* Points */}
            <div
              style={{
                padding: '10px 14px',
                textAlign: 'right',
                borderLeft: '2px solid #14130f',
                flexShrink: 0,
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.04em', color: isMe ? '#FFC20E' : '#14130f', lineHeight: 1 }}>
                {member.puntos_totales || 0}
              </p>
              <p style={{ fontSize: 8, color: '#9b968a', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1 }}>
                pts
              </p>
            </div>
          </motion.div>
        );
      })}

      {sorted.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#9b968a', fontSize: 13 }}>
          No hay miembros aún
        </div>
      )}
    </div>
  );
}
