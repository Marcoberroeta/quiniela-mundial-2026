// World Cup 2026 - Fixture oficial (sorteo 5 dic 2025 + clasificatorias 31 mar 2026)
// 48 equipos, 12 grupos (A-L), 4 equipos por grupo
// 72 partidos fase de grupos + 32 partidos eliminatorias = 104 total
// Horarios en UTC

export const TEAM_FLAGS = {
  // Grupo A
  "México": "🇲🇽", "Sudáfrica": "🇿🇦", "Corea del Sur": "🇰🇷", "Chequia": "🇨🇿",
  // Grupo B
  "Canadá": "🇨🇦", "Suiza": "🇨🇭", "Qatar": "🇶🇦", "Bosnia y Herzegovina": "🇧🇦",
  // Grupo C
  "Brasil": "🇧🇷", "Marruecos": "🇲🇦", "Haití": "🇭🇹", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Grupo D
  "Estados Unidos": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turquía": "🇹🇷",
  // Grupo E
  "Alemania": "🇩🇪", "Curazao": "🇨🇼", "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨",
  // Grupo F
  "Países Bajos": "🇳🇱", "Japón": "🇯🇵", "Túnez": "🇹🇳", "Suecia": "🇸🇪",
  // Grupo G
  "Bélgica": "🇧🇪", "Egipto": "🇪🇬", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿",
  // Grupo H
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudita": "🇸🇦", "Uruguay": "🇺🇾",
  // Grupo I
  "Francia": "🇫🇷", "Senegal": "🇸🇳", "Noruega": "🇳🇴", "Irak": "🇮🇶",
  // Grupo J
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  // Grupo K
  "Portugal": "🇵🇹", "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴", "Congo DR": "🇨🇩",
  // Grupo L
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croacia": "🇭🇷", "Ghana": "🇬🇭", "Panamá": "🇵🇦",
  // Comodín
  "Por definir": "🏳️"
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

// Todos los horarios en UTC. Fuente: FIFA / sorteo oficial dic 2025
export const GROUP_STAGE_MATCHES = [
  // ── GRUPO A ── México, Sudáfrica, Corea del Sur, Chequia
  { match_number: 1,  fecha_kickoff: "2026-06-11T20:00:00Z", equipo_local: "México",       equipo_visitante: "Sudáfrica",    fase: "grupos", grupo_letra: "A", estadio: "Estadio Azteca",        ciudad: "Ciudad de México", estado: "programado" },
  { match_number: 2,  fecha_kickoff: "2026-06-12T02:00:00Z", equipo_local: "Corea del Sur", equipo_visitante: "Chequia",      fase: "grupos", grupo_letra: "A", estadio: "Estadio Akron",         ciudad: "Guadalajara",       estado: "programado" },
  { match_number: 25, fecha_kickoff: "2026-06-18T17:00:00Z", equipo_local: "Chequia",       equipo_visitante: "Sudáfrica",    fase: "grupos", grupo_letra: "A", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta",           estado: "programado" },
  { match_number: 26, fecha_kickoff: "2026-06-18T20:00:00Z", equipo_local: "México",        equipo_visitante: "Corea del Sur",fase: "grupos", grupo_letra: "A", estadio: "SoFi Stadium",          ciudad: "Los Ángeles",       estado: "programado" },
  { match_number: 49, fecha_kickoff: "2026-06-23T00:00:00Z", equipo_local: "Sudáfrica",     equipo_visitante: "Corea del Sur",fase: "grupos", grupo_letra: "A", estadio: "MetLife Stadium",       ciudad: "Nueva Jersey",      estado: "programado" },
  { match_number: 50, fecha_kickoff: "2026-06-23T00:00:00Z", equipo_local: "Chequia",       equipo_visitante: "México",       fase: "grupos", grupo_letra: "A", estadio: "Arrowhead Stadium",     ciudad: "Kansas City",       estado: "programado" },

  // ── GRUPO B ── Canadá, Suiza, Qatar, Bosnia y Herzegovina
  { match_number: 3,  fecha_kickoff: "2026-06-12T20:00:00Z", equipo_local: "Canadá",              equipo_visitante: "Bosnia y Herzegovina", fase: "grupos", grupo_letra: "B", estadio: "BMO Field",    ciudad: "Toronto",    estado: "programado" },
  { match_number: 8,  fecha_kickoff: "2026-06-13T20:00:00Z", equipo_local: "Qatar",               equipo_visitante: "Suiza",                fase: "grupos", grupo_letra: "B", estadio: "Levi's Stadium",ciudad: "San Francisco",estado: "programado" },
  { match_number: 27, fecha_kickoff: "2026-06-18T23:00:00Z", equipo_local: "Suiza",               equipo_visitante: "Bosnia y Herzegovina", fase: "grupos", grupo_letra: "B", estadio: "SoFi Stadium", ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 28, fecha_kickoff: "2026-06-19T02:00:00Z", equipo_local: "Canadá",              equipo_visitante: "Qatar",                fase: "grupos", grupo_letra: "B", estadio: "BC Place",     ciudad: "Vancouver",  estado: "programado" },
  { match_number: 51, fecha_kickoff: "2026-06-23T23:00:00Z", equipo_local: "Bosnia y Herzegovina",equipo_visitante: "Qatar",                fase: "grupos", grupo_letra: "B", estadio: "Gillette Stadium",ciudad: "Boston",   estado: "programado" },
  { match_number: 52, fecha_kickoff: "2026-06-23T23:00:00Z", equipo_local: "Suiza",               equipo_visitante: "Canadá",               fase: "grupos", grupo_letra: "B", estadio: "Lumen Field",  ciudad: "Seattle",    estado: "programado" },

  // ── GRUPO C ── Brasil, Marruecos, Haití, Escocia
  { match_number: 5,  fecha_kickoff: "2026-06-13T02:00:00Z", equipo_local: "Haití",    equipo_visitante: "Escocia",   fase: "grupos", grupo_letra: "C", estadio: "Gillette Stadium",  ciudad: "Boston",       estado: "programado" },
  { match_number: 7,  fecha_kickoff: "2026-06-13T23:00:00Z", equipo_local: "Brasil",   equipo_visitante: "Marruecos", fase: "grupos", grupo_letra: "C", estadio: "MetLife Stadium",   ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 29, fecha_kickoff: "2026-06-19T17:00:00Z", equipo_local: "Brasil",   equipo_visitante: "Haití",    fase: "grupos", grupo_letra: "C", estadio: "AT&T Stadium",      ciudad: "Dallas",       estado: "programado" },
  { match_number: 30, fecha_kickoff: "2026-06-19T20:00:00Z", equipo_local: "Escocia",  equipo_visitante: "Marruecos",fase: "grupos", grupo_letra: "C", estadio: "Lumen Field",       ciudad: "Seattle",      estado: "programado" },
  { match_number: 53, fecha_kickoff: "2026-06-24T23:00:00Z", equipo_local: "Marruecos",equipo_visitante: "Haití",    fase: "grupos", grupo_letra: "C", estadio: "BC Place",          ciudad: "Vancouver",    estado: "programado" },
  { match_number: 54, fecha_kickoff: "2026-06-24T23:00:00Z", equipo_local: "Escocia",  equipo_visitante: "Brasil",   fase: "grupos", grupo_letra: "C", estadio: "Levi's Stadium",    ciudad: "San Francisco",estado: "programado" },

  // ── GRUPO D ── Estados Unidos, Paraguay, Australia, Turquía
  { match_number: 4,  fecha_kickoff: "2026-06-12T23:00:00Z", equipo_local: "Estados Unidos", equipo_visitante: "Paraguay",  fase: "grupos", grupo_letra: "D", estadio: "SoFi Stadium",          ciudad: "Los Ángeles",  estado: "programado" },
  { match_number: 6,  fecha_kickoff: "2026-06-13T05:00:00Z", equipo_local: "Australia",      equipo_visitante: "Turquía",   fase: "grupos", grupo_letra: "D", estadio: "BC Place",              ciudad: "Vancouver",    estado: "programado" },
  { match_number: 31, fecha_kickoff: "2026-06-19T23:00:00Z", equipo_local: "Estados Unidos", equipo_visitante: "Australia", fase: "grupos", grupo_letra: "D", estadio: "Hard Rock Stadium",     ciudad: "Miami",        estado: "programado" },
  { match_number: 32, fecha_kickoff: "2026-06-20T02:00:00Z", equipo_local: "Turquía",        equipo_visitante: "Paraguay",  fase: "grupos", grupo_letra: "D", estadio: "Lincoln Financial Field",ciudad: "Filadelfia",   estado: "programado" },
  { match_number: 55, fecha_kickoff: "2026-06-25T00:00:00Z", equipo_local: "Paraguay",       equipo_visitante: "Australia", fase: "grupos", grupo_letra: "D", estadio: "NRG Stadium",           ciudad: "Houston",      estado: "programado" },
  { match_number: 56, fecha_kickoff: "2026-06-25T00:00:00Z", equipo_local: "Turquía",        equipo_visitante: "Estados Unidos", fase: "grupos", grupo_letra: "D", estadio: "Arrowhead Stadium", ciudad: "Kansas City",  estado: "programado" },

  // ── GRUPO E ── Alemania, Curazao, Costa de Marfil, Ecuador
  { match_number: 10, fecha_kickoff: "2026-06-14T17:00:00Z", equipo_local: "Alemania",        equipo_visitante: "Curazao",       fase: "grupos", grupo_letra: "E", estadio: "NRG Stadium",            ciudad: "Houston",      estado: "programado" },
  { match_number: 9,  fecha_kickoff: "2026-06-14T23:00:00Z", equipo_local: "Costa de Marfil", equipo_visitante: "Ecuador",       fase: "grupos", grupo_letra: "E", estadio: "Lincoln Financial Field", ciudad: "Filadelfia",   estado: "programado" },
  { match_number: 33, fecha_kickoff: "2026-06-20T17:00:00Z", equipo_local: "Alemania",        equipo_visitante: "Costa de Marfil",fase: "grupos", grupo_letra: "E", estadio: "MetLife Stadium",        ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 34, fecha_kickoff: "2026-06-20T20:00:00Z", equipo_local: "Ecuador",         equipo_visitante: "Curazao",       fase: "grupos", grupo_letra: "E", estadio: "AT&T Stadium",           ciudad: "Dallas",       estado: "programado" },
  { match_number: 57, fecha_kickoff: "2026-06-25T20:00:00Z", equipo_local: "Curazao",         equipo_visitante: "Costa de Marfil",fase: "grupos", grupo_letra: "E", estadio: "Gillette Stadium",      ciudad: "Boston",       estado: "programado" },
  { match_number: 58, fecha_kickoff: "2026-06-25T20:00:00Z", equipo_local: "Ecuador",         equipo_visitante: "Alemania",      fase: "grupos", grupo_letra: "E", estadio: "Mercedes-Benz Stadium",  ciudad: "Atlanta",      estado: "programado" },

  // ── GRUPO F ── Países Bajos, Japón, Túnez, Suecia
  { match_number: 11, fecha_kickoff: "2026-06-14T20:00:00Z", equipo_local: "Países Bajos", equipo_visitante: "Japón",  fase: "grupos", grupo_letra: "F", estadio: "AT&T Stadium",    ciudad: "Dallas",       estado: "programado" },
  { match_number: 12, fecha_kickoff: "2026-06-15T01:00:00Z", equipo_local: "Suecia",        equipo_visitante: "Túnez", fase: "grupos", grupo_letra: "F", estadio: "Estadio BBVA",    ciudad: "Monterrey",    estado: "programado" },
  { match_number: 35, fecha_kickoff: "2026-06-20T23:00:00Z", equipo_local: "Países Bajos", equipo_visitante: "Suecia",fase: "grupos", grupo_letra: "F", estadio: "Hard Rock Stadium",ciudad: "Miami",        estado: "programado" },
  { match_number: 36, fecha_kickoff: "2026-06-21T02:00:00Z", equipo_local: "Japón",         equipo_visitante: "Túnez", fase: "grupos", grupo_letra: "F", estadio: "Rose Bowl",        ciudad: "Los Ángeles",  estado: "programado" },
  { match_number: 59, fecha_kickoff: "2026-06-25T23:00:00Z", equipo_local: "Túnez",         equipo_visitante: "Países Bajos",fase: "grupos", grupo_letra: "F", estadio: "BMO Field",  ciudad: "Toronto",      estado: "programado" },
  { match_number: 60, fecha_kickoff: "2026-06-25T23:00:00Z", equipo_local: "Japón",         equipo_visitante: "Suecia",fase: "grupos", grupo_letra: "F", estadio: "Levi's Stadium",  ciudad: "San Francisco",estado: "programado" },

  // ── GRUPO G ── Bélgica, Egipto, Irán, Nueva Zelanda
  { match_number: 16, fecha_kickoff: "2026-06-15T17:00:00Z", equipo_local: "Bélgica",      equipo_visitante: "Egipto",        fase: "grupos", grupo_letra: "G", estadio: "Lumen Field",      ciudad: "Seattle",     estado: "programado" },
  { match_number: 15, fecha_kickoff: "2026-06-15T23:00:00Z", equipo_local: "Irán",         equipo_visitante: "Nueva Zelanda", fase: "grupos", grupo_letra: "G", estadio: "SoFi Stadium",     ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 37, fecha_kickoff: "2026-06-21T17:00:00Z", equipo_local: "Bélgica",      equipo_visitante: "Irán",          fase: "grupos", grupo_letra: "G", estadio: "Rose Bowl",         ciudad: "Los Ángeles", estado: "programado" },
  { match_number: 38, fecha_kickoff: "2026-06-21T20:00:00Z", equipo_local: "Nueva Zelanda",equipo_visitante: "Egipto",        fase: "grupos", grupo_letra: "G", estadio: "Arrowhead Stadium", ciudad: "Kansas City",  estado: "programado" },
  { match_number: 61, fecha_kickoff: "2026-06-26T20:00:00Z", equipo_local: "Egipto",       equipo_visitante: "Irán",          fase: "grupos", grupo_letra: "G", estadio: "AT&T Stadium",     ciudad: "Dallas",       estado: "programado" },
  { match_number: 62, fecha_kickoff: "2026-06-26T20:00:00Z", equipo_local: "Nueva Zelanda",equipo_visitante: "Bélgica",       fase: "grupos", grupo_letra: "G", estadio: "NRG Stadium",      ciudad: "Houston",      estado: "programado" },

  // ── GRUPO H ── España, Cabo Verde, Arabia Saudita, Uruguay
  { match_number: 14, fecha_kickoff: "2026-06-15T17:00:00Z", equipo_local: "España",         equipo_visitante: "Cabo Verde",    fase: "grupos", grupo_letra: "H", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta",      estado: "programado" },
  { match_number: 13, fecha_kickoff: "2026-06-15T23:00:00Z", equipo_local: "Arabia Saudita", equipo_visitante: "Uruguay",       fase: "grupos", grupo_letra: "H", estadio: "Hard Rock Stadium",     ciudad: "Miami",        estado: "programado" },
  { match_number: 39, fecha_kickoff: "2026-06-21T23:00:00Z", equipo_local: "España",         equipo_visitante: "Arabia Saudita",fase: "grupos", grupo_letra: "H", estadio: "MetLife Stadium",       ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 40, fecha_kickoff: "2026-06-22T02:00:00Z", equipo_local: "Uruguay",        equipo_visitante: "Cabo Verde",    fase: "grupos", grupo_letra: "H", estadio: "Lincoln Financial Field",ciudad: "Filadelfia",   estado: "programado" },
  { match_number: 63, fecha_kickoff: "2026-06-26T23:00:00Z", equipo_local: "Cabo Verde",     equipo_visitante: "Arabia Saudita",fase: "grupos", grupo_letra: "H", estadio: "Levi's Stadium",        ciudad: "San Francisco",estado: "programado" },
  { match_number: 64, fecha_kickoff: "2026-06-26T23:00:00Z", equipo_local: "Uruguay",        equipo_visitante: "España",        fase: "grupos", grupo_letra: "H", estadio: "SoFi Stadium",          ciudad: "Los Ángeles",  estado: "programado" },

  // ── GRUPO I ── Francia, Senegal, Noruega, Irak
  { match_number: 17, fecha_kickoff: "2026-06-16T20:00:00Z", equipo_local: "Francia",  equipo_visitante: "Senegal", fase: "grupos", grupo_letra: "I", estadio: "MetLife Stadium",  ciudad: "Nueva Jersey", estado: "programado" },
  { match_number: 18, fecha_kickoff: "2026-06-16T23:00:00Z", equipo_local: "Irak",     equipo_visitante: "Noruega", fase: "grupos", grupo_letra: "I", estadio: "Gillette Stadium", ciudad: "Boston",       estado: "programado" },
  { match_number: 41, fecha_kickoff: "2026-06-22T17:00:00Z", equipo_local: "Francia",  equipo_visitante: "Irak",    fase: "grupos", grupo_letra: "I", estadio: "AT&T Stadium",     ciudad: "Dallas",       estado: "programado" },
  { match_number: 42, fecha_kickoff: "2026-06-22T20:00:00Z", equipo_local: "Noruega",  equipo_visitante: "Senegal", fase: "grupos", grupo_letra: "I", estadio: "Lumen Field",      ciudad: "Seattle",      estado: "programado" },
  { match_number: 65, fecha_kickoff: "2026-06-27T20:00:00Z", equipo_local: "Senegal",  equipo_visitante: "Irak",    fase: "grupos", grupo_letra: "I", estadio: "Rose Bowl",         ciudad: "Los Ángeles",  estado: "programado" },
  { match_number: 66, fecha_kickoff: "2026-06-27T20:00:00Z", equipo_local: "Noruega",  equipo_visitante: "Francia", fase: "grupos", grupo_letra: "I", estadio: "BC Place",          ciudad: "Vancouver",    estado: "programado" },

  // ── GRUPO J ── Argentina, Argelia, Austria, Jordania
  { match_number: 19, fecha_kickoff: "2026-06-17T02:00:00Z", equipo_local: "Argentina", equipo_visitante: "Argelia",  fase: "grupos", grupo_letra: "J", estadio: "Arrowhead Stadium", ciudad: "Kansas City",  estado: "programado" },
  { match_number: 20, fecha_kickoff: "2026-06-17T05:00:00Z", equipo_local: "Austria",   equipo_visitante: "Jordania", fase: "grupos", grupo_letra: "J", estadio: "Levi's Stadium",    ciudad: "San Francisco",estado: "programado" },
  { match_number: 43, fecha_kickoff: "2026-06-22T23:00:00Z", equipo_local: "Argentina", equipo_visitante: "Austria",  fase: "grupos", grupo_letra: "J", estadio: "Hard Rock Stadium", ciudad: "Miami",        estado: "programado" },
  { match_number: 44, fecha_kickoff: "2026-06-23T02:00:00Z", equipo_local: "Jordania",  equipo_visitante: "Argelia",  fase: "grupos", grupo_letra: "J", estadio: "NRG Stadium",       ciudad: "Houston",      estado: "programado" },
  { match_number: 67, fecha_kickoff: "2026-06-27T23:00:00Z", equipo_local: "Argelia",   equipo_visitante: "Austria",  fase: "grupos", grupo_letra: "J", estadio: "Estadio Azteca",    ciudad: "Ciudad de México",estado: "programado" },
  { match_number: 68, fecha_kickoff: "2026-06-27T23:00:00Z", equipo_local: "Jordania",  equipo_visitante: "Argentina",fase: "grupos", grupo_letra: "J", estadio: "Estadio BBVA",      ciudad: "Monterrey",    estado: "programado" },

  // ── GRUPO K ── Portugal, Uzbekistán, Colombia, Congo DR
  { match_number: 23, fecha_kickoff: "2026-06-17T17:00:00Z", equipo_local: "Portugal",   equipo_visitante: "Congo DR",   fase: "grupos", grupo_letra: "K", estadio: "NRG Stadium",    ciudad: "Houston",        estado: "programado" },
  { match_number: 24, fecha_kickoff: "2026-06-18T01:00:00Z", equipo_local: "Uzbekistán", equipo_visitante: "Colombia",   fase: "grupos", grupo_letra: "K", estadio: "Estadio Azteca", ciudad: "Ciudad de México",estado: "programado" },
  { match_number: 45, fecha_kickoff: "2026-06-23T17:00:00Z", equipo_local: "Portugal",   equipo_visitante: "Uzbekistán", fase: "grupos", grupo_letra: "K", estadio: "Lumen Field",    ciudad: "Seattle",        estado: "programado" },
  { match_number: 46, fecha_kickoff: "2026-06-23T20:00:00Z", equipo_local: "Colombia",   equipo_visitante: "Congo DR",   fase: "grupos", grupo_letra: "K", estadio: "Gillette Stadium",ciudad: "Boston",         estado: "programado" },
  { match_number: 69, fecha_kickoff: "2026-06-28T20:00:00Z", equipo_local: "Congo DR",   equipo_visitante: "Uzbekistán", fase: "grupos", grupo_letra: "K", estadio: "BC Place",       ciudad: "Vancouver",      estado: "programado" },
  { match_number: 70, fecha_kickoff: "2026-06-28T20:00:00Z", equipo_local: "Colombia",   equipo_visitante: "Portugal",   fase: "grupos", grupo_letra: "K", estadio: "BMO Field",       ciudad: "Toronto",        estado: "programado" },

  // ── GRUPO L ── Inglaterra, Croacia, Ghana, Panamá
  { match_number: 22, fecha_kickoff: "2026-06-17T20:00:00Z", equipo_local: "Inglaterra", equipo_visitante: "Croacia", fase: "grupos", grupo_letra: "L", estadio: "AT&T Stadium",          ciudad: "Dallas",    estado: "programado" },
  { match_number: 21, fecha_kickoff: "2026-06-18T00:00:00Z", equipo_local: "Ghana",      equipo_visitante: "Panamá",  fase: "grupos", grupo_letra: "L", estadio: "BMO Field",              ciudad: "Toronto",   estado: "programado" },
  { match_number: 47, fecha_kickoff: "2026-06-24T17:00:00Z", equipo_local: "Inglaterra", equipo_visitante: "Ghana",   fase: "grupos", grupo_letra: "L", estadio: "Mercedes-Benz Stadium",  ciudad: "Atlanta",   estado: "programado" },
  { match_number: 48, fecha_kickoff: "2026-06-24T20:00:00Z", equipo_local: "Panamá",     equipo_visitante: "Croacia", fase: "grupos", grupo_letra: "L", estadio: "Arrowhead Stadium",      ciudad: "Kansas City",estado: "programado" },
  { match_number: 71, fecha_kickoff: "2026-06-29T20:00:00Z", equipo_local: "Croacia",    equipo_visitante: "Ghana",   fase: "grupos", grupo_letra: "L", estadio: "Lincoln Financial Field", ciudad: "Filadelfia",estado: "programado" },
  { match_number: 72, fecha_kickoff: "2026-06-29T20:00:00Z", equipo_local: "Panamá",     equipo_visitante: "Inglaterra",fase: "grupos", grupo_letra: "L", estadio: "Rose Bowl",             ciudad: "Los Ángeles",estado: "programado" },
];

// Ronda de 32 (partidos 73-88): equipos por definir tras fase de grupos
export const KNOCKOUT_MATCHES = [
  // Ronda de 32 (16 partidos) - 2 y 3 jul aprox.
  ...Array.from({ length: 16 }, (_, i) => ({
    match_number: 73 + i,
    fecha_kickoff: `2026-07-0${2 + Math.floor(i / 4)}T${18 + (i % 4) * 2}:00:00Z`,
    equipo_local: "Por definir", equipo_visitante: "Por definir",
    fase: "ronda_32", estadio: "Por definir", ciudad: "Por definir", estado: "programado"
  })),
  // Octavos (8 partidos) - 5-7 jul aprox.
  ...Array.from({ length: 8 }, (_, i) => ({
    match_number: 89 + i,
    fecha_kickoff: `2026-07-0${5 + Math.floor(i / 3)}T${18 + (i % 3) * 3}:00:00Z`,
    equipo_local: "Por definir", equipo_visitante: "Por definir",
    fase: "octavos", estadio: "Por definir", ciudad: "Por definir", estado: "programado"
  })),
  // Cuartos (4 partidos) - 10-11 jul
  { match_number: 97, fecha_kickoff: "2026-07-10T20:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "cuartos", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  { match_number: 98, fecha_kickoff: "2026-07-10T23:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "cuartos", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  { match_number: 99, fecha_kickoff: "2026-07-11T20:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "cuartos", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  { match_number: 100, fecha_kickoff: "2026-07-11T23:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "cuartos", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  // Semifinales - 14-15 jul
  { match_number: 101, fecha_kickoff: "2026-07-14T23:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "semis", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  { match_number: 102, fecha_kickoff: "2026-07-15T23:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "semis", estadio: "Por definir", ciudad: "Por definir", estado: "programado" },
  // Tercer lugar - 18 jul
  { match_number: 103, fecha_kickoff: "2026-07-18T23:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "tercer_lugar", estadio: "Hard Rock Stadium", ciudad: "Miami", estado: "programado" },
  // Final - 19 jul, MetLife
  { match_number: 104, fecha_kickoff: "2026-07-19T23:00:00Z", equipo_local: "Por definir", equipo_visitante: "Por definir", fase: "final", estadio: "MetLife Stadium", ciudad: "Nueva Jersey", estado: "programado" },
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