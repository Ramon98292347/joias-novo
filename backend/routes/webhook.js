const express = require('express');
const router = express.Router();

// Rota webhook para receber contatos do formulário
router.post('/contato', async (req, res) => {
  try {
    const { email, telefone, origem, timestamp, description, mensagem } = req.body;

    // Validação básica
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email inválido' 
      });
    }

    // Aqui você pode integrar com:
    // - WhatsApp API
    // - Email marketing (Mailchimp, SendGrid)
    // - CRM (HubSpot, Salesforce)
    // - Planilhas Google
    // - Telegram Bot
    // - Slack

    console.log('📧 NOVO CONTATO RECEBIDO:');
    console.log('📧 Email:', email);
    console.log('📱 Telefone:', telefone || 'Não informado');
    console.log('📝 Origem:', origem);
    if (description || mensagem) {
      console.log('🗒️ Descrição:', description || mensagem);
    }
    console.log('⏰ Timestamp:', timestamp);
    console.log('🌐 IP:', req.ip);
    console.log('👤 User-Agent:', req.get('User-Agent'));

    // Exemplo de integração com Discord (descomente se quiser usar)
    /*
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📧 Novo Contato - ' + origem,
            color: 0x00ff00,
            fields: [
              { name: '📧 Email', value: email, inline: true },
              { name: '📱 Telefone', value: telefone || 'Não informado', inline: true },
              { name: '⏰ Data', value: new Date(timestamp).toLocaleString('pt-BR'), inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    }
    */

    // Exemplo de integração com Telegram (descomente se quiser usar)
    /*
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId) {
      const message = `
📧 *NOVO CONTATO - ${origem.toUpperCase()}*

📧 Email: ${email}
📱 Telefone: ${telefone || 'Não informado'}
⏰ Data: ${new Date(timestamp).toLocaleString('pt-BR')}
      `;

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }
    */

    // Salvar no banco de dados (opcional)
    /*
    const { data, error } = await supabase
      .from('contatos')
      .insert([{
        email,
        telefone: telefone || null,
        origem,
        data_contato: timestamp,
        ip: req.ip,
        user_agent: req.get('User-Agent')
      }]);

    if (error) {
      console.error('Erro ao salvar no banco:', error);
    }
    */

    res.json({ 
      success: true, 
      message: 'Contato recebido com sucesso!' 
    });

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para testar o webhook
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Webhook funcionando!',
    timestamp: new Date().toISOString(),
    endpoints: {
      contato: 'POST /api/webhook/contato',
      campos: {
        email: 'obrigatório',
        telefone: 'opcional', 
        origem: 'opcional',
        timestamp: 'opcional'
      }
    }
  });
});

module.exports = router;
 
// Orçamento webhook
router.post('/orcamento', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('🧾 NOVO ORÇAMENTO RECEBIDO:', {
      customer_name: payload.customer_name,
      customer_email: payload.customer_email,
      customer_phone: payload.customer_phone,
      description: payload.description || payload.customer_message || null,
      cart_items_count: Array.isArray(payload.cart_items) ? payload.cart_items.length : 0,
      cart_total: payload.cart_total,
    });

    const n8nUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n-n8n.ynlng8.easypanel.host/webhook/revic-joias';
    try {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'orcamento',
          customer_name: payload.customer_name,
          customer_email: payload.customer_email,
          customer_phone: payload.customer_phone,
          description: payload.description || payload.customer_message || '',
          cart_items: Array.isArray(payload.cart_items) ? payload.cart_items : [],
          cart_total: payload.cart_total ?? 0,
          site_url: (req.headers.origin || req.get('Origin') || ''),
          user_agent: req.get('User-Agent') || '',
        }),
      });
    } catch (err) {
      console.warn('⚠️ Falha ao encaminhar para n8n:', err?.message);
    }
    res.json({ success: true, message: 'Orçamento recebido com sucesso!' });
  } catch (error) {
    console.error('Erro no webhook de orçamento:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

router.post('/order', async (req, res) => {
  try {
    const payload = req.body || {};
    const n8nUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n-n8n.ynlng8.easypanel.host/webhook/revic-joias';
    try {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          ...payload,
        }),
      });
    } catch (err) {
      console.warn('⚠️ Falha ao encaminhar pedido para n8n:', err?.message);
    }
    res.json({ success: true, message: 'Pedido encaminhado com sucesso!' });
  } catch (error) {
    console.error('Erro no webhook de pedido:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});
