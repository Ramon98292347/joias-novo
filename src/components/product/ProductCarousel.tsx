import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

import productRing from "@/assets/product-ring.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productPen from "@/assets/product-pen.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productAliancas from "@/assets/product-aliancas.jpg";

const mockProducts = [
  {
    id: "1",
    name: "Anel Solitário Diamante 0.30ct Ouro 18k",
    price: 4890,
    originalPrice: 5490,
    image: productRing,
    category: "Anéis",
    isNew: true,
  },
  {
    id: "2",
    name: "Colar Pingente Girassol Ouro 18k",
    price: 3250,
    image: productNecklace,
    category: "Colares",
    isBestseller: true,
  },
  {
    id: "3",
    name: "Relógio Clássico Rose Gold",
    price: 2890,
    image: productWatch,
    category: "Relógios",
    isNew: true,
  },
  {
    id: "4",
    name: "Caneta Tinteiro Ouro Gravado",
    price: 1590,
    image: productPen,
    category: "Canetas",
  },
  {
    id: "5",
    name: "Pulseira Elos Ouro 18k",
    price: 2190,
    image: productBracelet,
    category: "Pulseiras",
    isBestseller: true,
  },
  {
    id: "6",
    name: "Par de Alianças Ouro 18k com Diamantes",
    price: 6890,
    originalPrice: 7990,
    image: productAliancas,
    category: "Alianças",
    isNew: true,
  },
];

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1.5);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, mockProducts.length - Math.floor(itemsPerView));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm uppercase tracking-wider mb-2">Exclusividade</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Novidades da Loja</h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
