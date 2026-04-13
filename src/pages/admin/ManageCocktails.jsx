import { useState, useEffect } from 'react';
import { getCocktails, createCocktail, updateCocktail, deleteCocktail } from '../../api/client';
import Loading from '../../components/Loading';
import './ManageCocktails.css';

function ManageCocktails() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadCocktails(); }, []);

  async function loadCocktails() {
    try {
      setCocktails(await getCocktails());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce cocktail ?')) return;
    try {
      await deleteCocktail(id);
      loadCocktails();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(cocktail) {
    setEditing(cocktail);
    setShowForm(true);
  }

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await updateCocktail(editing.id, data);
      } else {
        await createCocktail(data);
      }
      setShowForm(false);
      setEditing(null);
      loadCocktails();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="manage-cocktails">
      <div className="admin-header">
        <h1 className="admin-title">Gestion des cocktails</h1>
        <button className="btn-accent" onClick={handleAdd}>Ajouter</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {showForm && (
        <CocktailForm cocktail={editing} onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
      <CocktailsTable cocktails={cocktails} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

function CocktailsTable({ cocktails, onEdit, onDelete }) {
  if (cocktails.length === 0) return <p>Aucun cocktail</p>;
  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Dispo</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cocktails.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nom}</td>
              <td>{c.categorie}</td>
              <td>{c.prix} &euro;</td>
              <td>{c.disponibilite ? 'Oui' : 'Non'}</td>
              <td className="action-buttons">
                <button className="btn-small btn-primary" onClick={() => onEdit(c)}>Modifier</button>
                <button className="btn-small btn-danger" onClick={() => onDelete(c.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const EMPTY_FORM = { nom: '', image: '', histoire: '', origine: '', ingredients: '', prix: '', categorie: '', disponibilite: true };

function CocktailForm({ cocktail, onSave, onCancel }) {
  const initial = cocktail
    ? { ...cocktail, ingredients: Array.isArray(cocktail.ingredients) ? cocktail.ingredients.join(', ') : '' }
    : EMPTY_FORM;
  const [form, setForm] = useState(initial);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      prix: parseFloat(form.prix),
      ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(data);
  }

  return (
    <form className="cocktail-form" onSubmit={handleSubmit}>
      <h2>{cocktail ? 'Modifier' : 'Ajouter'} un cocktail</h2>
      <CocktailFormFields form={form} onChange={handleChange} />
      <div className="form-actions">
        <button type="submit" className="btn-accent">Enregistrer</button>
        <button type="button" className="btn-small btn-danger" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

function CocktailFormFields({ form, onChange }) {
  return (
    <>
      <div className="form-group">
        <label>Nom</label>
        <input name="nom" value={form.nom} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Image URL</label>
        <input name="image" value={form.image || ''} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Catégorie</label>
        <input name="categorie" value={form.categorie || ''} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Prix</label>
        <input name="prix" type="number" step="0.01" value={form.prix} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>Ingrédients (séparés par des virgules)</label>
        <input name="ingredients" value={form.ingredients} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Histoire</label>
        <textarea name="histoire" value={form.histoire || ''} onChange={onChange} rows="3" />
      </div>
      <div className="form-group">
        <label>Origine</label>
        <input name="origine" value={form.origine || ''} onChange={onChange} />
      </div>
      <div className="form-group form-checkbox">
        <label>
          <input type="checkbox" name="disponibilite" checked={form.disponibilite} onChange={onChange} />
          Disponible
        </label>
      </div>
    </>
  );
}

export default ManageCocktails;
