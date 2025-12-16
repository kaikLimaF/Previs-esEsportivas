import { Database, Cpu, BarChart3, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Coleta de Dados',
    description: 'Agregamos dados de multiplas fontes: resultados, estatisticas avancadas, lesoes e condicoes.',
    highlight: '+20 indicadores',
  },
  {
    icon: Cpu,
    title: 'Processamento',
    description: 'Nosso algoritmo calcula uma "nota" para cada time com pesos especificos por indicador.',
    highlight: 'Algoritmo proprio',
  },
  {
    icon: BarChart3,
    title: 'Calculo de Probabilidades',
    description: 'Convertemos as notas em probabilidades usando modelos estatisticos validados.',
    highlight: 'Formulas validadas',
  },
  {
    icon: CheckCircle,
    title: 'Visualizacao',
    description: 'Apresentamos os resultados em dashboards claros e acionaveis.',
    highlight: 'Insights claros',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Como{' '}
            <span className="gradient-text">Calculamos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Somamos varios sinais dos times, comparamos as forcas e transformamos em porcentagens 
            com base em padroes historicos.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="glass-card p-6 text-center hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm neon-glow">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                  
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {step.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="glass-card p-6 border-primary/20">
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
              Formula Simplificada
            </h4>
            <div className="font-mono text-sm bg-background/50 p-4 rounded-lg space-y-2">
              <p><span className="text-primary">Nota_Time</span> = Sum(Peso_i x Indicador_i)</p>
              <p><span className="text-neon-blue">Chance_A</span> = Nota_A / (Nota_A + Nota_B)</p>
              <p><span className="text-neon-purple">Chance_Empate</span> = Fator_Empate x Media_Defensiva</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
