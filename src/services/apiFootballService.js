// ESPN API - Free, No Authentication Required
const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      console.error(`API Error: ${response.status}`);
      return { events: [], leagues: [] };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ESPN API Error:', error);
    return { events: [], leagues: [] };
  }
}

// Mapeamento de ligas ESPN
const LEAGUES = {
  'eng.1': { name: 'Premier League', country: 'England' },
  'esp.1': { name: 'La Liga', country: 'Spain' },
  'ita.1': { name: 'Serie A', country: 'Italy' },
  'ger.1': { name: 'Bundesliga', country: 'Germany' },
  'fra.1': { name: 'Ligue 1', country: 'France' },
  'bra.1': { name: 'Brasileirão', country: 'Brazil' },
  'por.1': { name: 'Primeira Liga', country: 'Portugal' },
  'ned.1': { name: 'Eredivisie', country: 'Netherlands' },
  'uefa.champions': { name: 'Champions League', country: 'Europe' },
  'uefa.europa': { name: 'Europa League', country: 'Europe' },
  'arg.1': { name: 'Liga Argentina', country: 'Argentina' },
  'mex.1': { name: 'Liga MX', country: 'Mexico' },
  'usa.1': { name: 'MLS', country: 'USA' },
};

// Transformar evento ESPN para formato padrão
function transformEvent(event, leagueId) {
  const competition = event.competitions?.[0];
  const homeTeam = competition?.competitors?.find(c => c.homeAway === 'home');
  const awayTeam = competition?.competitors?.find(c => c.homeAway === 'away');
  const leagueInfo = LEAGUES[leagueId] || { name: leagueId, country: 'World' };

  return {
    fixture: {
      id: event.id,
      date: event.date,
      status: {
        short: competition?.status?.type?.shortDetail || event.status?.type?.name,
        long: competition?.status?.type?.detail || event.status?.type?.description
      },
      venue: competition?.venue?.fullName || null
    },
    league: {
      id: leagueId,
      name: leagueInfo.name,
      country: leagueInfo.country,
      logo: event.season?.type?.abbreviation ? null : null
    },
    teams: {
      home: {
        id: homeTeam?.id,
        name: homeTeam?.team?.displayName || homeTeam?.team?.name,
        logo: homeTeam?.team?.logo
      },
      away: {
        id: awayTeam?.id,
        name: awayTeam?.team?.displayName || awayTeam?.team?.name,
        logo: awayTeam?.team?.logo
      }
    },
    goals: {
      home: homeTeam?.score ? parseInt(homeTeam.score) : null,
      away: awayTeam?.score ? parseInt(awayTeam.score) : null
    }
  };
}

// Buscar jogos por data (busca de múltiplas ligas)
export async function getFixtures(date) {
  const formattedDate = date instanceof Date 
    ? date.toISOString().split('T')[0].replace(/-/g, '')
    : (date || new Date().toISOString().split('T')[0]).replace(/-/g, '');

  const leagueIds = Object.keys(LEAGUES);
  const allMatches = [];

  // Buscar jogos de cada liga em paralelo
  const promises = leagueIds.map(async (leagueId) => {
    try {
      const data = await fetchAPI(`/${leagueId}/scoreboard?dates=${formattedDate}`);
      const events = data.events || [];
      return events.map(event => transformEvent(event, leagueId));
    } catch {
      return [];
    }
  });

  const results = await Promise.all(promises);
  results.forEach(matches => allMatches.push(...matches));

  return allMatches;
}

// Buscar jogos ao vivo
export async function getLiveFixtures() {
  const leagueIds = Object.keys(LEAGUES);
  const allMatches = [];

  const promises = leagueIds.map(async (leagueId) => {
    try {
      const data = await fetchAPI(`/${leagueId}/scoreboard`);
      const events = (data.events || []).filter(e => 
        e.status?.type?.state === 'in' || 
        e.competitions?.[0]?.status?.type?.state === 'in'
      );
      return events.map(event => transformEvent(event, leagueId));
    } catch {
      return [];
    }
  });

  const results = await Promise.all(promises);
  results.forEach(matches => allMatches.push(...matches));

  return allMatches;
}

// Buscar jogos por liga
export async function getFixturesByLeague(leagueId) {
  const data = await fetchAPI(`/${leagueId}/scoreboard`);
  return (data.events || []).map(event => transformEvent(event, leagueId));
}

// Buscar detalhes de um jogo
export async function getFixtureById(fixtureId) {
  // ESPN usa endpoint diferente para evento específico
  for (const leagueId of Object.keys(LEAGUES)) {
    try {
      const data = await fetchAPI(`/${leagueId}/scoreboard`);
      const event = (data.events || []).find(e => e.id === fixtureId);
      if (event) {
        return transformEvent(event, leagueId);
      }
    } catch {
      continue;
    }
  }
  return null;
}

// Buscar estatísticas de um jogo
export async function getFixtureStatistics(fixtureId) {
  const match = await getFixtureById(fixtureId);
  if (!match) return [];
  
  return [
    { team: match.teams.home, statistics: [] },
    { team: match.teams.away, statistics: [] }
  ];
}

// Buscar informações de um time
export async function getTeamInfo(teamId) {
  // ESPN não tem endpoint direto para time, retorna vazio
  return [];
}

// Buscar estatísticas de um time
export async function getTeamStatistics(teamId) {
  return null;
}

// Buscar competições disponíveis
export async function getLeagues() {
  return Object.entries(LEAGUES).map(([id, info]) => ({
    league: {
      id,
      name: info.name,
      type: 'League',
      logo: null
    },
    country: {
      name: info.country,
      flag: null
    }
  }));
}

// Buscar classificação
export async function getStandings(leagueId) {
  const data = await fetchAPI(`/${leagueId}/standings`);
  return data.standings?.[0]?.entries || [];
}

// Buscar confrontos diretos (H2H)
export async function getH2H(team1Id, team2Id) {
  // ESPN não tem endpoint H2H direto
  return [];
}

// Ligas principais
export function getMainLeagues() {
  return Object.entries(LEAGUES).map(([id, info]) => ({
    id,
    name: info.name,
    country: info.country
  }));
}

export const apiFootballService = {
  getFixtures,
  getLiveFixtures,
  getFixturesByLeague,
  getFixtureById,
  getFixtureStatistics,
  getTeamInfo,
  getTeamStatistics,
  getLeagues,
  getStandings,
  getH2H,
  getMainLeagues,
};

export default apiFootballService;
