import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateIdentifier, validatePassword } from '../../utils/validators';
import './Login.css';

function Login() {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!validateIdentifier(identifiant)) {
      return setError('Identifiant invalide (8-12 caractères alphanumériques)');
    }
    if (!validatePassword(password)) {
      return setError('Mot de passe invalide (12-64 chars, 1 majuscule, 1 chiffre, 1 spécial)');
    }

    setLoading(true);
    try {
      await login(identifiant, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Connexion Admin</h1>
        {error && <p className="login-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="identifiant">Identifiant</label>
          <input id="identifiant" type="text" value={identifiant}
            onChange={e => setIdentifiant(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password}
            onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-accent" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default Login;
