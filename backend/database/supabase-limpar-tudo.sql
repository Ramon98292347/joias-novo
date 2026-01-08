-- Script para excluir TODAS as tabelas não utilizadas
-- Mantém apenas: produtos, categorias, imagens, carousel, webhook_logs e admin

-- Desabilitar verificações de foreign key temporariamente
SET session_replication_role = replica;

-- Excluir tabelas de pedidos e compras
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.shopping_carts CASCADE;

-- Excluir tabelas de cupons e descontos
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.coupon_usage CASCADE;
DROP TABLE IF EXISTS public.discounts CASCADE;

-- Excluir tabelas de pagamento
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.payment_installments CASCADE;

-- Excluir tabelas de envio e endereços
DROP TABLE IF EXISTS public.shipping_addresses CASCADE;
DROP TABLE IF EXISTS public.shipping_methods CASCADE;
DROP TABLE IF EXISTS public.shipping_rates CASCADE;

-- Excluir tabelas de usuários e clientes (mantém apenas admin_users)
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.customer_addresses CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;

-- Excluir tabelas de auditoria e logs
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.user_activity_logs CASCADE;

-- Excluir tabelas de notificações e comunicação
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;

-- Excluir tabelas de reviews e avaliações
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.ratings CASCADE;

-- Excluir tabelas de wishlist e favoritos
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.wishlist_items CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;

-- Excluir tabelas de estoque e inventário
DROP TABLE IF EXISTS public.inventory_movements CASCADE;
DROP TABLE IF EXISTS public.stock_movements CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;

-- Excluir tabelas de taxas e impostos
DROP TABLE IF EXISTS public.taxes CASCADE;
DROP TABLE IF EXISTS public.tax_rates CASCADE;
DROP TABLE IF EXISTS public.tax_rules CASCADE;

-- Excluir tabelas de moeda e configurações financeiras
DROP TABLE IF EXISTS public.currencies CASCADE;
DROP TABLE IF EXISTS public.exchange_rates CASCADE;

-- Excluir tabelas de fornecedores e compras
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.purchase_orders CASCADE;
DROP TABLE IF EXISTS public.purchase_order_items CASCADE;

-- Excluir tabelas de funcionários e departamentos
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.employee_roles CASCADE;

-- Reabilitar verificações de foreign key
SET session_replication_role = DEFAULT;

-- Verificar tabelas restantes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Mensagem de confirmação
SELECT 'Tabelas não utilizadas excluídas com sucesso!' as status;