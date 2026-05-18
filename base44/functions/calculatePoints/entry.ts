import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { match_id } = await req.json();
  
  // Get the match
  const matches = await base44.asServiceRole.entities.Match.filter({ id: match_id });
  if (!matches.length) {
    return Response.json({ error: 'Match not found' }, { status: 404 });
  }
  const match = matches[0];
  
  if (match.estado !== 'finalizado') {
    return Response.json({ error: 'Match not finished yet' }, { status: 400 });
  }

  // Get all predictions for this match
  const predictions = await base44.asServiceRole.entities.Prediction.filter({ match_id: match.id });
  
  const isKnockout = match.fase !== 'grupos';
  
  for (const pred of predictions) {
    // Get group rules
    const groups = await base44.asServiceRole.entities.Group.filter({ id: pred.group_id });
    if (!groups.length) continue;
    const reglas = groups[0].reglas_puntos || {
      marcador_exacto: 5,
      signo_diferencia: 3,
      solo_signo: 2,
      sin_acierto: 0,
      bonus_eliminacion: 1
    };

    let puntos = 0;
    const gl = match.gol_local;
    const gv = match.gol_visitante;
    const pl = pred.gol_local_pred;
    const pv = pred.gol_visitante_pred;

    if (pl === gl && pv === gv) {
      // Exact score
      puntos = reglas.marcador_exacto;
    } else {
      const realSign = Math.sign(gl - gv);
      const predSign = Math.sign(pl - pv);
      
      if (realSign === predSign) {
        const realDiff = gl - gv;
        const predDiff = pl - pv;
        if (realDiff === predDiff) {
          // Correct sign + exact goal difference
          puntos = reglas.signo_diferencia;
        } else {
          // Only correct sign
          puntos = reglas.solo_signo;
        }
      } else {
        puntos = reglas.sin_acierto;
      }
    }

    // Knockout bonus
    if (isKnockout && match.ganador_penales && pred.ganador_eliminacion_pred) {
      if (pred.ganador_eliminacion_pred === match.ganador_penales) {
        puntos += reglas.bonus_eliminacion;
      }
    }

    // Update prediction points
    await base44.asServiceRole.entities.Prediction.update(pred.id, { puntos_obtenidos: puntos });

    // Update group member total points
    const members = await base44.asServiceRole.entities.GroupMember.filter({
      group_id: pred.group_id,
      user_id: pred.user_id
    });
    if (members.length) {
      // Recalculate total from all predictions
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