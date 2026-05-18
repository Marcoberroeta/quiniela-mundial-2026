// World Cup 2026 Group Stage matches data
// 48 teams, 12 groups (A-L), 3 matches per team = 72 group stage matches
// Then 32 knockout matches = 104 total

export const TEAM_FLAGS = {
  "México": "🇲🇽", "Sudáfrica": "🇿🇦", "Estados Unidos": "🇺🇸", "Canadá": "🇨🇦",
  "Argentina": "🇦🇷", "Brasil": "🇧🇷", "Francia": "🇫🇷", "Alemania": "🇩🇪",
  "España": "🇪🇸", "Inglaterra": "🇬🇧", "Portugal": "🇵🇹", "Países Bajos": "🇳🇱",
  "Italia": "🇮🇹", "Bélgica": "🇧🇪", "Croacia": "🇭🇷", "Uruguay": "🇺🇾",
  "Colombia": "🇨🇴", "Japón": "🇯🇵", "Corea del Sur": "🇰🇷", "Australia": "🇦🇺",
  "Arabia Saudita": "🇸🇦", "Qatar": "🇶🇦", "Ecuador": "🇪🇨", "Irán": "🇮🇷",
  "Senegal": "🇸🇳", "Marruecos": "🇲🇦", "Ghana": "🇬🇭", "Camerún": "🇨🇲",
  "Nigeria": "🇳🇬", "Túnez": "🇹🇳", "Serbia": "🇷🇸", "Suiza": "🇨🇭",
  "Dinamarca": "🇩🇰", "Polonia": "🇵🇱", "Suecia": "🇸🇪", "Gales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Costa Rica": "🇨🇷", "Panamá": "🇵🇦", "Honduras": "🇭🇳", "Jamaica": "🇯🇲",
  "Perú": "🇵🇪", "Chile": "🇨🇱", "Paraguay": "🇵🇾", "Bolivia": "🇧🇴",
  "Venezuela": "🇻🇪", "Egipto": "🇪🇬", "Argelia": "🇩🇿", "Mali": "🇲🇱",
  "Indonesia": "🇮🇩", "Por definir": "🏳️"
};

export const FASE_LABELS = {
  "grupos": "Fase de Grupos",
  "ronda_32": "Ronda de 32",
  "octavos": "Octavos de Final",
  "cuartos": "Cuartos de Final",
  "semis": "Semifinales",
  "tercer_lugar": "Tercer Lugar",
  "final": "Final"
};

export const ESTADO_LABELS = {
  "programado": "Programado",
  "en_vivo": "En vivo",
  "finalizado": "Finalizado"
};

