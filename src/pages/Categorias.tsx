import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Categorias = () => {
  const categorias = [
    { nome: "Joias", slug: "joias", descricao: "Joias finas e elegantes" },
    { nome: "Relógios", slug: "relogios", descricao: "Relógios de luxo e precisão" },
    { nome: "Canetas", slug: "canetas", descricao: "Canetas premium e sofisticadas" },
    { nome: "Alianças", slug: "aliancas", descricao: "Alianças para casamentos e compromissos" },
    { nome: "Acessórios", slug: "acessorios", descricao: "Acessórios finos e complementares" },
  ];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-serif">Categorias</h1>
        <div></div> {/* Espaço vazio para centralizar o título */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div key={categoria.slug} className="bg-secondary/30 rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-2">{categoria.nome}</h3>
            <p className="text-muted mb-4">{categoria.descricao}</p>
            <Link to={`/categoria/${categoria.slug}`}>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Produtos
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorias;