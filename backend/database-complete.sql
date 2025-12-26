-- =====================================================
-- SISTEMA E-COMMERCE COMPLETO - RAVIC JOIAS
-- =====================================================

-- 1. USUÁRIOS ADMINISTRATIVOS
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    is_active BOOLEAN DEFAULT true,
    login_attempts INTEGER DEFAULT 0,
    blocked_until TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    last_login_attempt TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIAS DE PRODUTOS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COLEÇÕES
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUTOS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES categories(id),
    collection_id UUID REFERENCES collections(id),
    material VARCHAR(50), -- ouro, prata, aço, etc.
    price DECIMAL(10,2) NOT NULL,
    promotional_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    weight DECIMAL(8,3), -- peso em gramas
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 1,
    sku VARCHAR(100) UNIQUE,
    tags TEXT[], -- array de tags como 'novidade', 'mais_vendido', 'promocao'
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false, -- aparece no carrossel
    is_new BOOLEAN DEFAULT false, -- novidade
    on_sale BOOLEAN DEFAULT false, -- em promoção
    dimensions JSONB, -- {length, width, height}
    specifications JSONB, -- especificações técnicas
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. IMAGENS DOS PRODUTOS
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CLIENTES (USUÁRIOS DO SITE)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14), -- CPF brasileiro
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    birth_date DATE,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    newsletter BOOLEAN DEFAULT false,
    customer_group VARCHAR(50) DEFAULT 'regular', -- regular, vip, wholesale
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_purchase TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ENDEREÇOS DOS CLIENTES
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
    is_default BOOLEAN DEFAULT false,
    recipient_name VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    country VARCHAR(2) DEFAULT 'BR',
    reference_point TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CARRINHO DE COMPRAS
CREATE TABLE IF NOT EXISTS shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    session_id VARCHAR(255), -- para usuários não logados
    token VARCHAR(255) UNIQUE, -- token do carrinho
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),
    item_count INTEGER DEFAULT 0,
    subtotal DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    coupon_code VARCHAR(50),
    expires_at TIMESTAMP WITH TIME ZONE,
    abandoned_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ITENS DO CARRINHO
CREATE TABLE IF NOT EXISTS shopping_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL, -- preço na época da adição
    total_price DECIMAL(10,2) NOT NULL,
    customization JSONB, -- personalizações do produto
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- número do pedido formatado
    customer_id UUID REFERENCES customers(id),
    cart_id UUID REFERENCES shopping_carts(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(50), -- credit_card, boleto, pix, etc.
    payment_method_title VARCHAR(100),
    payment_gateway VARCHAR(50), -- stripe, pagarme, mercadopago
    payment_gateway_id VARCHAR(255), -- ID do pagamento no gateway
    installments INTEGER DEFAULT 1,
    
    -- Valores
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Cupom
    coupon_code VARCHAR(50),
    coupon_discount DECIMAL(10,2) DEFAULT 0,
    
    -- Frete
    shipping_method VARCHAR(100),
    shipping_method_title VARCHAR(255),
    shipping_estimate_days INTEGER,
    tracking_code VARCHAR(100),
    tracking_url TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Endereços
    shipping_address_id UUID REFERENCES customer_addresses(id),
    billing_address_id UUID REFERENCES customer_addresses(id),
    
    -- Informações adicionais
    customer_notes TEXT,
    admin_notes TEXT,
    private_notes TEXT, -- notas internas
    
    -- Datas importantes
    paid_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    
    -- Metadados
    ip_address INET,
    user_agent TEXT,
    source VARCHAR(50), -- desktop, mobile, app
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL, -- nome na época da compra
    product_sku VARCHAR(100), -- SKU na época da compra
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL, -- preço pago por unidade
    total_price DECIMAL(10,2) NOT NULL, -- preço total (unitário × quantidade)
    discount_amount DECIMAL(10,2) DEFAULT 0,
    customization JSONB, -- personalizações
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. HISTÓRICO DE STATUS DOS PEDIDOS
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    previous_status VARCHAR(50),
    notes TEXT,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. CUPONS DE DESCONTO
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2), -- para descontos percentuais
    usage_limit INTEGER, -- número máximo de usos
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_customer INTEGER DEFAULT 1,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    applies_to VARCHAR(50) DEFAULT 'all' CHECK (applies_to IN ('all', 'categories', 'products', 'shipping')),
    excluded_categories UUID[], -- array de IDs de categorias
    included_categories UUID[], -- array de IDs de categorias
    excluded_products UUID[], -- array de IDs de produtos
    included_products UUID[], -- array de IDs de produtos
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. USO DOS CUPONS
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id),
    order_id UUID REFERENCES orders(id),
    customer_id UUID REFERENCES customers(id),
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. CONFIGURAÇÕES DO SISTEMA
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'integer', 'decimal', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- se pode ser acessado via API pública
    updated_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. CARROSSEL DE NOVIDADES
