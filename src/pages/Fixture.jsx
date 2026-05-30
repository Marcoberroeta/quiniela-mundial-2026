import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GROUP_STAGE_MATCHES, TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import BracketView from '@/components/BracketView';

const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const estadoStyle = {
  programado: 'bg-muted text-muted-foreground',
  en_vivo:    'bg-red-500 text-white',
  finalizado: 'bg-primary/10 text-primary',
};

function MatchRow({ match }) {
  const kickoff = new Date(match.fecha_kickoff);
  const flag = (t) => TEAM_FLAGS[t] || '🏳️';
  const finished = match.estado === 'finalizado';
  const live = match.estado === 'en_vivo';

  return (
    <Card className="p-3 mb-2 border-border/50">
      {/* Date + status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(kickoff, "EEE d MMM · HH:mm", { locale: es })}
          {' '}(CDM)
        </span>
        <Badge className={`text-[10px] ${estadoStyle[match.estado]}`}>
          {match.estado === 'en_vivo' ? '🔴 En vivo' : match.estado === 'finalizado' ? 'Finalizado' : 'Programado'}
        </Badge>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center gap-1.5">
          <span className="text-xl">{flag(match.equipo_local)}</span>
          <span className="text-sm font-semibold leading-tight">{match.equipo_local}</span>
        </div>

        <div className="flex-shrink-0 text-center w-16">
          {finished || live ? (
            <span className="text-lg font-bold">
              {match.gol_local ?? 0} - {match.gol_visitante ?? 0}
            </span>
          ) : (
            <span className="text-sm font-bold text-primary">
              {format(kickoff, 'HH:mm')}
            </span>
          )}
        </div>

        <div className="flex-1 flex items-center justify-end gap-1.5">
          <span className="text-sm font-semibold leading-tight text-right">{match.equipo_visitante}</span>
          <span className="text-xl">{flag(match.equipo_visitante)}</span>
        </div>
      </div>

      {/* Venue */}
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>{match.estadio}, {match.ciudad}</span>
        <span className="ml-auto text-[10px] font-medium text-muted-foreground/60">#{match.match_number}</span>
      </div>
    </Card>
  );
}

function GroupTab({ letra, dbMatches }) {
  // Prefer DB matches (have real status/scores), fall back to static data
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

  // Build standing table from teams in this group
  const teams = useMemo(() => {
    const teamSet = new Set();
    matches.forEach(m => { teamSet.add(m.equipo_local); teamSet.add(m.equipo_visitante); });
    const stats = {};
    teamSet.forEach(t => { stats[t] = { pts: 0, gf: 0, gc: 0, pj: 0, g: 0, e: 0, p: 0 }; });

    matches.forEach(m => {
      if (m.estado !== 'finalizado') return;
      const gl = m.gol_local, gv = m.gol_visitante;
      stats[m.equipo_local].pj++;
      stats[m.equipo_visitante].pj++;
      stats[m.equipo_local].gf += gl;
      stats[m.equipo_local].gc += gv;
      stats[m.equipo_visitante].gf += gv;
      stats[m.equipo_visitante].gc += gl;
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
      {/* Table */}
      {anyFinished && (
        <Card className="mb-4 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground">
                <th className="text-left p-2 pl-3 font-medium">Equipo</th>
                <th className="p-2 font-medium">PJ</th>
                <th className="p-2 font-medium">G</th>
                <th className="p-2 font-medium">E</th>
                <th className="p-2 font-medium">P</th>
                <th className="p-2 font-medium">DIF</th>
                <th className="p-2 pr-3 font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t, i) => (
                <tr key={t.name} className={`border-t border-border/40 ${i < 2 ? 'bg-primary/5' : ''}`}>
                  <td className="p-2 pl-3 flex items-center gap-1.5 font-medium">
                    <span>{flag(t.name)}</span>
                    <span className="truncate max-w-[90px]">{t.name}</span>
                  </td>
                  <td className="p-2 text-center text-muted-foreground">{t.pj}</td>
                  <td className="p-2 text-center text-muted-foreground">{t.g}</td>
                  <td className="p-2 text-center text-muted-foreground">{t.e}</td>
                  <td className="p-2 text-center text-muted-foreground">{t.p}</td>
                  <td className="p-2 text-center text-muted-foreground">{t.dif > 0 ? '+' : ''}{t.dif}</td>
                  <td className="p-2 pr-3 text-center font-bold text-primary">{t.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Matches */}
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

  const groupMatches = useMemo(() => 
    dbMatches.filter(m => m.fase === 'grupos'),
    [dbMatches]
  );

  const knockoutMatches = useMemo(() => 
    dbMatches.filter(m => m.fase !== 'grupos').sort((a, b) => a.match_number - b.match_number),
    [dbMatches]
  );

  return (
    <div className="pb-24">
      <div className="p-4 bg-muted/40 border-b border-border sticky top-0 z-20">
        <h1 className="text-xl font-bold">Fixture · Mundial 2026</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Horarios CDM (UTC-6)</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab triggers */}
        <div className="overflow-x-auto border-b border-border sticky top-12 z-10 bg-background">
          <TabsList className="inline-flex gap-0 h-10 bg-transparent p-0 w-full justify-start rounded-none border-0">
            <TabsTrigger
              value="grupos"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/30 px-4"
            >
              📊 Grupos
            </TabsTrigger>
            <TabsTrigger
              value="llaves"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/30 px-4"
            >
              ⚽ Llaves
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Grupos tab */}
        <TabsContent value="grupos" className="p-4">
          <div className="mb-5">
            <h2 className="text-lg font-bold mb-3">Fase de Grupos</h2>
            
            {/* Group selector */}
            <div className="overflow-x-auto pb-3 mb-4">
              <div className="inline-flex gap-1">
                {GRUPOS.map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={`h-9 px-3 text-sm font-bold rounded-lg transition-colors ${
                      activeGroup === g
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Grupo content */}
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Grupo {activeGroup}
            </h3>
            <GroupTab letra={activeGroup} dbMatches={groupMatches} />
          </div>
        </TabsContent>

        {/* Llaves tab */}
        <TabsContent value="llaves" className="p-0">
          <BracketView dbMatches={knockoutMatches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
