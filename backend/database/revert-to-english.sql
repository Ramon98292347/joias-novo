-- Script para reverter nomes das tabelas de volta para inglês
-- Executar este script no Supabase

-- Função auxiliar para verificar e renomear tabela
CREATE OR REPLACE FUNCTION safe_rename_table(old_name TEXT, new_name TEXT)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = old_name) THEN
        EXECUTE format('ALTER TABLE IF EXISTS %I RENAME TO %I', old_name, new_name);
        RAISE NOTICE 'Tabela % renomeada para %', old_name, new_name;
    ELSE
        RAISE NOTICE 'Tabela % não existe', old_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Reverter nomes das tabelas principais
SELECT safe_rename_table('usuários_administradores', 'admin_users');
SELECT safe_rename_table('categorias', 'categories');
SELECT safe_rename_table('produtos', 'products');
SELECT safe_rename_table('clientes', 'customers');
SELECT safe_rename_table('pedidos', 'orders');
SELECT safe_rename_table('itens_do_pedido', 'order_items');
SELECT safe_rename_table('carrinho', 'cart');
SELECT safe_rename_table('itens_do_carrinho', 'cart_items');
SELECT safe_rename_table('endereços', 'addresses');
SELECT safe_rename_table('métodos_de_pagamento', 'payment_methods');
SELECT safe_rename_table('entregas', 'shipments');
SELECT safe_rename_table('imagens_dos_produtos', 'product_images');
SELECT safe_rename_table('estoque', 'inventory');
SELECT safe_rename_table('movimentações_de_estoque', 'inventory_movements');
SELECT safe_rename_table('cupons', 'coupons');
SELECT safe_rename_table('impostos', 'taxes');
SELECT safe_rename_table('configurações', 'settings');
SELECT safe_rename_table('logs_de_auditoria', 'audit_logs');
SELECT safe_rename_table('sessões', 'sessions');
SELECT safe_rename_table('notificações', 'notifications');
SELECT safe_rename_table('histórico_de_preços', 'price_history');
SELECT safe_rename_table('avaliações', 'reviews');
SELECT safe_rename_table('favoritos', 'favorites');
SELECT safe_rename_table('newsletter', 'newsletter');

-- Drop function auxiliar
DROP FUNCTION safe_rename_table(TEXT, TEXT);

-- Verificar tabelas renomeadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'admin_users', 'categories', 'products', 'customers', 'orders', 
    'order_items', 'cart', 'cart_items', 'addresses', 'payment_methods',
    'shipments', 'product_images', 'inventory', 'inventory_movements',
    'coupons', 'taxes', 'settings', 'audit_logs', 'sessions',
    'notifications', 'price_history', 'reviews', 'favorites', 'newsletter'
)
ORDER BY table_name;