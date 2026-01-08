-- Script para renomear tabelas do Inglês para Português no Supabase
-- Execute este script no SQL Editor do Supabase

DO $$ 
BEGIN
    -- 1. Renomear admin_users para usuários_administradores
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
        ALTER TABLE IF EXISTS admin_users RENAME TO usuários_administradores;
    END IF;

    -- 2. Renomear categories para categorias
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'categories') THEN
        ALTER TABLE IF EXISTS categories RENAME TO categorias;
    END IF;

    -- 3. Renomear collections para coleções
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'collections') THEN
        ALTER TABLE IF EXISTS collections RENAME TO coleções;
    END IF;

    -- 4. Renomear products para produtos
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'products') THEN
        ALTER TABLE IF EXISTS products RENAME TO produtos;
    END IF;

    -- 5. Renomear product_images para imagens_do_produto
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'product_images') THEN
        ALTER TABLE IF EXISTS product_images RENAME TO imagens_do_produto;
    END IF;

    -- 6. Renomear carousel_items para itens_do_carrossel
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'carousel_items') THEN
        ALTER TABLE IF EXISTS carousel_items RENAME TO itens_do_carrossel;
    END IF;

    -- 7. Renomear settings para configurações
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'settings') THEN
        ALTER TABLE IF EXISTS settings RENAME TO configurações;
    END IF;

    -- Tabelas adicionais (caso existam e você queira garantir o nome)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'inventory') THEN
        ALTER TABLE IF EXISTS inventory RENAME TO inventário;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cart_items') THEN
        ALTER TABLE IF EXISTS cart_items RENAME TO itens_do_carrinho_de_compras;
    END IF;

END $$;

-- Verificar as tabelas após a renomeação
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;