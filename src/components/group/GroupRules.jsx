import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, Star } from 'lucide-react';
import { toast } from 'sonner';

const RULE_LABELS = {
  marcador_exacto: { label: 'Marcador exacto', icon: '🎯' },
  signo_diferencia: { label: 'Signo + diferencia', icon: '📐' },
  solo_signo: { label: 'Solo signo correcto', icon: '✅' },
  sin_acierto: { label: 'Sin acierto', icon: '❌' },
  bonus_eliminacion: { label: 'Bonus eliminación', icon: '⚡' },
};

export default function GroupRules({ group, members }) {
  const [copied, setCopied] = useState(false);
  const reglas = group.reglas_puntos || {};

  const handleShare = () => {
    const link = `${window.location.origin}/join/${group.codigo_invitacion}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Invite */}
      <Card className="p-4 text-center bg-primary/5 border-primary/20">
        <p className="text-sm text-muted-foreground mb-1">Código de invitación</p>
        <p className="text-2xl font-mono font-bold tracking-[0.2em] text-primary mb-3">
          {group.codigo_invitacion}
        </p>
        <Button onClick={handleShare} variant="outline" size="sm">
          {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied ? 'Copiado' : 'Compartir invitación'}
        </Button>
      </Card>

      {/* Rules */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" /> Reglas de puntos
        </h3>
        <Card className="divide-y divide-border/50">
          {Object.entries(RULE_LABELS).map(([key, { label, icon }]) => (
            <div key={key} className="flex items-center justify-between p-3">
              <span className="text-sm flex items-center gap-2">
                <span>{icon}</span> {label}
              </span>
              <Badge variant="secondary" className="font-bold">
                {reglas[key] ?? 0} pts
              </Badge>
            </div>
          ))}
        </Card>
      </div>

      {/* Members */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" /> Miembros ({members.length})
        </h3>
        <Card className="divide-y divide-border/50">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {(m.user_nombre || m.user_email || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.user_nombre || m.user_email}</p>
              </div>
              <span className="text-sm font-bold">{m.puntos_totales || 0} pts</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}