// Group stage matches for World Cup 2026
// Based on confirmed host cities and official draw structure
export const GROUP_STAGE_MATCHES = [
  // Group A
  { match_number: 1, fecha_kickoff: "2026-06-11T18:00:00Z", equipo_local: "México", equipo_visitante: "Sudáfrica", fase: "grupos", grupo_letra: "A", estadio: "Estadio Azteca", ciudad: "Ciudad de México", estado: "programado" },
  { match_number: 2, fecha_kickoff: "2026-06-12T00:00:00Z", equipo_local: "Estados Unidos", equipo_visitante: "Colombia", fase: "grupos", grupo_letra: "A", estadio: "SoFi Stadium", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 3, fecha_kickoff: "2026-06-16T18:00:00Z", equipo_local: "México", equipo_visitante: "Colombia", fase: "grupos", grupo_letra: "A", estadio: "Estadio Azteca", ciudad: "Ciudad de México", estado: "programado" },
  { match_number: 4, fecha_kickoff: "2026-06-16T21:00:00Z", equipo_local: "Sudáfrica", equipo_visitante: "Estados Unidos", fase: "grupos", grupo_letra: "A", estadio: "MetLife Stadium", ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 5, fecha_kickoff: "2026-06-20T18:00:00Z", equipo_local: "Colombia", equipo_visitante: "Sudáfrica", fase: "grupos", grupo_letra: "A", estadio: "AT&T Stadium", ciudad: "Dallas", estado: "programado" },
  { match_number: 6, fecha_kickoff: "2026-06-20T18:00:00Z", equipo_local: "Estados Unidos", equipo_visitante: "México", fase: "grupos", grupo_letra: "A", estadio: "MetLife Stadium", ciudad: "Nueva Jersey", estado: "programado" },
  
  // Group B
  { match_number: 7, fecha_kickoff: "2026-06-11T21:00:00Z", equipo_local: "Argentina", equipo_visitante: "Canadá", fase: "grupos", grupo_letra: "B", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },
  { match_number: 8, fecha_kickoff: "2026-06-12T18:00:00Z", equipo_local: "Perú", equipo_visitante: "Australia", fase: "grupos", grupo_letra: "B", estadio: "BC Place", ciudad: "Vancouver", estado: "programado" },
  { match_number: 9, fecha_kickoff: "2026-06-16T00:00:00Z", equipo_local: "Argentina", equipo_visitante: "Perú", fase: "grupos", grupo_letra: "B", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },
  { match_number: 10, fecha_kickoff: "2026-06-17T18:00:00Z", equipo_local: "Canadá", equipo_visitante: "Australia", fase: "grupos", grupo_letra: "B", estadio: "BMO Field", ciudad: "Toronto", estado: "programado" },
  { match_number: 11, fecha_kickoff: "2026-06-21T18:00:00Z", equipo_local: "Australia", equipo_visitante: "Argentina", fase: "grupos", grupo_letra: "B", estadio: "Gillette Stadium", ciudad: "Boston", estado: "programado" },
  { match_number: 12, fecha_kickoff: "2026-06-21T18:00:00Z", equipo_local: "Canadá", equipo_visitante: "Perú", fase: "grupos", grupo_letra: "B", estadio: "BMO Field", ciudad: "Toronto", estado: "programado" },
  
  // Group C
  { match_number: 13, fecha_kickoff: "2026-06-12T15:00:00Z", equipo_local: "Francia", equipo_visitante: "Dinamarca", fase: "grupos", grupo_letra: "C", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", estado: "programado" },
  { match_number: 14, fecha_kickoff: "2026-06-12T21:00:00Z", equipo_local: "Túnez", equipo_visitante: "Indonesia", fase: "grupos", grupo_letra: "C", estadio: "Lumen Field", ciudad: "Seattle", estado: "programado" },
  { match_number: 15, fecha_kickoff: "2026-06-17T15:00:00Z", equipo_local: "Francia", equipo_visitante: "Túnez", fase: "grupos", grupo_letra: "C", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", estado: "programado" },
  { match_number: 16, fecha_kickoff: "2026-06-17T21:00:00Z", equipo_local: "Dinamarca", equipo_visitante: "Indonesia", fase: "grupos", grupo_letra: "C", estadio: "Lumen Field", ciudad: "Seattle", estado: "programado" },
  { match_number: 17, fecha_kickoff: "2026-06-22T18:00:00Z", equipo_local: "Indonesia", equipo_visitante: "Francia", fase: "grupos", grupo_letra: "C", estadio: "NRG Stadium", ciudad: "Houston", estado: "programado" },
  { match_number: 18, fecha_kickoff: "2026-06-22T18:00:00Z", equipo_local: "Dinamarca", equipo_visitante: "Túnez", fase: "grupos", grupo_letra: "C", estadio: "Lincoln Financial Field", ciudad: "Filadelfia", estado: "programado" },

  // Group D
  { match_number: 19, fecha_kickoff: "2026-06-13T15:00:00Z", equipo_local: "Brasil", equipo_visitante: "Nigeria", fase: "grupos", grupo_letra: "D", estadio: "Rose Bowl", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 20, fecha_kickoff: "2026-06-13T18:00:00Z", equipo_local: "Ecuador", equipo_visitante: "Serbia", fase: "grupos", grupo_letra: "D", estadio: "Lincoln Financial Field", ciudad: "Filadelfia", estado: "programado" },
  { match_number: 21, fecha_kickoff: "2026-06-18T15:00:00Z", equipo_local: "Brasil", equipo_visitante: "Ecuador", fase: "grupos", grupo_letra: "D", estadio: "SoFi Stadium", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 22, fecha_kickoff: "2026-06-18T18:00:00Z", equipo_local: "Nigeria", equipo_visitante: "Serbia", fase: "grupos", grupo_letra: "D", estadio: "NRG Stadium", ciudad: "Houston", estado: "programado" },
  { match_number: 23, fecha_kickoff: "2026-06-23T18:00:00Z", equipo_local: "Serbia", equipo_visitante: "Brasil", fase: "grupos", grupo_letra: "D", estadio: "Gillette Stadium", ciudad: "Boston", estado: "programado" },
  { match_number: 24, fecha_kickoff: "2026-06-23T18:00:00Z", equipo_local: "Nigeria", equipo_visitante: "Ecuador", fase: "grupos", grupo_letra: "D", estadio: "AT&T Stadium", ciudad: "Dallas", estado: "programado" },

  // Group E
  { match_number: 25, fecha_kickoff: "2026-06-13T21:00:00Z", equipo_local: "Alemania", equipo_visitante: "Japón", fase: "grupos", grupo_letra: "E", estadio: "AT&T Stadium", ciudad: "Dallas", estado: "programado" },
  { match_number: 26, fecha_kickoff: "2026-06-14T15:00:00Z", equipo_local: "Bélgica", equipo_visitante: "Costa Rica", fase: "grupos", grupo_letra: "E", estadio: "Levi's Stadium", ciudad: "San Francisco", estado: "programado" },
  { match_number: 27, fecha_kickoff: "2026-06-18T21:00:00Z", equipo_local: "Alemania", equipo_visitante: "Bélgica", fase: "grupos", grupo_letra: "E", estadio: "MetLife Stadium", ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 28, fecha_kickoff: "2026-06-19T15:00:00Z", equipo_local: "Japón", equipo_visitante: "Costa Rica", fase: "grupos", grupo_letra: "E", estadio: "Levi's Stadium", ciudad: "San Francisco", estado: "programado" },
  { match_number: 29, fecha_kickoff: "2026-06-24T18:00:00Z", equipo_local: "Costa Rica", equipo_visitante: "Alemania", fase: "grupos", grupo_letra: "E", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },
  { match_number: 30, fecha_kickoff: "2026-06-24T18:00:00Z", equipo_local: "Japón", equipo_visitante: "Bélgica", fase: "grupos", grupo_letra: "E", estadio: "Rose Bowl", ciudad: "Los Ángeles", estado: "programado" },

  // Group F
  { match_number: 31, fecha_kickoff: "2026-06-14T18:00:00Z", equipo_local: "España", equipo_visitante: "Marruecos", fase: "grupos", grupo_letra: "F", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },
  { match_number: 32, fecha_kickoff: "2026-06-14T21:00:00Z", equipo_local: "Croacia", equipo_visitante: "Panamá", fase: "grupos", grupo_letra: "F", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", estado: "programado" },
  { match_number: 33, fecha_kickoff: "2026-06-19T18:00:00Z", equipo_local: "España", equipo_visitante: "Croacia", fase: "grupos", grupo_letra: "F", estadio: "NRG Stadium", ciudad: "Houston", estado: "programado" },
  { match_number: 34, fecha_kickoff: "2026-06-19T21:00:00Z", equipo_local: "Marruecos", equipo_visitante: "Panamá", fase: "grupos", grupo_letra: "F", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", estado: "programado" },
  { match_number: 35, fecha_kickoff: "2026-06-25T18:00:00Z", equipo_local: "Panamá", equipo_visitante: "España", fase: "grupos", grupo_letra: "F", estadio: "Rose Bowl", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 36, fecha_kickoff: "2026-06-25T18:00:00Z", equipo_local: "Marruecos", equipo_visitante: "Croacia", fase: "grupos", grupo_letra: "F", estadio: "Lumen Field", ciudad: "Seattle", estado: "programado" },

  // Group G
  { match_number: 37, fecha_kickoff: "2026-06-15T15:00:00Z", equipo_local: "Inglaterra", equipo_visitante: "Senegal", fase: "grupos", grupo_letra: "G", estadio: "BC Place", ciudad: "Vancouver", estado: "programado" },
  { match_number: 38, fecha_kickoff: "2026-06-15T18:00:00Z", equipo_local: "Suiza", equipo_visitante: "Jamaica", fase: "grupos", grupo_letra: "G", estadio: "Estadio BBVA", ciudad: "Monterrey", estado: "programado" },
  { match_number: 39, fecha_kickoff: "2026-06-20T15:00:00Z", equipo_local: "Inglaterra", equipo_visitante: "Suiza", fase: "grupos", grupo_letra: "G", estadio: "Levi's Stadium", ciudad: "San Francisco", estado: "programado" },
  { match_number: 40, fecha_kickoff: "2026-06-20T21:00:00Z", equipo_local: "Senegal", equipo_visitante: "Jamaica", fase: "grupos", grupo_letra: "G", estadio: "Estadio BBVA", ciudad: "Monterrey", estado: "programado" },
  { match_number: 41, fecha_kickoff: "2026-06-25T21:00:00Z", equipo_local: "Jamaica", equipo_visitante: "Inglaterra", fase: "grupos", grupo_letra: "G", estadio: "Lincoln Financial Field", ciudad: "Filadelfia", estado: "programado" },
  { match_number: 42, fecha_kickoff: "2026-06-25T21:00:00Z", equipo_local: "Senegal", equipo_visitante: "Suiza", fase: "grupos", grupo_letra: "G", estadio: "Gillette Stadium", ciudad: "Boston", estado: "programado" },

  // Group H
  { match_number: 43, fecha_kickoff: "2026-06-15T21:00:00Z", equipo_local: "Portugal", equipo_visitante: "Irán", fase: "grupos", grupo_letra: "H", estadio: "Gillette Stadium", ciudad: "Boston", estado: "programado" },
  { match_number: 44, fecha_kickoff: "2026-06-15T00:00:00Z", equipo_local: "Paraguay", equipo_visitante: "Arabia Saudita", fase: "grupos", grupo_letra: "H", estadio: "Estadio Akron", ciudad: "Guadalajara", estado: "programado" },
  { match_number: 45, fecha_kickoff: "2026-06-21T15:00:00Z", equipo_local: "Portugal", equipo_visitante: "Paraguay", fase: "grupos", grupo_letra: "H", estadio: "MetLife Stadium", ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 46, fecha_kickoff: "2026-06-21T21:00:00Z", equipo_local: "Irán", equipo_visitante: "Arabia Saudita", fase: "grupos", grupo_letra: "H", estadio: "Estadio Akron", ciudad: "Guadalajara", estado: "programado" },
  { match_number: 47, fecha_kickoff: "2026-06-26T18:00:00Z", equipo_local: "Arabia Saudita", equipo_visitante: "Portugal", fase: "grupos", grupo_letra: "H", estadio: "SoFi Stadium", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 48, fecha_kickoff: "2026-06-26T18:00:00Z", equipo_local: "Irán", equipo_visitante: "Paraguay", fase: "grupos", grupo_letra: "H", estadio: "BC Place", ciudad: "Vancouver", estado: "programado" },

  // Group I
  { match_number: 49, fecha_kickoff: "2026-06-14T00:00:00Z", equipo_local: "Italia", equipo_visitante: "Chile", fase: "grupos", grupo_letra: "I", estadio: "SoFi Stadium", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 50, fecha_kickoff: "2026-06-14T18:00:00Z", equipo_local: "Corea del Sur", equipo_visitante: "Camerún", fase: "grupos", grupo_letra: "I", estadio: "NRG Stadium", ciudad: "Houston", estado: "programado" },
  { match_number: 51, fecha_kickoff: "2026-06-19T00:00:00Z", equipo_local: "Italia", equipo_visitante: "Corea del Sur", fase: "grupos", grupo_letra: "I", estadio: "AT&T Stadium", ciudad: "Dallas", estado: "programado" },
  { match_number: 52, fecha_kickoff: "2026-06-20T00:00:00Z", equipo_local: "Chile", equipo_visitante: "Camerún", fase: "grupos", grupo_letra: "I", estadio: "Lumen Field", ciudad: "Seattle", estado: "programado" },
  { match_number: 53, fecha_kickoff: "2026-06-24T21:00:00Z", equipo_local: "Camerún", equipo_visitante: "Italia", fase: "grupos", grupo_letra: "I", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", estado: "programado" },
  { match_number: 54, fecha_kickoff: "2026-06-24T21:00:00Z", equipo_local: "Chile", equipo_visitante: "Corea del Sur", fase: "grupos", grupo_letra: "I", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },

  // Group J
  { match_number: 55, fecha_kickoff: "2026-06-13T00:00:00Z", equipo_local: "Países Bajos", equipo_visitante: "Ghana", fase: "grupos", grupo_letra: "J", estadio: "Lumen Field", ciudad: "Seattle", estado: "programado" },
  { match_number: 56, fecha_kickoff: "2026-06-13T21:00:00Z", equipo_local: "Venezuela", equipo_visitante: "Egipto", fase: "grupos", grupo_letra: "J", estadio: "Estadio BBVA", ciudad: "Monterrey", estado: "programado" },
  { match_number: 57, fecha_kickoff: "2026-06-17T00:00:00Z", equipo_local: "Países Bajos", equipo_visitante: "Venezuela", fase: "grupos", grupo_letra: "J", estadio: "BC Place", ciudad: "Vancouver", estado: "programado" },
  { match_number: 58, fecha_kickoff: "2026-06-18T00:00:00Z", equipo_local: "Ghana", equipo_visitante: "Egipto", fase: "grupos", grupo_letra: "J", estadio: "Estadio BBVA", ciudad: "Monterrey", estado: "programado" },
  { match_number: 59, fecha_kickoff: "2026-06-23T21:00:00Z", equipo_local: "Egipto", equipo_visitante: "Países Bajos", fase: "grupos", grupo_letra: "J", estadio: "Lincoln Financial Field", ciudad: "Filadelfia", estado: "programado" },
  { match_number: 60, fecha_kickoff: "2026-06-23T21:00:00Z", equipo_local: "Ghana", equipo_visitante: "Venezuela", fase: "grupos", grupo_letra: "J", estadio: "Levi's Stadium", ciudad: "San Francisco", estado: "programado" },

  // Group K
  { match_number: 61, fecha_kickoff: "2026-06-16T15:00:00Z", equipo_local: "Uruguay", equipo_visitante: "Bolivia", fase: "grupos", grupo_letra: "K", estadio: "Estadio Akron", ciudad: "Guadalajara", estado: "programado" },
  { match_number: 62, fecha_kickoff: "2026-06-16T00:00:00Z", equipo_local: "Gales", equipo_visitante: "Argelia", fase: "grupos", grupo_letra: "K", estadio: "Rose Bowl", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 63, fecha_kickoff: "2026-06-22T15:00:00Z", equipo_local: "Uruguay", equipo_visitante: "Gales", fase: "grupos", grupo_letra: "K", estadio: "Estadio Akron", ciudad: "Guadalajara", estado: "programado" },
  { match_number: 64, fecha_kickoff: "2026-06-22T21:00:00Z", equipo_local: "Bolivia", equipo_visitante: "Argelia", fase: "grupos", grupo_letra: "K", estadio: "BMO Field", ciudad: "Toronto", estado: "programado" },
  { match_number: 65, fecha_kickoff: "2026-06-26T21:00:00Z", equipo_local: "Argelia", equipo_visitante: "Uruguay", fase: "grupos", grupo_letra: "K", estadio: "Estadio Azteca", ciudad: "Ciudad de México", estado: "programado" },
  { match_number: 66, fecha_kickoff: "2026-06-26T21:00:00Z", equipo_local: "Bolivia", equipo_visitante: "Gales", fase: "grupos", grupo_letra: "K", estadio: "BMO Field", ciudad: "Toronto", estado: "programado" },

  // Group L
  { match_number: 67, fecha_kickoff: "2026-06-11T15:00:00Z", equipo_local: "Polonia", equipo_visitante: "Honduras", fase: "grupos", grupo_letra: "L", estadio: "Levi's Stadium", ciudad: "San Francisco", estado: "programado" },
  { match_number: 68, fecha_kickoff: "2026-06-12T00:00:00Z", equipo_local: "Qatar", equipo_visitante: "Mali", fase: "grupos", grupo_letra: "L", estadio: "Estadio Akron", ciudad: "Guadalajara", estado: "programado" },
  { match_number: 69, fecha_kickoff: "2026-06-17T15:00:00Z", equipo_local: "Polonia", equipo_visitante: "Qatar", fase: "grupos", grupo_letra: "L", estadio: "AT&T Stadium", ciudad: "Dallas", estado: "programado" },
  { match_number: 70, fecha_kickoff: "2026-06-17T00:00:00Z", equipo_local: "Honduras", equipo_visitante: "Mali", fase: "grupos", grupo_letra: "L", estadio: "Estadio Azteca", ciudad: "Ciudad de México", estado: "programado" },
  { match_number: 71, fecha_kickoff: "2026-06-22T00:00:00Z", equipo_local: "Mali", equipo_visitante: "Polonia", fase: "grupos", grupo_letra: "L", estadio: "Gillette Stadium", ciudad: "Boston", estado: "programado" },
  { match_number: 72, fecha_kickoff: "2026-06-22T00:00:00Z", equipo_local: "Honduras", equipo_visitante: "Qatar", fase: "grupos", grupo_letra: "L", estadio: "Estadio BBVA", ciudad: "Monterrey", estado: "programado" }
];

// Knockout matches - dates TBD based on bracket
export const KNOCKOUT_MATCHES = [
  // Round of 32 (16 matches)
  ...Array.from({ length: 16 }, (_, i) => ({
    match_number: 73 + i,
    fecha_kickoff: `2026-06-${28 + Math.floor(i / 4)}T${15 + (i % 4) * 3}:00:00Z`,
    equipo_local: "Por definir",
    equipo_visitante: "Por definir",
    fase: "ronda_32",
    estadio: "Por definir",
    ciudad: "Por definir",
    estado: "programado"
  })),
  // Round of 16 (8 matches)
  ...Array.from({ length: 8 }, (_, i) => ({
    match_number: 89 + i,
    fecha_kickoff: `2026-07-0${2 + Math.floor(i / 4)}T${16 + (i % 4) * 3}:00:00Z`,
    equipo_local: "Por definir",
    equipo_visitante: "Por definir",
    fase: "octavos",
    estadio: "Por definir",
    ciudad: "Por definir",
    estado: "programado"
  })),
  // Quarter finals (4 matches)
  ...Array.from({ length: 4 }, (_, i) => ({
    match_number: 97 + i,
    fecha_kickoff: `2026-07-0${5 + Math.floor(i / 2)}T${17 + (i % 2) * 3}:00:00Z`,
    equipo_local: "Por definir",
    equipo_visitante: "Por definir",
    fase: "cuartos",
    estadio: "Por definir",
    ciudad: "Por definir",
    estado: "programado"
  })),
  // Semi finals (2 matches)
  { match_number: 101, fecha_kickoff: "2026-07-08T18:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "semis", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  { match_number: 102, fecha_kickoff: "2026-07-09T18:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "semis", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  // Third place
  { match_number: 103, fecha_kickoff: "2026-07-18T18:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "tercer_lugar", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },
  // Final
  { match_number: 104, fecha_kickoff: "2026-07-19T18:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "final", estadio: "MetLife Stadium", ciudad: "Nueva Jersey", estado: "programado" },
];

export const ALL_MATCHES = [...GROUP_STAGE_MATCHES, ...KNOCKOUT_MATCHES];

export function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}