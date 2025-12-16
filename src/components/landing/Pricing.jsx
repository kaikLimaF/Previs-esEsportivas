import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Perfeito para comecar a explorar',
    features: [
      '10 jogos por dia',
      'Estatisticas basicas',
      'Probabilidades gerais',
      '4 esportes disponiveis',
      'Favoritos limitados (5)',
    ],
    cta: 'Comecar Gratis',
    href: '/auth?mode=signup',
    popular: false,
  },
  {
    name: 'Premium',
    price: 'R$ 29,90',
    period: '/mes',
    description: 'Para apostadores serios',
    features: [
      'Jogos ilimitados',
      'Todos os indicadores',
      'Graficos avancados',
      'Alertas personalizados',
      'Historico completo',
      'Comparador de times',
      'Favoritos ilimitados',
      'Suporte prioritario',
    ],
    cta: 'Assinar Premium',
    href: '/pricing',
    popular: true,
  },
  {
    name: 'Pro',
    price: 'R$ 79,90',
    period: '/mes',
    description: 'Para profissionais e empresas',
    features: [
      'Tudo do Premium',
      'API de dados',
      'Exportacao de relatorios',
      'Webhooks personalizados',
      'Analises sob demanda',
      'Gerente de conta dedicado',
    ],
    cta: 'Contato Comercial',
    href: '/pricing',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Planos e Precos
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Escolha seu{' '}
            <span className="gradient-text">plano ideal</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comece gratis e faca upgrade quando precisar de mais poder.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "glass-card p-6 relative transition-all duration-300 hover:scale-[1.02]",
                plan.popular && "border-primary/50 scale-[1.02]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold neon-glow">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.popular ? "btn-primary-glow" : ""
                )}
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link to={plan.href}>
                  {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
