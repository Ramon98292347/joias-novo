import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
  isBestseller,
}: ProductCardProps) => {
  const formatPrice = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link to={`/produto/${id}`} className="product-card group block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover img-zoom"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wider">
              Novo
            </span>
          )}
          {isBestseller && (
            <span className="px-2 py-1 bg-background text-foreground text-[10px] font-medium uppercase tracking-wider">
              Mais Vendido
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-1 bg-destructive text-destructive-foreground text-[10px] font-medium uppercase tracking-wider">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          onClick={(e) => {
            e.preventDefault();
            // Add to wishlist logic
          }}
        >
          <Heart className="h-4 w-4 text-foreground" />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            className="w-full py-2.5 bg-background/95 backdrop-blur-sm text-foreground text-xs font-medium uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
            }}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-primary mb-1">{category}</p>
        <h3 className="font-serif text-sm md:text-base text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-medium text-foreground">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-sm text-muted line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>
        <p className="text-[10px] text-muted mt-1">
          ou 10x de {formatPrice(price / 10)} sem juros
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
