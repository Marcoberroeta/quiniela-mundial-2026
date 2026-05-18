import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const estadoStyles = {
  programado: "bg-muted text-muted-foreground",
  en_vivo: "bg-red-500 text-white animate-pulse",
  finalizado: "bg-primary/10 text-primary"
};

const estadoLabels = {
  programado: "Programado",
  en_vivo: "🔴 En vivo",
  finalizado: "Finalizado"
};

export default function MatchCard({ match, prediction, onClick, showScore = false }) {
  const kickoff = new Date(match.fecha_kickoff);
  const isKnockout = match.fase !== 'grupos';
  const flag = (team) => TEAM_FLAGS[team] || '🏳️';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="p-4 cursor-pointer hover:shadow-md transition-all border-border/60 active:scale-[0.98]"
        onClick={() => onClick?.(match)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              {match.grupo_letra ? `Grupo ${match.grupo_letra}` : FASE_LABELS[match.fase]}
            </Badge>
            <Badge className={`text-xs ${estadoStyles[match.estado]}`}>
              {estadoLabels[match.estado]}
            </Badge>
          </div>
          {match.match_number && (
            <span className="text-xs text-muted-foreground">#{match.match_number}</span>
          )}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between gap-2">
          {/* Local */}
          <div className="flex-1 text-center">
            <div className="text-2xl mb-1">{flag(match.equipo_local)}</div>
            <p className="text-sm font-semibold leading-tight">{match.equipo_local}</p>
          </div>

          {/* Score or Time */}
          <div className="flex-shrink-0 text-center min-w-[80px]">
            {showScore && match.estado === 'finalizado' ? (
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">{match.gol_local}</span>
                <span className="text-lg text-muted-foreground">-</span>
                <span className="text-2xl font-bold">{match.gol_visitante}</span>
              </div>
            ) : match.estado === 'en_vivo' ? (
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-red-600">{match.gol_local ?? 0}</span>
                <span className="text-lg text-muted-foreground">-</span>
                <span className="text-2xl font-bold text-red-600">{match.gol_visitante ?? 0}</span>
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold text-primary">
                  {format(kickoff, 'HH:mm')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(kickoff, 'dd MMM', { locale: es })}
                </p>
              </div>
            )}
            {match.ganador_penales && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                (pen: {match.ganador_penales === 'local' ? match.equipo_local : match.equipo_visitante})
              </p>
            )}
          </div>

          {/* Visitante */}
          <div className="flex-1 text-center">
            <div className="text-2xl mb-1">{flag(match.equipo_visitante)}</div>
            <p className="text-sm font-semibold leading-tight">{match.equipo_visitante}</p>
          </div>
        </div>

        {/* Prediction indicator */}
        {prediction && (
          <div className="mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Mi pronóstico:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {prediction.gol_local_pred} - {prediction.gol_visitante_pred}
                </span>
                {match.estado === 'finalizado' && prediction.puntos_obtenidos != null && (
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    +{prediction.puntos_obtenidos} pts
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Venue */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{match.estadio}, {match.ciudad}</span>
        </div>
      </Card>
    </motion.div>
  );
}