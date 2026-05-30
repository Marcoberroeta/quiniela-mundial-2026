import React, { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_FLAGS, FASE_LABELS, KNOCKOUT_MATCHES } from '@/lib/matchData';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

const PHASES = [
  { key: 'ronda_32', label: 'Ronda de 32', matches_count: 16 },
  { key: 'octavos', label: 'Octavos de Final', matches_count: 8 },
  { key: 'cuartos', label: 'Cuartos de Final', matches_count: 4 },
  { key: 'semis', label: 'Semifinales', matches_count: 2 },
  { key: 'final', label: 'Final', matches_count: 1 },
];

interface BracketMatchProps {
  match: any;
}

function BracketMatch({ match }: BracketMatchProps) {
  const flag = (t: string) => TEAM_FLAGS[t] || '🏳️';
  const kickoff = new Date(match.fecha_kickoff);
  const finished = match.estado === 'finalizado';
  const live = match.estado === 'en_vivo';
  const isKnown = match.equipo_local !== 'Por definir';

  return (
    <Card className="mb-3 overflow-hidden border border-border/50 hover:shadow-md transition-shadow">
      {/* Match number + time */}
      <div className="px-3 py-1.5 bg-muted/40 border-b border-border/30 flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase">
          #{match.match_number}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {format(kickoff, 'HH:mm', { locale: es })}
          </span>
          {finished && <Badge className="text-[9px] bg-primary/10 text-primary">✓ Final</Badge>}
          {live && <Badge className="text-[9px] bg-red-500 text-white">🔴 Vivo</Badge>}
        </div>
      </div>

      {/* Teams */}
      <div className="divide-y divide-border/30">
        {/* Local */}
        <div
          className={`p-2 flex items-center justify-between gap-2 ${
            finished && match.gol_local > match.gol_visitante
              ? 'bg-primary/10 font-semibold'
              : isKnown ? '' : 'bg-muted/20'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-lg flex-shrink-0">{flag(match.equipo_local)}</span>
            <span className="text-xs truncate">
              {isKnown ? match.equipo_local : '⏳ Por definir'}
            </span>
          </div>
          {(finished || live) && (
            <span className="text-sm font-bold text-center w-6 flex-shrink-0">
              {match.gol_local ?? '-'}
            </span>
          )}
        </div>

        {/* Visitante */}
        <div
          className={`p-2 flex items-center justify-between gap-2 ${
            finished && match.gol_visitante > match.gol_local
              ? 'bg-primary/10 font-semibold'
              : isKnown ? '' : 'bg-muted/20'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-lg flex-shrink-0">{flag(match.equipo_visitante)}</span>
            <span className="text-xs truncate">
              {isKnown ? match.equipo_visitante : '⏳ Por definir'}
            </span>
          </div>
          {(finished || live) && (
            <span className="text-sm font-bold text-center w-6 flex-shrink-0">
              {match.gol_visitante ?? '-'}
            </span>
          )}
        </div>
      </div>

      {/* Venue info */}
      {finished && (
        <div className="px-3 py-1 text-[9px] text-muted-foreground border-t border-border/30 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          <span className="truncate">
            {match.estadio}, {match.ciudad}
          </span>
        </div>
      )}

      {/* Tied match indicator for knockout */}
      {finished && match.gol_local === match.gol_visitante && match.fase !== 'grupos' && (
        <div className="px-3 py-1 text-[9px] bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200 border-t border-yellow-200 dark:border-yellow-800 flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5" />
          <span>Definido en penales/prórroga</span>
        </div>
      )}
    </Card>
  );
}

function PhaseColumn({ phase, matches }: { phase: any; matches: any[] }) {
  return (
    <div className="flex-shrink-0 w-56">
      <div className="sticky top-0 bg-background/80 backdrop-blur z-10 pb-2 mb-2">
        <h3 className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">
          {phase.label}
        </h3>
        <div className="text-[9px] text-center text-muted-foreground/60">
          {matches.length} partidos
        </div>
      </div>
      <div className="space-y-2">
        {matches.map(m => (
          <BracketMatch key={m.id || m.match_number} match={m} />
        ))}
      </div>
    </div>
  );
}

interface BracketViewProps {
  dbMatches: any[];
}

function BracketView({ dbMatches }: BracketViewProps) {
  const byPhase = useMemo(() => {
    const map: Record<string, any[]> = {};
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
      <div className="p-4 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">
          Los partidos de eliminatorias se mostrarán aquí cuando comience esa fase.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 p-4 min-w-max">
        {PHASES.map(phase => (
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

export default function BracketPage() {
  const { data: knockoutMatches = [] } = useQuery({
    queryKey: ['knockout-matches'],
    queryFn: () =>
      base44.entities.Match.filter(
        { fase: 'ronda_32' },
        'match_number',
        200
      ).then(matches => {
        // Fetch all knockout phases
        return Promise.all([
          matches,
          base44.entities.Match.filter({ fase: 'octavos' }, 'match_number', 100),
          base44.entities.Match.filter({ fase: 'cuartos' }, 'match_number', 100),
          base44.entities.Match.filter({ fase: 'semis' }, 'match_number', 100),
          base44.entities.Match.filter({ fase: 'final' }, 'match_number', 100),
        ]).then(([r32, oct, cuart, semi, fin]) =>
          [...r32, ...oct, ...cuart, ...semi, ...fin].sort(
            (a, b) => a.match_number - b.match_number
          )
        );
      }),
  });

  return (
    <div className="pb-24">
      <div className="p-4 bg-muted/40 border-b border-border sticky top-0 z-20">
        <h1 className="text-xl font-bold">⚽ Llaves · Eliminatorias</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Visualiza el árbol del torneo desde Ronda de 32 hasta la Final
        </p>
      </div>

      <BracketView dbMatches={knockoutMatches} />
    </div>
  );
}
