import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, Check, Settings, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { generateInviteCode } from '@/lib/matchData';
import { toast } from 'sonner';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const GREEN = '#00923F';
const YELLOW = '#FFC20E';

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
      <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: '48px 16px 96px', textAlign: 'center' }}>
        {/* Success header */}
        <div
          style={{
            border: `3px solid ${INK}`,
            background: GREEN,
            color: '#fff',
            padding: '20px 24px',
            marginBottom: 24,
            boxShadow: `5px 5px 0 ${INK}`,
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
            ¡Grupo creado!
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            {created.nombre}
          </h1>
        </div>

        {/* Invite code block */}
        <div
          style={{
            border: `3px solid ${INK}`,
            background: CONCRETE,
            padding: '20px 24px',
            marginBottom: 24,
            maxWidth: 320,
            margin: '0 auto 24px',
            boxShadow: `4px 4px 0 ${INK}`,
          }}
        >
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', marginBottom: 10 }}>
            Código de invitación
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, letterSpacing: '0.3em', color: INK }}>
            {created.codigo_invitacion}
          </p>
        </div>

        <div style={{ maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleCopy}
            style={{
              width: '100%', height: 48,
              border: `2px solid ${INK}`,
              background: CONCRETE,
              color: INK,
              fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: `3px 3px 0 ${INK}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
            {copied ? 'Copiado' : 'Copiar link de invitación'}
          </button>
          <button
            onClick={() => navigate(`/group/${created.id}`)}
            style={{
              width: '100%', height: 48,
              border: `2px solid ${INK}`,
              background: INK,
              color: CONCRETE,
              fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: `3px 3px 0 ${INK}`,
            }}
          >
            Ir al grupo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: '16px 16px 96px' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 24, marginTop: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 0,
        }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} /> Volver
      </button>

      {/* Title */}
      <div style={{ borderBottom: `3px solid ${INK}`, paddingBottom: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: INK }}>
          Crear grupo
        </h1>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', display: 'block', marginBottom: 8 }}>
            Nombre del grupo
          </label>
          <Input
            placeholder="Ej: La Oficina, Los Primos..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* Collapsible rules */}
        <div>
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
              borderTop: `2px solid ${INK}`, borderBottom: rulesOpen ? 'none' : `2px solid ${INK}`,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9b968a' }}>
              <Settings style={{ width: 13, height: 13 }} /> Reglas de puntos
            </span>
            <ChevronDown
              style={{
                width: 16, height: 16, color: '#9b968a',
                transform: rulesOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }}
            />
          </button>

          {rulesOpen && (
            <div
              style={{
                border: `2px solid ${INK}`,
                borderTop: 'none',
                background: '#d8d5cc',
                padding: 12,
              }}
            >
              {Object.entries(RULE_LABELS).map(([key, label], idx, arr) => (
                <div
                  key={key}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingBottom: idx < arr.length - 1 ? 10 : 0,
                    marginBottom: idx < arr.length - 1 ? 10 : 0,
                    borderBottom: idx < arr.length - 1 ? `1px solid #c7c3b8` : 'none',
                  }}
                >
                  <label style={{ fontSize: 11, color: INK, fontWeight: 500 }}>{label}</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={reglas[key]}
                    onChange={(e) => setReglas({ ...reglas, [key]: parseInt(e.target.value) || 0 })}
                    style={{
                      width: 64, textAlign: 'center',
                      border: `2px solid ${INK}`,
                      background: CONCRETE,
                      padding: '4px 8px',
                      fontSize: 14, fontWeight: 700,
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={!nombre.trim() || loading}
          style={{
            width: '100%', height: 52,
            border: `2px solid ${INK}`,
            background: !nombre.trim() || loading ? '#c7c3b8' : INK,
            color: CONCRETE,
            fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: !nombre.trim() || loading ? 'not-allowed' : 'pointer',
            boxShadow: !nombre.trim() || loading ? 'none' : `4px 4px 0 ${INK}`,
            transition: 'background 0.1s',
          }}
        >
          {loading ? 'Creando...' : 'Crear grupo'}
        </button>
      </div>
    </div>
  );
}
