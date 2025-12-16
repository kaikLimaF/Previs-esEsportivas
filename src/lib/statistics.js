// SportPredict - Motor de Calculo Estatistico

// Pesos para calculo da nota do time (0-100)
const WEIGHTS = {
  recentForm: 0.20,
  offensiveStrength: 0.15,
  defensiveStrength: 0.15,
  homeAwayPerformance: 0.12,
  h2h: 0.10,
  squadAvailability: 0.08,
  possession: 0.08,
  opponentDifficulty: 0.07,
  specialFactors: 0.05,
};

// Calcular forma baseada nos ultimos 5 resultados (W=3, D=1, L=0)
function calculateFormFromResults(results) {
  if (!results) return 50;
  
  let points = 0;
  const maxPoints = results.length * 3;
  
  for (const result of results.toUpperCase()) {
    if (result === 'W') points += 3;
    else if (result === 'D') points += 1;
  }
  
  return (points / maxPoints) * 100;
}

// Calcular nota do time (0-100)
export function calculateTeamScore(team, isHome) {
  const formScore = team.recentForm;
  const offenseScore = team.offensiveStrength;
  const defenseScore = team.defensiveStrength;
  const venueScore = isHome ? team.homeAdvantage : team.awayPerformance;
  const possessionScore = team.possession;
  
  const formFromResults = calculateFormFromResults(team.last5Results);
  
  const score = 
    (formScore * WEIGHTS.recentForm) +
    (offenseScore * WEIGHTS.offensiveStrength) +
    (defenseScore * WEIGHTS.defensiveStrength) +
    (venueScore * WEIGHTS.homeAwayPerformance) +
    (possessionScore * WEIGHTS.possession) +
    (formFromResults * 0.15) +
    (team.midfieldStrength * 0.05) +
    (team.setPieceStrength * 0.05);

  return Math.min(100, Math.max(0, score));
}

// Converter notas em probabilidades
export function calculateProbabilities(homeTeam, awayTeam) {
  const homeScore = calculateTeamScore(homeTeam, true);
  const awayScore = calculateTeamScore(awayTeam, false);
  
  const totalScore = homeScore + awayScore;
  let homeWinBase = (homeScore / totalScore) * 100;
  let awayWinBase = (awayScore / totalScore) * 100;
  
  const defensiveAvg = (homeTeam.defensiveStrength + awayTeam.defensiveStrength) / 2;
  const scoreDiff = Math.abs(homeScore - awayScore);
  const balanceFactor = 1 - (scoreDiff / 100);
  
  const drawBase = 15 + (balanceFactor * 20) + (defensiveAvg / 10);
  
  const total = homeWinBase + awayWinBase + drawBase;
  const homeWin = Math.round((homeWinBase / total) * 100);
  const awayWin = Math.round((awayWinBase / total) * 100);
  const draw = 100 - homeWin - awayWin;
  
  const confidence = Math.min(95, 70 + (balanceFactor * 10));

  return {
    homeWin: Math.max(5, Math.min(85, homeWin)),
    draw: Math.max(5, Math.min(40, draw)),
    awayWin: Math.max(5, Math.min(85, awayWin)),
    confidence,
  };
}

// Calcular tendencias de gols
export function calculateGoalTendencies(homeTeam, awayTeam) {
  const avgGoalsScored = (homeTeam.goalsScored + awayTeam.goalsScored) / 2;
  const avgGoalsConceded = (homeTeam.goalsConceded + awayTeam.goalsConceded) / 2;
  const expectedGoals = avgGoalsScored + avgGoalsConceded;
  
  const over15 = Math.min(90, 50 + (expectedGoals * 15));
  const over25 = Math.min(80, 30 + (expectedGoals * 12));
  const over35 = Math.min(60, 15 + (expectedGoals * 10));
  
  const homeScoresProb = homeTeam.offensiveStrength / 100;
  const awayScoresProb = awayTeam.offensiveStrength / 100;
  const btts = Math.round(homeScoresProb * awayScoresProb * 100);

  return {
    over15: Math.round(over15),
    over25: Math.round(over25),
    over35: Math.round(over35),
    btts: Math.max(30, Math.min(75, btts)),
  };
}

// Calcular forca relativa para radar
export function calculateRadarData(team) {
  return {
    attack: team.offensiveStrength,
    defense: team.defensiveStrength,
    midfield: team.midfieldStrength,
    setPiece: team.setPieceStrength,
    form: team.recentForm,
  };
}

// Formatar probabilidade para exibicao
export function formatProbability(value) {
  return `${Math.round(value)}%`;
}

// Classificar probabilidade (alta, media, baixa)
export function classifyProbability(value) {
  if (value >= 50) return 'high';
  if (value >= 30) return 'medium';
  return 'low';
}

// Calcular "time mais quente" baseado em forma recente
export function calculateHotness(team) {
  const formScore = calculateFormFromResults(team.last5Results);
  const offensiveForm = team.offensiveStrength * 0.3;
  const recentForm = team.recentForm * 0.5;
  
  return Math.round(formScore * 0.4 + offensiveForm + recentForm * 0.3);
}
