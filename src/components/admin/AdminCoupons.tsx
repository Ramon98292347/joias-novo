import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import adminService from '../../services/adminService';

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_purchase?: number;
  max_uses?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    minimum_purchase: 0,
    max_uses: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    is_active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await adminService.getCoupons();
      setCoupons(response.coupons || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon.id, formData);
      } else {
        await adminService.createCoupon(formData);
      }
      
      setShowModal(false);
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        minimum_purchase: 0,
        max_uses: 0,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '',
        is_active: true,
      });
      loadCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Erro ao salvar cupom');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_purchase: coupon.minimum_purchase || 0,
      max_uses: coupon.max_uses || 0,
      valid_from: coupon.valid_from.split('T')[0],
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
      is_active: coupon.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cupom?')) {
      try {
        await adminService.deleteCoupon(id);
        loadCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Erro ao excluir cupom');
      }
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await adminService.updateCoupon(coupon.id, { ...coupon, is_active: !coupon.is_active });
      loadCoupons();
    } catch (error) {
      console.error('Error toggling coupon status:', error);
    }
  };

  const generateCode = () => {
    const prefix = 'RAVIC';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${random}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isValidCoupon = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
    
    if (validFrom > now) return false;
    if (validUntil && validUntil < now) return false;
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return false;
    
    return true;
  };

  if (loading) {
    return (
      <AdminLayout title="Cupons de Desconto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cupons de Desconto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Cupons de Desconto</h2>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setFormData({
                code: generateCode(),
                description: '',
                discount_type: 'percentage',
                discount_value: 10,
                minimum_purchase: 0,
                max_uses: 0,
                valid_from: new Date().toISOString().split('T')[0],
                valid_until: '',
                is_active: true,
              });
              setShowModal(true);
            }}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Novo Cupom
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-white">{coupons.length}</div>
            <div className="text-slate-400 text-sm">Total de Cupons</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-400">
              {coupons.filter(c => c.is_active && isValidCoupon(c)).length}
            </div>
            <div className="text-slate-400 text-sm">Ativos</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">
              {coupons.reduce((sum, c) => sum + c.used_count, 0)}
            </div>
            <div className="text-slate-400 text-sm">Total de Usos</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">
              {coupons.filter(c => c.used_count > 0).length}
            </div>
            <div className="text-slate-400 text-sm">Usados</div>
          </div>
        </div>

        {/* Coupons List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p className="text-lg mb-2">Nenhum cupom encontrado</p>
              <p className="text-sm">Crie seu primeiro cupom para começar.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{coupon.code}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.is_active && isValidCoupon(coupon)
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {coupon.is_active && isValidCoupon(coupon) ? 'Ativo' : 'Inativo'}
                        </span>
                        {coupon.used_count > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            Usado {coupon.used_count}x
                          </span>
                        )}
                      </div>
                      
                      {coupon.description && (
                        <p className="text-slate-300 text-sm mb-2">{coupon.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Desconto</p>
                          <p className="text-white font-medium">
                            {coupon.discount_type === 'percentage' 
                              ? `${coupon.discount_value}%` 
                              : formatCurrency(coupon.discount_value)
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Compra Mínima</p>
                          <p className="text-white">
                            {coupon.minimum_purchase > 0 ? formatCurrency(coupon.minimum_purchase) : 'Sem mínimo'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Válido de</p>
                          <p className="text-white">{formatDate(coupon.valid_from)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Válido até</p>
                          <p className="text-white">
                            {coupon.valid_until ? formatDate(coupon.valid_until) : 'Sem limite'}
                          </p>
                        </div>
                        {coupon.max_uses > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-slate-400">Usos Restantes</p>
                            <p className="text-white">{coupon.max_uses - coupon.used_count} de {coupon.max_uses}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          coupon.is_active && isValidCoupon(coupon)
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30'
                        }`}
                      >
                        {coupon.is_active && isValidCoupon(coupon) ? 'Desativar' : 'Ativar'}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Código *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, code: generateCode() }))}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                    >
                      Gerar
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo de Desconto *
                    </label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    >
                      <option value="percentage">Porcentagem (%)</option>
                      <option value="fixed">Valor Fixo (R$)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Valor do Desconto *
                    </label>
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Compra Mínima (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.minimum_purchase}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimum_purchase: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Máximo de Usos
                    </label>
                    <input
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_uses: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Válido de *
                    </label>
                    <input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Válido até
                    </label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-slate-600 text-amber-400 focus:ring-amber-400"
                    />
                    <span className="text-slate-300">Ativo</span>
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium rounded-lg transition-colors"
                  >
                    {editingCoupon ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;