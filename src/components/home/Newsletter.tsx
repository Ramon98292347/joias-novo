import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic
    setEmail("");
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-primary text-sm uppercase tracking-wider mb-2">Exclusivo</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Receba Novidades em Primeira Mão
          </h2>
          <p className="text-muted mb-8">
            Cadastre-se para receber ofertas exclusivas, lançamentos e dicas de estilo.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button type="submit" className="btn-gold inline-flex items-center justify-center gap-2 whitespace-nowrap">
              Inscrever
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="text-xs text-muted mt-4">
            Ao se inscrever, você concorda com nossa{" "}
            <a href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
