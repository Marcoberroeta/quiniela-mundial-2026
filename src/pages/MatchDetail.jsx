import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const BLUE = '#0E63B3';
const YELLOW = '#FFC20E';
const GREEN = '#00923F';

export default function MatchDetail() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('group');

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => base44.auth.me() });

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const matches = await base44.entities.Match.filter({ id: matchId });
      return matches[0] || null;
    },
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['match-predictions', matchId, groupId],
    queryFn: () => base44.entities.Prediction.filter({ match_id: matchId, group_id: groupId }),
    enabled: !!groupId,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => base44.entities.GroupMember.filter({ group_id: groupId }),
    enabled: !!groupId,
  });

  if (isLoading || !match) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          width: 32, height: 32,
          border: `3px solid #c7c3b8`, borderTop: `3px solid ${RED}`,
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  const flag = (team) => TEAM_FLAGS[team] || '🏳️';
  const kickoff = new Date(match.fecha_kickoff);
  const isFinished = match.estado === 'finalizado';
  const isStarted = match.estado !== 'programado';
  const isLive = match.estado === 'en_vivo';

  const getMemberName = (userId) => {
    const member = members.find(m => m.user_id === userId);
    return member?.user_nombre || member?.user_email || 'Jugador';
  };

  const visiblePredictions = isStarted
    ? predictions.sort((a, b) => (b.puntos_obtenidos || 0) - (a.puntos_obtenidos || 0))
    : predictions.filter(p => p.user_id === user?.id);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Back header */}
      <div
        style={{
          background: INK,
          padding: '16px',
          borderBottom: `3px solid ${INK}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b968a', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: CONCRETE }}>
          Partido
        </span>
      </div>

      <div style={{ padding: '16px 16px 96px' }}>
        {/* Match card */}
        <div
          style={{
            border: `3px solid ${INK}`,
            background: CONCRETE,
            marginBottom: 20,
            boxShadow: `5px 5px 0 ${INK}`,
          }}
        >
          {/* Phase badge strip */}
          <div
            style={{
              background: INK,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: YELLOW }}>
              {match.grupo_letra ? `GRUPO ${match.grupo_letra}` : FASE_LABELS[match.fase]?.toUpperCase() || match.fase?.toUpperCase()}
            </span>
            {isLive && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: RED }}>● EN VIVO</span>
            )}
            {isFinished && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: GREEN }}>✓ FINALIZADO</span>
            )}
          </div>

          {/* Teams */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '24px 16px',
            }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{flag(match.equipo_local)}</div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: INK }}>
                {match.equipo_local}
              </p>
            </div>

            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              {isFinished ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.06em', color: INK }}>{match.gol_local}</span>
                  <span style={{ fontSize: 20, color: '#9b968a', fontWeight: 700 }}>–</span>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.06em', color: INK }}>{match.gol_visitante}</span>
                </div>
              ) : isLive ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.06em', color: RED }}>{match.gol_local ?? 0}</span>
                  <span style={{ fontSize: 20, color: '#9b968a', fontWeight: 700 }}>–</span>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.06em', color: RED }}>{match.gol_visitante ?? 0}</span>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 26, fontWeight: 700, color: BLUE, letterSpacing: '-0.04em' }}>
                    {format(kickoff, 'HH:mm')}
                  </p>
                  <p style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
                    {format(kickoff, "d 'de' MMMM", { locale: es })}
                  </p>
                </div>
              )}
              {match.ganador_penales && (
                <p style={{ fontSize: 9, color: '#9b968a', marginTop: 4, letterSpacing: '0.06em' }}>
                  Pen: {match.ganador_penales === 'local' ? match.equipo_local : match.equipo_visitante}
                </p>
              )}
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{flag(match.equipo_visitante)}</div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: INK }}>
                {match.equipo_visitante}
              </p>
            </div>
          </div>

          {/* Venue */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '8px 14px', borderTop: `2px solid #c7c3b8`,
            }}
          >
            <MapPin style={{ width: 10, height: 10, color: '#9b968a' }} />
            <span style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.06em' }}>
              {match.estadio}, {match.ciudad}
            </span>
          </div>
        </div>

        {/* Predictions */}
        <div style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 8, marginBottom: 12 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: INK }}>
            {isStarted ? 'Pronósticos del grupo' : 'Mi pronóstico'}
          </h2>
          {!isStarted && (
            <p style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.06em', marginTop: 4 }}>
              Los pronósticos de otros jugadores se mostrarán después del kickoff.
            </p>
          )}
        </div>

        {visiblePredictions.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', border: `2px dashed ${INK}`, background: CONCRETE }}>
            <p style={{ fontSize: 12, color: '#9b968a' }}>
              {isStarted ? 'No hay pronósticos' : 'No has hecho pronóstico para este partido'}
            </p>
          </div>
        ) : (
          <div style={{ border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
            {visiblePredictions.map((pred, idx) => {
              const isExact = isFinished && pred.gol_local_pred === match.gol_local && pred.gol_visitante_pred === match.gol_visitante;
              const isMe = pred.user_id === user?.id;

              return (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    borderBottom: idx < visiblePredictions.length - 1 ? `2px solid ${INK}` : 'none',
                    background: isMe ? INK : CONCRETE,
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isExact ? YELLOW : (isMe ? '#2a2926' : '#d8d5cc'),
                      borderRight: `2px solid ${INK}`,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: isExact ? INK : (isMe ? '#9b968a' : INK) }}>
                      {idx + 1}
                    </span>
                  </div>

                  {/* Name + score */}
                  <div style={{ flex: 1, padding: '10px 12px', minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: isMe ? CONCRETE : INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getMemberName(pred.user_id)}
                      {isMe && <span style={{ fontSize: 9, fontWeight: 400, color: '#9b968a', marginLeft: 6 }}>TÚ</span>}
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em', color: isMe ? CONCRETE : INK, marginTop: 2 }}>
                      {pred.gol_local_pred} – {pred.gol_visitante_pred}
                    </p>
                  </div>

                  {/* Points */}
                  <div
                    style={{
                      padding: '10px 12px', textAlign: 'right',
                      borderLeft: `2px solid ${INK}`, flexShrink: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center',
                    }}
                  >
                    {isExact && <Target style={{ width: 14, height: 14, color: YELLOW, marginBottom: 2 }} />}
                    {isFinished && (
                      <>
                        <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em', color: isMe ? YELLOW : INK, lineHeight: 1 }}>
                          +{pred.puntos_obtenidos || 0}
                        </p>
                        <p style={{ fontSize: 8, color: '#9b968a', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1 }}>pts</p>
                      </>
                    )}
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
