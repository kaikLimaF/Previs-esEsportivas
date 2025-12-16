import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { getFixtureStatistics, getH2H, getTeamInfo } from '@/services/apiFootballService';
import { Loader2, ArrowLeft, TrendingUp, Shield, Target, Flame, Trophy, Users } from 'lucide-react';
import { calculateProbabilities, calculateGoalTendencies } from '@/lib/statistics';

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [fixtureStats, setFixtureStats] = useState(null);
  const [h2h, setH2h] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchData();
  }, [id]);

  const fetchMatchData = async () => {
    try {
      // Buscar estatísticas do jogo
      const statsData = await getFixtureStatistics(id);
      setFixtureStats(statsData);

      // Se temos estatísticas, extrair IDs dos times
      if (statsData && statsData.length >= 2) {
        const homeTeamId = statsData[0]?.team?.id;
        const awayTeamId = statsData[1]?.team?.id;

        // Buscar informações dos times
        const [homeInfo, awayInfo] = await Promise.all([
          getTeamInfo(homeTeamId),
          getTeamInfo(awayTeamId)
        ]);

        // Buscar H2H
        const h2hData = await getH2H(homeTeamId, awayTeamId);
        setH2h(h2hData);

        // Processar dados do time da casa
        const homeTeamData = homeInfo[0]?.team || {};
        const homeVenue = homeInfo[0]?.venue || {};
        setHomeTeam({
          id: homeTeamId,
          name: homeTeamData.name || statsData[0]?.team?.name || 'Time Casa',
          logo_url: homeTeamData.logo || statsData[0]?.team?.logo,
          venue: homeVenue.name
        });

        // Processar dados do time visitante
        const awayTeamData = awayInfo[0]?.team || {};
        setAwayTeam({
          id: awayTeamId,
          name: awayTeamData.name || statsData[1]?.team?.name || 'Time Fora',
          logo_url: awayTeamData.logo || statsData[1]?.team?.logo
        });

        // Criar objeto match com dados disponíveis
        setMatch({
          id: id,
          league: 'Partida',
          match_date: new Date().toISOString(),
          venue: homeVenue.name
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do jogo:', error);
    }
    setLoading(false);
  };

  // Função para extrair estatística por tipo
  const getStatValue = (stats, type) => {
    if (!stats || !stats.statistics) return null;
    const stat = stats.statistics.find(s => s.type === type);
    return stat ? stat.value : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!homeTeam || !awayTeam) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Partida nao encontrada ou sem dados disponiveis.</p>
          <Link to="/dashboard" className="flex items-center gap-2 text-primary mt-4 justify-center">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
          </Link>
        </main>
      </div>
    );
  }

  // Extrair estatísticas dos times do jogo
  const homeFixtureStats = fixtureStats?.[0] || {};
  const awayFixtureStats = fixtureStats?.[1] || {};

  // Calcular força baseada nas estatísticas do jogo
  const parsePercentage = (val) => {
    if (!val) return 50;
    if (typeof val === 'string' && val.includes('%')) {
      return parseInt(val.replace('%', '')) || 50;
    }
    return parseInt(val) || 50;
  };

  const homeStats = {
    id: homeTeam.id,
    name: homeTeam.name,
    offensiveStrength: Math.min(100, (getStatValue(homeFixtureStats, 'Shots on Goal') || 4) * 12),
    defensiveStrength: Math.max(0, 100 - (getStatValue(awayFixtureStats, 'Shots on Goal') || 4) * 10),
    midfieldStrength: parsePercentage(getStatValue(homeFixtureStats, 'Ball Possession')),
    setPieceStrength: 50,
    recentForm: 50,
    homeAdvantage: 55,
    awayPerformance: 45,
    goalsScored: 1.5,
    goalsConceded: 1.0,
    xg: parseFloat(getStatValue(homeFixtureStats, 'expected_goals')) || 1.5,
    xga: parseFloat(getStatValue(awayFixtureStats, 'expected_goals')) || 1.0,
    possession: parsePercentage(getStatValue(homeFixtureStats, 'Ball Possession')),
    shotsOnTarget: getStatValue(homeFixtureStats, 'Shots on Goal') || 4,
    tackles: getStatValue(homeFixtureStats, 'Tackles') || 15,
    last5Results: 'WDWLD',
    winsSeasons: 0,
    drawsSeason: 0,
    lossesSeason: 0,
  };

  const awayStats = {
    id: awayTeam.id,
    name: awayTeam.name,
    offensiveStrength: Math.min(100, (getStatValue(awayFixtureStats, 'Shots on Goal') || 4) * 12),
    defensiveStrength: Math.max(0, 100 - (getStatValue(homeFixtureStats, 'Shots on Goal') || 4) * 10),
    midfieldStrength: parsePercentage(getStatValue(awayFixtureStats, 'Ball Possession')),
    setPieceStrength: 50,
    recentForm: 50,
    homeAdvantage: 55,
    awayPerformance: 45,
    goalsScored: 1.5,
    goalsConceded: 1.0,
    xg: parseFloat(getStatValue(awayFixtureStats, 'expected_goals')) || 1.5,
    xga: parseFloat(getStatValue(homeFixtureStats, 'expected_goals')) || 1.0,
    possession: parsePercentage(getStatValue(awayFixtureStats, 'Ball Possession')),
    shotsOnTarget: getStatValue(awayFixtureStats, 'Shots on Goal') || 4,
    tackles: getStatValue(awayFixtureStats, 'Tackles') || 15,
    last5Results: 'WDWLD',
    winsSeasons: 0,
    drawsSeason: 0,
    lossesSeason: 0,
  };

  const probs = calculateProbabilities(homeStats, awayStats);
  const goalTrends = calculateGoalTendencies(homeStats, awayStats);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="glass-card p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-sm text-muted-foreground">{match?.league || 'Partida'}</span>
            {match?.venue && <p className="text-xs text-muted-foreground mt-1">{match.venue}</p>}
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <TeamDisplay team={homeTeam} isHome />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{probs.homeWin}%</div>
              <div className="text-xs text-muted-foreground">Casa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-yellow">{probs.draw}%</div>
              <div className="text-xs text-muted-foreground">Empate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{probs.awayWin}%</div>
              <div className="text-xs text-muted-foreground">Fora</div>
            </div>
            <TeamDisplay team={awayTeam} />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Por que essas probabilidades?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TeamLogo logo={homeTeam.logo_url} name={homeTeam.name} />
              {homeTeam.name}
            </h3>
            <div className="space-y-3">
              <StatRow icon={Target} label="Forca Ofensiva" value={homeStats.offensiveStrength} />
              <StatRow icon={Shield} label="Forca Defensiva" value={homeStats.defensiveStrength} />
              <StatRow icon={Flame} label="Posse de Bola" value={homeStats.possession} />
              <StatRow icon={Users} label="Vantagem em Casa" value={homeStats.homeAdvantage} />
              <StatRow icon={Trophy} label="Chutes ao Gol" value={homeStats.shotsOnTarget} isDecimal />
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TeamLogo logo={awayTeam.logo_url} name={awayTeam.name} />
              {awayTeam.name}
            </h3>
            <div className="space-y-3">
              <StatRow icon={Target} label="Forca Ofensiva" value={awayStats.offensiveStrength} />
              <StatRow icon={Shield} label="Forca Defensiva" value={awayStats.defensiveStrength} />
              <StatRow icon={Flame} label="Posse de Bola" value={awayStats.possession} />
              <StatRow icon={Users} label="Performance Fora" value={awayStats.awayPerformance} />
              <StatRow icon={Trophy} label="Chutes ao Gol" value={awayStats.shotsOnTarget} isDecimal />
            </div>
          </div>
        </div>

        {h2h.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Confrontos Diretos (H2H)
            </h2>
            <div className="glass-card p-4 mb-6">
              <div className="space-y-2">
                {h2h.slice(0, 5).map((game, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm border-b border-border pb-2">
                    <span className="text-muted-foreground">
                      {new Date(game.fixture?.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      {game.teams?.home?.name} {game.goals?.home} x {game.goals?.away} {game.teams?.away?.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Tendencias de Gols
        </h2>
        
        <div className="glass-card p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GoalCard label="Mais de 1.5 gols" value={goalTrends.over15} />
            <GoalCard label="Mais de 2.5 gols" value={goalTrends.over25} />
            <GoalCard label="Mais de 3.5 gols" value={goalTrends.over35} />
            <GoalCard label="Ambos Marcam" value={goalTrends.btts} />
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="font-bold mb-3">Como calculamos</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nossas probabilidades sao calculadas analisando diversos fatores: <span className="text-foreground">forca ofensiva e defensiva</span> dos times, 
            <span className="text-foreground"> posse de bola</span>, 
            <span className="text-foreground"> chutes ao gol</span>, 
            alem de <span className="text-foreground"> confrontos diretos</span> e outras estatisticas avancadas.
            Dados fornecidos pela API-Football.
          </p>
        </div>
      </main>
    </div>
  );
}

function TeamDisplay({ team, isHome }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <TeamLogo logo={team.logo_url} name={team.name} size="lg" />
      <span className="font-bold text-center">{team.name}</span>
      {isHome && <span className="text-xs text-primary">Casa</span>}
    </div>
  );
}

function TeamLogo({ logo, name, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-3xl',
  };
  
  if (!logo) {
    return (
      <span className={`${sizeClasses[size]} rounded-full bg-secondary flex items-center justify-center font-bold`}>
        {name?.charAt(0) || '?'}
      </span>
    );
  }
  
  if (logo.startsWith('http')) {
    return (
      <img 
        src={logo} 
        alt={name || 'Team'} 
        className={`${sizeClasses[size]} rounded-full object-cover bg-secondary`}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }
  
  return <span className={sizeClasses[size]}>{logo}</span>;
}

function StatRow({ icon: Icon, label, value, isDecimal }) {
  const displayValue = isDecimal ? value.toFixed(1) : Math.round(value);
  const percentage = isDecimal ? (value / 10) * 100 : value;
  
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{displayValue}{isDecimal ? '' : '%'}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-neon-blue rounded-full transition-all"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function GoalCard({ label, value }) {
  return (
    <div className="text-center p-3 rounded-lg bg-secondary/50">
      <div className={`text-2xl font-bold ${value >= 60 ? 'text-primary' : value >= 40 ? 'text-neon-yellow' : 'text-muted-foreground'}`}>
        {value}%
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
