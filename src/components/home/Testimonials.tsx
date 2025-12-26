import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    location: "São Paulo, SP",
    text: "As alianças ficaram perfeitas! Qualidade impecável e atendimento excelente. Recomendo a todos que buscam joias de verdade.",
    rating: 5,
    product: "Alianças Ouro 18k",
  },
  {
    name: "João Santos",
    location: "Rio de Janeiro, RJ",
    text: "Comprei um relógio para presente e superou todas as expectativas. Embalagem premium e entrega antes do prazo.",
    rating: 5,
    product: "Relógio Clássico",
  },
  {
    name: "Ana Costa",
    location: "Belo Horizonte, MG",
    text: "Já é a terceira compra que faço na Ravic. Sempre peças lindas e duradouras. A garantia eterna faz toda diferença!",
    rating: 5,
    product: "Colar Ouro 18k",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary text-sm uppercase tracking-wider mb-2">Depoimentos</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">O Que Dizem Nossos Clientes</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 md:p-8 rounded-sm border border-border/50 hover:border-primary/30 transition-colors"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-foreground leading-relaxed mb-6">{testimonial.text}</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div>
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted">{testimonial.location}</p>
                <p className="text-xs text-primary mt-1">{testimonial.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
