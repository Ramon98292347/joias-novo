require('dotenv').config();
const supabase = require('./config/supabase');

async function checkAdmin() {
  try {
    // Verificar se existe algum usuário admin
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, login_attempts')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return;
    }

    console.log('📊 Total de usuários encontrados:', users.length);
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco de dados!');
      console.log('📝 Você precisa criar um usuário admin primeiro.');
      return;
    }

    console.log('\n👥 Usuários cadastrados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Função: ${user.role} | Ativo: ${user.is_active ? 'Sim' : 'Não'} | Tentativas: ${user.login_attempts || 0}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });

    // Verificar se existe um usuário com email admin@ravicjoias.com
    const adminUser = users.find(u => u.email === 'admin@ravicjoias.com');
    
    if (adminUser) {
      console.log('✅ Usuário admin@ravicjoias.com encontrado!');
      console.log(`   Nome: ${adminUser.name}`);
      console.log(`   Função: ${adminUser.role}`);
      console.log(`   Ativo: ${adminUser.is_active ? 'Sim' : 'Não'}`);
      console.log(`   Tentativas de login: ${adminUser.login_attempts || 0}`);
    } else {
      console.log('❌ Usuário admin@ravicjoias.com NÃO encontrado!');
      console.log('📝 Você pode usar um dos usuários acima ou criar um novo.');
    }

  } catch (error) {
    console.error('Erro:', error);
  }
}

checkAdmin();