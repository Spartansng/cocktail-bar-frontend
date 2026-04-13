import './OrderStatus.css';

const STATUS_LABELS = {
  en_attente: 'En attente',
  en_preparation: 'En préparation',
  servi: 'Servi',
};

function OrderStatus({ status }) {
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`order-status order-status--${status}`}>
      {label}
    </span>
  );
}

export default OrderStatus;
