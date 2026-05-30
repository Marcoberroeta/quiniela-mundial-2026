import React from 'react';
import { TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin } from 'lucide-react';

const STATUS_COLOR = {
  programado: '#0E63B3',
  en_vivo:    '#E2001A',
  finalizado: '#00923F',
};

const STATUS_LABEL = {
  programado: 'PROG',
  en_vivo:    '● VIVO',
  finalizado: 'FINAL',
};

export default function MatchCard({ match, prediction, onClick, showScore = false }) {
  const kickoff = new Date(match.fecha_kickoff);
  const flag = (team) => TEAM_FLAGS[team] || '🏳️';
  const accentColor = STATUS_COLOR[match.estado] || '#9b968a';
  const isLive = match.estado === 'en_vivo';
  const isFinished = match.estado === 'finalizado';
  const showGoals = (showScore && isFinished) || isLive;

  return (
    <div
      onClick={() => onClick?.(match)}
      className="relative mb-3 select-none"
      style={{
        background: '#e4e1d8',
        border: '2px solid #14130f',
        borderLeft: `5px solid ${accentColor}`,
        boxShadow: '3px 3px 0 #14130f',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Top strip */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '1px solid #c7c3b8', background: '#d8d5cc' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#9b968a' }}>
            {match.grupo_letra ? `GRP ${match.grupo_letra}` : FASE_LABELS[match.fase]?.toUpperCase() || match.fase?.toUpperCase()}
          </span>
          {match.match_number && (
            <span style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.1em' }}>#{match.match_number}</span>
          )}
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: accentColor,
          }}
        >
          {STATUS_LABEL[match.estado]}
        </span>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        {/* Local */}
        <div className="flex-1 flex items-center gap-2">
          <span style={{ fontSize: 22 }}>{flag(match.equipo_local)}</span>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            {match.equipo_local}
          </span>
        </div>

        {/* Score or time */}
        <div className="flex-shrink-0 text-center" style={{ minWidth: 72 }}>
          {showGoals ? (
            <div className="flex items-center justify-center gap-1">
              <span style={{ fontSize: 24, fontWeight: 700, color: isLive ? '#E2001A' : '#14130f' }}>
                {match.gol_local ?? 0}
              </span>
              <span style={{ fontSize: 14, color: '#9b968a', fontWeight: 700 }}>—</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: isLive ? '#E2001A' : '#14130f' }}>
                {match.gol_visitante ?? 0}
              </span>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0E63B3', letterSpacing: '-0.02em' }}>
                {format(kickoff, 'HH:mm')}
              </p>
              <p style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
                {format(kickoff, 'dd MMM', { locale: es })}
              </p>
            </div>
          )}
          {match.ganador_penales && (
            <p style={{ fontSize: 9, color: '#9b968a', marginTop: 2 }}>
              pen: {match.ganador_penales === 'local' ? match.equipo_local : match.equipo_visitante}
            </p>
          )}
        </div>

        {/* Visitante */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2, textAlign: 'right' }}>
            {match.equipo_visitante}
          </span>
          <span style={{ fontSize: 22 }}>{flag(match.equipo_visitante)}</span>
        </div>
      </div>

      {/* Prediction row */}
      {prediction && (
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderTop: '1px solid #c7c3b8', background: '#d8d5cc' }}
        >
          <span style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Mi pronóstico
          </span>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {prediction.gol_local_pred} — {prediction.gol_visitante_pred}
            </span>
            {isFinished && prediction.puntos_obtenidos != null && (
              <span
                style={{
                  background: '#FFC20E',
                  color: '#14130f',
                  border: '2px solid #14130f',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  letterSpacing: '0.06em',
                }}
              >
                +{prediction.puntos_obtenidos} PTS
              </span>
            )}
          </div>
        </div>
      )}

      {/* Venue */}
      <div
        className="flex items-center gap-1 px-3 py-1.5"
        style={{ borderTop: prediction ? 'none' : '1px solid #c7c3b8' }}
      >
        <MapPin style={{ width: 10, height: 10, color: '#9b968a' }} />
        <span style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.06em' }}>
          {match.estadio}, {match.ciudad}
        </span>
      </div>
    </div>
  );
}
