import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Buscar = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
          <h1 className="text-3xl font-serif">Buscar Produtos</h1>
          <div></div> {/* Espaço vazio para centralizar o título */}
        </div>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-5 w-5" />
          <Input
            type="text"
            placeholder="Digite o que está procurando..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full"
          />
        </div>

        <div className="text-center">
          <p className="text-muted mb-4">Digite algo na barra de busca acima</p>
          <p className="text-sm text-muted/70">Esta funcionalidade está em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
};

export default Buscar;