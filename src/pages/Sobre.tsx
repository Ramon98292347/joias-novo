import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBar from "@/components/layout/MobileBar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const Sobre = () => {
  return (
    <>
      <Helmet>
        <title>Sobre a Ravic | Ravic Joias</title>
        <meta name="description" content="Conheça a história da Ravic Joias, tradição e elegância desde 1985." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="bg-secondary py-12 md:py-20">
            <div className="container text-center">
              <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
                Sobre a Ravic
              </h1>
              <p className="text-muted max-w-2xl mx-auto">
                Tradição e elegância desde 1985
              </p>
            </div>
          </section>

          <section className="py-12 md:py-20">
            <div className="container max-w-4xl">
              <div className="prose prose-lg mx-auto text-muted">
                <p className="text-lg leading-relaxed mb-6">
                  A Ravic Joias nasceu da paixão por criar peças que transcendem o tempo. 
                  Desde 1985, nos dedicamos a oferecer joias, relógios e acessórios de luxo 
                  que combinam tradição artesanal com design contemporâneo.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Nossa missão é proporcionar momentos únicos através de peças que carregam 
                  significado, qualidade e sofisticação. Cada item em nossa coleção é 
                  cuidadosamente selecionado para atender aos mais altos padrões de excelência.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Com atendimento personalizado e compromisso com a satisfação do cliente, 
                  a Ravic se tornou referência em joalheria premium no Brasil, unindo o 
                  melhor da tradição europeia com a elegância brasileira.
                </p>

                <h2 className="text-2xl font-serif text-foreground mt-12 mb-6">Nossos Valores</h2>
                <ul className="space-y-4 text-muted">
                  <li><strong className="text-foreground">Excelência:</strong> Qualidade incomparável em cada detalhe</li>
                  <li><strong className="text-foreground">Tradição:</strong> Técnicas artesanais preservadas por gerações</li>
                  <li><strong className="text-foreground">Inovação:</strong> Design contemporâneo que surpreende</li>
                  <li><strong className="text-foreground">Confiança:</strong> Transparência e honestidade em todas as relações</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <MobileBar />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Sobre;
