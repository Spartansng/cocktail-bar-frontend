import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCocktail } from '../../api/client';
import Loading from '../../components/Loading';
import './CocktailDetail.css';

function CocktailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCocktail();
  }, [id]);

  async function loadCocktail() {
    try {
      const data = await getCocktail(id);
      setCocktail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function addToOrder() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.cocktail_id === cocktail.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ cocktail_id: cocktail.id, nom: cocktail.nom, prix: cocktail.prix, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/order');
  }

  if (loading) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;
  if (!cocktail) return <p className="error-message">Cocktail non trouvé</p>;

  return (
    <div className="cocktail-detail">
      <CocktailDetailHeader cocktail={cocktail} />
      <CocktailDetailInfo cocktail={cocktail} />
      <button className="btn-accent" onClick={addToOrder}>
        Ajouter à la commande
      </button>
    </div>
  );
}

function CocktailDetailHeader({ cocktail }) {
  return (
    <div className="cocktail-detail-header">
      <div className="cocktail-detail-image">
        {cocktail.image ? (
          <img src={cocktail.image} alt={cocktail.nom} />
        ) : (
          <div className="cocktail-detail-placeholder">&#127864;</div>
        )}
      </div>
      <div>
        <h1>{cocktail.nom}</h1>
        {cocktail.categorie && <span className="detail-category">{cocktail.categorie}</span>}
        <p className="detail-price">{cocktail.prix} &euro;</p>
      </div>
    </div>
  );
}

function CocktailDetailInfo({ cocktail }) {
  return (
    <div className="cocktail-detail-info">
      {cocktail.histoire && <p className="detail-section"><strong>Histoire :</strong> {cocktail.histoire}</p>}
      {cocktail.origine && <p className="detail-section"><strong>Origine :</strong> {cocktail.origine}</p>}
      {Array.isArray(cocktail.ingredients) && cocktail.ingredients.length > 0 && (
        <div className="detail-section">
          <strong>Ingrédients :</strong>
          <ul className="ingredient-list">
            {cocktail.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CocktailDetail;
