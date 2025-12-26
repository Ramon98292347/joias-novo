import { Truck } from "lucide-react";

const Topbar = () => {
  return (
    <div className="bg-primary py-2">
      <div className="container flex items-center justify-center gap-2">
        <Truck className="h-4 w-4 text-primary-foreground" />
        <span className="topbar-text text-xs md:text-sm font-medium tracking-wider uppercase text-primary-foreground">
          Frete Grátis em compras acima de R$ 299
        </span>
      </div>
    </div>
  );
};

export default Topbar;
