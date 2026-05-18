import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown, Copy, Check, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { generateInviteCode } from '@/lib/matchData';
import { toast } from 'sonner';

// New scoring: 12 pts base for correct winner, -1 per goal diff, multiplied by phase
// These legacy fields are kept for DB compatibility but calculatePoints now uses fixed logic
const DEFAULT_RULES = {
  marcador_exacto: 12,
  signo_diferencia: 12,
  solo_signo: 12,
  sin_acierto: 0,
  bonus_eliminacion: 0,
};

const RULE_LABELS = {
  marcador_exacto: 'Marcador exacto',
  signo_diferencia: 'Signo + diferencia exacta',
  solo_signo: 'Solo signo correcto',
  sin_acierto: 'Sin acierto',
  bonus_eliminacion: 'Bonus eliminación (penales)',
};

export default function CreateGroup() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [reglas, setReglas] = useState({ ...DEFAULT_RULES });
  const [rulesOpen, setRulesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!nombre.trim()) return;
    setLoading(true);

    const codigo = generateInviteCode();
    const user = await base44.auth.me();

    const group = await base44.entities.Group.create({
      nombre: nombre.trim(),
      codigo_invitacion: codigo,
      reglas_puntos: reglas,
    });

    // Auto-join as member
    await base44.entities.GroupMember.create({
      group_id: group.id,
      user_id: user.id,
      user_nombre: user.full_name || '',
      user_email: user.email,
      puntos_totales: 0,
    });

    setCreated(group);
    setLoading(false);
  };

  const handleCopy = () => {
    const link = `${window.location.origin}/join/${created.codigo_invitacion}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  if (created) {
    return (
      <div className="p-4 pt-12 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">¡Grupo creado!</h1>
        <p className="text-muted-foreground mb-6">{created.nombre}</p>

        <Card className="p-6 mb-6 max-w-sm mx-auto">
          <p className="text-sm text-muted-foreground mb-2">Código de invitación</p>
          <p className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">
            {created.codigo_invitacion}
          </p>
        </Card>

        <div className="space-y-3 max-w-sm mx-auto">
          <Button onClick={handleCopy} className="w-full" variant="outline">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copiado' : 'Copiar link de invitación'}
          </Button>
          <Button onClick={() => navigate(`/group/${created.id}`)} className="w-full bg-primary">
            Ir al grupo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 pt-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-2xl font-bold mb-6">Crear grupo</h1>

      <div className="space-y-6">
        <div>
          <Label htmlFor="nombre" className="text-sm font-medium">Nombre del grupo</Label>
          <Input
            id="nombre"
            placeholder="Ej: La Oficina, Los Primos..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <Collapsible open={rulesOpen} onOpenChange={setRulesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Settings className="w-4 h-4" /> Reglas de puntos
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${rulesOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card className="p-4 space-y-4">
              {Object.entries(RULE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm">{label}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={reglas[key]}
                    onChange={(e) => setReglas({ ...reglas, [key]: parseInt(e.target.value) || 0 })}
                    className="w-20 text-center"
                  />
                </div>
              ))}
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Button
          onClick={handleCreate}
          disabled={!nombre.trim() || loading}
          className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
        >
          {loading ? 'Creando...' : 'Crear grupo'}
        </Button>
      </div>
    </div>
  );
}