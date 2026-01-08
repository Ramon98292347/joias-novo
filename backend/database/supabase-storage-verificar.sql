-- Script para verificar configuração atual do Storage
-- Execute primeiro para ver o que já existe

-- 1. Verificar buckets existentes
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets
ORDER BY name;

-- 2. Verificar políticas existentes
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY policyname;

-- 3. Verificar se há políticas com nomes conflitantes
SELECT 
    policyname,
    COUNT(*) as quantidade
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
GROUP BY policyname
HAVING COUNT(*) > 1;

-- 4. Verificar estrutura da tabela objects
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'storage' 
AND table_name = 'objects'
ORDER BY ordinal_position;

-- 5. Verificar permissões atuais
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'storage' 
AND table_name = 'objects';