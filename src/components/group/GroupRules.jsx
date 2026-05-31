import React, { useState } from 'react';
import { Copy, Check, Eye, CheckCircle, Gift, Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const BLUE = '#0E63B3';
const YELLOW = '#FFC20E';
const GREEN = '#00923F';
const CONCRETE_DK = '#2a2926';

const PHASE_MULTIPLIERS = [
  { fase: 'Grupos',        mult: '×1', color: BLUE },
  { fase: 'Dieciseisavos', mult: '×1', color: BLUE },
  { fase: 'Octavos',       mult: '×2', color: RED },
  { fase: 'Cuartos',       mult: '×2', color: RED },
  { fase: 'Semis',         mult: '×3', color: RED },
  { fase: '3er Lugar',     mult: '×3', color: RED },
  { fase: 'Final',         mult: '×4', color: YELLOW, highlight: true },
];

function DarkBlock({ children, className = '', accent = null }) {
  return (
    <div
      style={{
        background: CONCRETE_DK,
        border: `2px solid ${CONCRETE}`,
        borderLeft: accent ? `5px solid ${accent}` : `2px solid ${CONCRETE}`,
        padding: '14px 16px',
        marginBottom: 8,
        boxShadow: `3px 3px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: '#9b968a', padding: '20px 0 10px',
    }}>
      {children}
    </div>
  );
}

export default function GroupRules({ group, members }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const link = `${window.location.origin}/join/${group.codigo_invitacion}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: INK,
        minHeight: '100vh',
        margin: '-16px -16px 0',
        padding: '16px 16px 96px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: CONCRETE,
      }}
    >
      {/* Invite code */}
      <div
        style={{
          border: `2px solid ${CONCRETE}`,
          borderLeft: `5px solid ${GREEN}`,
          padding: 16,
          marginBottom: 8,
          textAlign: 'center',
          background: CONCRETE_DK,
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', marginBottom: 8 }}>
          Código de invitación
        </p>
        <p style={{
          fontFamily: 'monospace',
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: GREEN,
          marginBottom: 12,
        }}>
          {group.codigo_invitacion}
        </p>
        <button
          onClick={handleShare}
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: CONCRETE,
            border: `2px solid ${CONCRETE}`,
            padding: '8px 16px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
          {copied ? 'Copiado' : 'Compartir'}
        </button>
      </div>

      {/* Scoring */}
      <SectionTitle>¿Cómo funciona la puntuación?</SectionTitle>

      <DarkBlock accent={GREEN}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ganador correcto o empate
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.6 }}>
          Aciertas al ganador (o empate) →{' '}
          <span style={{ color: GREEN, fontWeight: 700 }}>12 puntos</span> base.
        </p>
      </DarkBlock>

      <DarkBlock accent={YELLOW}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>—</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Penalización por gol
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.6 }}>
          Por cada gol de diferencia se resta{' '}
          <span style={{ color: YELLOW, fontWeight: 700 }}>1 pt</span>.
          Mínimo siempre <span style={{ color: YELLOW, fontWeight: 700 }}>1 pt</span>.
        </p>
        <div style={{ marginTop: 10, border: `1px solid rgba(255,255,255,0.1)`, background: '#111' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9b968a' }}>
            <span>Dif. 2 goles → 12 − 2</span>
            <span style={{ color: GREEN, fontWeight: 700 }}>10 pts</span>
          </div>
          <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9b968a' }}>
            <span>Marcador exacto</span>
            <span style={{ color: GREEN, fontWeight: 700 }}>12 pts ✓</span>
          </div>
        </div>
      </DarkBlock>

      <DarkBlock accent={RED}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: RED }}>✗</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ganador incorrecto
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.6 }}>
          No aciertas al ganador →{' '}
          <span style={{ color: RED, fontWeight: 700 }}>0 puntos</span>.
        </p>
      </DarkBlock>

      {/* Phase multipliers */}
      <SectionTitle>Multiplicadores por fase</SectionTitle>
      <DarkBlock accent={BLUE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <TrendingUp style={{ width: 14, height: 14, color: GREEN }} />
          <p style={{ fontSize: 12, color: '#9b968a' }}>
            Conforme avanza el torneo,{' '}
            <span style={{ color: CONCRETE, fontWeight: 700 }}>acertar vale más</span>.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PHASE_MULTIPLIERS.map(({ fase, mult, color, highlight }) => (
            <span
              key={fase}
              style={{
                padding: '4px 10px',
                background: highlight ? YELLOW : 'rgba(255,255,255,0.08)',
                color: highlight ? INK : '#9b968a',
                border: `2px solid ${highlight ? INK : 'rgba(255,255,255,0.15)'}`,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              {mult} {fase}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 12, border: `1px solid rgba(255,255,255,0.1)`, background: '#111' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9b968a' }}>
            <span>Marcador exacto · Grupos ×1</span>
            <span style={{ color: GREEN, fontWeight: 700 }}>12 pts</span>
          </div>
          <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: YELLOW, fontWeight: 700 }}>Marcador exacto · Final ×4</span>
            <span style={{ color: YELLOW, fontWeight: 700 }}>48 pts</span>
          </div>
        </div>
      </DarkBlock>

      {/* Visibility */}
      <SectionTitle>¿Puedo ver los picks de otros?</SectionTitle>
      <DarkBlock accent={BLUE}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Eye style={{ width: 16, height: 16, color: GREEN, marginTop: 1, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: CONCRETE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Partidos no finalizados
            </p>
            <p style={{ fontSize: 11, color: '#9b968a', lineHeight: 1.5 }}>
              Solo ves los picks de otros cuando el partido terminó.
            </p>
          </div>
        </div>
      </DarkBlock>
      <DarkBlock accent={GREEN}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <CheckCircle style={{ width: 16, height: 16, color: GREEN, marginTop: 1, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: CONCRETE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Partidos finalizados
            </p>
            <p style={{ fontSize: 11, color: '#9b968a', lineHeight: 1.5 }}>
              Todos los picks son visibles para comparar estrategias.
            </p>
          </div>
        </div>
      </DarkBlock>

      {/* Awards */}
      {(group.costo_entrada || group.premios) && (
        <>
          <SectionTitle>Premios y entrada</SectionTitle>

          {group.costo_entrada && (
            <DarkBlock accent={YELLOW}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Gift style={{ width: 16, height: 16, color: YELLOW, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: CONCRETE, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Costo de entrada
                </span>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <p style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em', color: YELLOW, lineHeight: 1 }}>
                  ${group.costo_entrada.toLocaleString('es-MX')}
                </p>
                <p style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
                  MXN · por jugador
                </p>
              </div>
              <p style={{ fontSize: 11, color: '#9b968a', textAlign: 'center', lineHeight: 1.5, marginTop: 8 }}>
                Pozo total = <span style={{ color: CONCRETE, fontWeight: 700 }}>${group.costo_entrada.toLocaleString('es-MX')} × {members.length} participantes = ${(group.costo_entrada * members.length).toLocaleString('es-MX')}</span>
              </p>
            </DarkBlock>
          )}

          {group.premios && (
            <DarkBlock accent={GREEN}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Trophy style={{ width: 16, height: 16, color: YELLOW, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: CONCRETE, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Premios y repartición
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {group.premios}
              </p>
            </DarkBlock>
          )}
        </>
      )}

      {/* Members */}
      <SectionTitle>Miembros ({members.length})</SectionTitle>
      <div style={{ border: `2px solid ${CONCRETE}` }}>
        {members.map((m, idx) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderBottom: idx < members.length - 1 ? `1px solid rgba(255,255,255,0.08)` : 'none',
              background: CONCRETE_DK,
            }}
          >
            <div style={{
              width: 28, height: 28,
              background: `rgba(${idx === 0 ? '226,0,26' : idx === 1 ? '14,99,179' : '0,146,63'},0.25)`,
              border: `2px solid rgba(255,255,255,0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: [RED, BLUE, GREEN, YELLOW][idx % 4] }}>
                {(m.user_nombre || m.user_email || '?')[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: CONCRETE, textTransform: 'uppercase', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.user_nombre || m.user_email}
              </p>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, letterSpacing: '-0.02em' }}>
              {m.puntos_totales || 0}
              <span style={{ fontSize: 9, color: '#9b968a', marginLeft: 3, letterSpacing: '0.1em' }}>pts</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}