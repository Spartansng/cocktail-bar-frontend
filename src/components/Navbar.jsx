import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Cocktail Bar</Link>
      <div className="navbar-links">
        <Link to="/">Carte</Link>
        <Link to="/order">Commander</Link>
        {isStaff && <Link to="/admin">Admin</Link>}
        {user ? (
          <button className="navbar-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        ) : (
          <Link to="/admin/login">Connexion</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
