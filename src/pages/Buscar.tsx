import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Buscar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif text-center mb-8">Buscar Produtos</h1>
        
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