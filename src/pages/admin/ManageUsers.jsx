import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/client';
import { validateIdentifier, validatePassword } from '../../utils/validators';
import Loading from '../../components/Loading';
import './ManageUsers.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data) {
    try {
      await createUser(data);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRoleChange(id, role) {
    try {
      await updateUser(id, { role });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="manage-users">
      <div className="admin-header">
        <h1 className="admin-title">Gestion des utilisateurs</h1>
        <button className="btn-accent" onClick={() => setShowForm(true)}>Ajouter</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {showForm && <UserForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />}
      <UsersTable users={users} onRoleChange={handleRoleChange} onDelete={handleDelete} />
    </div>
  );
}

function UsersTable({ users, onRoleChange, onDelete }) {
  if (users.length === 0) return <p>Aucun utilisateur</p>;
  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Nom</th><th>Prénom</th><th>Identifiant</th><th>Rôle</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <UserRow key={u.id} user={u} onRoleChange={onRoleChange} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user, onRoleChange, onDelete }) {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.nom}</td>
      <td>{user.prenom}</td>
      <td>{user.identifiant}</td>
      <td>
        <select value={user.role} onChange={e => onRoleChange(user.id, e.target.value)}
          className="role-select">
          <option value="user">user</option>
          <option value="staff">staff</option>
          <option value="admin">admin</option>
        </select>
      </td>
      <td>
        <button className="btn-small btn-danger" onClick={() => onDelete(user.id)}>Supprimer</button>
      </td>
    </tr>
  );
}

const EMPTY_USER = { nom: '', prenom: '', identifiant: '', password: '', role: 'user' };

function UserForm({ onCreate, onCancel }) {
  const [form, setForm] = useState(EMPTY_USER);
  const [formError, setFormError] = useState(null);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateIdentifier(form.identifiant)) {
      return setFormError('Identifiant invalide (8-12 chars alphanumériques)');
    }
    if (!validatePassword(form.password)) {
      return setFormError('Mot de passe invalide (12-64 chars, 1 maj, 1 chiffre, 1 spécial)');
    }
    setFormError(null);
    onCreate(form);
  }

  return (
    <form className="cocktail-form" onSubmit={handleSubmit}>
      <h2>Ajouter un utilisateur</h2>
      {formError && <p className="login-error">{formError}</p>}
      <UserFormFields form={form} onChange={handleChange} />
      <div className="form-actions">
        <button type="submit" className="btn-accent">Créer</button>
        <button type="button" className="btn-small btn-danger" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

function UserFormFields({ form, onChange }) {
  return (
    <>
      <div className="form-group">
        <label>Nom</label>
        <input name="nom" value={form.nom} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Prénom</label>
        <input name="prenom" value={form.prenom} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Identifiant</label>
        <input name="identifiant" value={form.identifiant} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Mot de passe</label>
        <input name="password" type="password" value={form.password} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Rôle</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="user">user</option>
          <option value="staff">staff</option>
          <option value="admin">admin</option>
        </select>
      </div>
    </>
  );
}

export default ManageUsers;
