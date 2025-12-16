import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Analise Preditiva Esportiva
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
            Previsoes Esportivas{' '}
            <span className="gradient-text neon-text">Inteligentes</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Um motor de analise estatistica que transforma dados em{' '}
            <span className="text-foreground font-semibold">probabilidades precisas</span>.
            Insights que dao vantagem - sem intermediar apostas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="btn-primary-glow text-lg px-8 py-6" asChild>
              <Link to="/auth?mode=signup">
                Comecar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/dashboard">
                Ver Analises
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <StatCard icon={BarChart3} value="92%" label="Precisao Media" />
            <StatCard icon={TrendingUp} value="10K+" label="Jogos Analisados" />
            <StatCard icon={Shield} value="4" label="Esportes" />
            <StatCard icon={Zap} value="24/7" label="Atualizacao" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="glass-card p-4 sm:p-6 text-center hover:border-primary/30 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