CREATE TABLE IF NOT EXISTS carousel_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    button_text VARCHAR(50) DEFAULT 'Ver Produto',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. BANNERS PROMOCIONAIS
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    link_url TEXT,
    button_text VARCHAR(50),
    position VARCHAR(50) NOT NULL CHECK (position IN ('home_main', 'home_secondary', 'category_top', 'category_side', 'product_page')),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    impression_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. AVALIAÇÕES DE PRODUTOS
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    unhelpful_count INTEGER DEFAULT 0,
    admin_response TEXT,
    admin_response_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. LISTA DE DESEJOS
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- 20. NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- order_update, shipping, promotion, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    action_text VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. LOGS DE AUDITORIA (EXPANDIDO)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id),
    customer_id UUID REFERENCES customers(id),
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'view'
    entity VARCHAR(100) NOT NULL, -- 'product', 'order', 'customer', 'settings', etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    changes JSONB, -- apenas as mudanças feitas
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_url TEXT,
    response_status INTEGER,
    error_message TEXT,
    duration_ms INTEGER, -- duração da operação
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. MÉTODOS DE PAGAMENTO
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'boleto', 'pix', 'bank_transfer', 'wallet')),
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    config JSONB, -- configurações específicas do gateway
    fees JSONB, -- taxas e configurações
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. MÉTODOS DE ENVIO
CREATE TABLE IF NOT EXISTS shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('fixed', 'weight_based', 'price_based', 'distance_based')),
    base_price DECIMAL(10,2) DEFAULT 0,
    min_price DECIMAL(10,2) DEFAULT 0,
    max_price DECIMAL(10,2),
    estimated_days_min INTEGER,
    estimated_days_max INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    config JSONB, -- configurações específicas
    restrictions JSONB, -- restrições de peso, dimensões, etc.
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. TAXAS E IMPOSTOS
CREATE TABLE IF NOT EXISTS taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('fixed', 'percentage')),
    rate DECIMAL(10,4) NOT NULL,
    applies_to VARCHAR(50) DEFAULT 'all' CHECK (applies_to IN ('all', 'products', 'shipping')),
    is_active BOOLEAN DEFAULT true,
    is_compound BOOLEAN DEFAULT false, -- imposto sobre imposto
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. INVENTÁRIO
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0, -- quantidade reservada em pedidos
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    min_stock INTEGER DEFAULT 1,
    max_stock INTEGER,
    reorder_point INTEGER DEFAULT 5,
    location VARCHAR(100), -- localização no estoque
    batch_number VARCHAR(100),
    expiry_date DATE,
    cost_price DECIMAL(10,2),
    last_restock_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. MOVIMENTAÇÃO DE INVENTÁRIO
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'transfer', 'sale', 'return')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    reference_type VARCHAR(50), -- 'order', 'purchase', 'adjustment', 'transfer'
    reference_id UUID,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Índices para categorias
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_cpf ON customers(cpf);
CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers(is_active);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON orders(total_amount);

