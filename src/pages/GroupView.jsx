import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import GroupUpcoming from '@/components/group/GroupUpcoming';
import GroupLeaderboard from '@/components/group/GroupLeaderboard';
import GroupResults from '@/components/group/GroupResults';
import GroupRules from '@/components/group/GroupRules';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const BLUE = '#0E63B3';
const YELLOW = '#FFC20E';
const GREEN = '#00923F';

const TABS = [
  { key: 'upcoming',  label: 'PRÓXIMOS', color: BLUE },
  { key: 'tabla',     label: 'TABLA',    color: YELLOW },
  { key: 'results',   label: 'RESULTADOS', color: GREEN },
  { key: 'rules',     label: 'REGLAS',   color: INK },
];

export default function GroupView() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => base44.auth.me() });

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
      if (existing) return base44.entities.Prediction.update(existing.id, data);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          width: 32, height: 32,
          border: `3px solid #c7c3b8`,
          borderTop: `3px solid ${RED}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <p style={{ color: '#9b968a', fontSize: 12 }}>Grupo no encontrado</p>
      </div>
    );
  }

  const activeTabData = TABS.find(t => t.key === activeTab);
  const isYellow = activeTabData?.color === YELLOW;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Group header */}
      <div
        style={{
          background: INK,
          borderBottom: `3px solid ${INK}`,
          padding: '16px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, color: '#9b968a', display: 'flex', alignItems: 'center',
          }}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </button>
        <h1 style={{
          flex: 1, fontSize: 16, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.02em', color: CONCRETE,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          textAlign: 'center',
        }}>
          {group.nombre}
        </h1>
        <button
          onClick={handleShare}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: `2px solid rgba(255,255,255,0.2)`,
            padding: 6, cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}
        >
          <Share2 style={{ width: 14, height: 14, color: '#9b968a' }} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: `3px solid ${INK}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: CONCRETE,
        }}
      >
        {TABS.map(({ key, label, color }, idx) => {
          const isActive = activeTab === key;
          const tabIsYellow = color === YELLOW;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                background: isActive ? color : CONCRETE,
                color: isActive ? (tabIsYellow ? INK : '#fff') : '#9b968a',
                borderRight: idx < TABS.length - 1 ? `2px solid ${INK}` : 'none',
                transition: 'background 0.1s',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 16px 96px' }}>
        {activeTab === 'upcoming' && (
          <GroupUpcoming
            matches={matches}
            predictions={predictions}
            onSave={(matchId, data) => savePrediction.mutate({ matchId, data })}
            saving={savePrediction.isPending}
          />
        )}
        {activeTab === 'tabla' && (
          <GroupLeaderboard members={members} currentUserId={user?.id} />
        )}
        {activeTab === 'results' && (
          <GroupResults
            matches={matches}
            predictions={predictions}
            groupId={groupId}
          />
        )}
        {activeTab === 'rules' && (
          <GroupRules group={group} members={members} />
        )}
      </div>
    </div>
  );
}
