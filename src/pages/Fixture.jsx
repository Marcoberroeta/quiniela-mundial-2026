import React, { useState, useMemo } from 'react';
import { GROUP_STAGE_MATCHES, TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin } from 'lucide-react';
import BracketView from '@/components/BracketView';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const CONCRETE_MID = '#d8d5cc';
const BLUE = '#0E63B3';
const RED = '#E2001A';
const GREEN = '#00923F';
const YELLOW = '#FFC20E';

const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const STATUS_COLOR = { programado: BLUE, en_vivo: RED, finalizado: GREEN };
const STATUS_LABEL = { programado: 'PROG', en_vivo: '● VIVO', finalizado: 'FINAL' };

function MatchRow({ match }) {
  const kickoff = new Date(match.fecha_kickoff);
  const flag = (t) => TEAM_FLAGS[t] || '🏳️';
  const finished = match.estado === 'finalizado';
  const live = match.estado === 'en_vivo';
  const accentColor = STATUS_COLOR[match.estado] || '#9b968a';

  return (
    <div
      style={{
        border: `2px solid ${INK}`,
        borderLeft: `4px solid ${accentColor}`,
        marginBottom: 8,
        background: CONCRETE,
        boxShadow: `2px 2px 0 ${INK}`,
      }}
    >
      {/* Date + status */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 10px',
          background: CONCRETE_MID,
          borderBottom: `1px solid #c7c3b8`,
        }}
      >
        <span style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.06em' }}>
          {format(kickoff, "EEE d MMM · HH:mm", { locale: es })} CDM
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: accentColor }}>
          {STATUS_LABEL[match.estado]}
        </span>
      </div>

      {/* Teams */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '10px 12px',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 20 }}>{flag(match.equipo_local)}</span>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: INK }}>
            {match.equipo_local}
          </span>
        </div>

        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 64 }}>
          {finished || live ? (
            <span style={{ fontSize: 20, fontWeight: 700, color: live ? RED : INK, letterSpacing: '-0.04em' }}>
              {match.gol_local ?? 0} — {match.gol_visitante ?? 0}
            </span>
          ) : (
            <span style={{ fontSize: 16, fontWeight: 700, color: BLUE, letterSpacing: '-0.02em' }}>
              {format(kickoff, 'HH:mm')}
            </span>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: INK, textAlign: 'right' }}>
            {match.equipo_visitante}
          </span>
          <span style={{ fontSize: 20 }}>{flag(match.equipo_visitante)}</span>
        </div>
      </div>

      {/* Venue */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
          borderTop: '1px solid #c7c3b8',
        }}
      >
        <MapPin style={{ width: 10, height: 10, color: '#9b968a' }} />
        <span style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.06em' }}>
          {match.estadio}, {match.ciudad}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: '#9b968a' }}>#{match.match_number}</span>
      </div>
    </div>
  );
}

