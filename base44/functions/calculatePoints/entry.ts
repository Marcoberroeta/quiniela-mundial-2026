import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Phase multipliers
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
      // Winner (or draw) correct: 12 pts base, minus 1 pt per goal difference between prediction and result
      const BASE = 12;
      const predDiff = Math.abs((pl - pv) - (gl - gv));  // goal difference error
      const scoreDiff = Math.abs(pl - gl) + Math.abs(pv - gv); // total goal error
      // Penalty: 1 pt per goal of total difference, minimum 1 pt
      const penalty = scoreDiff;
      puntos = Math.max(1, BASE - penalty);
    } else {
      // Wrong winner = 0 pts
      puntos = 0;
    }

    // Apply phase multiplier
    puntos = puntos * multiplier;

    await base44.asServiceRole.entities.Prediction.update(pred.id, { puntos_obtenidos: puntos });

    // Recalculate member total
    const members = await base44.asServiceRole.entities.GroupMember.filter({
      group_id: pred.group_id,
      user_id: pred.user_id
    });
    if (members.length) {
      const allPreds = await base44.asServiceRole.entities.Prediction.filter({
        group_id: pred.group_id,
        user_id: pred.user_id
      });
      const total = allPreds.reduce((sum, p) => sum + (p.puntos_obtenidos || 0), 0);
      await base44.asServiceRole.entities.GroupMember.update(members[0].id, { puntos_totales: total });
    }
  }

  return Response.json({ success: true, predictions_updated: predictions.length });
});