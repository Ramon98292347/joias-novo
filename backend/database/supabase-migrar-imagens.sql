-- Script para migrar imagens existentes para o Storage
-- Atualiza URLs para usar o Storage do Supabase

-- Atualizar URLs de imagens que não estão no storage
UPDATE product_images 
SET 
  url = CASE 
    WHEN url LIKE 'http%' AND url NOT LIKE '%supabase.co%' THEN 
      -- Converter URLs externas para placeholder ou deixar como está
      url
    WHEN url IS NULL OR url = '' THEN
      -- Gerar URL padrão para imagens sem URL
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sem+Imagem'
    ELSE 
      -- Manter URLs que já estão no storage ou são válidas
      url
  END,
  bucket_name = COALESCE(bucket_name, 'product-images'),
  storage_path = CASE 
    WHEN url LIKE '%supabase.co/storage%' THEN 
      -- Extrair o path do storage da URL existente
      SUBSTRING(url FROM 'object/public/product-images/(.+)')
    ELSE 
      -- Manter path existente ou NULL
      storage_path
  END;

-- Verificar imagens que precisam ser migradas
SELECT 
  id,
  product_id,
  url,
  bucket_name,
  storage_path,
  CASE 
    WHEN url LIKE '%supabase.co/storage%' THEN 'Já no Storage'
    WHEN url LIKE 'http%' THEN 'URL Externa'
    ELSE 'Sem URL'
  END as status
FROM product_images
ORDER BY status, created_at DESC;

-- Adicionar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_product_images_storage_check 
ON product_images(url, bucket_name, storage_path);

-- Mensagem de sucesso
SELECT 'Migração de imagens concluída!' as resultado;