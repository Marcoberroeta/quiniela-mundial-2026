import React, { useMemo } from 'react';
import { TEAM_FLAGS } from '@/lib/matchData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const CONCRETE_MID = '#d8d5cc';

const PHASES = [
  { key: 'ronda_32', label: 'Ronda 32',  color: '#0E63B3', mult: '×1' },
  { key: 'octavos',  label: 'Octavos',   color: '#0E63B3', mult: '×2' },
  { key: 'cuartos',  label: 'Cuartos',   color: '#E2001A', mult: '×2' },
  { key: 'semis',    label: 'Semis',     color: '#E2001A', mult: '×3' },
  { key: 'final',    label: 'Final',     color: '#FFC20E', mult: '×4' },
];

function BracketMatch({ match }) {
  const flag = (t) => TEAM_FLAGS[t] || '🏳️';
  const kickoff = new Date(match.fecha_kickoff);
  const finished = match.estado === 'finalizado';
  const live = match.estado === 'en_vivo';
  const isKnown = match.equipo_local !== 'Por definir';

  const teamRow = (team, goles, isWinner) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        padding: '6px 8px',
        background: isWinner ? INK : 'transparent',
        borderBottom: `1px solid #c7c3b8`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{flag(team)}</span>
        <span style={{
          fontSize: 11, fontWeight: isWinner ? 700 : 500,
          textTransform: 'uppercase', letterSpacing: '0.02em',
          color: isWinner ? CONCRETE : INK,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {isKnown ? team : '⏳'}
        </span>
      </div>
      {(finished || live) && (
        <span style={{
          fontSize: 14, fontWeight: 700,
          color: isWinner ? '#FFC20E' : (live ? '#E2001A' : '#9b968a'),
          minWidth: 16, textAlign: 'right', flexShrink: 0,
        }}>
          {goles ?? '-'}
        </span>
      )}
    </div>
  );

  const localWins = finished && match.gol_local > match.gol_visitante;
  const visitanteWins = finished && match.gol_visitante > match.gol_local;

  return (
    <div
      style={{
        border: `2px solid ${INK}`,
        marginBottom: 8,
        background: CONCRETE,
        boxShadow: `2px 2px 0 ${INK}`,
      }}
    >
      {/* Match header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          background: CONCRETE_MID,
          borderBottom: `1px solid ${INK}`,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, color: '#9b968a', letterSpacing: '0.1em' }}>
          #{match.match_number}
        </span>
        <span style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.06em' }}>
          {format(kickoff, 'HH:mm', { locale: es })}
        </span>
        {finished && (
          <span style={{ fontSize: 9, fontWeight: 700, color: '#00923F', letterSpacing: '0.1em' }}>✓ FIN</span>
        )}
        {live && (
          <span style={{ fontSize: 9, fontWeight: 700, color: '#E2001A' }}>● VIVO</span>
        )}
      </div>

      {teamRow(match.equipo_local, match.gol_local, localWins)}
      <div style={{ borderBottom: 'none' }}>
        {teamRow(match.equipo_visitante, match.gol_visitante, visitanteWins)}
      </div>

      {finished && match.gol_local === match.gol_visitante && match.fase !== 'grupos' && (
        <div style={{
          padding: '3px 8px',
          background: '#fffbe6',
          borderTop: `1px solid #c7c3b8`,
          fontSize: 9, color: '#9b968a',
        }}>
          Definido en penales/prórroga
        </div>
      )}
    </div>
  );
}

function PhaseColumn({ phase, matches }) {
  const textColor = phase.color === '#FFC20E' ? INK : '#ffffff';

  return (
    <div style={{ flexShrink: 0, width: 200 }}>
      {/* Phase header */}
      <div
        style={{
          background: phase.color,
          border: `2px solid ${INK}`,
          borderBottom: 'none',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 0,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: textColor }}>
          {phase.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: textColor,
          background: 'rgba(0,0,0,0.2)',
          padding: '1px 6px',
        }}>
          {phase.mult}
        </span>
      </div>
      <div style={{ border: `2px solid ${INK}`, padding: 8, background: '#d8d5cc' }}>
        <p style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 8 }}>
          {matches.length} PARTIDOS
        </p>
        {matches.map(m => (
          <BracketMatch key={m.id || m.match_number} match={m} />
        ))}
      </div>
    </div>
  );
}

export default function BracketView({ dbMatches }) {
  const byPhase = useMemo(() => {
    const map = {};
    PHASES.forEach(p => {
      map[p.key] = dbMatches
        .filter(m => m.fase === p.key)
        .sort((a, b) => a.match_number - b.match_number);
    });
    return map;
  }, [dbMatches]);

  const hasAnyKnockout = Object.values(byPhase).some(arr => arr.length > 0);

  if (!hasAnyKnockout) {
    return (
      <div style={{ padding: 32, textAlign: 'center', border: `2px solid ${INK}`, margin: 16, background: CONCRETE }}>
        <AlertCircle style={{ width: 32, height: 32, margin: '0 auto 12px', color: '#9b968a' }} />
        <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.6 }}>
          Los partidos de eliminatorias se mostrarán aquí cuando comience esa fase.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 12, padding: 16, minWidth: 'max-content' }}>
        {PHASES.filter(p => byPhase[p.key]?.length > 0).map(phase => (
          <PhaseColumn
            key={phase.key}
            phase={phase}
            matches={byPhase[phase.key]}
          />
        ))}
      </div>
    </div>
  );
}
