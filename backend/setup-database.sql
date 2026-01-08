-- Script SQL para criar tabelas do sistema admin

-- Função RPC: sincroniza o usuário autenticado na tabela admin_users
create or replace function public.admin_users_sync_current_user()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_claims jsonb := current_setting('request.jwt.claims', true)::jsonb;
  v_email text := coalesce(v_claims->>'email', '');
  v_user_meta jsonb := coalesce(v_claims->'user_metadata', '{}'::jsonb);
  v_name text := coalesce(v_user_meta->>'name', '');
  v_role text := coalesce(v_user_meta->>'role', 'editor');
begin
  insert into public.admin_users (id, email, name, role, is_active, created_at, updated_at)
  values (v_uid, v_email, v_name, v_role, true, now(), now())
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        role = excluded.role,
        updated_at = now();
  return v_uid;
end;
$$;

grant execute on function public.admin_users_sync_current_user() to authenticated;

-- Função + Trigger: cria/atualiza admin_users ao inserir em auth.users
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_users (id, email, name, role, is_active, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'editor'),
    true,
    now(),
    now()
  )
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        role = excluded.role,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_admin_user();


-- Tabela de usuários admin
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

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    collection VARCHAR(100),
    material VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    promotional_price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    tags TEXT[], -- array de tags como 'novidade', 'mais_vendido'
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false, -- aparece no carrossel
    is_new BOOLEAN DEFAULT false, -- novidade
    images JSONB, -- array de objetos com url e ordem
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id),
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    entity VARCHAR(100) NOT NULL, -- 'product', 'settings', 'user'
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO settings (key, value, type, description) VALUES
('free_shipping_enabled', 'true', 'boolean', 'Frete grátis ativado'),
('free_shipping_min_value', '150.00', 'decimal', 'Valor mínimo para frete grátis'),
('whatsapp_number', '', 'string', 'Número do WhatsApp'),
('contact_email', '', 'string', 'Email de contato'),
('instagram_url', '', 'string', 'URL do Instagram'),
('facebook_url', '', 'string', 'URL do Facebook'),
('home_banner_text', 'Bem-vindo à nossa loja', 'string', 'Texto do banner principal'),
('carousel_auto_play', 'true', 'boolean', 'Carrossel com autoplay'),
('carousel_interval', '4000', 'integer', 'Intervalo do carrossel em milissegundos');

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comando para criar usuário admin padrão (execute separadamente se quiser)
-- Senha: admin123
/*
INSERT INTO admin_users (email, password, name, role, is_active) VALUES
('admin@ravicjoias.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin', true);
*/
