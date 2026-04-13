import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../api/client';
import './Order.css';

function Order() {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function updateQuantity(cocktailId, delta) {
    setCart(prev => prev
      .map(item => item.cocktail_id === cocktailId
        ? { ...item, quantity: item.quantity + delta }
        : item)
      .filter(item => item.quantity > 0));
  }

  function removeItem(cocktailId) {
    setCart(prev => prev.filter(item => item.cocktail_id !== cocktailId));
  }

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tableNumber || cart.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const items = cart.map(({ cocktail_id, quantity }) => ({ cocktail_id, quantity }));
      const order = await createOrder({ table_number: parseInt(tableNumber), items });
      localStorage.removeItem('cart');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="order-page">
      <h1 className="order-title">Votre Commande</h1>
      {error && <p className="error-message">{error}</p>}
      {cart.length === 0 ? (
        <p className="order-empty">Votre panier est vide</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <TableInput value={tableNumber} onChange={setTableNumber} />
          <CartList cart={cart} onUpdate={updateQuantity} onRemove={removeItem} />
          <OrderTotal total={total} submitting={submitting} />
        </form>
      )}
    </div>
  );
}

function TableInput({ value, onChange }) {
  return (
    <div className="order-table">
      <label htmlFor="table-number">Numéro de table</label>
      <input
        id="table-number"
        type="number"
        min="1"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="filter-input"
      />
    </div>
  );
}

function CartList({ cart, onUpdate, onRemove }) {
  return (
    <div className="cart-list">
      {cart.map(item => (
        <div key={item.cocktail_id} className="cart-item">
          <span className="cart-item-name">{item.nom}</span>
          <div className="cart-item-controls">
            <button type="button" onClick={() => onUpdate(item.cocktail_id, -1)}>-</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onUpdate(item.cocktail_id, 1)}>+</button>
          </div>
          <span className="cart-item-price">{(item.prix * item.quantity).toFixed(2)} &euro;</span>
          <button type="button" className="cart-item-remove" onClick={() => onRemove(item.cocktail_id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

function OrderTotal({ total, submitting }) {
  return (
    <div className="order-footer">
      <p className="order-total">Total : <strong>{total.toFixed(2)} &euro;</strong></p>
      <button type="submit" className="btn-accent" disabled={submitting}>
        {submitting ? 'Envoi...' : 'Valider la commande'}
      </button>
    </div>
  );
}

export default Order;
