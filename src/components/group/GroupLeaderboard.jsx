import React from 'react';
import Leaderboard from '@/components/Leaderboard';

export default function GroupLeaderboard({ members, currentUserId }) {
  return (
    <div>
      <div className="text-center mb-4">
        <span className="text-3xl">🏆</span>
        <h2 className="text-lg font-bold mt-1">Tabla de posiciones</h2>
        <p className="text-xs text-muted-foreground">{members.length} jugadores</p>
      </div>
      <Leaderboard members={members} currentUserId={currentUserId} />
    </div>
  );
}