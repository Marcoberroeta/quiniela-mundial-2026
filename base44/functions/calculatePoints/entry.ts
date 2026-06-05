import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PHASE_MULTIPLIERS = {
  grupos:        1,
  ronda_32:      1,
  octavos:       2,
  cuartos:       2,
  semis:         3,
  tercer_lugar:  3,
  final:         4,
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { match_id } = await req.json();

  const matches = await base44.asServiceRole.entities.Match.filter({ id: match_id });
  if (!matches.length) {
    return Response.json({ error: 'Match not found' }, { status: 404 });
  }
  const match = matches[0];

  if (match.estado !== 'finalizado') {
    return Response.json({ error: 'Match not finished yet' }, { status: 400 });
  }

  const predictions = await base44.asServiceRole.entities.Prediction.filter({ match_id: match.id });
  const multiplier = PHASE_MULTIPLIERS[match.fase] || 1;

  for (const pred of predictions) {
    const gl = match.gol_local;
    const gv = match.gol_visitante;
    const pl = pred.gol_local_pred;
    const pv = pred.gol_visitante_pred;

    const realSign = Math.sign(gl - gv);
    const predSign = Math.sign(pl - pv);

    let puntos = 0;

    if (realSign === predSign) {
      const BASE = 12;
      const scoreDiff = Math.abs(pl - gl) + Math.abs(pv - gv);
      puntos = Math.max(1, BASE - scoreDiff);
    }

    puntos = puntos * multiplier;

    await base44.asServiceRole.entities.Prediction.update(pred.id, { puntos_obtenidos: puntos });
  }

  // Refresh GroupMember totals for all affected users
  const allMembers = await base44.asServiceRole.entities.GroupMember.list('-puntos_totales', 1000);
  const uniqueUserIds = [...new Set(allMembers.map((m: any) => m.user_id))];
  for (const userId of uniqueUserIds) {
    const userPreds = await base44.asServiceRole.entities.Prediction.filter({ user_id: userId });
    const total = userPreds.reduce((sum: number, p: any) => sum + (p.puntos_obtenidos || 0), 0);
    const userMembers = allMembers.filter((m: any) => m.user_id === userId);
    for (const member of userMembers) {
      await base44.asServiceRole.entities.GroupMember.update(member.id, { puntos_totales: total });
    }
  }

  return Response.json({ success: true, predictions_updated: predictions.length });
});