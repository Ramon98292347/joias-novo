ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sizes INTEGER[] NULL;

COMMENT ON COLUMN public.products.sizes IS 'Lista de medidas disponíveis (5 a 32) para o produto';