-- Índices para carrinho
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_token ON shopping_carts(token);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_status ON shopping_carts(status);

-- Índices para avaliações
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer_id ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função genérica para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_carts_updated_at BEFORE UPDATE ON shopping_carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carousel_items_updated_at BEFORE UPDATE ON carousel_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGERS PARA LÓGICA DE NEGÓCIO
-- =====================================================

-- Atualizar contador de avaliações e média do produto
CREATE OR REPLACE FUNCTION update_product_review_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_approved = true THEN
        UPDATE products 
        SET specifications = COALESCE(specifications, '{}'::jsonb) || jsonb_build_object(
            'review_count', COALESCE((specifications->>'review_count')::int, 0) + 1,
            'average_rating', (
                SELECT AVG(rating)::numeric(10,2) 
                FROM product_reviews 
                WHERE product_id = NEW.product_id AND is_approved = true
            )
        )
        WHERE id = NEW.product_id;
    END IF;
    
    IF TG_OP = 'UPDATE' AND OLD.is_approved != NEW.is_approved THEN
        IF NEW.is_approved = true THEN
            UPDATE products 
            SET specifications = COALESCE(specifications, '{}'::jsonb) || jsonb_build_object(
                'review_count', COALESCE((specifications->>'review_count')::int, 0) + 1,
                'average_rating', (
                    SELECT AVG(rating)::numeric(10,2) 
                    FROM product_reviews 
                    WHERE product_id = NEW.product_id AND is_approved = true
                )
            )
            WHERE id = NEW.product_id;
        ELSE
            UPDATE products 
            SET specifications = COALESCE(specifications, '{}'::jsonb) || jsonb_build_object(
                'review_count', GREATEST(COALESCE((specifications->>'review_count')::int, 1) - 1, 0),
                'average_rating', (
                    SELECT AVG(rating)::numeric(10,2) 
                    FROM product_reviews 
                    WHERE product_id = NEW.product_id AND is_approved = true
                )
            )
            WHERE id = NEW.product_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_review_stats_trigger
    AFTER INSERT OR UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_review_stats();

-- Atualizar estoque quando pedido for confirmado
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status AND NEW.status = 'paid' THEN
        -- Deduzir do estoque
        UPDATE products 
        SET stock = stock - oi.quantity
        FROM order_items oi
        WHERE products.id = oi.product_id AND oi.order_id = NEW.id;
        
        -- Atualizar quantidade reservada
        UPDATE inventory 
        SET reserved_quantity = reserved_quantity - oi.quantity
        FROM order_items oi
        WHERE inventory.product_id = oi.product_id AND oi.order_id = NEW.id;
        
        -- Registrar movimento de inventário
        INSERT INTO inventory_movements (product_id, type, quantity, previous_quantity, new_quantity, reason, reference_type, reference_id, created_by)
        SELECT oi.product_id, 'sale', -oi.quantity, p.stock + oi.quantity, p.stock, 'Pedido confirmado', 'order', NEW.id, NEW.created_by
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_on_order_trigger
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order();

-- =====================================================
-- DADOS INICIAIS ESSENCIAIS
-- =====================================================

-- Métodos de pagamento padrão
INSERT INTO payment_methods (name, code, description, type, is_default, config, fees) VALUES
('Cartão de Crédito', 'credit_card', 'Pagamento com cartão de crédito', 'credit_card', true, 
 '{"gateway": "stripe", "installments": true, "max_installments": 12}', 
 '{"percentage": 3.5, "fixed_per_installment": 0.30}'),
('PIX', 'pix', 'Pagamento instantâneo via PIX', 'pix', false, 
 '{"gateway": "stripe", "expires_in": 3600}', 
 '{"percentage": 1.5, "fixed": 0}'),
('Boleto Bancário', 'boleto', 'Pagamento via boleto bancário', 'boleto', false, 
 '{"gateway": "stripe", "expires_in": 259200}', 
 '{"percentage": 2.5, "fixed": 1.50}');

