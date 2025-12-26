import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBar from "@/components/layout/MobileBar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ProductCard from "@/components/product/ProductCard";

import productRing from "@/assets/product-ring.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productPen from "@/assets/product-pen.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productAliancas from "@/assets/product-aliancas.jpg";

const categoryData: Record<string, { title: string; description: string; products: any[] }> = {
  joias: {
    title: "Joias",
    description: "Descubra nossa coleção exclusiva de joias em ouro e prata.",
    products: [
      { id: 1, name: "Anel Solitário Ouro 18k", price: 4890, originalPrice: 5490, image: productRing, isNew: true },
      { id: 2, name: "Colar Pérolas Naturais", price: 3290, image: productNecklace },
      { id: 3, name: "Pulseira Tennis Diamantes", price: 8990, originalPrice: 9990, image: productBracelet, isNew: true },
    ],
  },
  relogios: {
    title: "Relógios",
    description: "Relógios de luxo das melhores marcas do mundo.",
    products: [
      { id: 4, name: "Relógio Clássico Automático", price: 12890, image: productWatch, isNew: true },
      { id: 5, name: "Relógio Elegance Ouro", price: 18990, originalPrice: 21990, image: productWatch },
    ],
  },
  canetas: {
    title: "Canetas",
    description: "Canetas de luxo para quem aprecia a arte da escrita.",
    products: [
      { id: 6, name: "Caneta Executiva Premium", price: 2890, image: productPen },
      { id: 7, name: "Caneta Ouro Rosé", price: 4590, originalPrice: 5290, image: productPen, isNew: true },
    ],
  },
  aliancas: {
    title: "Alianças",
    description: "Alianças que simbolizam o amor eterno.",
    products: [
      { id: 8, name: "Par de Alianças Ouro 18k", price: 6890, image: productAliancas, isNew: true },
      { id: 9, name: "Alianças Diamantes", price: 9990, originalPrice: 11990, image: productAliancas },
    ],
  },
  acessorios: {
    title: "Acessórios",
    description: "Acessórios sofisticados para completar seu visual.",
    products: [
      { id: 10, name: "Pulseira Couro Premium", price: 890, image: productBracelet },
      { id: 11, name: "Abotoaduras Ouro", price: 1890, originalPrice: 2290, image: productRing, isNew: true },
    ],
  },
};

const Categoria = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? categoryData[slug] : null;

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-foreground mb-4">Categoria não encontrada</h1>
            <Link to="/" className="text-primary hover:underline">
              Voltar para a home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.title} | Ravic Joias</title>
        <meta name="description" content={category.description} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="bg-secondary py-12 md:py-20">
            <div className="container px-4 sm:px-6">
              <div className="text-center mb-8 xs:mb-10 sm:mb-12">
                <h1 className="font-serif text-3xl xs:text-4xl md:text-5xl text-foreground mb-3 xs:mb-4">
                  {category.title}
                </h1>
                <p className="text-base xs:text-lg text-muted max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-12 md:py-20">
            <div className="container px-4 sm:px-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6">
                {category.products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {category.products.length === 0 && (
                <p className="text-center text-muted py-12">
                  Nenhum produto encontrado nesta categoria.
                </p>
              )}
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

export default Categoria;
