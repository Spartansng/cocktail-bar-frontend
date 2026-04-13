import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getCocktails } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import './Dashboard.css';

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [orders, cocktails] = await Promise.all([getOrders(), getCocktails()]);
      const pending = orders.filter(o => o.status === 'en_attente').length;
      const preparing = orders.filter(o => o.status === 'en_preparation').length;
      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        preparingOrders: preparing,
        totalCocktails: cocktails.length,
      });
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Tableau de bord</h1>
      <p className="dashboard-welcome">Bonjour {user?.prenom || user?.identifiant}</p>
      {stats && <DashboardStats stats={stats} />}
      <DashboardLinks isAdmin={isAdmin} />
    </div>
  );
}

function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.pendingOrders}</span>
        <span className="stat-label">En attente</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.preparingOrders}</span>
        <span className="stat-label">En préparation</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.totalOrders}</span>
        <span className="stat-label">Commandes totales</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.totalCocktails}</span>
        <span className="stat-label">Cocktails</span>
      </div>
    </div>
  );
}

function DashboardLinks({ isAdmin }) {
  return (
    <div className="dashboard-links">
      <Link to="/admin/orders" className="dashboard-link">Gérer les commandes</Link>
      {isAdmin && <Link to="/admin/cocktails" className="dashboard-link">Gérer les cocktails</Link>}
      {isAdmin && <Link to="/admin/users" className="dashboard-link">Gérer les utilisateurs</Link>}
    </div>
  );
}

export default Dashboard;
