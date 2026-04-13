import { useState, useEffect } from 'react';
import { getCocktails } from '../../api/client';
import CocktailCard from '../../components/CocktailCard';
import Loading from '../../components/Loading';
import './Home.css';

function Home() {
  const [cocktails, setCocktails] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCocktails();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cocktails, search, category, ingredient]);

  async function loadCocktails() {
    try {
      const data = await getCocktails();
      setCocktails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let result = cocktails;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c => c.nom.toLowerCase().includes(s));
    }
    if (category) {
      result = result.filter(c => c.categorie === category);
    }
    if (ingredient) {
      const ing = ingredient.toLowerCase();
      result = result.filter(c =>
        Array.isArray(c.ingredients) &&
        c.ingredients.some(i => i.toLowerCase().includes(ing))
      );
    }
    setFiltered(result);
  }

  const categories = [...new Set(cocktails.map(c => c.categorie).filter(Boolean))];
  const allIngredients = extractIngredients(cocktails);

  if (loading) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="home">
      <h1 className="home-title">Notre Carte</h1>
      <HomeFilters
        search={search} onSearch={setSearch}
        category={category} onCategory={setCategory}
        ingredient={ingredient} onIngredient={setIngredient}
        categories={categories} ingredients={allIngredients}
      />
      <div className="cocktails-grid">
        {filtered.map(c => <CocktailCard key={c.id} cocktail={c} />)}
      </div>
      {filtered.length === 0 && <p className="no-results">Aucun cocktail trouvé</p>}
    </div>
  );
}

function extractIngredients(cocktails) {
  const set = new Set();
  cocktails.forEach(c => {
    if (Array.isArray(c.ingredients)) {
      c.ingredients.forEach(i => set.add(i));
    }
  });
  return [...set].sort();
}

function HomeFilters({ search, onSearch, category, onCategory, ingredient, onIngredient, categories, ingredients }) {
  return (
    <div className="home-filters">
      <input
        type="text"
        placeholder="Rechercher un cocktail..."
        value={search}
        onChange={e => onSearch(e.target.value)}
        className="filter-input"
      />
      <select value={category} onChange={e => onCategory(e.target.value)} className="filter-select">
        <option value="">Toutes les catégories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={ingredient} onChange={e => onIngredient(e.target.value)} className="filter-select">
        <option value="">Tous les ingrédients</option>
        {ingredients.map(i => <option key={i} value={i}>{i}</option>)}
      </select>
    </div>
  );
}

export default Home;
