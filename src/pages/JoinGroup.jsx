import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const BLUE = '#0E63B3';
const GREEN = '#00923F';

export default function JoinGroup() {
  const navigate = useNavigate();
  const { code } = useParams();
  const [inputCode, setInputCode] = useState(code || '');
  const [loading, setLoading] = useState(false);
  const [autoJoining, setAutoJoining] = useState(!!code);

  useEffect(() => {
    if (code) handleJoin(code);
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
    const groups = await base44.entities.Group.filter({ codigo_invitacion: trimmed });
    if (!groups.length) {
      toast.error('Grupo no encontrado');
      setLoading(false);
      setAutoJoining(false);
      return;
    }
    const group = groups[0];
    const existing = await base44.entities.GroupMember.filter({ group_id: group.id, user_id: user.id });
    if (existing.length) {
      toast.info('Ya eres miembro de este grupo');
      navigate(`/group/${group.id}`);
      return;
    }
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, border: `3px solid #c7c3b8`, borderTop: `3px solid ${BLUE}`,
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 11, color: '#9b968a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Uniéndote al grupo...
          </p>
        </div>
      </div>
    );
  }

  const isValid = inputCode.length === 6;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: '16px 16px 96px' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 32, marginTop: 16,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} /> Volver
      </button>

      {/* Header block */}
      <div
        style={{
          border: `3px solid ${INK}`,
          background: BLUE,
          color: '#fff',
          padding: '20px 20px 20px',
          marginBottom: 28,
          boxShadow: `5px 5px 0 ${INK}`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 48, height: 48,
            border: `2px solid rgba(255,255,255,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Users style={{ width: 24, height: 24, color: '#fff' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>
            Unirme a un grupo
          </h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginTop: 4 }}>
            Código de 6 caracteres
          </p>
        </div>
      </div>

      {/* Input area */}
      <div
        style={{
          border: `3px solid ${INK}`,
          background: CONCRETE,
          padding: 20,
          boxShadow: `4px 4px 0 ${INK}`,
          maxWidth: 360,
          margin: '0 auto',
        }}
      >
        <input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          maxLength={6}
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: '0.3em',
            height: 64,
            border: `2px solid ${INK}`,
            background: CONCRETE,
            color: INK,
            outline: 'none',
            marginBottom: 16,
          }}
          onFocus={e => e.target.style.borderColor = BLUE}
          onBlur={e => e.target.style.borderColor = INK}
        />
        <button
          onClick={() => handleJoin()}
          disabled={!isValid || loading}
          style={{
            width: '100%', height: 52,
            border: `2px solid ${INK}`,
            background: !isValid || loading ? '#c7c3b8' : INK,
            color: CONCRETE,
            fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: !isValid || loading ? 'not-allowed' : 'pointer',
            boxShadow: !isValid || loading ? 'none' : `4px 4px 0 ${INK}`,
          }}
        >
          {loading ? 'Buscando...' : 'Unirme'}
        </button>
      </div>
    </div>
  );
}
