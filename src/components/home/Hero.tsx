import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-rings.jpg";

const Hero = () => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Alianças de ouro 18k"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative h-full flex items-center">
        <div className="max-w-xl animate-fade-in">
          <p className="text-primary text-sm md:text-base uppercase tracking-[0.2em] mb-4 animate-fade-in-delay-1">
            Coleção Exclusiva
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4">
            Momento
            <br />
            <span className="text-gold-gradient">Eterno</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-3 animate-fade-in-delay-2">
            Alianças em Ouro 18k
          </p>
          <ul className="space-y-1 text-sm text-muted/80 mb-8 animate-fade-in-delay-2">
            <li>• Sem Solda</li>
            <li>• Garantia Eterna</li>
            <li>• Fabricação Própria</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
            <Link to="/categoria/aliancas" className="btn-gold inline-flex items-center justify-center gap-2">
              Ver Coleção
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/loja" className="btn-outline-gold inline-flex items-center justify-center gap-2">
              Explorar Loja
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-pulse">
        <span className="text-xs uppercase tracking-wider text-muted">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
