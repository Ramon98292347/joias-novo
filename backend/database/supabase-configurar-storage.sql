-- Script para configurar Storage do Supabase para imagens de produtos
-- Este script configura buckets e permissões para upload de imagens

-- Criar bucket para imagens de produtos (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 
  'product-images', 
  true, -- público (acessível via URL)
  5242880, -- 5MB limite
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Criar bucket para carousel (banner) images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'carousel-images', 
  'carousel-images', 
  true, -- público
  10485760, -- 10MB limite para banners
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Políticas de segurança para product-images bucket
-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

-- Permitir upload para usuários autenticados (admin)
CREATE POLICY "Permitir upload admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Permitir update para usuários autenticados (admin)
CREATE POLICY "Permitir update admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

-- Permitir delete para usuários autenticados (admin)
CREATE POLICY "Permitir delete admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- Políticas para carousel-images bucket
CREATE POLICY "Permitir leitura pública carousel" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'carousel-images');

CREATE POLICY "Permitir upload admin carousel" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'carousel-images');

CREATE POLICY "Permitir update admin carousel" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'carousel-images');

CREATE POLICY "Permitir delete admin carousel" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'carousel-images');

-- Atualizar a tabela product_images para usar storage
-- Modificar a coluna url para aceitar URLs do storage
ALTER TABLE product_images 
ALTER COLUMN url TYPE VARCHAR(1000);

-- Adicionar coluna para identificar se é imagem do storage
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS storage_path VARCHAR(500);

-- Adicionar coluna para bucket reference
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS bucket_name VARCHAR(100) DEFAULT 'product-images';

-- Criar função para facilitar upload de imagens
CREATE OR REPLACE FUNCTION upload_product_image(
  p_product_id UUID,
  p_file_name VARCHAR,
  p_storage_path VARCHAR,
  p_alt_text VARCHAR DEFAULT NULL,
  p_is_primary BOOLEAN DEFAULT false
) RETURNS UUID AS $$
DECLARE
  v_image_id UUID;
  v_public_url VARCHAR;
BEGIN
  -- Gerar URL pública do storage
  v_public_url := 'https://your-project.supabase.co/storage/v1/object/public/product-images/' || p_storage_path;
  
  -- Inserir registro na tabela
  INSERT INTO product_images (id, product_id, url, alt_text, is_primary, storage_path, bucket_name)
  VALUES (gen_random_uuid(), p_product_id, v_public_url, p_alt_text, p_is_primary, p_storage_path, 'product-images')
  RETURNING id INTO v_image_id;
  
  RETURN v_image_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_product_images_storage_path ON product_images(storage_path);
CREATE INDEX IF NOT EXISTS idx_product_images_bucket ON product_images(bucket_name);

-- Mensagem de sucesso
SELECT 'Storage configurado com sucesso!' as status;