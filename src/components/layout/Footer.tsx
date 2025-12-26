import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-petrol-dark border-t border-border">
      {/* Main Footer */}
      <div className="container px-4 sm:px-6 py-8 xs:py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 sm:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4 xs:mb-5 sm:mb-6">
              <h2 className="font-serif text-xl xs:text-2xl tracking-wider text-foreground">
                <span className="text-primary">R</span>AVIC
                <span className="block text-[9px] xs:text-[10px] tracking-[0.3em] text-muted font-sans font-light -mt-1">
                  JOIAS
                </span>
              </h2>
            </Link>
            <p className="text-muted text-xs xs:text-sm leading-relaxed mb-4 xs:mb-5 sm:mb-6">
              A mais de 30 anos no mercado de Alianças, Joias e Relógios. Fabricamos e consertamos.
            </p>
            <div className="flex items-center gap-3 xs:gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 xs:h-10 xs:w-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram className="h-4 w-4 xs:h-5 xs:w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 xs:h-10 xs:w-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Facebook className="h-4 w-4 xs:h-5 xs:w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 xs:h-10 xs:w-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Youtube className="h-4 w-4 xs:h-5 xs:w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-base xs:text-lg text-foreground mb-4 xs:mb-5 sm:mb-6">Navegação</h3>
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
            <h3 className="font-serif text-base xs:text-lg text-foreground mb-4 xs:mb-5 sm:mb-6">Institucional</h3>
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
            <h3 className="font-serif text-base xs:text-lg text-foreground mb-4 xs:mb-5 sm:mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2 xs:gap-3">
                <Phone className="h-4 w-4 xs:h-5 xs:w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs xs:text-sm text-foreground">(27) 99734-0566</p>
                  <p className="text-[10px] xs:text-xs text-muted">Seg a Sex: 9h às 18h</p>
                </div>
              </li>
              <li className="flex items-start gap-2 xs:gap-3">
                <Mail className="h-4 w-4 xs:h-5 xs:w-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:marketing@ravicjoias.com.br"
                  className="text-xs xs:text-sm text-muted hover:text-primary transition-colors"
                >
                  marketing@ravicjoias.com.br
                </a>
              </li>
              <li className="flex items-start gap-2 xs:gap-3">
                <MapPin className="h-4 w-4 xs:h-5 xs:w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs xs:text-sm text-muted">
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
        <div className="container px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 xs:gap-4">

            <div className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6 text-xs text-muted justify-center md:justify-start">
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
