import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBar from "@/components/layout/MobileBar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Hero from "@/components/home/Hero";
import ProductCarousel from "@/components/product/ProductCarousel";
import Categories from "@/components/home/Categories";
import Benefits from "@/components/home/Benefits";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import InstagramGallery from "@/components/home/InstagramGallery";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Ravic Joias | Alianças, Joias e Relógios de Luxo</title>
        <meta
          name="description"
          content="A mais de 30 anos no mercado de Alianças, Joias e Relógios. Fabricação própria, garantia eterna e qualidade premium. Frete grátis em compras acima de R$ 299."
        />
        <meta name="keywords" content="joias, alianças, relógios, canetas, ouro 18k, prata, luxo, joalheria" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <Hero />
          <ProductCarousel />
          <Categories />
          <Benefits />
          <Testimonials />
          <Newsletter />
          <InstagramGallery />
        </main>

        <Footer />
        <MobileBar />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
