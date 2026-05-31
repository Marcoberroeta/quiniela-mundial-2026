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
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = inputCode.length === 6 && nombre.trim().length >= 2 && telefono.trim().length >= 8;

  const handleJoin = async () => {
    const trimmed = inputCode.toUpperCase().trim();
    setLoading(true);
    const user = await base44.auth.me();
    const groups = await base44.entities.Group.filter({ codigo_invitacion: trimmed });
    if (!groups.length) {
      toast.error('Grupo no encontrado');
      setLoading(false);
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
      user_nombre: nombre.trim(),
      user_email: user.email,
      user_telefono: telefono.trim(),
      puntos_totales: 0,
    });
    toast.success(`¡Te uniste a "${group.nombre}"!`);
    navigate(`/group/${group.id}`);
  };

  const inputStyle = (focused) => ({
    width: '100%',
    height: 48,
    border: `2px solid ${INK}`,
    background: CONCRETE,
    color: INK,
    outline: 'none',
    padding: '0 12px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    marginBottom: 14,
    boxSizing: 'border-box',
  });

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
          padding: '20px',
          marginBottom: 28,
          boxShadow: `5px 5px 0 ${INK}`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{
          width: 48, height: 48,
          border: `2px solid rgba(255,255,255,0.4)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Users style={{ width: 24, height: 24, color: '#fff' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>
            Unirme al grupo
          </h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginTop: 4 }}>
            Llena tus datos para participar
          </p>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          border: `3px solid ${INK}`,
          background: CONCRETE,
          padding: 20,
          boxShadow: `4px 4px 0 ${INK}`,
          maxWidth: 400,
          margin: '0 auto',
        }}
      >
        {/* Code */}
        <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', display: 'block', marginBottom: 8 }}>
          Código de invitación
        </label>
        <input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          maxLength={6}
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: '0.3em',
            height: 58,
            border: `2px solid ${INK}`,
            background: '#fff',
            color: INK,
            outline: 'none',
            marginBottom: 20,
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = BLUE}
          onBlur={e => e.target.style.borderColor = INK}
        />

        {/* Nombre */}
        <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', display: 'block', marginBottom: 8 }}>
          Tu nombre
        </label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Juan García"
          style={{ ...inputStyle(), marginBottom: 20 }}
          onFocus={e => e.target.style.borderColor = BLUE}
          onBlur={e => e.target.style.borderColor = INK}
        />

        {/* Teléfono */}
        <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', display: 'block', marginBottom: 8 }}>
          Teléfono
        </label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: 5512345678"
          type="tel"
          style={{ ...inputStyle(), marginBottom: 24 }}
          onFocus={e => e.target.style.borderColor = BLUE}
          onBlur={e => e.target.style.borderColor = INK}
        />

        <button
          onClick={handleJoin}
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
          {loading ? 'Uniéndome...' : 'Unirme al grupo'}
        </button>
      </div>
    </div>
  );
}