function GroupTab({ letra, dbMatches }) {
  const matches = useMemo(() => {
    if (dbMatches.length) {
      return dbMatches
        .filter(m => m.grupo_letra === letra)
        .sort((a, b) => new Date(a.fecha_kickoff) - new Date(b.fecha_kickoff));
    }
    return GROUP_STAGE_MATCHES
      .filter(m => m.grupo_letra === letra)
      .sort((a, b) => new Date(a.fecha_kickoff) - new Date(b.fecha_kickoff));
  }, [letra, dbMatches]);

  const teams = useMemo(() => {
    const teamSet = new Set();
    matches.forEach(m => { teamSet.add(m.equipo_local); teamSet.add(m.equipo_visitante); });
    const stats = {};
    teamSet.forEach(t => { stats[t] = { pts: 0, gf: 0, gc: 0, pj: 0, g: 0, e: 0, p: 0 }; });

    matches.forEach(m => {
      if (m.estado !== 'finalizado') return;
      const gl = m.gol_local, gv = m.gol_visitante;
      stats[m.equipo_local].pj++;  stats[m.equipo_visitante].pj++;
      stats[m.equipo_local].gf += gl;   stats[m.equipo_local].gc += gv;
      stats[m.equipo_visitante].gf += gv; stats[m.equipo_visitante].gc += gl;
      if (gl > gv) {
        stats[m.equipo_local].pts += 3; stats[m.equipo_local].g++;
        stats[m.equipo_visitante].p++;
      } else if (gl < gv) {
        stats[m.equipo_visitante].pts += 3; stats[m.equipo_visitante].g++;
        stats[m.equipo_local].p++;
      } else {
        stats[m.equipo_local].pts += 1; stats[m.equipo_local].e++;
        stats[m.equipo_visitante].pts += 1; stats[m.equipo_visitante].e++;
      }
    });

    return Object.entries(stats)
      .map(([name, s]) => ({ name, ...s, dif: s.gf - s.gc }))
      .sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf);
  }, [matches]);

  const flag = (t) => TEAM_FLAGS[t] || '🏳️';
  const anyFinished = matches.some(m => m.estado === 'finalizado');

  return (
    <div>
      {anyFinished && (
        <div style={{ border: `2px solid ${INK}`, marginBottom: 16, boxShadow: `3px 3px 0 ${INK}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: INK, color: CONCRETE }}>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Equipo</th>
                {['PJ','G','E','P','DIF','Pts'].map(h => (
                  <th key={h} style={{ padding: '6px 6px', fontWeight: 700, letterSpacing: '0.06em', textAlign: 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((t, i) => (
                <tr
                  key={t.name}
                  style={{
                    borderTop: `1px solid #c7c3b8`,
                    background: i < 2 ? '#d8d5cc' : CONCRETE,
                  }}
                >
                  <td style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                    <span style={{ fontSize: 14 }}>{flag(t.name)}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      {t.name}
                    </span>
                    {i < 2 && (
                      <span style={{ width: 6, height: 6, background: GREEN, display: 'inline-block', marginLeft: 2, flexShrink: 0 }} />
                    )}
                  </td>
                  {[t.pj, t.g, t.e, t.p, `${t.dif > 0 ? '+' : ''}${t.dif}`].map((v, vi) => (
                    <td key={vi} style={{ padding: '6px', textAlign: 'center', color: '#9b968a' }}>{v}</td>
                  ))}
                  <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: INK, fontSize: 13 }}>{t.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {matches.map(m => <MatchRow key={m.id || m.match_number} match={m} />)}
    </div>
  );
}

export default function Fixture() {
  const [activeTab, setActiveTab] = useState('grupos');
  const [activeGroup, setActiveGroup] = useState('A');

  const { data: dbMatches = [] } = useQuery({
    queryKey: ['fixture-matches'],
    queryFn: () => base44.entities.Match.filter({}, 'fecha_kickoff', 200),
  });

  const groupMatches = useMemo(() => dbMatches.filter(m => m.fase === 'grupos'), [dbMatches]);
  const knockoutMatches = useMemo(() =>
    dbMatches.filter(m => m.fase !== 'grupos').sort((a, b) => a.match_number - b.match_number),
    [dbMatches]
  );

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Sticky header */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: `3px solid ${INK}`,
          background: INK,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: CONCRETE }}>
          Fixture · Mundial 2026
        </h1>
        <p style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>
          Horarios CDM (UTC−6)
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: `3px solid ${INK}`,
          position: 'sticky',
          top: 62,
          zIndex: 10,
          background: CONCRETE,
        }}
      >
        {[
          { key: 'grupos', label: '📊 GRUPOS', color: BLUE },
          { key: 'llaves', label: '⚽ LLAVES', color: RED },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: activeTab === key ? color : CONCRETE,
              color: activeTab === key ? (color === YELLOW ? INK : '#fff') : '#9b968a',
              borderRight: key === 'grupos' ? `2px solid ${INK}` : 'none',
              transition: 'background 0.1s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grupos tab */}
      {activeTab === 'grupos' && (
        <div style={{ padding: '16px 16px 96px' }}>
          {/* Group selector */}
          <div style={{ overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ display: 'inline-flex', gap: 0, border: `2px solid ${INK}` }}>
              {GRUPOS.map((g, idx) => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  style={{
                    width: 36, height: 36,
                    border: 'none',
                    borderRight: idx < GRUPOS.length - 1 ? `2px solid ${INK}` : 'none',
                    background: activeGroup === g ? INK : CONCRETE,
                    color: activeGroup === g ? CONCRETE : '#9b968a',
                    fontWeight: 700, fontSize: 12, letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Group label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 16, borderBottom: `2px solid ${INK}`, paddingBottom: 8,
          }}>
            <div style={{
              background: BLUE, color: '#fff',
              padding: '3px 10px',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            }}>
              GRUPO {activeGroup}
            </div>
          </div>

          <GroupTab letra={activeGroup} dbMatches={groupMatches} />
        </div>
      )}

      {/* Llaves tab */}
      {activeTab === 'llaves' && (
        <div style={{ paddingBottom: 96 }}>
          <BracketView dbMatches={knockoutMatches} />
        </div>
      )}
    </div>
  );
}