-- Métodos de envio padrão
INSERT INTO shipping_methods (name, code, description, type, base_price, min_price, estimated_days_min, estimated_days_max, is_default, config) VALUES
('Sedex', 'sedex', 'Entrega expressa via Sedex', 'fixed', 25.90, 150.00, 1, 3, true, '{"carrier": "correios"}'),
('PAC', 'pac', 'Entrega econômica via PAC', 'fixed', 15.90, 200.00, 5, 10, false, '{"carrier": "correios"}'),
('Retirada na Loja', 'pickup', 'Retirada gratuita na loja física', 'fixed', 0.00, 0.00, 0, 0, false, '{"requires_scheduling": true}');

-- Configurações essenciais
INSERT INTO settings (key, value, type, description, is_public) VALUES
('store_name', 'RAVIC Joias', 'string', 'Nome da loja', true),
('store_description', 'Joias finas e acessórios de qualidade', 'string', 'Descrição da loja', true),
('store_phone', '', 'string', 'Telefone da loja', true),
('store_email', '', 'string', 'Email de contato da loja', true),
('store_address', '', 'string', 'Endereço da loja', true),
('free_shipping_enabled', 'true', 'boolean', 'Frete grátis ativado', true),
('free_shipping_min_value', '150.00', 'decimal', 'Valor mínimo para frete grátis', true),
('currency', 'BRL', 'string', 'Moeda padrão', true),
('currency_symbol', 'R$', 'string', 'Símbolo da moeda', true),
('decimal_separator', ',', 'string', 'Separador decimal', true),
('thousand_separator', '.', 'string', 'Separador de milhares', true),
('products_per_page', '12', 'integer', 'Produtos por página', true),
('enable_reviews', 'true', 'boolean', 'Habilitar avaliações de produtos', true),
('review_moderation', 'true', 'boolean', 'Avaliações precisam de aprovação', false),
('enable_wishlist', 'true', 'boolean', 'Habilitar lista de desejos', true),
('enable_newsletter', 'true', 'boolean', 'Habilitar newsletter', true),
('enable_guest_checkout', 'true', 'boolean', 'Permitir compra sem cadastro', true),
('order_number_prefix', 'RV', 'string', 'Prefixo do número do pedido', false),
('order_number_length', '8', 'integer', 'Comprimento do número do pedido', false),
('low_stock_threshold', '5', 'integer', 'Limite de estoque baixo', false),
('out_of_stock_behavior', 'hide_add_to_cart', 'string', 'Comportamento quando sem estoque', false),
('enable_backorders', 'false', 'boolean', 'Permitir pedidos de produtos sem estoque', false),
('carousel_auto_play', 'true', 'boolean', 'Carrossel com autoplay', true),
('carousel_interval', '4000', 'integer', 'Intervalo do carrossel em milissegundos', true),
('home_title', 'Bem-vindo à RAVIC Joias', 'string', 'Título da página inicial', true),
('home_description', 'Descubra nossa coleção exclusiva de joias finas', 'string', 'Descrição da página inicial', true),
('whatsapp_number', '', 'string', 'Número do WhatsApp', true),
('instagram_url', '', 'string', 'URL do Instagram', true),
('facebook_url', '', 'string', 'URL do Facebook', true),
('twitter_url', '', 'string', 'URL do Twitter', true),
('youtube_url', '', 'string', 'URL do YouTube', true),
('pinterest_url', '', 'string', 'URL do Pinterest', true),
('google_analytics_id', '', 'string', 'ID do Google Analytics', false),
('facebook_pixel_id', '', 'string', 'ID do Facebook Pixel', false),
('google_tag_manager_id', '', 'string', 'ID do Google Tag Manager', false),
('mailchimp_api_key', '', 'string', 'API Key do Mailchimp', false),
('mailchimp_list_id', '', 'string', 'ID da lista do Mailchimp', false),
('smtp_host', '', 'string', 'Servidor SMTP', false),
('smtp_port', '587', 'integer', 'Porta SMTP', false),
('smtp_user', '', 'string', 'Usuário SMTP', false),
('smtp_password', '', 'string', 'Senha SMTP', false),
('smtp_encryption', 'tls', 'string', 'Criptografia SMTP', false),
('email_from_name', 'RAVIC Joias', 'string', 'Nome do remetente de emails', false),
('email_from_address', '', 'string', 'Email do remetente', false),
('maintenance_mode', 'false', 'boolean', 'Modo de manutenção', false),
('maintenance_message', 'Estamos em manutenção. Volte em breve!', 'string', 'Mensagem de manutenção', true);

