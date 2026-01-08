# 📸 Sistema de Imagens com Supabase Storage

## 🚀 Como Configurar

### 1. Executar Scripts SQL
Execute os scripts na seguinte ordem:
1. `supabase-configurar-storage.sql` - Configura buckets e permissões
2. `supabase-excluir-cascade.sql` - Limpa tabelas não usadas (se ainda não fez)
3. `supabase-migrar-imagens.sql` - Atualiza imagens existentes

### 2. Backend (Já configurado)
- Rota criada: `/api/storage/products/:id/images/upload`
- Rota de exclusão: `/api/storage/images/:imageId`
- Multer já está instalado no package.json

### 3. Frontend (Componente pronto)
- Componente `ImageUpload.tsx` criado
- Suporta drag & drop e upload por clique
- Preview de imagens existentes
- Exclusão de imagens

## 📋 Como Usar

### No Admin de Produtos:
```tsx
import ImageUpload from '@/components/ImageUpload';

const AdminProductForm = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (imageUrl: string, imageId: string) => {
    setImages(prev => [...prev, { id: imageId, url: imageUrl }]);
  };

  const handleImageRemove = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div>
      {/* Outros campos do formulário */}
      
      <ImageUpload
        productId={productId}
        onUploadComplete={handleImageUpload}
        onImageRemove={handleImageRemove}
        existingImages={images}
      />
    </div>
  );
};
```

## 🎯 Configuração dos Buckets

### Product Images:
- **Nome**: `product-images`
- **Público**: Sim (acessível via URL)
- **Limite**: 5MB por arquivo
- **Formatos**: JPEG, PNG, WebP
- **Path**: `products/{productId}/{timestamp}-{filename}`

### Carousel Images:
- **Nome**: `carousel-images`
- **Público**: Sim
- **Limite**: 10MB por arquivo (para banners)
- **Formatos**: JPEG, PNG, WebP

## 🔐 Segurança

### Permissões Configuradas:
- **Leitura**: Pública (qualquer um pode ver imagens)
- **Upload**: Apenas usuários autenticados (admin)
- **Update/Delete**: Apenas usuários autenticados (admin)

### Validações:
- Tipo de arquivo (MIME type)
- Tamanho máximo (5MB produtos, 10MB carousel)
- Nome único com timestamp
- Sanitização de nomes de arquivo

## 📁 Estrutura no Storage

```
supabase-storage/
├── product-images/
│   └── products/
│       └── {product-id}/
│           ├── 1234567890-imagem1.jpg
│           └── 1234567891-imagem2.png
└── carousel-images/
    └── carousel/
        ├── 1234567890-banner1.jpg
        └── 1234567891-banner2.png
```

## 🔄 URLs Geradas

As URLs seguem o padrão:
```
https://{seu-projeto}.supabase.co/storage/v1/object/public/{bucket-name}/{path}
```

Exemplo:
```
https://abc123.supabase.co/storage/v1/object/public/product-images/products/550e8400-e29b-41d4-a716-446655440000/1234567890-relogio-dourado.jpg
```

## ⚡ Performance

### Otimizações:
- Índices no banco para queries rápidas
- Imagens servidas via CDN do Supabase
- Lazy loading implementado no componente
- Cache de imagens configurado

### Dicas:
- Use WebP para melhor compressão
- Mantenha imagens abaixo de 1MB para produtos
- Use dimensões proporcionais (ex: 800x800)
- Implemente lazy loading nas listagens

## 🚨 Tratamento de Erros

O sistema lida com:
- Uploads com arquivos muito grandes
- Tipos de arquivo inválidos
- Falhas de conexão com o Storage
- Erros de permissão
- Conflitos de nomes de arquivo

## 📊 Monitoramento

Verifique no Supabase Dashboard:
- Uso de storage
- Número de uploads
- Erros de upload
- Performance das imagens