-- Script para configurar Supabase Storage com verificação de existência
-- Executa apenas o que ainda não existe

-- 1. Criar buckets apenas se não existirem
DO $$
BEGIN
    -- Bucket para imagens de produtos
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'product-images',
            'product-images',
            true,
            5242880, -- 5MB
            ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        );
    END IF;

    -- Bucket para imagens do carousel
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'carousel-images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'carousel-images',
            'carousel-images',
            true,
            10485760, -- 10MB
            ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        );
    END IF;
END $$;

-- 2. Criar políticas apenas se não existirem (evita conflitos)
DO $$
DECLARE
    policy_exists boolean;
BEGIN
    -- Política para leitura pública no bucket de produtos
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir leitura pública produtos'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        CREATE POLICY "Permitir leitura pública produtos" ON storage.objects
        FOR SELECT
        USING (
            bucket_id = 'product-images' AND
            (storage.foldername(name))[1] = 'products'
        );
    END IF;

    -- Política para upload de imagens de produtos (apenas autenticados)
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir upload produtos autenticados'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        CREATE POLICY "Permitir upload produtos autenticados" ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'product-images' AND
            (storage.foldername(name))[1] = 'products' AND
            auth.role() = 'authenticated'
        );
    END IF;

    -- Política para exclusão de imagens de produtos (apenas autenticados)
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir exclusão produtos autenticados'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        CREATE POLICY "Permitir exclusão produtos autenticados" ON storage.objects
        FOR DELETE
        USING (
            bucket_id = 'product-images' AND
            (storage.foldername(name))[1] = 'products' AND
            auth.role() = 'authenticated'
        );
    END IF;

    -- Política para leitura pública no bucket de carousel
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir leitura pública carousel'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        CREATE POLICY "Permitir leitura pública carousel" ON storage.objects
        FOR SELECT
        USING (
            bucket_id = 'carousel-images' AND
            (storage.foldername(name))[1] = 'carousel'
        );
    END IF;

    -- Política para upload de imagens do carousel (apenas autenticados)
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir upload carousel autenticados'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        CREATE POLICY "Permitir upload carousel autenticados" ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'carousel-images' AND
            (storage.foldername(name))[1] = 'carousel' AND
            auth.role() = 'authenticated'
        );
    END IF;

    -- Política para exclusão de imagens do carousel (apenas autenticados)
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Permitir exclusão carousel autenticados'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        CREATE POLICY "Permitir exclusão carousel autenticados" ON storage.objects
        FOR DELETE
        USING (
            bucket_id = 'carousel-images' AND
            (storage.foldername(name))[1] = 'carousel' AND
            auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- 3. Verificar configuração final
SELECT 
    b.id as bucket_id,
    b.name as bucket_name,
    b.public,
    b.file_size_limit,
    COUNT(p.policyname) as total_policies
FROM storage.buckets b
LEFT JOIN pg_policies p ON p.tablename = 'objects'
WHERE b.id IN ('product-images', 'carousel-images')
GROUP BY b.id, b.name, b.public, b.file_size_limit;

-- 4. Listar políticas criadas
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%produtos%' OR policyname LIKE '%carousel%'
ORDER BY policyname;