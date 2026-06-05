import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const GREEN = '#00923F';

export default function ProfileSetupModal({ user, onComplete }) {
  const [nombre, setNombre] = useState(user?.full_name || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!telefono.trim()) { setError('El teléfono es obligatorio.'); return; }
    setSaving(true);
    try {
      await base44.auth.updateMe({ full_name: nombre.trim(), telefono: telefono.trim() });
      onComplete();
    } catch (e) {
      setError('Error al guardar. Intenta de nuevo.');
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20,19,15,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        border: `3px solid ${INK}`,
        boxShadow: `6px 6px 0 ${INK}`,
        background: CONCRETE,
      }}>
        {/* Header */}
        <div style={{ background: INK, padding: '16px 20px' }}>
          <div style={{ display: 'flex', height: 4, marginBottom: 14 }}>
            {[RED, '#FFC20E', '#0E63B3', GREEN].map(c => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9b968a', marginBottom: 4 }}>
            Bienvenido
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: CONCRETE }}>
            Completa tu perfil
          </h2>
        </div>

        {/* Form */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 11, color: '#9b968a', lineHeight: 1.6, marginTop: -4 }}>
            Necesitamos tu nombre y teléfono para participar en la quiniela.
          </p>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', display: 'block', marginBottom: 6 }}>
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ej: Juan García"
              value={nombre}
              onChange={e => { setNombre(e.target.value); setError(''); }}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: `2px solid ${INK}`,
                background: '#fff',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9b968a', display: 'block', marginBottom: 6 }}>
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="Ej: 5512345678"
              value={telefono}
              onChange={e => { setTelefono(e.target.value); setError(''); }}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: `2px solid ${INK}`,
                background: '#fff',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 11, color: RED, fontWeight: 700 }}>{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', height: 50,
              border: `2px solid ${INK}`,
              background: saving ? '#9b968a' : INK,
              color: CONCRETE,
              fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : `4px 4px 0 ${RED}`,
              marginTop: 4,
            }}
          >
            {saving ? 'Guardando...' : 'Entrar a la quiniela →'}
          </button>
        </div>
      </div>
    </div>
  );
}