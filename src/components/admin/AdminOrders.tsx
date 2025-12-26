import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import adminService from '../../services/adminService';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  items: {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  created_at: string;
  updated_at: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'preparing', label: 'Em Preparação' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'Todos os Pagamentos' },
    { value: 'pending', label: 'Pagamento Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'refunded', label: 'Reembolsado' },
    { value: 'failed', label: 'Falhou' },
  ];

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.payment_status = paymentFilter;

      const response = await adminService.getOrders(params);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, trackingCode?: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus, trackingCode);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-blue-500/20 text-blue-400',
      preparing: 'bg-purple-500/20 text-purple-400',
      shipped: 'bg-indigo-500/20 text-indigo-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-green-500/20 text-green-400',
      refunded: 'bg-blue-500/20 text-blue-400',
      failed: 'bg-red-500/20 text-red-400',
    };
    return colors[paymentStatus] || 'bg-slate-500/20 text-slate-400';
  };

  if (loading) {
    return (
      <AdminLayout title="Pedidos">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pedidos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Pedidos</h2>
          <div className="text-sm text-slate-400">
            Total: {orders.length} pedidos
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status do Pedido
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status do Pagamento
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-lg mb-2">Nenhum pedido encontrado</p>
              <p className="text-sm">Nenhum pedido corresponde aos filtros selecionados.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">Pedido #{order.order_number}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {statusOptions.find(s => s.value === order.status)?.label || order.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {paymentStatusOptions.find(p => p.value === order.payment_status)?.label || order.payment_status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Cliente</p>
                          <p className="text-white">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Valor Total</p>
                          <p className="text-white font-medium">{formatCurrency(order.total_amount)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Data</p>
                          <p className="text-white">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-slate-400 text-sm">
                          {order.items.length} item(s) • {order.payment_method}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Ver Detalhes
                      </button>
                      
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-3 py-1 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        {statusOptions.slice(1).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Detalhes do Pedido #{selectedOrder.order_number}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Informações do Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400">Nome:</span>
                        <span className="text-white ml-2">{selectedOrder.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white ml-2">{selectedOrder.customer_email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Telefone:</span>
                        <span className="text-white ml-2">{selectedOrder.customer_phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Endereço de Entrega</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400">Rua:</span>
                        <span className="text-white ml-2">{selectedOrder.shipping_address.street}, {selectedOrder.shipping_address.number}</span>
                      </div>
                      {selectedOrder.shipping_address.complement && (
                        <div>
                          <span className="text-slate-400">Complemento:</span>
                          <span className="text-white ml-2">{selectedOrder.shipping_address.complement}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400">Bairro:</span>
                        <span className="text-white ml-2">{selectedOrder.shipping_address.neighborhood}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Cidade:</span>
                        <span className="text-white ml-2">{selectedOrder.shipping_address.city} - {selectedOrder.shipping_address.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">CEP:</span>
                        <span className="text-white ml-2">{selectedOrder.shipping_address.zip_code}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Itens do Pedido</h4>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={item.id} className={`flex justify-between items-center ${index > 0 ? 'pt-3 border-t border-slate-600' : ''}`}>
                        <div>
                          <p className="text-white">{item.product_name}</p>
                          <p className="text-slate-400 text-sm">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white">{formatCurrency(item.unit_price)}</p>
                          <p className="text-slate-400 text-sm">{formatCurrency(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Pagamento</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400">Método:</span>
                        <span className="text-white ml-2">{selectedOrder.payment_method}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                          {paymentStatusOptions.find(p => p.value === selectedOrder.payment_status)?.label || selectedOrder.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Resumo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="text-white">{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total:</span>
                        <span className="text-white font-medium">{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    const trackingCode = prompt('Código de rastreamento (opcional):');
                    handleStatusUpdate(selectedOrder.id, 'shipped', trackingCode || undefined);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium rounded-lg transition-colors"
                >
                  Marcar como Enviado
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;