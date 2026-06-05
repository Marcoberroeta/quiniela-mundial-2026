import React, { useState, useMemo } from 'react';
import { Trophy, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const { data: allMatches = [] } = useQuery({
    queryKey: ['matches-upcoming'],
    queryFn: () => base44.entities.Match.filter({ estado: 'programado' }, 'fecha_kickoff', 20),
  });

  const { data: myPredictions = [] } = useQuery({
    queryKey: ['predictions-home', user?.id],
    queryFn: () => base44.entities.Prediction.filter({ user_id: user?.id }),
    enabled: !!user?.id,
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
    return allMatches
      .sort((a, b) => new Date(a.fecha_kickoff) - new Date(b.fecha_kickoff))
      .slice(0, 10);
  }, [allMatches]);

  const getPrediction = (matchId) => myPredictions.find(p => p.match_id === matchId);

  // My total points
  const myPoints = useMemo(() =>
    myPredictions.reduce((sum, p) => sum + (p.puntos_obtenidos || 0), 0),
    [myPredictions]
  );

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Hero header */}
      <div style={{ borderBottom: `3px solid ${INK}`, background: INK, padding: '28px 16px 20px' }}>
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
            <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.04em', textTransform: 'uppercase', color: CONCRETE }}>
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

        {/* My score strip */}
        {user && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 12 }}>
            <span style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Mis puntos
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.04em', color: YELLOW }}>
              {myPoints} <span style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.1em' }}>PTS</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Admin link */}
        {user?.role === 'admin' && (
          <Link to="/admin" className="block mb-4">
            <div style={{ border: `2px solid ${INK}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, background: CONCRETE, boxShadow: `2px 2px 0 ${INK}` }}>
              <Settings style={{ width: 14, height: 14, color: '#9b968a' }} />
              <span style={{ fontSize: 11, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Panel de administración
              </span>
            </div>
          </Link>
        )}

        {/* Upcoming matches */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: `2px solid ${INK}`, paddingBottom: 8 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: INK }}>
            Próximos partidos
          </h2>
        </div>

        {upcomingMatches.length === 0 ? (
          <div style={{ border: `2px dashed ${INK}`, padding: 32, textAlign: 'center', background: CONCRETE }}>
            <Trophy style={{ width: 28, height: 28, margin: '0 auto 12px', color: '#9b968a' }} />
            <p style={{ fontSize: 12, color: '#9b968a' }}>No hay partidos próximos.</p>
          </div>
        ) : (
          <div>
            {upcomingMatches.map((match) => {
              const pred = getPrediction(match.id);
              const lockTime = new Date(match.fecha_kickoff);
              const isLocked = new Date() >= lockTime || !!pred;
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={pred}
                  onClick={isLocked ? undefined : setSelectedMatch}
                />
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