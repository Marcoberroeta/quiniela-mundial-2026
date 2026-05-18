import React, { useMemo } from 'react';
import MatchCard from '@/components/MatchCard';
import { useNavigate } from 'react-router-dom';

export default function GroupResults({ matches, predictions, groupId }) {
  const navigate = useNavigate();

  const finishedMatches = useMemo(() => {
    return matches
      .filter(m => m.estado === 'finalizado')
      .sort((a, b) => new Date(b.fecha_kickoff) - new Date(a.fecha_kickoff));
  }, [matches]);

  const getPrediction = (matchId) => predictions.find(p => p.match_id === matchId);

  if (finishedMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">⏳</span>
        <p className="text-muted-foreground mt-3">Aún no hay resultados</p>
        <p className="text-xs text-muted-foreground mt-1">Los partidos finalizados aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {finishedMatches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          prediction={getPrediction(match.id)}
          showScore={true}
          onClick={() => navigate(`/match/${match.id}?group=${groupId}`)}
        />
      ))}
    </div>
  );
}