import { useEffect, useState } from "react";
import CollectionProductsCarousel from "@/components/home/CollectionProductsCarousel";
import { getApiBaseUrl } from "@/lib/api";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

const CollectionsBySection = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/public/collections`);
        if (!res.ok) throw new Error("Erro ao buscar coleções");
        const data = await res.json();
        setCollections(Array.isArray(data?.collections) ? data.collections : []);
      } catch {
        setCollections([]);
      }
    };
    load();
  }, []);

  if (collections.length === 0) return null;

  return (
    <div>
      {collections.map((c) => (
        <CollectionProductsCarousel key={c.id} collection={c} />
      ))}
    </div>
  );
};

export default CollectionsBySection;

