const supabase = require('./config/supabase');

async function unblockAdmin() {
  try {
    console.log('🔓 Desbloqueando usuário admin...');
    
    // Desbloquear o usuário admin e resetar tentativas
    const { data, error } = await supabase
      .from('admin_users')
      .update({ 
        login_attempts: 0,
        blocked_until: null,
        last_login_attempt: null
      })
      .eq('email', 'admin@ravicjoias.com');

    if (error) {
      console.error('❌ Erro ao desbloquear usuário:', error);
      return;
    }

    if (data) {
      console.log('✅ Usuário admin desbloqueado com sucesso!');
      console.log('🔄 Tentativas resetadas para 0');
      console.log('🔓 Bloqueio removido');
      
      // Verificar se foi realmente atualizado
      const { data: updatedUser } = await supabase
        .from('admin_users')
        .select('email, login_attempts, blocked_until')
        .eq('email', 'admin@ravicjoias.com')
        .single();
        
      console.log('\n📊 Status atualizado:');
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Tentativas: ${updatedUser.login_attempts}`);
      console.log(`   Bloqueado até: ${updatedUser.blocked_until || 'Não bloqueado'}`);
      
    } else {
      console.log('⚠️ Nenhum usuário encontrado com esse email');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

unblockAdmin();