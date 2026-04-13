import { useState, useEffect } from 'react';
import { getOrders, updateOrder, deleteOrder } from '../../api/client';
import OrderStatus from '../../components/OrderStatus';
import Loading from '../../components/Loading';
import './ManageOrders.css';

const NEXT_STATUS = {
  en_attente: 'en_preparation',
  en_preparation: 'servi',
};

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    try {
      setOrders(await getOrders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdvance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateOrder(order.id, { status: next });
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette commande ?')) return;
    try {
      await deleteOrder(id);
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="manage-orders">
      <h1 className="admin-title">Gestion des commandes</h1>
      {error && <p className="error-message">{error}</p>}
      <OrdersTable orders={orders} onAdvance={handleAdvance} onDelete={handleDelete} />
    </div>
  );
}

function OrdersTable({ orders, onAdvance, onDelete }) {
  if (orders.length === 0) return <p>Aucune commande</p>;

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Table</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <OrderRow key={order.id} order={order} onAdvance={onAdvance} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({ order, onAdvance, onDelete }) {
  const canAdvance = order.status !== 'servi';
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.table_number}</td>
      <td><OrderStatus status={order.status} /></td>
      <td>{new Date(order.created_at).toLocaleString('fr-FR')}</td>
      <td className="action-buttons">
        {canAdvance && (
          <button className="btn-small btn-success" onClick={() => onAdvance(order)}>
            Avancer
          </button>
        )}
        <button className="btn-small btn-danger" onClick={() => onDelete(order.id)}>
          Supprimer
        </button>
      </td>
    </tr>
  );
}

export default ManageOrders;
