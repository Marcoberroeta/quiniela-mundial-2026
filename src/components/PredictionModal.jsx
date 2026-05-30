import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TEAM_FLAGS } from '@/lib/matchData';
import { Minus, Plus, Lock, Save, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function GoalStepper({ value, onChange, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-3xl font-bold w-10 text-center">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => onChange(Math.min(10, value + 1))}
          disabled={value >= 10}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function PredictionModal({ match, prediction, open, onClose, onSave, saving }) {
  const [golLocal, setGolLocal] = useState(0);
  const [golVisitante, setGolVisitante] = useState(0);
  const [ganadorElim, setGanadorElim] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isKnockout = match?.fase !== 'grupos';
  const kickoff = match ? new Date(match.fecha_kickoff) : new Date();
  // Fase de grupos: bloqueo 1 día antes del inicio del mundial (10 jun 2026 23:59 CDM = 11 jun 05:59 UTC)
  // Eliminatorias: bloqueo 15 min antes del kickoff del partido
  const WORLD_CUP_START = new Date('2026-06-11T05:59:00Z');
  const lockTime = match?.fase === 'grupos'
    ? WORLD_CUP_START
    : new Date(kickoff.getTime() - 15 * 60 * 1000);
  // Locked if time passed OR if prediction already submitted (no edits allowed)
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
  }, [prediction, match]);

  if (!match) return null;

  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    onSave({
      gol_local_pred: golLocal,
      gol_visitante_pred: golVisitante,
      ganador_eliminacion_pred: isKnockout && golLocal === golVisitante ? ganadorElim : null
    });
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {isLocked ? '🔒 Pronóstico bloqueado' : '⚽ Mi pronóstico'}
          </DialogTitle>
        </DialogHeader>

        {/* Match info */}
        <div className="text-center mb-2">
          <p className="text-xs text-muted-foreground">
            {format(kickoff, "EEEE d 'de' MMMM, HH:mm", { locale: es })}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{match.estadio}, {match.ciudad}</p>
        </div>

        {showConfirmation ? (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                    ⚠️ Pronóstico irreversible
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Una vez que guardes tu pronóstico, <strong>no podrás editarlo más</strong>. 
                    Verifica que {golLocal} - {golVisitante} 
                    {isKnockout && golLocal === golVisitante ? ` (${ganadorElim === 'local' ? match.equipo_local : match.equipo_visitante} en penales)` : ''} 
                    sea tu predicción final.
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-2">
                    {match?.fase === 'grupos'
                      ? '📅 Los pronósticos de fase de grupos se bloquearán 1 día antes del inicio del Mundial.'
                      : '⏱️ Este pronóstico se bloqueará 15 minutos antes del kickoff.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleCancelConfirmation}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {saving ? 'Guardando...' : 'Sí, confirmar'}
              </Button>
            </div>
          </div>
        ) : isLocked ? (
          <div className="text-center py-8">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {prediction
                ? 'Ya enviaste tu pronóstico. No se pueden hacer modificaciones.'
                : match?.fase === 'grupos'
                  ? 'Los pronósticos de fase de grupos se cerraron 1 día antes del inicio del Mundial.'
                  : 'El pronóstico se bloqueó 15 minutos antes del kickoff.'}
            </p>
            {prediction && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tu pronóstico:</p>
                <p className="text-2xl font-bold mt-1">
                  {prediction.gol_local_pred} - {prediction.gol_visitante_pred}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goal steppers */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl mb-1">{flag(match.equipo_local)}</div>
                <p className="text-xs font-medium mb-3">{match.equipo_local}</p>
                <GoalStepper value={golLocal} onChange={setGolLocal} label="Goles" />
              </div>

              <div className="text-2xl font-bold text-muted-foreground pt-8">vs</div>

              <div className="text-center">
                <div className="text-3xl mb-1">{flag(match.equipo_visitante)}</div>
                <p className="text-xs font-medium mb-3">{match.equipo_visitante}</p>
                <GoalStepper value={golVisitante} onChange={setGolVisitante} label="Goles" />
              </div>
            </div>

            {/* Knockout tie-breaker */}
            {isKnockout && golLocal === golVisitante && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium mb-3 block text-center">
                  ¿Quién avanza en penales?
                </Label>
                <RadioGroup
                  value={ganadorElim || ''}
                  onValueChange={setGanadorElim}
                  className="flex justify-center gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local" className="text-sm cursor-pointer">
                      {flag(match.equipo_local)} {match.equipo_local}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="visitante" id="visitante" />
                    <Label htmlFor="visitante" className="text-sm cursor-pointer">
                      {flag(match.equipo_visitante)} {match.equipo_visitante}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        )}

        {!isLocked && !showConfirmation && (
          <DialogFooter>
            <Button
              onClick={handleSaveClick}
              disabled={saving || (isKnockout && golLocal === golVisitante && !ganadorElim)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar pronóstico'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
