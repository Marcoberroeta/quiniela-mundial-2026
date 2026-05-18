import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Share2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import GroupUpcoming from '@/components/group/GroupUpcoming';
import GroupLeaderboard from '@/components/group/GroupLeaderboard';
import GroupResults from '@/components/group/GroupResults';
import GroupRules from '@/components/group/GroupRules';

export default function GroupView() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: group, isLoading: loadingGroup } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const groups = await base44.entities.Group.filter({ id: groupId });
      return groups[0] || null;
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => base44.entities.GroupMember.filter({ group_id: groupId }),
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: () => base44.entities.Match.list('fecha_kickoff', 200),
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions', groupId, user?.id],
    queryFn: () => base44.entities.Prediction.filter({ group_id: groupId, user_id: user?.id }),
    enabled: !!user?.id,
  });

  const savePrediction = useMutation({
    mutationFn: async ({ matchId, data }) => {
      const existing = predictions.find(p => p.match_id === matchId);
      if (existing) {
        return base44.entities.Prediction.update(existing.id, data);
      }
      return base44.entities.Prediction.create({
        user_id: user.id,
        group_id: groupId,
        match_id: matchId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions', groupId] });
      toast.success('Pronóstico guardado');
    },
  });

  const handleShare = () => {
    const link = `${window.location.origin}/join/${group?.codigo_invitacion}`;
    navigator.clipboard.writeText(link);
    toast.success('Link de invitación copiado');
  };

  if (loadingGroup) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-4 pt-8 text-center">
        <p className="text-muted-foreground">Grupo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 mb-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold truncate flex-1 text-center mx-2">{group.nombre}</h1>
        <button onClick={handleShare} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-10 mb-4">
          <TabsTrigger value="upcoming" className="text-xs">Próximos</TabsTrigger>
          <TabsTrigger value="tabla" className="text-xs">Tabla</TabsTrigger>
          <TabsTrigger value="results" className="text-xs">Resultados</TabsTrigger>
          <TabsTrigger value="rules" className="text-xs">Reglas</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <GroupUpcoming
            matches={matches}
            predictions={predictions}
            onSave={(matchId, data) => savePrediction.mutate({ matchId, data })}
            saving={savePrediction.isPending}
          />
        </TabsContent>

        <TabsContent value="tabla">
          <GroupLeaderboard members={members} currentUserId={user?.id} />
        </TabsContent>

        <TabsContent value="results">
          <GroupResults
            matches={matches}
            predictions={predictions}
            groupId={groupId}
          />
        </TabsContent>

        <TabsContent value="rules">
          <GroupRules group={group} members={members} />
        </TabsContent>
      </Tabs>
    </div>
  );
}