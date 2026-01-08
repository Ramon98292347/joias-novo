const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configurar multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limite
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use: JPEG, PNG, WebP'));
    }
  }
});

// Upload de imagem de produto para o Storage
router.post('/products/:id/images/upload', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text, is_primary } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const file = req.file;
    const fileName = `${id}/${Date.now()}-${file.originalname}`;
    const bucketName = 'product-images';

    // Fazer upload para o Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Inserir registro no banco
    const { data: imageData, error: imageError } = await supabase
      .from('imagens_do_produto')
      .insert([
        {
          product_id: id,
          url: publicUrl,
          storage_path: fileName,
          bucket_name: bucketName,
          alt_text: alt_text || '',
          is_primary: is_primary === 'true',
          sort_order: 0
        }
      ])
      .select()
      .single();

    if (imageError) {
      console.error('Erro ao salvar no banco:', imageError);
      return res.status(500).json({ error: 'Erro ao salvar imagem no banco' });
    }

    res.json({
      message: 'Imagem enviada com sucesso',
      data: imageData,
      url: publicUrl
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Excluir imagem do Storage e do banco
router.delete('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    // Buscar informações da imagem
    const { data: imageData, error: findError } = await supabase
      .from('imagens_do_produto')
      .select('*')
      .eq('id', imageId)
      .single();

    if (findError || !imageData) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    // Excluir do Storage
    const { error: storageError } = await supabase.storage
      .from(imageData.bucket_name)
      .remove([imageData.storage_path]);

    if (storageError) {
      console.error('Erro ao excluir do storage:', storageError);
      // Continuar mesmo com erro no storage
    }

    // Excluir do banco
    const { error: dbError } = await supabase
      .from('imagens_do_produto')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      return res.status(500).json({ error: 'Erro ao excluir imagem do banco' });
    }

    res.json({ message: 'Imagem excluída com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;