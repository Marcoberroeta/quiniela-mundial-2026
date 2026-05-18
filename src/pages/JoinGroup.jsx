import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JoinGroup() {
  const navigate = useNavigate();
  const { code } = useParams();
  const [inputCode, setInputCode] = useState(code || '');
  const [loading, setLoading] = useState(false);
  const [autoJoining, setAutoJoining] = useState(!!code);

  useEffect(() => {
    if (code) {
      handleJoin(code);
    }
  }, [code]);

  const handleJoin = async (joinCode) => {
    const trimmed = (joinCode || inputCode).toUpperCase().trim();
    if (trimmed.length !== 6) {
      toast.error('El código debe tener 6 caracteres');
      setAutoJoining(false);
      return;
    }

    setLoading(true);
    const user = await base44.auth.me();

    // Find group by code
    const groups = await base44.entities.Group.filter({ codigo_invitacion: trimmed });
    if (!groups.length) {
      toast.error('Grupo no encontrado');
      setLoading(false);
      setAutoJoining(false);
      return;
    }

    const group = groups[0];

    // Check if already a member
    const existing = await base44.entities.GroupMember.filter({
      group_id: group.id,
      user_id: user.id,
    });

    if (existing.length) {
      toast.info('Ya eres miembro de este grupo');
      navigate(`/group/${group.id}`);
      return;
    }

    // Join
    await base44.entities.GroupMember.create({
      group_id: group.id,
      user_id: user.id,
      user_nombre: user.full_name || '',
      user_email: user.email,
      puntos_totales: 0,
    });

    toast.success(`¡Te uniste a "${group.nombre}"!`);
    navigate(`/group/${group.id}`);
  };

  if (autoJoining) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Uniéndote al grupo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 pt-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
          <Users className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold">Unirme a un grupo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ingresa el código de 6 caracteres
        </p>
      </div>

      <Card className="p-6 max-w-sm mx-auto">
        <Input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          className="text-center text-2xl font-mono tracking-[0.3em] h-14"
          maxLength={6}
        />
        <Button
          onClick={() => handleJoin()}
          disabled={inputCode.length !== 6 || loading}
          className="w-full mt-4 bg-primary hover:bg-primary/90 h-12"
        >
          {loading ? 'Buscando...' : 'Unirme'}
        </Button>
      </Card>
    </div>
  );
}