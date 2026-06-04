import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TEAM_FLAGS } from '@/lib/matchData';
import { Minus, Plus, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const INK = '#14130f';
const CONCRETE = '#e4e1d8';
const RED = '#E2001A';
const GREEN = '#00923F';
const YELLOW = '#FFC20E';

function GoalStepper({ value, onChange, label }) {
  const [punching, setPunching] = useState(false);
  const [ghost, setGhost] = useState(null);

  const handleChange = (dir) => {
    const next = value + dir;
    if (next < 0 || next > 10) return;
    onChange(next);
    setPunching(true);
    setGhost({ dir, key: Date.now() });
    setTimeout(() => setPunching(false), 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9b968a' }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `2px solid ${INK}` }}>
        <button
          onClick={() => handleChange(-1)}
          disabled={value <= 0}
          style={{
            width: 40, height: 48,
            border: 'none',
            borderRight: `2px solid ${INK}`,
            background: value <= 0 ? '#c7c3b8' : CONCRETE,
            cursor: value <= 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20, color: value <= 0 ? '#9b968a' : INK,
          }}
        >
          −
        </button>
        <div
          style={{
            width: 56, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'visible',
          }}
        >
          <span
            className={punching ? 'animate-punch' : ''}
            style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: INK }}
          >
            {value}
          </span>
          {ghost && (
            <span
              key={ghost.key}
              className="animate-ghost"
              style={{
                position: 'absolute',
                top: 4, left: '50%',
                fontSize: 14, fontWeight: 700,
                color: ghost.dir > 0 ? GREEN : RED,
                pointerEvents: 'none',
              }}
            >
              {ghost.dir > 0 ? '+1' : '−1'}
            </span>
          )}
        </div>
        <button
          onClick={() => handleChange(1)}
          disabled={value >= 10}
          style={{
            width: 40, height: 48,
            border: 'none',
            borderLeft: `2px solid ${INK}`,
            background: value >= 10 ? '#c7c3b8' : CONCRETE,
            cursor: value >= 10 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20, color: value >= 10 ? '#9b968a' : INK,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function PredictionModal({ match, prediction, open, onClose, onSave, saving }) {
  const [golLocal, setGolLocal] = useState(0);
  const [golVisitante, setGolVisitante] = useState(0);
  const [ganadorElim, setGanadorElim] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pegado, setPegado] = useState(false);

  const isKnockout = match?.fase !== 'grupos';
  const kickoff = match ? new Date(match.fecha_kickoff) : new Date();
  const lockTime = new Date(kickoff.getTime() - 15 * 60 * 1000);
  const isLocked = new Date() >= lockTime || !!prediction;
  const flag = (team) => TEAM_FLAGS[team] || '🏳️';

  useEffect(() => {
    if (prediction) {
      setGolLocal(prediction.gol_local_pred ?? 0);
      setGolVisitante(prediction.gol_visitante_pred ?? 0);
      setGanadorElim(prediction.ganador_eliminacion_pred || null);
    } else {
      setGolLocal(0);
      setGolVisitante(0);
      setGanadorElim(null);
    }
    setPegado(false);
    setShowConfirmation(false);
  }, [prediction, match]);

  if (!match) return null;

  const handleSaveClick = () => setShowConfirmation(true);

  const handleConfirmSave = () => {
    onSave({
      gol_local_pred: golLocal,
      gol_visitante_pred: golVisitante,
      ganador_eliminacion_pred: isKnockout && golLocal === golVisitante ? ganadorElim : null,
    });
    setPegado(true);
    setShowConfirmation(false);
    setTimeout(() => {
      setPegado(false);
      onClose();
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm mx-auto p-0 overflow-hidden"
        style={{
          borderRadius: 0,
          border: `3px solid ${INK}`,
          boxShadow: `5px 5px 0 ${INK}`,
          background: CONCRETE,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* PEGADO stamp overlay */}
        {pegado && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(20,19,15,0.55)',
              pointerEvents: 'none',
            }}
          >
            <div
              className="animate-slam"
              style={{
                background: GREEN,
                color: '#fff',
                border: `4px solid ${INK}`,
                padding: '12px 28px',
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                boxShadow: `4px 4px 0 ${INK}`,
                transformOrigin: 'center',
              }}
            >
              PEGADO
            </div>
          </div>
        )}

        {/* Header strip */}
        <div
          style={{
            background: INK,
            color: CONCRETE,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {isLocked ? '🔒 Bloqueado' : '⚽ Mi pronóstico'}
          </span>
          <span style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.1em' }}>
            {format(kickoff, 'dd MMM · HH:mm', { locale: es })}
          </span>
        </div>

        {/* Match info */}
        <div style={{ padding: '8px 16px', borderBottom: `2px solid ${INK}`, background: '#d8d5cc', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.08em' }}>
            {match.estadio}, {match.ciudad}
          </p>
        </div>

        <div style={{ padding: 16 }}>
          {showConfirmation ? (
            <div>
              {/* Warning block */}
              <div
                style={{
                  border: `2px solid ${YELLOW}`,
                  background: '#fffbe6',
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: INK, marginBottom: 6 }}>
                  ⚠ Pronóstico irreversible
                </p>
                <p style={{ fontSize: 11, color: '#5a5540', lineHeight: 1.5 }}>
                  Una vez guardado <strong>no podrás editar</strong>. Verifica:{' '}
                  <strong>{golLocal} – {golVisitante}</strong>
                  {isKnockout && golLocal === golVisitante && ganadorElim
                    ? ` (${ganadorElim === 'local' ? match.equipo_local : match.equipo_visitante} pen.)`
                    : ''}.
                </p>
                <p style={{ fontSize: 10, color: '#9b968a', marginTop: 6 }}>
                  Pronósticos cierran 15 min antes del kickoff.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowConfirmation(false)}
                  style={{
                    flex: 1, height: 44,
                    border: `2px solid ${INK}`,
                    background: CONCRETE,
                    color: INK,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: `3px 3px 0 ${INK}`,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSave}
                  disabled={saving}
                  style={{
                    flex: 1, height: 44,
                    border: `2px solid ${INK}`,
                    background: GREEN,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: `3px 3px 0 ${INK}`,
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          ) : isLocked ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Lock style={{ width: 32, height: 32, margin: '0 auto 12px', color: '#9b968a' }} />
              <p style={{ fontSize: 12, color: '#9b968a', lineHeight: 1.6 }}>
                {prediction
                  ? 'Ya enviaste tu pronóstico. No se pueden hacer modificaciones.'
                  : 'El pronóstico se bloqueó 15 minutos antes del kickoff.'}
              </p>
              {prediction && (
                <div
                  style={{
                    marginTop: 16,
                    border: `2px solid ${INK}`,
                    padding: '12px 24px',
                    background: '#d8d5cc',
                    display: 'inline-block',
                  }}
                >
                  <p style={{ fontSize: 10, color: '#9b968a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Tu pronóstico
                  </p>
                  <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: INK }}>
                    {prediction.gol_local_pred} – {prediction.gol_visitante_pred}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Steppers */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{flag(match.equipo_local)}</div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: INK, marginBottom: 10 }}>
                    {match.equipo_local}
                  </p>
                  <GoalStepper value={golLocal} onChange={setGolLocal} label="Goles" />
                </div>

                <div style={{ fontSize: 18, fontWeight: 700, color: '#9b968a', paddingTop: 28 }}>vs</div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{flag(match.equipo_visitante)}</div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: INK, marginBottom: 10 }}>
                    {match.equipo_visitante}
                  </p>
                  <GoalStepper value={golVisitante} onChange={setGolVisitante} label="Goles" />
                </div>
              </div>

              {/* Knockout tiebreaker */}
              {isKnockout && golLocal === golVisitante && (
                <div
                  style={{
                    border: `2px solid ${INK}`,
                    padding: 12,
                    marginBottom: 16,
                    background: '#d8d5cc',
                  }}
                >
                  <Label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: 10, color: '#9b968a' }}>
                    ¿Quién avanza en penales?
                  </Label>
                  <RadioGroup
                    value={ganadorElim || ''}
                    onValueChange={setGanadorElim}
                    className="flex justify-center gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="local" id="local" />
                      <Label htmlFor="local" style={{ fontSize: 12, cursor: 'pointer' }}>
                        {flag(match.equipo_local)} {match.equipo_local}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="visitante" id="visitante" />
                      <Label htmlFor="visitante" style={{ fontSize: 12, cursor: 'pointer' }}>
                        {flag(match.equipo_visitante)} {match.equipo_visitante}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSaveClick}
                disabled={saving || (isKnockout && golLocal === golVisitante && !ganadorElim)}
                style={{
                  width: '100%',
                  height: 48,
                  border: `2px solid ${INK}`,
                  background: INK,
                  color: CONCRETE,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: saving || (isKnockout && golLocal === golVisitante && !ganadorElim) ? 'not-allowed' : 'pointer',
                  boxShadow: `3px 3px 0 ${INK}`,
                  opacity: saving || (isKnockout && golLocal === golVisitante && !ganadorElim) ? 0.5 : 1,
                }}
              >
                {saving ? 'Guardando...' : 'Guardar pronóstico'}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}