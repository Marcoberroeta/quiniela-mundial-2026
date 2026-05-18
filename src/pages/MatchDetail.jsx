import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function MatchDetail() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('group');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const flag = (team) => TEAM_FLAGS[team] || '🏳️';
  const kickoff = new Date(match.fecha_kickoff);
  const isFinished = match.estado === 'finalizado';
  const isStarted = match.estado !== 'programado';

  // Before kickoff, only show current user's prediction
  const getMemberName = (userId) => {
    const member = members.find(m => m.user_id === userId);
    return member?.user_nombre || member?.user_email || 'Jugador';
  };

  const visiblePredictions = isStarted
    ? predictions.sort((a, b) => (b.puntos_obtenidos || 0) - (a.puntos_obtenidos || 0))
    : predictions.filter(p => p.user_id === user?.id);

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 pt-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      {/* Match header */}
      <Card className="p-6 mb-6">
        <div className="text-center mb-4">
          <Badge variant="outline" className="text-xs">
            {match.grupo_letra ? `Grupo ${match.grupo_letra}` : FASE_LABELS[match.fase]}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="text-4xl mb-2">{flag(match.equipo_local)}</div>
            <p className="text-sm font-bold">{match.equipo_local}</p>
          </div>

          <div className="text-center">
            {isFinished ? (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{match.gol_local}</span>
                <span className="text-xl text-muted-foreground">-</span>
                <span className="text-4xl font-bold">{match.gol_visitante}</span>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-primary">
                  {format(kickoff, 'HH:mm')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(kickoff, "d 'de' MMMM", { locale: es })}
                </p>
              </div>
            )}
            {match.ganador_penales && (
              <p className="text-xs text-muted-foreground mt-1">
                Penales: {match.ganador_penales === 'local' ? match.equipo_local : match.equipo_visitante}
              </p>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="text-4xl mb-2">{flag(match.equipo_visitante)}</div>
            <p className="text-sm font-bold">{match.equipo_visitante}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mt-4 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{match.estadio}, {match.ciudad}</span>
        </div>
      </Card>

      {/* Predictions */}
      <h2 className="text-lg font-bold mb-3">
        {isStarted ? 'Pronósticos del grupo' : 'Mi pronóstico'}
      </h2>

      {!isStarted && (
        <p className="text-xs text-muted-foreground mb-3">
          Los pronósticos de otros jugadores se mostrarán después del kickoff.
        </p>
      )}

      <div className="space-y-2">
        {visiblePredictions.map((pred, idx) => {
          const isExact = isFinished && pred.gol_local_pred === match.gol_local && pred.gol_visitante_pred === match.gol_visitante;
          const isMe = pred.user_id === user?.id;

          return (
            <motion.div
              key={pred.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`p-3 flex items-center gap-3 ${isMe ? 'ring-1 ring-primary/30 bg-primary/5' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getMemberName(pred.user_id)}
                    {isMe && <span className="text-xs text-muted-foreground ml-1">(tú)</span>}
                  </p>
                  <p className="text-lg font-bold">
                    {pred.gol_local_pred} - {pred.gol_visitante_pred}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isExact && <Target className="w-4 h-4 text-accent" />}
                  {isFinished && (
                    <Badge className="bg-accent text-accent-foreground font-bold">
                      +{pred.puntos_obtenidos || 0}
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}

        {visiblePredictions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {isStarted ? 'No hay pronósticos' : 'No has hecho pronóstico para este partido'}
          </div>
        )}
      </div>
    </div>
  );
}