import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../api/client';
import OrderStatus from '../../components/OrderStatus';
import Loading from '../../components/Loading';
import './OrderTracking.css';

const POLL_INTERVAL = 10000;

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [id]);

  async function loadOrder() {
    try {
      const data = await getOrder(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading message="Chargement de votre commande..." />;
  if (error) return <p className="error-message">{error}</p>;
  if (!order) return <p className="error-message">Commande non trouvée</p>;

  return (
    <div className="tracking-page">
      <h1 className="tracking-title">Suivi de commande</h1>
      <TrackingInfo order={order} />
      <TrackingItems items={order.items} />
    </div>
  );
}

function TrackingInfo({ order }) {
  return (
    <div className="tracking-card">
      <div className="tracking-row">
        <span>Commande #{order.id}</span>
        <OrderStatus status={order.status} />
      </div>
      <div className="tracking-row">
        <span>Table {order.table_number}</span>
        <span className="tracking-date">
          {new Date(order.created_at).toLocaleString('fr-FR')}
        </span>
      </div>
    </div>
  );
}

function TrackingItems({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="tracking-items">
      <h2>Cocktails commandés</h2>
      <ul>
        {items.map(item => (
          <li key={item.id} className="tracking-item">
            <span>{item.cocktail_nom}</span>
            <span>x{item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderTracking;
