import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Plus, ArrowRight, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MatchCard from '@/components/MatchCard';
import PredictionModal from '@/components/PredictionModal';
import { toast } from 'sonner';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const BLUE = '#0E63B3';
const YELLOW = '#FFC20E';
const GREEN = '#00923F';

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['my-memberships', user?.id],
    queryFn: () => base44.entities.GroupMember.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['my-groups', memberships.map(m => m.group_id).join(',')],
    queryFn: async () => {
      if (!memberships.length) return [];
      const allGroups = await base44.entities.Group.list();
      const myGroupIds = new Set(memberships.map(m => m.group_id));
      return allGroups.filter(g => myGroupIds.has(g.id));
    },
    enabled: memberships.length > 0,
  });

  const getMembershipForGroup = (groupId) => memberships.find(m => m.group_id === groupId);
  const primaryGroupId = memberships[0]?.group_id || null;

  const { data: allMatches = [] } = useQuery({
    queryKey: ['matches-upcoming'],
    queryFn: () => base44.entities.Match.filter({ estado: 'programado' }, 'fecha_kickoff', 10),
  });

  const { data: myPredictions = [] } = useQuery({
    queryKey: ['predictions-home', user?.id, primaryGroupId],
    queryFn: () => base44.entities.Prediction.filter({ user_id: user?.id, group_id: primaryGroupId }),
    enabled: !!user?.id && !!primaryGroupId,
  });

  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const savePrediction = useMutation({
    mutationFn: async ({ matchId, data }) => {
      const existing = myPredictions.find(p => p.match_id === matchId);
      if (existing) return base44.entities.Prediction.update(existing.id, data);
      return base44.entities.Prediction.create({
        ...data,
        user_id: user.id,
        group_id: primaryGroupId,
        match_id: matchId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions-home'] });
      setSelectedMatch(null);
      toast.success('Pronóstico guardado');
    },
  });

  const upcomingMatches = useMemo(() => {
    const now = new Date();
    return allMatches
      .filter(m => new Date(m.fecha_kickoff) > now)
      .sort((a, b) => new Date(a.fecha_kickoff) - new Date(b.fecha_kickoff))
      .slice(0, 6);
  }, [allMatches]);

  const getPrediction = (matchId) => myPredictions.find(p => p.match_id === matchId);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Brutalist hero header */}
      <div
        style={{
          borderBottom: `3px solid ${INK}`,
          background: INK,
          padding: '28px 16px 20px',
          position: 'relative',
        }}
      >
        {/* Color stripe */}
        <div style={{ display: 'flex', height: 5, marginBottom: 20, border: `1px solid rgba(255,255,255,0.2)` }}>
          {[RED, YELLOW, BLUE, GREEN].map(c => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            {user && (
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9b968a', marginBottom: 6 }}>
                Hola, {user.full_name || user.email}
              </p>
            )}
            <h1 style={{
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: CONCRETE,
            }}>
              Quiniela<br />
              <span style={{ color: RED }}>Mundial.</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 0.85, color: YELLOW }}>
              26
            </div>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', marginTop: 4 }}>
              FIFA World Cup
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Admin link */}
        {user?.role === 'admin' && (
          <Link to="/admin" className="block mb-4">
            <div
              style={{
                border: `2px solid ${INK}`,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: CONCRETE,
                boxShadow: `2px 2px 0 ${INK}`,
              }}
            >
              <Settings style={{ width: 14, height: 14, color: '#9b968a' }} />
              <span style={{ fontSize: 11, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Panel de administración
              </span>
            </div>
          </Link>
        )}

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'admin' ? '1fr 1fr' : '1fr', gap: 0, marginBottom: 24, border: `2px solid ${INK}` }}>
          {user?.role === 'admin' && (
            <Link to="/create-group" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '20px 16px',
                  textAlign: 'center',
                  borderRight: `2px solid ${INK}`,
                  background: CONCRETE,
                  transition: 'background 0.1s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = RED}
                onMouseLeave={e => e.currentTarget.style.background = CONCRETE}
              >
                <Plus style={{ width: 22, height: 22, margin: '0 auto 8px', color: INK }} />
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: INK }}>
                  Nuevo grupo
                </p>
              </div>
            </Link>
          )}
          <Link to="/join" style={{ textDecoration: 'none' }}>
            <div
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                background: CONCRETE,
                transition: 'background 0.1s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = BLUE}
              onMouseLeave={e => e.currentTarget.style.background = CONCRETE}
            >
              <Users style={{ width: 22, height: 22, margin: '0 auto 8px', color: INK }} />
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: INK }}>
                Unirme
              </p>
            </div>
          </Link>
        </div>

        {/* Upcoming matches */}
        {upcomingMatches.length > 0 && (
          <div className="mb-6">
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12, borderBottom: `2px solid ${INK}`, paddingBottom: 8,
            }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: INK }}>
                Próximos partidos
              </h2>
              {!primaryGroupId && (
                <span style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.08em' }}>Únete a un grupo para pronosticar</span>
              )}
            </div>
            <div>
              {upcomingMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={getPrediction(match.id)}
                  onClick={primaryGroupId ? setSelectedMatch : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* My groups */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, borderBottom: `2px solid ${INK}`, paddingBottom: 8,
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: INK }}>
            Mis grupos
          </h2>
        </div>

        {groups.length === 0 ? (
          <div
            style={{
              border: `2px dashed ${INK}`,
              padding: 32,
              textAlign: 'center',
              background: CONCRETE,
            }}
          >
            <Trophy style={{ width: 28, height: 28, margin: '0 auto 12px', color: '#9b968a' }} />
            <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.6 }}>
              Aún no perteneces a ningún grupo.
            </p>
            <p style={{ fontSize: 11, color: '#9b968a', marginTop: 4 }}>
              Crea uno o únete con un código de invitación.
            </p>
          </div>
        ) : (
          <div style={{ border: `2px solid ${INK}` }}>
            {groups.map((group, idx) => {
              const membership = getMembershipForGroup(group.id);
              return (
                <Link key={group.id} to={`/group/${group.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderBottom: idx < groups.length - 1 ? `2px solid ${INK}` : 'none',
                      background: CONCRETE,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.background = CONCRETE}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {group.nombre}
                      </h3>
                      <p style={{ fontSize: 9, color: '#9b968a', letterSpacing: '0.1em', marginTop: 2, fontFamily: 'monospace' }}>
                        {group.codigo_invitacion}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right', paddingRight: 8, borderRight: `2px solid ${INK}` }}>
                        <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', color: INK, lineHeight: 1 }}>
                          {membership?.puntos_totales || 0}
                        </p>
                        <p style={{ fontSize: 8, color: '#9b968a', letterSpacing: '0.14em', textTransform: 'uppercase' }}>pts</p>
                      </div>
                      <ArrowRight style={{ width: 16, height: 16, color: '#9b968a' }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <PredictionModal
        match={selectedMatch}
        prediction={selectedMatch ? getPrediction(selectedMatch.id) : null}
        open={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onSave={(data) => savePrediction.mutate({ matchId: selectedMatch.id, data })}
        saving={savePrediction.isPending}
      />
    </div>
  );
}