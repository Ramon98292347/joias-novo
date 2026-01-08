-- Script para atualizar tabela product_images com Storage
-- Mantém estrutura existente e adiciona campos do Storage

-- 1. Verificar estrutura atual da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'product_images'
ORDER BY ordinal_position;

-- 2. Adicionar campos do Storage (se não existirem)
DO $$
BEGIN
    -- Adicionar bucket_name se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_images' 
        AND column_name = 'bucket_name'
    ) THEN
        ALTER TABLE product_images ADD COLUMN bucket_name VARCHAR(100);
    END IF;

    -- Adicionar storage_path se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_images' 
        AND column_name = 'storage_path'
    ) THEN
        ALTER TABLE product_images ADD COLUMN storage_path VARCHAR(500);
    END IF;

    -- Adicionar updated_at se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_images' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE product_images ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 3. Atualizar registros existentes com base nas URLs atuais
UPDATE product_images 
SET 
    bucket_name = COALESCE(bucket_name, 'product-images'),
    storage_path = CASE 
        WHEN image_url LIKE '%supabase.co/storage%' AND storage_path IS NULL THEN 
            -- Extrair path do storage da URL
            SUBSTRING(image_url FROM 'object/public/product-images/(.+)')
        WHEN storage_path IS NULL THEN 
            -- Gerar path baseado no ID do produto
            'products/' || product_id || '/' || EXTRACT(EPOCH FROM created_at) || '-' || id || '.jpg'
        ELSE 
            storage_path
    END
WHERE bucket_name IS NULL OR storage_path IS NULL;

-- 4. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_product_images_bucket ON product_images(bucket_name);
CREATE INDEX IF NOT EXISTS idx_product_images_storage_path ON product_images(storage_path);
CREATE INDEX IF NOT EXISTS idx_product_images_updated_at ON product_images(updated_at);

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_product_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para updated_at (remove se existir e recria)
DROP TRIGGER IF EXISTS update_product_images_updated_at ON product_images;
CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_product_images_updated_at();

-- 7. Verificar resultado final
SELECT 
    id,
    product_id,
    image_url,
    bucket_name,
    storage_path,
    is_primary,
    created_at,
    updated_at
FROM product_images
ORDER BY product_id, sort_order, created_at;