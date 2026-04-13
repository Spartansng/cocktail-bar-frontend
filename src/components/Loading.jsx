function Loading({ message = 'Chargement...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
      <p>{message}</p>
    </div>
  );
}

export default Loading;