-- =====================================================
-- USUÁRIO ADMIN PADRÃO
-- =====================================================

-- Senha: admin123 (criptografada com bcrypt)
INSERT INTO admin_users (email, password, name, role, is_active) VALUES
('admin@ravicjoias.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador Principal', 'admin', true);

-- =====================================================
-- CATEGORIAS PADRÃO PARA JOIAS
-- =====================================================

INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Anéis', 'aneis', 'Anéis em ouro, prata e aço inoxidável', 1, true),
('Brincos', 'brincos', 'Brincos de todos os estilos e tamanhos', 2, true),
('Colares', 'colares', 'Colares e gargantilhas elegantes', 3, true),
('Pulseiras', 'pulseiras', 'Pulseiras e braceletes femininas e masculinas', 4, true),
('Pingentes', 'pingentes', 'Pingentes para colares e pulseiras', 5, true),
('Conjuntos', 'conjuntos', 'Conjuntos de joias combinadas', 6, true),
('Alianças', 'aliancas', 'Alianças para casamento e compromisso', 7, true),
('Acessórios', 'acessorios', 'Acessórios e complementos', 8, true);

-- =====================================================
-- COLEÇÕES PADRÃO
-- =====================================================

INSERT INTO collections (name, slug, description, is_active, sort_order) VALUES
('Elegância', 'elegancia', 'Joias sofisticadas para ocasiões especiais', true, 1),
('Dia a Dia', 'dia-a-dia', 'Joias delicadas para uso diário', true, 2),
('Moderno', 'moderno', 'Designs contemporâneos e ousados', true, 3),
('Clássico', 'classico', 'Peças atemporais que nunca saem de moda', true, 4),
('Noiva', 'noiva', 'Joias perfeitas para o dia mais especial', true, 5),
('Presentes', 'presentes', 'Joias ideais para presentear quem você ama', true, 6);

-- =====================================================
-- PRODUTOS DE EXEMPLO
-- =====================================================

