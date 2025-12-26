import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "5527997340566";
  const message = "Olá! Gostaria de saber mais sobre os produtos da Ravic Joias.";

  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        Fale conosco
      </span>
    </button>
  );
};

export default WhatsAppButton;
