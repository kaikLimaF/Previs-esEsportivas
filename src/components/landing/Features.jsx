import { 
  BarChart3, 
  Brain, 
  Bell, 
  GitCompare, 
  Shield, 
  Smartphone,
  TrendingUp,
  Target
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Modelagem Estatistica',
    description: 'Algoritmo proprietario que analisa +20 indicadores por time, incluindo xG, forma recente e confrontos diretos.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: BarChart3,
    title: 'Visualizacoes Avancadas',
    description: 'Graficos de radar, tendencias de forma e historico de confrontos em dashboards intuitivos.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/10',
  },
  {
    icon: Bell,
    title: 'Alertas em Tempo Real',
    description: 'Notificacoes quando as probabilidades mudam significativamente ou quando ha atualizacoes importantes.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/10',
  },
  {
    icon: GitCompare,
    title: 'Comparador de Times',
    description: 'Compare qualquer time lado a lado com metricas detalhadas e probabilidades calculadas.',
    color: 'text-neon-orange',
    bgColor: 'bg-neon-orange/10',
  },
  {
    icon: Target,
    title: 'Multi-Esportes',
    description: 'Futebol, Basquete, Tenis e E-sports. Todos com o mesmo rigor estatistico.',
    color: 'text-neon-yellow',
    bgColor: 'bg-neon-yellow/10',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description: 'Acesse suas analises de qualquer dispositivo, em qualquer lugar.',
    color: 'text-neon-red',
    bgColor: 'bg-neon-red/10',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Funcionalidades
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Tudo que voce precisa para{' '}
            <span className="gradient-text">analises precisas</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ferramentas profissionais de analise esportiva, simplificadas para voce.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
