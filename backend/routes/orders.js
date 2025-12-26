const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all orders with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'all',
      start_date,
      end_date,
      search
    } = req.query;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('order_status', status);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }

    // Calculate totals
    const totals = calculateOrderTotals(orders || []);

    res.json({
      orders: orders || [],
      totals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// Update order status
router.put('/:id/status', 
  body('status')
    .isIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status inválido'),
  body('tracking_code').optional().isString(),
  body('notes').optional().isString(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: errors.array() 
        });
      }

      const { status, tracking_code, notes } = req.body;

      // Get old order data for logging
      const { data: oldOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!oldOrder) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      const updateData = {
        order_status: status,
        updated_at: new Date()
      };

      if (tracking_code !== undefined) updateData.tracking_code = tracking_code;
      if (notes !== undefined) updateData.notes = notes;

      const { data: order, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Erro ao atualizar pedido' });
      }

      // Log the action
      await logAction(req.user.id, 'update_order_status', 'orders', id, oldOrder, order);

      res.json({
        message: 'Status do pedido atualizado com sucesso',
        order
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  }
);

// Get order statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // Base query for date filtering
    let dateFilter = supabase.from('orders');
    
    if (start_date) {
      dateFilter = dateFilter.gte('created_at', start_date);
    }
    
    if (end_date) {
      dateFilter = dateFilter.lte('created_at', end_date);
    }

    // Get orders by status
    const statusQuery = dateFilter.select('order_status, total_amount');
    const { data: ordersByStatus } = await statusQuery;

    // Get daily sales for chart
    const dailyQuery = dateFilter.select('created_at, total_amount, order_status');
    const { data: dailyOrders } = await dailyQuery;

    // Process statistics
    const stats = processOrderStats(ordersByStatus || [], dailyOrders || []);

    res.json(stats);
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de pedidos' });
  }
});

// Helper functions
function calculateOrderTotals(orders) {
  return orders.reduce((totals, order) => {
    totals.total_amount += parseFloat(order.total_amount) || 0;
    totals.total_orders += 1;
    
    switch (order.order_status) {
      case 'paid':
        totals.paid += parseFloat(order.total_amount) || 0;
        break;
      case 'processing':
        totals.processing += parseFloat(order.total_amount) || 0;
        break;
      case 'shipped':
        totals.shipped += parseFloat(order.total_amount) || 0;
        break;
      case 'delivered':
        totals.delivered += parseFloat(order.total_amount) || 0;
        break;
      case 'cancelled':
        totals.cancelled += parseFloat(order.total_amount) || 0;
        break;
    }
    
    return totals;
  }, {
    total_amount: 0,
    total_orders: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });
}

function processOrderStats(ordersByStatus, dailyOrders) {
  // Status breakdown
  const statusBreakdown = ordersByStatus.reduce((acc, order) => {
    if (!acc[order.order_status]) {
      acc[order.order_status] = { count: 0, amount: 0 };
    }
    acc[order.order_status].count += 1;
    acc[order.order_status].amount += parseFloat(order.total_amount) || 0;
    return acc;
  }, {});

  // Daily sales chart
  const dailySales = dailyOrders.reduce((acc, order) => {
    if (order.order_status === 'paid') {
      const date = new Date(order.created_at).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = { count: 0, amount: 0 };
      }
      acc[date].count += 1;
      acc[date].amount += parseFloat(order.total_amount) || 0;
    }
    return acc;
  }, {});

  const chartData = Object.entries(dailySales).map(([date, data]) => ({
    date,
    orders: data.count,
    amount: Math.round(data.amount * 100) / 100
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    statusBreakdown,
    dailyChart: chartData,
    totalAmount: ordersByStatus.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0),
    totalOrders: ordersByStatus.length
  };
}

async function logAction(userId, action, resourceType, resourceId, oldValues, newValues) {
  try {
    await supabase.from('audit_logs').insert([{
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: '0.0.0.0', // Should get from req.ip
      user_agent: 'Admin Dashboard' // Should get from req.headers['user-agent']
    }]);
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

module.exports = router;