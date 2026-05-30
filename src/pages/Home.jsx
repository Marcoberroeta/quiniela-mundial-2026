import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Plus, ArrowRight, LogOut, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import MatchCard from '@/components/MatchCard';
import PredictionModal from '@/components/PredictionModal';
import { toast } from 'sonner';

export default function Home() {
  const handleDeleteAccount = async () => {
    await base44.auth.logout();
  };

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

  // Primary group (first one the user belongs to, for predictions)
  const primaryGroupId = memberships[0]?.group_id || null;

  // Upcoming matches (next 5)
  const { data: allMatches = [] } = useQuery({
    queryKey: ['matches-upcoming'],
    queryFn: () => base44.entities.Match.filter({ estado: 'programado' }, 'fecha_kickoff', 10),
  });

  // Predictions for primary group
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
      if (existing) {
        return base44.entities.Prediction.update(existing.id, data);
      }
      return base44.entities.Prediction.create({
        ...data,
        user_id: user.id,
        group_id: primaryGroupId,
        match_id: matchId,
      });
    },
    onMutate: async ({ matchId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['predictions-home', user?.id, primaryGroupId] });
      const previous = queryClient.getQueryData(['predictions-home', user?.id, primaryGroupId]);
      queryClient.setQueryData(['predictions-home', user?.id, primaryGroupId], (old = []) => {
        const existing = old.find(p => p.match_id === matchId);
        if (existing) return old.map(p => p.match_id === matchId ? { ...p, ...data } : p);
        return [...old, { match_id: matchId, user_id: user?.id, group_id: primaryGroupId, ...data, id: `optimistic-${matchId}` }];
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['predictions-home', user?.id, primaryGroupId], context.previous);
      }
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
    <div className="p-4">
      {/* Header */}
      <div className="pt-6 pb-8 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4"
        >
          <span className="text-3xl">⚽</span>
        </motion.div>
        <h1 className="text-2xl font-bold">Quiniela Mundial</h1>
        <p className="text-sm text-muted-foreground mt-1">2026 · USA · Canadá · México</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            Hola, <span className="font-medium text-foreground">{user.full_name || user.email}</span> 👋
          </p>
        )}
        {user && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              onClick={() => base44.auth.logout()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3 h-3" /> Cerrar sesión
            </button>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-1 text-xs text-destructive/70 hover:text-destructive transition-colors">
                  <Trash2 className="w-3 h-3" /> Eliminar cuenta
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Perderás todos tus pronósticos y datos asociados. Contacta al administrador si necesitas eliminar tus datos permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Sí, cerrar sesión
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>



      {/* Quick Actions */}
      <div className={`grid gap-3 mb-6 ${user?.role === 'admin' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {user?.role === 'admin' && (
          <Link to="/create-group">
            <Card className="p-4 text-center hover:shadow-md transition-all border-primary/20 bg-primary/5 active:scale-[0.97]">
              <Plus className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm font-semibold">Nuevo grupo</p>
            </Card>
          </Link>
        )}
        <Link to="/join">
          <Card className="p-4 text-center hover:shadow-md transition-all border-accent/30 bg-accent/5 active:scale-[0.97]">
            <Users className="w-6 h-6 mx-auto text-accent mb-2" />
            <p className="text-sm font-semibold">Unirme con código</p>
          </Card>
        </Link>
      </div>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Próximos partidos</h2>
            {!primaryGroupId && (
              <span className="text-xs text-muted-foreground">Únete a un grupo para pronosticar</span>
            )}
          </div>
          <div className="space-y-3">
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

      {/* My Groups */}
      <h2 className="text-lg font-bold mb-3">Mis grupos</h2>

      {groups.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <Trophy className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">
            Aún no perteneces a ningún grupo.
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Crea uno o únete con un código de invitación.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const membership = getMembershipForGroup(group.id);
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link to={`/group/${group.id}`}>
                  <Card className="p-4 hover:shadow-md transition-all active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{group.nombre}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Código: {group.codigo_invitacion}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{membership?.puntos_totales || 0}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">pts</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
      {/* Prediction Modal */}
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