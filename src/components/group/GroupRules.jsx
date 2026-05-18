import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, Eye, CheckCircle, Gift, Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const PHASE_MULTIPLIERS = [
  { fase: 'Grupos',        mult: '×1' },
  { fase: 'Dieciseisavos', mult: '×1' },
  { fase: 'Octavos',       mult: '×2' },
  { fase: 'Cuartos',       mult: '×2' },
  { fase: 'Semifinales',   mult: '×3' },
  { fase: 'Tercer Lugar',  mult: '×3' },
  { fase: 'Final',         mult: '×4', highlight: true },
];

function DarkCard({ children, className = '' }) {
  return (
    <div className={`bg-[#1c1c1e] border border-white/8 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-white text-xl font-bold text-center my-5">{children}</h3>;
}

export default function GroupRules({ group, members }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const link = `${window.location.origin}/join/${group.codigo_invitacion}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black min-h-screen -mx-4 -mt-4 px-4 pt-4 pb-24 text-white space-y-1">

      {/* Invite */}
      <DarkCard className="p-4 text-center mb-4">
        <p className="text-gray-400 text-sm mb-1">Código de invitación</p>
        <p className="text-3xl font-mono font-bold tracking-[0.25em] text-[#a3e635] mb-3">
          {group.codigo_invitacion}
        </p>
        <Button
          onClick={handleShare}
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border-0"
        >
          {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied ? 'Copiado' : 'Compartir invitación'}
        </Button>
      </DarkCard>

      {/* Scoring system */}
      <SectionTitle>¿Cómo funciona la puntuación?</SectionTitle>

      {/* Winner correct */}
      <DarkCard className="p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#a3e635] text-lg">🎯</span>
          <span className="font-bold text-[#a3e635]">Ganador correcto o empate</span>
        </div>
        <p className="text-gray-400 text-sm">
          Si aciertas al ganador (o empate), obtienes <span className="text-[#a3e635] font-bold">12 puntos</span>.
        </p>
      </DarkCard>

      {/* Penalty per goal */}
      <DarkCard className="p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400 text-lg">—</span>
          <span className="font-bold text-amber-400">Penalización por gol</span>
        </div>
        <p className="text-gray-400 text-sm">
          Si aciertas al ganador pero no el marcador exacto, se resta{' '}
          <span className="text-amber-400 font-bold">1 pt</span> por cada gol de diferencia.
          Mínimo siempre llevas <span className="text-amber-400 font-bold">1 pt</span>.
        </p>
        <div className="mt-3 rounded-xl overflow-hidden bg-[#111]">
          <div className="p-3 text-sm text-gray-300 border-b border-white/8">
            Dif. goles = 2 → 12 − 2 =
            <span className="float-right font-bold text-[#a3e635]">10 pts</span>
          </div>
          <div className="p-3 text-sm text-gray-300">
            Marcador exacto →
            <span className="float-right font-bold text-[#a3e635]">12 pts ✓</span>
          </div>
        </div>
      </DarkCard>

      {/* Wrong winner */}
      <DarkCard className="p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500 text-lg">✗</span>
          <span className="font-bold text-red-400">Ganador incorrecto</span>
        </div>
        <p className="text-gray-400 text-sm">
          Si no aciertas al ganador, obtienes{' '}
          <span className="text-red-400 font-bold">0 puntos</span> sin importar el marcador.
        </p>
      </DarkCard>

      {/* Phase multipliers */}
      <SectionTitle>Multiplicadores por fase</SectionTitle>
      <DarkCard className="p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#a3e635]" />
          <p className="text-gray-400 text-sm">
            Conforme avanza el torneo, <span className="text-white font-bold">acertar al ganador vale más</span>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PHASE_MULTIPLIERS.map(({ fase, mult, highlight }) => (
            <span
              key={fase}
              className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                highlight
                  ? 'bg-[#a3e635] text-black'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {mult} {fase}
            </span>
          ))}
        </div>
        <div className="mt-3 rounded-xl overflow-hidden bg-[#111]">
          <div className="p-3 text-sm text-gray-400 border-b border-white/8">
            Aciertas el marcador exacto en dos fases:
          </div>
          <div className="flex justify-between p-3 border-b border-white/8">
            <span className="text-sm text-gray-300">Grupos <span className="text-gray-500 text-xs">×1</span></span>
            <span className="font-bold text-[#a3e635]">12 pts</span>
          </div>
          <div className="flex justify-between p-3 bg-[#1a1a1a]">
            <span className="text-sm text-[#a3e635] font-medium">Final <span className="text-gray-400 text-xs">×4</span></span>
            <span className="font-bold text-[#a3e635]">48 pts</span>
          </div>
        </div>
      </DarkCard>

      {/* Visibility */}
      <SectionTitle>¿Puedo ver los picks de otros?</SectionTitle>
      <DarkCard className="p-4 mb-3">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-[#a3e635] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-white text-sm">Partidos en curso o no iniciados</p>
            <p className="text-gray-400 text-sm mt-0.5">Solo ves los picks de otro cuando el partido ya terminó.</p>
          </div>
        </div>
      </DarkCard>
      <DarkCard className="p-4 mb-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#a3e635] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-white text-sm">Partidos finalizados</p>
            <p className="text-gray-400 text-sm mt-0.5">Los picks de todos son visibles para comparar estrategias.</p>
          </div>
        </div>
      </DarkCard>

      {/* Awards */}
      <SectionTitle>Premios y ganador</SectionTitle>
      <DarkCard className="p-4 mb-3">
        <div className="flex items-start gap-3">
          <Gift className="w-5 h-5 text-[#a3e635] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-white text-sm">Premios</p>
            <p className="text-gray-400 text-sm mt-0.5">Ustedes definen qué se juegan, para cuántos lugares y cómo se reparten.</p>
          </div>
        </div>
      </DarkCard>
      <DarkCard className="p-4 mb-3">
        <div className="flex items-start gap-3">
          <Trophy className="w-5 h-5 text-[#a3e635] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-white text-sm">Ganador</p>
            <p className="text-gray-400 text-sm mt-0.5">El que tenga más puntos al final del torneo gana. ¡Así de simple!</p>
          </div>
        </div>
      </DarkCard>

      {/* Members */}
      <SectionTitle>Miembros ({members.length})</SectionTitle>
      <DarkCard className="divide-y divide-white/8">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 flex items-center justify-center">
              <span className="text-xs font-bold text-[#a3e635]">
                {(m.user_nombre || m.user_email || '?')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{m.user_nombre || m.user_email}</p>
            </div>
            <span className="text-sm font-bold text-[#a3e635]">{m.puntos_totales || 0} pts</span>
          </div>
        ))}
      </DarkCard>
    </div>
  );
}