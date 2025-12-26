import { Shield, Truck, Award, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Pagamento Seguro",
    description: "Suas transações protegidas com tecnologia de ponta",
  },
  {
    icon: Truck,
    title: "Envio Rápido",
    description: "Entrega em até 48h para todo o Brasil",
  },
  {
    icon: Award,
    title: "Garantia Eterna",
    description: "Fabricação própria com qualidade garantida",
  },
  {
    icon: Headphones,
    title: "Atendimento Premium",
    description: "Suporte especializado via WhatsApp",
  },
];

const Benefits = () => {
  return (
    <section className="py-16 md:py-20 border-y border-border/50">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center group">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border border-primary/30 mb-4 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
