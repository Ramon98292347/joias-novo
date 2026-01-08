import { useEffect, useState } from "react";
import CollectionProductsCarousel from "@/components/home/CollectionProductsCarousel";
import { fetchCollections } from "@/services/publicData";

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
        const data = await fetchCollections();
        setCollections(Array.isArray(data) ? data : []);
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
