import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4';
const API_KEY = Deno.env.get('FOOTBALL_DATA_API_KEY') || '';

// Map match statuses from API to our schema
const STATUS_MAP = {
  'SCHEDULED': 'programado',
  'LIVE': 'en_vivo',
  'IN_PLAY': 'en_vivo',
  'PAUSED': 'en_vivo',
  'FINISHED': 'finalizado',
};

// Bracket advancement rules: after match N finishes, which slots should be filled
const ADVANCEMENT_RULES = {
  // Ronda de 32 (73-88) → Octavos (89-96)
  '73': { target: '89', slot: 'local' },   // W73 vs W74 → 89
  '74': { target: '89', slot: 'visitante' },
  '75': { target: '90', slot: 'local' },
  '76': { target: '90', slot: 'visitante' },
  '77': { target: '91', slot: 'local' },
  '78': { target: '91', slot: 'visitante' },
  '79': { target: '92', slot: 'local' },
  '80': { target: '92', slot: 'visitante' },
  '81': { target: '93', slot: 'local' },
  '82': { target: '93', slot: 'visitante' },
  '83': { target: '94', slot: 'local' },
  '84': { target: '94', slot: 'visitante' },
  '85': { target: '95', slot: 'local' },
  '86': { target: '95', slot: 'visitante' },
  '87': { target: '96', slot: 'local' },
  '88': { target: '96', slot: 'visitante' },
  // Octavos (89-96) → Cuartos (97-100)
  '89': { target: '97', slot: 'local' },
  '90': { target: '97', slot: 'visitante' },
  '91': { target: '98', slot: 'local' },
  '92': { target: '98', slot: 'visitante' },
  '93': { target: '99', slot: 'local' },
  '94': { target: '99', slot: 'visitante' },
  '95': { target: '100', slot: 'local' },
  '96': { target: '100', slot: 'visitante' },
  // Cuartos (97-100) → Semis (101-102)
  '97': { target: '101', slot: 'local' },
  '98': { target: '101', slot: 'visitante' },
  '99': { target: '102', slot: 'local' },
  '100': { target: '102', slot: 'visitante' },
  // Semis (101-102) → Final (104) + Tercer lugar (103)
  '101': { target: '104', slot: 'local' },  // Winner to Final
  '102': { target: '104', slot: 'visitante' }, // Winner to Final
};

interface MatchResult {
  id: number;
  utcDate: string;
  status: string;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
  homeTeam: { name: string };
  awayTeam: { name: string };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  // Check if user is admin or system
  const user = await base44.auth.me().catch(() => null);
  if (user?.role !== 'admin' && req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  console.log('🔄 Starting sync of World Cup 2026 results...');

  try {
    // Fetch all matches from football-data.org
    // Using 2026 FIFA World Cup competition ID
    const response = await fetch(`${FOOTBALL_DATA_API}/competitions/WC/matches`, {
      headers: { 'X-Auth-Token': API_KEY }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const apiMatches: MatchResult[] = data.matches || [];

    console.log(`📊 Fetched ${apiMatches.length} matches from API`);

    // Get all matches from DB
    const dbMatches = await base44.asServiceRole.entities.Match.filter({}, 'match_number', 200);
    console.log(`📂 Found ${dbMatches.length} matches in database`);

    let updated = 0;
    let pointsCalculated = 0;
    let advancementsApplied = 0;

    // Process each API match
    for (const apiMatch of apiMatches) {
      const matchDate = new Date(apiMatch.utcDate);
      const homeTeam = apiMatch.homeTeam.name;
      const awayTeam = apiMatch.awayTeam.name;

      // Find corresponding match in DB by team names and approximate date
      const dbMatch = dbMatches.find(m => {
        const sameTeams = (m.equipo_local === homeTeam && m.equipo_visitante === awayTeam) ||
                          (m.equipo_local === awayTeam && m.equipo_visitante === homeTeam);
        const kickoffTime = new Date(m.fecha_kickoff);
        const timeDiff = Math.abs(matchDate.getTime() - kickoffTime.getTime()) / (1000 * 60); // minutes
        return sameTeams && timeDiff < 120; // Allow 2-hour tolerance
      });

      if (!dbMatch) {
        console.log(`⚠️  No DB match found for: ${homeTeam} vs ${awayTeam}`);
        continue;
      }

      const newStatus = STATUS_MAP[apiMatch.status as keyof typeof STATUS_MAP] || 'programado';
      const newGoalsHome = apiMatch.score.fullTime.home;
      const newGoalsAway = apiMatch.score.fullTime.away;

      // Check if anything changed
      const statusChanged = dbMatch.estado !== newStatus;
      const goalsChanged = (dbMatch.gol_local !== newGoalsHome || dbMatch.gol_visitante !== newGoalsAway);

      if (!statusChanged && !goalsChanged) {
        continue; // No update needed
      }

      console.log(`📝 Updating match #${dbMatch.match_number}: ${homeTeam} vs ${awayTeam}`);
      console.log(`   Old: ${dbMatch.estado} (${dbMatch.gol_local}-${dbMatch.gol_visitante}) → New: ${newStatus} (${newGoalsHome}-${newGoalsAway})`);

      // Update match
      await base44.asServiceRole.entities.Match.update(dbMatch.id, {
        estado: newStatus,
        gol_local: newGoalsHome,
        gol_visitante: newGoalsAway,
      });

      updated++;

      // If match just finished, calculate points for all predictions
      if (apiMatch.status === 'FINISHED' && dbMatch.estado !== 'finalizado') {
        console.log(`🏆 Match #${dbMatch.match_number} finished! Calculating points...`);
        
        try {
          const pointsResult = await fetch(
            `${Deno.env.get('BASE44_URL') || 'http://localhost:3000'}/api/calculatePoints`,
            {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-admin-secret': Deno.env.get('ADMIN_SECRET') || '',
              },
              body: JSON.stringify({ match_id: dbMatch.id })
            }
          );

          if (pointsResult.ok) {
            pointsCalculated++;
            console.log(`✅ Points calculated for match #${dbMatch.match_number}`);
          } else {
            console.error(`❌ Failed to calculate points: ${pointsResult.statusText}`);
          }
        } catch (err) {
          console.error(`❌ Error calculating points:`, err);
        }

        // Apply bracket advancements for knockout matches
        if (dbMatch.fase !== 'grupos') {
          const advancement = ADVANCEMENT_RULES[dbMatch.match_number.toString()];
          if (advancement && newGoalsHome !== null && newGoalsAway !== null) {
            const winner = newGoalsHome > newGoalsAway ? dbMatch.equipo_local : dbMatch.equipo_visitante;
            
            console.log(`🔗 Advancing ${winner} to match #${advancement.target} (${advancement.slot})`);

            const targetMatch = dbMatches.find(m => m.match_number === parseInt(advancement.target));
            if (targetMatch) {
              const updateObj = advancement.slot === 'local' 
                ? { equipo_local: winner }
                : { equipo_visitante: winner };
              
              await base44.asServiceRole.entities.Match.update(targetMatch.id, updateObj);
              advancementsApplied++;
              console.log(`✅ Updated match #${advancement.target}`);
            }
          }
        }
      }
    }

    console.log(`\n✅ Sync complete: ${updated} matches updated, ${pointsCalculated} points calculated, ${advancementsApplied} advancements applied`);

    return Response.json({
      success: true,
      matches_updated: updated,
      points_calculated: pointsCalculated,
      advancements_applied: advancementsApplied,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Sync error:', error);
    return Response.json(
      { 
        error: 'Sync failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
});
