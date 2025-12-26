import { Link } from "react-router-dom";
import productRing from "@/assets/product-ring.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productPen from "@/assets/product-pen.jpg";
import productAliancas from "@/assets/product-aliancas.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";

const categories = [
  {
    name: "Joias",
    image: productRing,
    href: "/categoria/joias",
    description: "Anéis, Colares, Brincos",
  },
  {
    name: "Relógios",
    image: productWatch,
    href: "/categoria/relogios",
    description: "Clássicos e Modernos",
  },
  {
    name: "Canetas",
    image: productPen,
    href: "/categoria/canetas",
    description: "Escrita Premium",
  },
  {
    name: "Alianças",
    image: productAliancas,
    href: "/categoria/aliancas",
    description: "Ouro 18k e Prata",
  },
  {
    name: "Acessórios",
    image: productBracelet,
    href: "/categoria/acessorios",
    description: "Pulseiras e Mais",
  },
];

const Categories = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary text-sm uppercase tracking-wider mb-2">Explore</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Nossas Categorias</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="category-card group aspect-[3/4]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-4 md:p-6">
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
