const bcrypt = require('bcryptjs');
const supabase = require('./config/supabase');

async function checkPassword() {
  try {
    console.log('🔍 Verificando senha do admin...');
    
    // Buscar o hash da senha do admin
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('email, password')
      .eq('email', 'admin@ravicjoias.com')
      .single();

    if (error || !user) {
      console.error('❌ Usuário não encontrado');
      return;
    }

    console.log('✅ Usuário encontrado:', user.email);
    console.log('🔑 Hash da senha:', user.password);
    
    // Testar senha "admin123"
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('\n🧪 Testando senha "admin123":');
    console.log(`   Resultado: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
    
    if (!isValid) {
      console.log('\n🔧 A senha não é "admin123". Vamos tentar outras comuns:');
      
      const commonPasswords = ['admin', 'password', '123456', 'admin@123', 'ravic123'];
      
      for (const pwd of commonPasswords) {
        const valid = await bcrypt.compare(pwd, user.password);
        if (valid) {
          console.log(`   ✅ Senha correta encontrada: "${pwd}"`);
          return;
        }
      }
      
      console.log('   ❌ Nenhuma senha comum funcionou');
      console.log('\n💡 Sugestão: Você pode resetar a senha no banco de dados');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkPassword();