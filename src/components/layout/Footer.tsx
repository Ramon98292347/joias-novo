import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-petrol-dark border-t border-border">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-2xl tracking-wider text-foreground">
                <span className="text-primary">R</span>AVIC
                <span className="block text-[10px] tracking-[0.3em] text-muted font-sans font-light -mt-1">
                  JOIAS
                </span>
              </h2>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              A mais de 30 anos no mercado de Alianças, Joias e Relógios. Fabricamos e consertamos.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-lg text-foreground mb-6">Navegação</h3>
            <ul className="space-y-3">
              {["Joias", "Relógios", "Canetas", "Alianças", "Acessórios", "Novidades"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/categoria/${item.toLowerCase()}`}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h3 className="font-serif text-lg text-foreground mb-6">Institucional</h3>
            <ul className="space-y-3">
              {[
                { name: "Sobre a Ravic", href: "/sobre" },
                { name: "Como Comprar", href: "/como-comprar" },
                { name: "Trocas e Devoluções", href: "/trocas" },
                { name: "Privacidade", href: "/privacidade" },
                { name: "Termos de Uso", href: "/termos" },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg text-foreground mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">(27) 99734-0566</p>
                  <p className="text-xs text-muted">Seg a Sex: 9h às 18h</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:marketing@ravicjoias.com.br"
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  marketing@ravicjoias.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted">
                  Avenida Expedito Garcia, 94
                  <br />
                  Cariacica - Espírito Santo
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-6 text-xs text-muted justify-center md:justify-start">
              <Link to="/privacidade" className="hover:text-primary transition-colors">
                Como cuidamos da sua privacidade?
              </Link>
              <span className="hidden md:inline">|</span>
              <Link to="/compra-garantida" className="hover:text-primary transition-colors">
                Compra garantida
              </Link>
              <span className="hidden md:inline">|</span>
              <button className="hover:text-primary transition-colors">Configurar cookies</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
