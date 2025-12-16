import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Loader2, TrendingUp, Calendar, Filter, Globe, Trophy, RefreshCw } from 'lucide-react';
import { apiFootballService } from '@/services/apiFootballService';
import { addDays, isSameDay, startOfDay } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(new Date());

  const dateOptions = useMemo(() => {
    const today = startOfDay(new Date());
    return [0, 1, 2, 3, 4, 5, 6].map(i => addDays(today, i));
  }, []);

  // Extrair ligas e paises unicos dos jogos
  const { leagues, countries } = useMemo(() => {
    const leagueSet = new Set();
    const countrySet = new Set();
    
    matches.forEach(m => {
      if (m.league?.name) leagueSet.add(m.league.name);
      if (m.league?.country) countrySet.add(m.league.country);
    });
    
    return {
      leagues: Array.from(leagueSet).sort(),
      countries: Array.from(countrySet).sort()
    };
  }, [matches]);

  // Buscar jogos quando a data mudar
  useEffect(() => {
    fetchMatches();
  }, [dateFilter]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = format(dateFilter, 'yyyy-MM-dd');
      const fixtures = await apiFootballService.getFixtures(formattedDate);
      setMatches(fixtures);
    } catch (err) {
      console.error('Erro ao buscar jogos:', err);
      setError('Erro ao carregar jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar jogos
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (leagueFilter !== 'all' && m.league?.name !== leagueFilter) return false;
      if (countryFilter !== 'all' && m.league?.country !== countryFilter) return false;
      return true;
    });
  }, [matches, leagueFilter, countryFilter]);

  // Agrupar jogos por liga
  const matchesByLeague = useMemo(() => {
    const grouped = {};
    filteredMatches.forEach(match => {
      const leagueName = match.league?.name || 'Outros';
      if (!grouped[leagueName]) grouped[leagueName] = [];
      grouped[leagueName].push(match);
    });
    const sortedKeys = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const sortedGrouped = {};
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key];
    });
    return sortedGrouped;
  }, [filteredMatches]);

  // Calcular probabilidades simples baseado nos dados da API
  const getProbs = (fixture) => {
    // Se tiver predictions da API, usar
    // Caso contrario, calcular baseado em form/ranking
    const homeForm = fixture.teams?.home?.form || '';
    const awayForm = fixture.teams?.away?.form || '';
    
    let homeScore = 50;
    let awayScore = 50;
    
    // Calcular baseado na forma recente
    for (const char of homeForm.slice(-5)) {
      if (char === 'W') homeScore += 5;
      else if (char === 'D') homeScore += 1;
      else if (char === 'L') homeScore -= 3;
    }
    
    for (const char of awayForm.slice(-5)) {
      if (char === 'W') awayScore += 5;
      else if (char === 'D') awayScore += 1;
      else if (char === 'L') awayScore -= 3;
    }
    
    // Vantagem de jogar em casa
    homeScore += 5;
    
    const total = homeScore + awayScore;
    const homeWin = Math.round((homeScore / total) * 100);
    const awayWin = Math.round((awayScore / total) * 100);
    const draw = Math.max(15, 100 - homeWin - awayWin);
    
    // Normalizar para somar 100
    const sum = homeWin + draw + awayWin;
    return {
      homeWin: Math.round((homeWin / sum) * 100),
      draw: Math.round((draw / sum) * 100),
      awayWin: Math.round((awayWin / sum) * 100),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando jogos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Jogos com probabilidades calculadas</p>
          </div>
          <button 
            onClick={fetchMatches}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>

        {error && (
          <div className="glass-card p-4 mb-6 border-destructive/50 bg-destructive/10">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Date Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dateOptions.map((date, i) => (
            <button
              key={i}
              onClick={() => setDateFilter(date)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isSameDay(dateFilter, date)
                  ? 'bg-primary text-primary-foreground neon-glow'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {i === 0 ? 'Hoje' : i === 1 ? 'Amanha' : format(date, "EEE, dd/MM", { locale: ptBR })}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pais</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todos os paises</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Liga</label>
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas as ligas</option>
                {leagues.map((league) => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Calendar} value={filteredMatches.length} label="Jogos" />
          <StatCard icon={Trophy} value={Object.keys(matchesByLeague).length} label="Ligas" />
          <StatCard icon={Globe} value={countries.length} label="Paises" />
          <StatCard icon={TrendingUp} value={matches.length} label="Total" />
        </div>

        {/* Matches */}
        {filteredMatches.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Nenhum jogo encontrado para esta data.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(matchesByLeague).map(([leagueName, leagueMatches]) => {
              const firstMatch = leagueMatches[0];
              const country = firstMatch?.league?.country;
              const leagueLogo = firstMatch?.league?.logo;
              
              return (
                <div key={leagueName}>
                  <div className="flex items-center gap-3 mb-3">
                    {leagueLogo ? (
                      <img src={leagueLogo} alt={leagueName} className="w-6 h-6 object-contain" />
                    ) : (
                      <Trophy className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <h2 className="font-semibold text-lg">{leagueName}</h2>
                      {country && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {country}
                        </span>
                      )}
                    </div>
                    <span className="ml-auto text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                      {leagueMatches.length} jogo{leagueMatches.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leagueMatches.map((fixture) => {
                      const probs = getProbs(fixture);
                      const matchTime = new Date(fixture.fixture?.date);
                      const status = fixture.fixture?.status?.short;
                      const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(status);
                      
                      return (
                        <Link 
                          to={`/match/${fixture.fixture?.id}`} 
                          key={fixture.fixture?.id} 
                          className="match-card"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-muted-foreground">{country}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              isLive 
                                ? 'bg-primary/20 text-primary animate-pulse' 
                                : 'bg-secondary text-muted-foreground'
                            }`}>
                              {isLive ? 'AO VIVO' : format(matchTime, 'HH:mm')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 flex-1">
                              <TeamLogo logo={fixture.teams?.home?.logo} name={fixture.teams?.home?.name} />
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm leading-tight">
                                  {fixture.teams?.home?.name}
                                </span>
                              </div>
                            </div>
                            
                            {fixture.goals?.home !== null ? (
                              <div className="text-center px-3">
                                <span className="text-xl font-bold">
                                  {fixture.goals?.home} - {fixture.goals?.away}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs px-2">vs</span>
                            )}
                            
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-sm leading-tight">
                                  {fixture.teams?.away?.name}
                                </span>
                              </div>
                              <TeamLogo logo={fixture.teams?.away?.logo} name={fixture.teams?.away?.name} />
                            </div>
                          </div>

                          <div className="flex justify-between text-center">
                            <ProbBadge value={probs.homeWin} label="Casa" />
                            <ProbBadge value={probs.draw} label="Empate" />
                            <ProbBadge value={probs.awayWin} label="Fora" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="glass-card p-4 text-center">
      <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ProbBadge({ value, label }) {
  const color = value >= 50 ? 'text-primary' : value >= 30 ? 'text-neon-yellow' : 'text-muted-foreground';
  return (
    <div>
      <div className={`text-lg font-bold ${color}`}>{value}%</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function TeamLogo({ logo, name }) {
  if (!logo) {
    return (
      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
        {name?.charAt(0) || '?'}
      </span>
    );
  }
  
  return (
    <img 
      src={logo} 
      alt={name || 'Team'} 
      className="w-8 h-8 object-contain"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}
