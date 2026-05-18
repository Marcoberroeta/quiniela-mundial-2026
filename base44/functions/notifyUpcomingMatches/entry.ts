import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Runs every 5 minutes. Finds matches whose lockout window (kickoff - 15min) is
// between 55 and 65 minutes from now, then emails every user in any group that
// hasn't yet placed a prediction for that match.
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const now = new Date();
  // Lock = kickoff - 15 min. We want to notify ~1 hour before lock,
  // meaning kickoff is ~75 min away. We scan a 10-min window to avoid
  // missing a run (matches kicking off 70–80 minutes from now).
  const windowStart = new Date(now.getTime() + 70 * 60 * 1000);
  const windowEnd   = new Date(now.getTime() + 80 * 60 * 1000);

  // Fetch all scheduled matches
  const matches = await base44.asServiceRole.entities.Match.filter({ estado: 'programado' }, 'fecha_kickoff', 200);

  const targetMatches = matches.filter(m => {
    const kickoff = new Date(m.fecha_kickoff);
    return kickoff >= windowStart && kickoff <= windowEnd;
  });

  if (targetMatches.length === 0) {
    return Response.json({ notified: 0, message: 'No matches in window' });
  }

  // Get all group members (unique users)
  const allMembers = await base44.asServiceRole.entities.GroupMember.list('user_id', 500);
  const allUsers   = await base44.asServiceRole.entities.User.list('email', 500);
  const userMap    = Object.fromEntries(allUsers.map(u => [u.id, u]));

  let totalSent = 0;

  for (const match of targetMatches) {
    const kickoff   = new Date(match.fecha_kickoff);
    const lockTime  = new Date(kickoff.getTime() - 15 * 60 * 1000);
    const minutesToLock = Math.round((lockTime - now) / 60000);

    // Find every (group, user) pair that doesn't have a prediction for this match
    const existingPreds = await base44.asServiceRole.entities.Prediction.filter({ match_id: match.id });
    const predictedKeys = new Set(existingPreds.map(p => `${p.group_id}_${p.user_id}`));

    // Deduplicate users (one email per user, not per group)
    const notifiedUsers = new Set();

    for (const member of allMembers) {
      const key = `${member.group_id}_${member.user_id}`;
      if (predictedKeys.has(key)) continue;
      if (notifiedUsers.has(member.user_id)) continue;

      const user = userMap[member.user_id];
      if (!user?.email) continue;

      notifiedUsers.add(member.user_id);

      const subject = `⚽ ¡${match.equipo_local} vs ${match.equipo_visitante} en ${minutesToLock} min!`;
      const body = `Hola${user.full_name ? ' ' + user.full_name : ''},

Quedan aproximadamente ${minutesToLock} minutos para que se bloqueen las apuestas del partido:

  ${match.equipo_local} vs ${match.equipo_visitante}
  🕐 Kickoff: ${kickoff.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', dateStyle: 'full', timeStyle: 'short' })}
  🏟️ ${match.estadio}, ${match.ciudad}

¡No olvides registrar tu pronóstico antes de que sea demasiado tarde!

Ingresa a Quiniela Mundial y apuesta ahora.

— El equipo de Quiniela Mundial`;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: user.email,
        subject,
        body,
      });

      totalSent++;
    }
  }

  return Response.json({ notified: totalSent, matches: targetMatches.length });
});