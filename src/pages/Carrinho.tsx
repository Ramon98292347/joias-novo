import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Carrinho = () => {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted" />
        <h1 className="text-3xl font-serif mb-4">Carrinho de Compras</h1>
        <p className="text-muted mb-8">Seu carrinho está vazio no momento.</p>
        
        <div className="bg-secondary/30 rounded-lg p-6">
          <p className="text-sm text-muted mb-4">
            Adicione produtos ao carrinho para visualizá-los aqui.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Continuar Comprando
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;