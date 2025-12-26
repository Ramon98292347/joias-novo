import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import productRing from "@/assets/product-ring.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import heroRings from "@/assets/hero-rings.jpg";

const collections = [
  {
    name: "Ouro 18k",
    description: "Elegância atemporal em cada detalhe",
    image: heroRings,
    href: "/colecao/ouro-18k",
  },
  {
    name: "Coleção Noiva",
    description: "Para o dia mais especial",
    image: productRing,
    href: "/colecao/noiva",
  },
  {
    name: "Minimalista",
    description: "Sofisticação na simplicidade",
    image: productNecklace,
    href: "/colecao/minimalista",
  },
];

const Lookbook = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary text-sm uppercase tracking-wider mb-2">Inspiração</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Nossas Coleções</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.name}
              to={collection.href}
              className={`group relative overflow-hidden rounded-sm ${
                index === 0 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-sm text-muted mb-4">{collection.description}</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  Ver Coleção
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lookbook;