INSERT INTO products (name, slug, description, short_description, category_id, collection_id, material, price, promotional_price, stock, sku, tags, is_active, is_featured, is_new, weight) VALUES
('Anel de Ouro 18k com Zircônia', 'anel-de-ouro-18k-com-zirconia', 'Anel em ouro 18k com zircônia de alta qualidade. Perfeito para presentear em ocasiões especiais.','Anel em ouro 18k com zircônia', (SELECT id FROM categories WHERE slug = 'aneis'), (SELECT id FROM collections WHERE slug = 'elegancia'), 'ouro 18k', 1850.00, 1599.90, 15, 'ANEL-001', ARRAY['novidade', 'mais_vendido'], true, true, true, 3.5),
('Brinco de Prata 925 com Pérola', 'brinco-de-prata-925-com-perola', 'Brinco em prata 925 com pérola natural. Peça elegante que combina com qualquer ocasião.','Brinco em prata com pérola', (SELECT id FROM categories WHERE slug = 'brincos'), (SELECT id FROM collections WHERE slug = 'classico'), 'prata 925', 450.00, null, 25, 'BRINCO-001', ARRAY['classico', 'elegante'], true, false, false, 2.8),
('Colar de Aço Inoxidável com Coração', 'colar-de-aco-inoxidavel-com-coracao', 'Colar em aço inoxidável com pingente de coração. Moderno e resistente, ideal para uso diário.','Colar moderno em aço com coração', (SELECT id FROM categories WHERE slug = 'colares'), (SELECT id FROM collections WHERE slug = 'moderno'), 'aço inoxidável', 180.00, 149.90, 50, 'COLAR-001', ARRAY['moderno', 'diario'], true, true, false, 8.2),
('Pulseira de Ouro Rosé 18k', 'pulseira-de-ouro-rose-18k', 'Pulseira delicada em ouro rosé 18k. Design minimalista perfeito para mulheres modernas.','Pulseira em ouro rosé 18k', (SELECT id FROM categories WHERE slug = 'pulseiras'), (SELECT id FROM collections WHERE slug = 'dia-a-dia'), 'ouro rosé 18k', 980.00, null, 8, 'PULSEIRA-001', ARRAY['delicado', 'minimalista'], true, false, true, 12.5),
('Conjunto de Alianças em Ouro 18k', 'conjunto-de-aliancas-em-ouro-18k', 'Par de alianças em ouro 18k com acabamento polido. Símbolo eterno do amor e compromisso.','Par de alianças em ouro 18k', (SELECT id FROM categories WHERE slug = 'aliancas'), (SELECT id FROM collections WHERE slug = 'noiva'), 'ouro 18k', 3200.00, 2890.00, 5, 'ALIANCA-001', ARRAY['casamento', 'compromisso'], true, true, false, 8.5),
('Pingente de Estrela em Prata', 'pingente-de-estrela-em-prata', 'Pingente de estrela em prata 925. Design delicado que pode ser usado sozinho ou combinado.','Pingente de estrela em prata', (SELECT id FROM categories WHERE slug = 'pingentes'), (SELECT id FROM collections WHERE slug = 'dia-a-dia'), 'prata 925', 220.00, null, 30, 'PINGENTE-001', ARRAY['delicado', 'estrela'], true, false, false, 1.2);

-- =====================================================
-- CONFIGURAÇÕES DE ESTOQUE PARA PRODUTOS
-- =====================================================

INSERT INTO inventory (product_id, quantity, reserved_quantity, min_stock, reorder_point) 
SELECT id, stock, 0, 5, 3 FROM products;

-- =====================================================
-- CUPONS DE DESCONTO EXEMPLO
-- =====================================================

INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, usage_limit, valid_from, valid_until, is_active, created_by) VALUES
('PRIMEIRACOMPRA', '15% de desconto na primeira compra', 'percentage', 15.00, 100.00, 100, NOW(), NOW() + INTERVAL '30 days', true, (SELECT id FROM admin_users WHERE email = 'admin@ravicjoias.com')),
('FRETEGRATIS', 'Frete grátis em compras acima de R$ 200', 'fixed', 25.90, 200.00, 50, NOW(), NOW() + INTERVAL '15 days', true, (SELECT id FROM admin_users WHERE email = 'admin@ravicjoias.com')),
('JOIAS10', 'R$ 100 de desconto em joias acima de R$ 500', 'fixed', 100.00, 500.00, 30, NOW(), NOW() + INTERVAL '20 days', true, (SELECT id FROM admin_users WHERE email = 'admin@ravicjoias.com'));

-- =====================================================
-- MENSAGEM FINAL
-- =====================================================

SELECT '✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!' as message;
SELECT '👤 Usuário admin: admin@ravicjoias.com / Senha: admin123' as login_info;
SELECT '📊 Total de tabelas criadas: 26' as tables_count;
SELECT '🛍️ Produtos de exemplo: 6' as sample_products;
SELECT '🎯 Categorias: 8' as categories_count;
SELECT '💎 Coleções: 6' as collections_count;
SELECT '🎁 Cupons ativos: 3' as coupons_count;