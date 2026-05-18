import React, { useState, useMemo } from 'react';
import MatchCard from '@/components/MatchCard';
import PredictionModal from '@/components/PredictionModal';
import { FASE_LABELS } from '@/lib/matchData';

export default function GroupUpcoming({ matches, predictions, onSave, saving }) {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const upcomingMatches = useMemo(() => {
    const now = new Date();
    return matches
      .filter(m => m.estado === 'programado' || m.estado === 'en_vivo')
      .sort((a, b) => new Date(a.fecha_kickoff) - new Date(b.fecha_kickoff));
  }, [matches]);

  const getPrediction = (matchId) => predictions.find(p => p.match_id === matchId);

  const handleSave = (data) => {
    onSave(selectedMatch.id, data);
    setSelectedMatch(null);
  };

  if (upcomingMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">🏆</span>
        <p className="text-muted-foreground mt-3">No hay partidos próximos</p>
      </div>
    );
  }

  // Group by date
  const grouped = {};
  upcomingMatches.forEach(m => {
    const date = new Date(m.fecha_kickoff).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(m);
  });

  return (
    <div>
      {Object.entries(grouped).map(([date, dateMatches]) => (
        <div key={date} className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 capitalize">
            {date}
          </h3>
          <div className="space-y-3">
            {dateMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={getPrediction(match.id)}
                onClick={setSelectedMatch}
              />
            ))}
          </div>
        </div>
      ))}

      <PredictionModal
        match={selectedMatch}
        prediction={selectedMatch ? getPrediction(selectedMatch.id) : null}
        open={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}