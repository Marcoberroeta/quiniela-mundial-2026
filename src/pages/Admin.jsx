import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, RefreshCw, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ALL_MATCHES, TEAM_FLAGS, FASE_LABELS } from '@/lib/matchData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingMatch, setEditingMatch] = useState(null);
  const [golLocal, setGolLocal] = useState('');
  const [golVisitante, setGolVisitante] = useState('');
  const [ganadorPenales, setGanadorPenales] = useState('');
  const [loadingImport, setLoadingImport] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: () => base44.entities.Match.list('fecha_kickoff', 200),
  });

  const updateMatch = useMutation({
    mutationFn: async ({ matchId, data }) => {
      await base44.entities.Match.update(matchId, data);
      if (data.estado === 'finalizado') {
        await base44.functions.invoke('calculatePoints', { match_id: matchId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      setEditingMatch(null);
      toast.success('Partido actualizado');
    },
  });

  const handleImportMatches = async () => {
    setLoadingImport(true);
    let count = 0;
    const batchSize = 10;
    
    for (let i = 0; i < ALL_MATCHES.length; i += batchSize) {
      const batch = ALL_MATCHES.slice(i, i + batchSize);
      await base44.entities.Match.bulkCreate(batch);
      count += batch.length;
    }
    
    queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
    toast.success(`${count} partidos importados`);
    setLoadingImport(false);
  };

  const handleUpdateResult = () => {
    if (!editingMatch) return;
    const data = {
      gol_local: parseInt(golLocal),
      gol_visitante: parseInt(golVisitante),
      estado: 'finalizado',
    };
    if (ganadorPenales) data.ganador_penales = ganadorPenales;
    updateMatch.mutate({ matchId: editingMatch.id, data });
  };

  const filteredMatches = matches.filter(m =>
    !search || 
    m.equipo_local?.toLowerCase().includes(search.toLowerCase()) ||
    m.equipo_visitante?.toLowerCase().includes(search.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="p-4 pt-12 text-center">
        <p className="text-muted-foreground">Acceso restringido a administradores</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 pt-4 mb-6">
        <button onClick={() => navigate('/')} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold">Administración</h1>
      </div>

      {/* Import */}
      {matches.length === 0 && (
        <Card className="p-6 mb-6 text-center border-dashed">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            No hay partidos cargados. Importa los 104 partidos del Mundial 2026.
          </p>
          <Button onClick={handleImportMatches} disabled={loadingImport} className="bg-primary">
            {loadingImport ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Importando...</>
            ) : (
              <><Upload className="w-4 h-4 mr-2" /> Importar partidos</>
            )}
          </Button>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Match list */}
      <div className="space-y-2">
        {filteredMatches.map((match) => {
          const flag = (t) => TEAM_FLAGS[t] || '🏳️';
          const isEditing = editingMatch?.id === match.id;

          return (
            <Card key={match.id} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    {match.grupo_letra ? `G${match.grupo_letra}` : FASE_LABELS[match.fase]?.slice(0, 8)}
                  </Badge>
                  <Badge className={
                    match.estado === 'finalizado' ? 'bg-primary/10 text-primary' :
                    match.estado === 'en_vivo' ? 'bg-red-500 text-white' :
                    'bg-muted text-muted-foreground'
                  }>
                    {match.estado}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(match.fecha_kickoff), 'dd/MM HH:mm')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {flag(match.equipo_local)} {match.equipo_local} vs {flag(match.equipo_visitante)} {match.equipo_visitante}
                </span>
                {match.estado === 'finalizado' ? (
                  <span className="text-sm font-bold">{match.gol_local} - {match.gol_visitante}</span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => {
                      setEditingMatch(match);
                      setGolLocal('');
                      setGolVisitante('');
                      setGanadorPenales('');
                    }}
                  >
                    Resultado
                  </Button>
                )}
              </div>

              {isEditing && (
                <div className="mt-3 pt-3 border-t space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Local"
                      value={golLocal}
                      onChange={(e) => setGolLocal(e.target.value)}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">-</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Visit."
                      value={golVisitante}
                      onChange={(e) => setGolVisitante(e.target.value)}
                      className="w-20 text-center"
                    />
                  </div>
                  {match.fase !== 'grupos' && (
                    <Select value={ganadorPenales} onValueChange={setGanadorPenales}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Penales (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">{match.equipo_local}</SelectItem>
                        <SelectItem value="visitante">{match.equipo_visitante}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingMatch(null)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary"
                      disabled={golLocal === '' || golVisitante === '' || updateMatch.isPending}
                      onClick={handleUpdateResult}
                    >
                      {updateMatch.isPending ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}