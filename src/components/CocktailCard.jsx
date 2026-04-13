import { Link } from 'react-router-dom';
import './CocktailCard.css';

function CocktailCard({ cocktail }) {
  return (
    <Link to={`/cocktails/${cocktail.id}`} className="cocktail-card">
      <div className="cocktail-card-image">
        {cocktail.image ? (
          <img src={cocktail.image} alt={cocktail.nom} />
        ) : (
          <div className="cocktail-card-placeholder">&#127864;</div>
        )}
      </div>
      <div className="cocktail-card-body">
        <h3 className="cocktail-card-name">{cocktail.nom}</h3>
        {cocktail.categorie && (
          <span className="cocktail-card-category">{cocktail.categorie}</span>
        )}
        <span className="cocktail-card-price">{cocktail.prix} &euro;</span>
      </div>
    </Link>
  );
}

export default CocktailCard;
