import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Carrinho = () => {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-serif">Carrinho de Compras</h1>
          <div></div> {/* Espaço vazio para centralizar o título */}
        </div>
        
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted" />
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
    </div>
  );
};

export default Carrinho;