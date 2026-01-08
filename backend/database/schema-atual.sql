-- Esquema Atual do Banco de Dados - Petr Leo Joias
-- Baseado nas tabelas reais do Supabase (nomes em Português)

-- 1. Usuários Administradores
-- Tabela: usuários_administradores
-- Campos sugeridos: id, email, name, password, role, is_active, login_attempts, blocked_until, last_login

-- 2. Categorias
-- Tabela: categorias
-- Campos sugeridos: id, name, slug, description, image_url, is_active, sort_order

-- 3. Coleções
-- Tabela: coleções
-- Campos sugeridos: id, name, slug, description, is_active

-- 4. Produtos
-- Tabela: produtos
-- Campos sugeridos: id, name, slug, description, short_description, category_id, material, price, promotional_price, stock, is_active, is_featured, is_new, is_on_sale

-- 5. Imagens do Produto
-- Tabela: imagens_do_produto
-- Campos sugeridos: id, product_id, url, alt_text, sort_order, is_primary, bucket_name, storage_path

-- 6. Itens do Carrossel (Banner)
-- Tabela: itens_do_carrossel
-- Campos sugeridos: id, product_id, title, subtitle, image_url, sort_order, is_active

-- 7. Configurações
-- Tabela: configurações
-- Campos sugeridos: id, key, value, type, description, is_public

-- 8. Webhook Logs (Orçamentos)
-- Tabela: webhook_logs
-- Campos: id, customer_name, customer_email, customer_phone, customer_message, cart_items, cart_total, webhook_url, response_status, response_data, created_at

-- 9. Outras tabelas mostradas na imagem:
-- - banners
-- - inventário
-- - histórico_de_status_do_pedido
-- - itens_do_carrinho_de_compras

-- Notas:
-- O sistema foi simplificado para remover o checkout complexo.
-- Pedidos agora são processados via webhook (tabela webhook_logs).
-- Imagens são armazenadas no Supabase Storage.